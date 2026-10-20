using System.Threading.RateLimiting;
using System.Security.Claims;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Serilog;
using Starter.Application;
using Starter.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog((context, configuration) => configuration
    .ReadFrom.Configuration(context.Configuration)
    .WriteTo.Console());

var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException("Set ConnectionStrings__Default before starting the API.");
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));
builder.Services.AddIdentityApiEndpoints<AppUser>(options =>
{
    options.Password.RequiredLength = 12;
    options.User.RequireUniqueEmail = true;
}).AddRoles<IdentityRole<Guid>>().AddEntityFrameworkStores<AppDbContext>();
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.SecurePolicy = builder.Environment.IsDevelopment() ? CookieSecurePolicy.SameAsRequest : CookieSecurePolicy.Always;
    options.ExpireTimeSpan = TimeSpan.FromHours(8);
});
var keysPath = builder.Configuration["DataProtection:KeysPath"];
if (!string.IsNullOrWhiteSpace(keysPath))
{
    Directory.CreateDirectory(keysPath);
    builder.Services.AddDataProtection().PersistKeysToFileSystem(new DirectoryInfo(keysPath));
}
builder.Services.AddAuthorizationBuilder().AddPolicy("CustomerAdmin", policy => policy.RequireRole("Admin"));
builder.Services.AddScoped<ICustomerStore, CustomerStore>();
builder.Services.AddScoped<CustomerService>();
builder.Services.AddValidatorsFromAssemblyContaining<CustomerInputValidator>();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ApiExceptionHandler>();
builder.Services.AddOpenApi();
builder.Services.AddHealthChecks().AddDbContextCheck<AppDbContext>("database");
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    // Compose requests arrive from NGINX, so this is a coarse proxy-level backstop.
    // Account lockout handles repeated password failures for an individual user.
    options.AddPolicy("auth", context => RateLimitPartition.GetFixedWindowLimiter(
        context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = 120, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 }));
});
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
if (allowedOrigins.Length > 0)
    builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseSerilogRequestLogging();
app.UseExceptionHandler();
app.UseRateLimiter();
if (allowedOrigins.Length > 0) app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    if (app.Configuration.GetValue<bool>("Database:AutoMigrate"))
    {
        await using var scope = app.Services.CreateAsyncScope();
        await scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.MigrateAsync();
    }
    app.MapOpenApi();
}

await SeedAdminAsync(app);
app.MapHealthChecks("/health/live", new() { Predicate = _ => false });
app.MapHealthChecks("/health/ready");
app.MapPost("/api/v1/auth/login", async (LoginInput input, SignInManager<AppUser> signInManager) =>
{
    if (string.IsNullOrWhiteSpace(input.Email) || string.IsNullOrWhiteSpace(input.Password))
        return Results.BadRequest();
    signInManager.AuthenticationScheme = IdentityConstants.ApplicationScheme;
    var result = await signInManager.PasswordSignInAsync(input.Email, input.Password, isPersistent: false, lockoutOnFailure: true);
    return result.Succeeded ? Results.NoContent() : Results.Unauthorized();
}).RequireRateLimiting("auth")
    .Produces(StatusCodes.Status204NoContent)
    .Produces(StatusCodes.Status400BadRequest)
    .Produces(StatusCodes.Status401Unauthorized);
app.MapGet("/api/v1/auth/me", (ClaimsPrincipal user) =>
    Results.Ok(new AuthUser(user.FindFirstValue(ClaimTypes.Email) ?? string.Empty, user.IsInRole("Admin"))))
    .RequireAuthorization().Produces<AuthUser>()
    .Produces(StatusCodes.Status401Unauthorized);
app.MapPost("/api/v1/auth/logout", async (SignInManager<AppUser> signInManager) =>
{
    signInManager.AuthenticationScheme = IdentityConstants.ApplicationScheme;
    await signInManager.SignOutAsync();
    return Results.NoContent();
}).RequireAuthorization().Produces(StatusCodes.Status204NoContent);

app.Use(async (context, next) =>
{
    if (context.Request.Path.StartsWithSegments("/api/v1") &&
        context.Request.Method is not ("GET" or "HEAD" or "OPTIONS") &&
        context.Request.Headers["X-CSRF"] != "1")
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        await context.Response.WriteAsJsonAsync(new { title = "Missing X-CSRF header", status = 403 });
        return;
    }
    await next(context);
});

var customers = app.MapGroup("/api/v1/customers").RequireAuthorization().WithTags("Customers");
customers.MapGet("/", async (CustomerService service, string? search, string? sort, int? page, int? pageSize, CancellationToken ct) =>
{
    var p = page ?? 1;
    var size = pageSize ?? 20;
    if (p < 1 || size is < 1 or > 100 || ((long)p - 1) * size > int.MaxValue || (search?.Length ?? 0) > 120 ||
        (sort is not null && sort is not ("name" or "-name" or "email" or "-email" or "oldest" or "newest")))
        return Results.ValidationProblem(new Dictionary<string, string[]> { ["query"] = ["Use page >= 1, pageSize 1-100, search <= 120 characters, and a supported sort."] });
    return Results.Ok(await service.ListAsync(new(search, sort ?? "newest", p, size), ct));
}).Produces<PagedResult<CustomerDto>>();
customers.MapGet("/{id:guid}", async (Guid id, CustomerService service, CancellationToken ct) =>
    await service.GetAsync(id, ct) is { } customer ? Results.Ok(customer) : Results.NotFound())
    .Produces<CustomerDto>();
customers.MapPost("/", async (CustomerInput input, IValidator<CustomerInput> validator, CustomerService service, CancellationToken ct) =>
{
    var validation = await validator.ValidateAsync(input, ct);
    if (!validation.IsValid) return Results.ValidationProblem(validation.ToDictionary());
    var customer = await service.CreateAsync(input, ct);
    return Results.Created($"/api/v1/customers/{customer.Id}", customer);
}).Produces<CustomerDto>(StatusCodes.Status201Created);
customers.MapPut("/{id:guid}", async (Guid id, CustomerInput input, IValidator<CustomerInput> validator, CustomerService service, CancellationToken ct) =>
{
    var validation = await validator.ValidateAsync(input, ct);
    if (!validation.IsValid) return Results.ValidationProblem(validation.ToDictionary());
    return await service.UpdateAsync(id, input, ct) is { } customer ? Results.Ok(customer) : Results.NotFound();
}).Produces<CustomerDto>();
customers.MapDelete("/{id:guid}", async (Guid id, CustomerService service, CancellationToken ct) =>
    await service.DeleteAsync(id, ct) ? Results.NoContent() : Results.NotFound())
    .RequireAuthorization("CustomerAdmin");

app.Run();

static async Task SeedAdminAsync(WebApplication app)
{
    var email = app.Configuration["BootstrapAdmin:Email"];
    var password = app.Configuration["BootstrapAdmin:Password"];
    if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password)) return;
    await using var scope = app.Services.CreateAsyncScope();
    var roles = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
    var users = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
    if (!await roles.RoleExistsAsync("Admin"))
    {
        var result = await roles.CreateAsync(new IdentityRole<Guid>("Admin"));
        if (!result.Succeeded) throw new InvalidOperationException("Could not create Admin role.");
    }
    var user = await users.FindByEmailAsync(email);
    if (user is null)
    {
        user = new AppUser { UserName = email, Email = email, EmailConfirmed = true };
        var result = await users.CreateAsync(user, password);
        if (!result.Succeeded) throw new InvalidOperationException($"Could not create bootstrap admin: {string.Join(", ", result.Errors.Select(e => e.Description))}");
    }
    if (!await users.IsInRoleAsync(user, "Admin"))
    {
        var result = await users.AddToRoleAsync(user, "Admin");
        if (!result.Succeeded) throw new InvalidOperationException("Could not assign Admin role.");
    }
}

public sealed class ApiExceptionHandler(ILogger<ApiExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken ct)
    {
        var isDuplicate = exception is DuplicateCustomerEmailException ||
            exception is DbUpdateException { InnerException: PostgresException { SqlState: PostgresErrorCodes.UniqueViolation } };
        if (!isDuplicate)
        {
            logger.LogError(exception, "Unhandled API exception");
            return false;
        }
        context.Response.StatusCode = StatusCodes.Status409Conflict;
        await Results.Problem(statusCode: 409, title: "Conflict", detail: "A record with this value already exists.").ExecuteAsync(context);
        return true;
    }
}

public partial class Program { }

public sealed record LoginInput(string Email, string Password);
public sealed record AuthUser(string Email, bool IsAdmin);
