# Architecture

The backend is a modular monolith. References point inward: API → Application and Infrastructure; Infrastructure → Application and Domain; Application → Domain. Domain has no framework dependency. HTTP DTOs are separate from EF entities. `CustomerService` owns use cases; `ICustomerStore` hides persistence. Add CQRS or MediatR only when a use case needs it.

React uses Router for pages, TanStack Query for server state, React Hook Form and Zod for forms, and generated OpenAPI types for customer contracts. NGINX serves the built app and proxies API calls on the same origin. PostgreSQL holds Identity and business data.

## Decisions to review for each project

1. Keep PostgreSQL migrations checked in and review them before production application.
2. Use cookie based sessions with same-origin hosting and an unsafe-method header check.
3. Require policy or role checks on the API; frontend visibility is only a usability aid.
4. Keep seed credentials out of source control and remove bootstrap variables after account creation.
