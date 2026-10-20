using FluentValidation;
using Starter.Domain;

namespace Starter.Application;

public sealed record CustomerInput(string Name, string Email);
public sealed record CustomerDto(Guid Id, string Name, string Email, DateTime CreatedAtUtc)
{
    public static CustomerDto From(Customer customer) =>
        new(customer.Id, customer.Name, customer.Email, customer.CreatedAtUtc);
}
public sealed record PagedResult<T>(IReadOnlyList<T> Items, int Page, int PageSize, int Total);
public sealed record CustomerQuery(string? Search, string Sort, int Page, int PageSize);

public sealed class CustomerInputValidator : AbstractValidator<CustomerInput>
{
    public CustomerInputValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(254);
    }
}

public interface ICustomerStore
{
    Task<PagedResult<CustomerDto>> ListAsync(CustomerQuery query, CancellationToken cancellationToken);
    Task<Customer?> GetAsync(Guid id, CancellationToken cancellationToken);
    Task<bool> EmailExistsAsync(string email, Guid? exceptId, CancellationToken cancellationToken);
    Task AddAsync(Customer customer, CancellationToken cancellationToken);
    Task SaveAsync(CancellationToken cancellationToken);
    Task DeleteAsync(Customer customer, CancellationToken cancellationToken);
}

public sealed class CustomerService(ICustomerStore store)
{
    public Task<PagedResult<CustomerDto>> ListAsync(CustomerQuery query, CancellationToken ct) => store.ListAsync(query, ct);

    public async Task<CustomerDto?> GetAsync(Guid id, CancellationToken ct)
    {
        var customer = await store.GetAsync(id, ct);
        return customer is null ? null : CustomerDto.From(customer);
    }

    public async Task<CustomerDto> CreateAsync(CustomerInput input, CancellationToken ct)
    {
        if (await store.EmailExistsAsync(input.Email.Trim().ToLowerInvariant(), null, ct))
            throw new DuplicateCustomerEmailException();
        var customer = Customer.Create(input.Name, input.Email);
        await store.AddAsync(customer, ct);
        return CustomerDto.From(customer);
    }

    public async Task<CustomerDto?> UpdateAsync(Guid id, CustomerInput input, CancellationToken ct)
    {
        var customer = await store.GetAsync(id, ct);
        if (customer is null) return null;
        if (await store.EmailExistsAsync(input.Email.Trim().ToLowerInvariant(), id, ct))
            throw new DuplicateCustomerEmailException();
        customer.Update(input.Name, input.Email);
        await store.SaveAsync(ct);
        return CustomerDto.From(customer);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct)
    {
        var customer = await store.GetAsync(id, ct);
        if (customer is null) return false;
        await store.DeleteAsync(customer, ct);
        return true;
    }
}

public sealed class DuplicateCustomerEmailException : Exception
{
    public DuplicateCustomerEmailException() : base("A customer with this email already exists.") { }
}
