using Starter.Application;
using Starter.Domain;

namespace Starter.Tests;

public sealed class CustomerTests
{
    [Fact]
    public void Validator_rejects_invalid_input()
    {
        var result = new CustomerInputValidator().Validate(new CustomerInput("", "not-an-email"));
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Name");
        Assert.Contains(result.Errors, e => e.PropertyName == "Email");
    }

    [Fact]
    public async Task Creating_duplicate_email_returns_a_conflict_condition()
    {
        var store = new MemoryCustomerStore();
        var service = new CustomerService(store);
        await service.CreateAsync(new("First", "TEST@example.com"), CancellationToken.None);
        await Assert.ThrowsAsync<DuplicateCustomerEmailException>(() =>
            service.CreateAsync(new("Second", "test@example.com"), CancellationToken.None));
    }

    [Fact]
    public async Task Customer_can_be_created_updated_and_deleted()
    {
        var service = new CustomerService(new MemoryCustomerStore());
        var created = await service.CreateAsync(new("  Alice  ", "ALICE@example.com"), CancellationToken.None);
        Assert.Equal("Alice", created.Name);
        Assert.Equal("alice@example.com", created.Email);
        var updated = await service.UpdateAsync(created.Id, new("Alice B", "alice2@example.com"), CancellationToken.None);
        Assert.Equal("Alice B", updated?.Name);
        Assert.True(await service.DeleteAsync(created.Id, CancellationToken.None));
        Assert.Null(await service.GetAsync(created.Id, CancellationToken.None));
    }

    private sealed class MemoryCustomerStore : ICustomerStore
    {
        private readonly Dictionary<Guid, Customer> customers = [];
        public Task<PagedResult<CustomerDto>> ListAsync(CustomerQuery query, CancellationToken ct) =>
            Task.FromResult(new PagedResult<CustomerDto>(customers.Values.Select(CustomerDto.From).ToList(), query.Page, query.PageSize, customers.Count));
        public Task<Customer?> GetAsync(Guid id, CancellationToken ct) => Task.FromResult(customers.GetValueOrDefault(id));
        public Task<bool> EmailExistsAsync(string email, Guid? exceptId, CancellationToken ct) =>
            Task.FromResult(customers.Values.Any(x => x.Email == email && x.Id != exceptId));
        public Task AddAsync(Customer customer, CancellationToken ct) { customers.Add(customer.Id, customer); return Task.CompletedTask; }
        public Task SaveAsync(CancellationToken ct) => Task.CompletedTask;
        public Task DeleteAsync(Customer customer, CancellationToken ct) { customers.Remove(customer.Id); return Task.CompletedTask; }
    }
}
