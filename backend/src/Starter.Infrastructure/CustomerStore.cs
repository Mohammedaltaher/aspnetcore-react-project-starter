using Microsoft.EntityFrameworkCore;
using Starter.Application;
using Starter.Domain;

namespace Starter.Infrastructure;

public sealed class CustomerStore(AppDbContext db) : ICustomerStore
{
    public async Task<PagedResult<CustomerDto>> ListAsync(CustomerQuery query, CancellationToken ct)
    {
        var customers = db.Customers.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var pattern = $"%{EscapeLike(query.Search.Trim())}%";
            customers = customers.Where(x => EF.Functions.ILike(x.Name, pattern, "\\") || EF.Functions.ILike(x.Email, pattern, "\\"));
        }
        var total = await customers.CountAsync(ct);
        customers = query.Sort switch
        {
            "name" => customers.OrderBy(x => x.Name).ThenBy(x => x.Id),
            "-name" => customers.OrderByDescending(x => x.Name).ThenBy(x => x.Id),
            "email" => customers.OrderBy(x => x.Email).ThenBy(x => x.Id),
            "-email" => customers.OrderByDescending(x => x.Email).ThenBy(x => x.Id),
            "oldest" => customers.OrderBy(x => x.CreatedAtUtc).ThenBy(x => x.Id),
            _ => customers.OrderByDescending(x => x.CreatedAtUtc).ThenBy(x => x.Id)
        };
        var items = await customers.Skip((query.Page - 1) * query.PageSize).Take(query.PageSize)
            .Select(x => new CustomerDto(x.Id, x.Name, x.Email, x.CreatedAtUtc)).ToListAsync(ct);
        return new(items, query.Page, query.PageSize, total);
    }

    private static string EscapeLike(string value) => value.Replace("\\", "\\\\").Replace("%", "\\%").Replace("_", "\\_");

    public Task<Customer?> GetAsync(Guid id, CancellationToken ct) => db.Customers.FirstOrDefaultAsync(x => x.Id == id, ct);
    public Task<bool> EmailExistsAsync(string email, Guid? exceptId, CancellationToken ct) =>
        db.Customers.AnyAsync(x => x.Email == email && (!exceptId.HasValue || x.Id != exceptId.Value), ct);
    public async Task AddAsync(Customer customer, CancellationToken ct)
    {
        db.Customers.Add(customer);
        await db.SaveChangesAsync(ct);
    }
    public Task SaveAsync(CancellationToken ct) => db.SaveChangesAsync(ct);
    public async Task DeleteAsync(Customer customer, CancellationToken ct)
    {
        db.Customers.Remove(customer);
        await db.SaveChangesAsync(ct);
    }
}
