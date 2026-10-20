using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Starter.Infrastructure;

namespace Starter.Tests;

public sealed class AuthenticatedWorkflowTests
{
    [Fact]
    public async Task Signed_in_user_can_create_a_customer_but_cannot_delete_it()
    {
        var databaseName = Guid.NewGuid().ToString();
        await using var factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.UseEnvironment("Production");
            builder.UseSetting("ConnectionStrings:Default", "Host=localhost;Database=not_used;Username=not_used;Password=not_used");
            builder.ConfigureServices(services =>
            {
                services.RemoveAll<DbContextOptions<AppDbContext>>();
                services.RemoveAll<IDbContextOptionsConfiguration<AppDbContext>>();
                services.AddDbContext<AppDbContext>(options => options.UseInMemoryDatabase(databaseName));
            });
        });
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true, AllowAutoRedirect = false });
        await using (var scope = factory.Services.CreateAsyncScope())
        {
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
            var user = new AppUser { UserName = "user@example.com", Email = "user@example.com", EmailConfirmed = true };
            var result = await userManager.CreateAsync(user, "Strong-Password-123!");
            Assert.True(result.Succeeded, string.Join(", ", result.Errors.Select(e => e.Description)));
            Assert.True(await userManager.CheckPasswordAsync(user, "Strong-Password-123!"));
            Assert.NotNull(await userManager.FindByNameAsync("user@example.com"));
            var signIn = scope.ServiceProvider.GetRequiredService<SignInManager<AppUser>>();
            var check = await signIn.CheckPasswordSignInAsync(user, "Strong-Password-123!", lockoutOnFailure: true);
            Assert.True(check.Succeeded, $"Sign-in blocked: {check.IsLockedOut}, {check.IsNotAllowed}, {check.RequiresTwoFactor}");
        }
        client.DefaultRequestHeaders.Add("X-CSRF", "1");
        var login = await client.PostAsJsonAsync("/api/v1/auth/login", new { email = "user@example.com", password = "Strong-Password-123!" });
        Assert.True(login.StatusCode == HttpStatusCode.NoContent, await login.Content.ReadAsStringAsync());
        Assert.True(login.Headers.TryGetValues("Set-Cookie", out var cookies), "Login did not issue a cookie.");
        client.DefaultRequestHeaders.Add("Cookie", cookies!.First().Split(';')[0]);
        var me = await client.GetAsync("/api/v1/auth/me");
        Assert.Equal(HttpStatusCode.OK, me.StatusCode);
        var created = await client.PostAsJsonAsync("/api/v1/customers", new { name = "Alice", email = "alice@example.com" });
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        var customer = await created.Content.ReadFromJsonAsync<CustomerResponse>();
        Assert.NotNull(customer);
        var deletion = await client.DeleteAsync($"/api/v1/customers/{customer.Id}");
        Assert.Equal(HttpStatusCode.Forbidden, deletion.StatusCode);
    }

    private sealed record CustomerResponse(Guid Id);
}
