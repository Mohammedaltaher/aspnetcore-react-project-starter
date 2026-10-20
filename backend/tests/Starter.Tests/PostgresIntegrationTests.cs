using Microsoft.EntityFrameworkCore;
using Npgsql;
using Starter.Application;
using Starter.Domain;
using Starter.Infrastructure;

namespace Starter.Tests;

public sealed class PostgresIntegrationTests
{
    [Fact]
    public async Task Migrations_and_customer_queries_work_against_postgres()
    {
        var connectionString = Environment.GetEnvironmentVariable("TEST_POSTGRES_CONNECTION");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            Assert.False(string.Equals(Environment.GetEnvironmentVariable("CI"), "true", StringComparison.OrdinalIgnoreCase),
                "CI must set TEST_POSTGRES_CONNECTION so PostgreSQL integration tests run.");
            return;
        }

        var databaseName = $"starter_test_{Guid.NewGuid():N}";
        var adminConnection = new NpgsqlConnectionStringBuilder(connectionString) { Database = "postgres" };
        var testConnection = new NpgsqlConnectionStringBuilder(connectionString) { Database = databaseName };
        await using var admin = new NpgsqlConnection(adminConnection.ConnectionString);
        await admin.OpenAsync();
        await using (var create = new NpgsqlCommand($"CREATE DATABASE \"{databaseName}\"", admin))
            await create.ExecuteNonQueryAsync();

        try
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseNpgsql(testConnection.ConnectionString).Options;
            await using (var db = new AppDbContext(options))
            {
                await db.Database.MigrateAsync();
                var store = new CustomerStore(db);
                await store.AddAsync(Customer.Create("100% Match", "first@example.com"), CancellationToken.None);
                await store.AddAsync(Customer.Create("Other", "second@example.com"), CancellationToken.None);

                var result = await store.ListAsync(new CustomerQuery("100%", "name", 1, 1), CancellationToken.None);
                Assert.Equal(1, result.Total);
                Assert.Single(result.Items);
                Assert.Equal("100% Match", result.Items[0].Name);

                var secondPage = await store.ListAsync(new CustomerQuery(null, "name", 2, 1), CancellationToken.None);
                Assert.Equal(2, secondPage.Total);
                Assert.Equal("Other", Assert.Single(secondPage.Items).Name);
            }

            await using var duplicateDb = new AppDbContext(options);
            duplicateDb.Customers.Add(Customer.Create("Duplicate", "first@example.com"));
            await Assert.ThrowsAsync<DbUpdateException>(() => duplicateDb.SaveChangesAsync());
        }
        finally
        {
            NpgsqlConnection.ClearAllPools();
            await using var drop = new NpgsqlCommand($"DROP DATABASE IF EXISTS \"{databaseName}\" WITH (FORCE)", admin);
            await drop.ExecuteNonQueryAsync();
        }
    }
}
