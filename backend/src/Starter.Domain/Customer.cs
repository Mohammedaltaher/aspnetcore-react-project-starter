namespace Starter.Domain;

public sealed class Customer
{
    private Customer() { }

    public Guid Id { get; private set; }
    public string Name { get; private set; } = "";
    public string Email { get; private set; } = "";
    public DateTime CreatedAtUtc { get; private set; }

    public static Customer Create(string name, string email) => new()
    {
        Id = Guid.NewGuid(),
        Name = name.Trim(),
        Email = email.Trim().ToLowerInvariant(),
        CreatedAtUtc = DateTime.UtcNow
    };

    public void Update(string name, string email)
    {
        Name = name.Trim();
        Email = email.Trim().ToLowerInvariant();
    }
}
