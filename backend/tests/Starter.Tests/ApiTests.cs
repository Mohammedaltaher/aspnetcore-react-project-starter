using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.Hosting;
using System.Net.Http.Json;

namespace Starter.Tests;

public sealed class ApiTests
{
    [Fact]
    public async Task Health_endpoint_is_live_without_a_database_connection()
    {
        await using var factory = CreateFactory();
        var response = await factory.CreateClient().GetAsync("/health/live");
        Assert.True(response.IsSuccessStatusCode);
    }

    [Fact]
    public async Task Customer_endpoint_requires_authentication()
    {
        await using var factory = CreateFactory();
        var response = await factory.CreateClient().GetAsync("/api/v1/customers");
        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Registration_is_disabled_in_production()
    {
        await using var factory = CreateFactory();
        var client = factory.CreateClient();
        client.DefaultRequestHeaders.Add("X-CSRF", "1");
        var response = await client.PostAsJsonAsync("/api/v1/auth/register", new { email = "new@example.com", password = "strong-password-123" });
        Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
    }

    private static WebApplicationFactory<Program> CreateFactory() => new WebApplicationFactory<Program>()
        .WithWebHostBuilder(builder =>
        {
            builder.UseEnvironment("Production");
            builder.UseSetting("ConnectionStrings:Default", "Host=localhost;Database=starter;Username=starter;Password=not-used");
        });
}
