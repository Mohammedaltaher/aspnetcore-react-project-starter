# Standard Software Development Plan

**Technology Stack:** ASP.NET Core 10, PostgreSQL, React, TypeScript, Docker

**Architecture:** Modular Monolith with Clean Architecture principles

**Objective:** Establish a consistent, scalable, secure, and maintainable process for developing web applications.

---

## Phase 1 — Project Planning

Before writing code:

1. Define the project purpose and business requirements.
2. Identify user roles and permissions.
3. Break the system into independent business modules.
4. List the features required for the MVP.
5. Define important business rules and workflows.
6. Identify integrations with external systems.
7. Define the required frontend pages.
8. Create an initial entity and relationship diagram.
9. Document the API endpoints required by each module.

**Deliverables:**
- `requirements.md`
- `modules.md`
- `database-design.md`
- `api-contract.md`

## Phase 2 — Backend Setup (.NET)

Create a new .NET solution using the following projects:

- `Project.Api` — Controllers/endpoints, authentication configuration, middleware, API documentation.
- `Project.Application` — Use cases, DTOs, validation, application interfaces.
- `Project.Domain` — Entities, enums, domain rules.
- `Project.Infrastructure` — EF Core, PostgreSQL, repositories, external integrations.
- `Project.Tests` — Unit and integration tests.

### Initial Backend Configuration

1. Configure dependency injection.
2. Configure environment-specific settings.
3. Add global exception handling.
4. Standardize error responses using Problem Details.
5. Add FluentValidation for input validation.
6. Configure authentication and authorization.
7. Add role- and policy-based permissions.
8. Add CORS where required.
9. Configure OpenAPI documentation.
10. Add health-check endpoints.
11. Add structured logging.
12. Implement pagination, filtering, and sorting conventions.
13. Configure cancellation tokens and async database calls.

**Important:** Use CQRS/MediatR where it adds value. Avoid unnecessary abstractions in small projects.

**Deliverable:** A working API foundation with authentication, consistent responses, logging, and tests.

## Phase 3 — PostgreSQL Database

Use PostgreSQL with Entity Framework Core and Npgsql.

### Database Implementation

1. Create the development PostgreSQL database.
2. Configure the connection string using environment variables or user secrets.
3. Create domain entities.
4. Configure entity relationships using Fluent API.
5. Define primary keys, foreign keys, and unique constraints.
6. Add indexes for frequent queries.
7. Create the initial EF Core migration.
8. Apply migrations to the development database.
9. Create seed data for development and testing.
10. Configure transactional operations where needed.

### Database Standards

- Use consistent table and column naming.
- Store timestamps in UTC.
- Use explicit decimal precision for monetary values.
- Enforce uniqueness and referential integrity in PostgreSQL.
- Avoid exposing database entities directly in API contracts.
- Use soft deletion only when business requirements justify it.
- Maintain migration history in Git.
- Never modify production data through unreviewed migrations.
- Configure automated backups and test restoration.

**Deliverable:** A PostgreSQL schema managed through migrations, with validated relationships and test data.

## Phase 4 — API Feature Development

Develop the API in independent business modules.

For every module:

1. Define entities and business rules.
2. Define request and response DTOs.
3. Create validation rules.
4. Implement application use cases.
5. Implement database access.
6. Expose REST endpoints.
7. Apply authentication and permissions.
8. Handle expected failures and edge cases.
9. Write automated tests.
10. Test endpoints through OpenAPI or an API client.

### Standard REST Endpoints

For a resource such as Customers:

- `GET /api/v1/customers` — Get paginated customers.
- `GET /api/v1/customers/{id}` — Get one customer.
- `POST /api/v1/customers` — Create customer.
- `PUT /api/v1/customers/{id}` — Update customer.
- `DELETE /api/v1/customers/{id}` — Delete customer.

Apply the same conventions across modules.

**Deliverable:** Functional, documented, tested API endpoints.

## Phase 5 — React Frontend

Use React with TypeScript and Vite for a standard client-side dashboard application.

### Frontend Technology

- React + TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- TanStack Query for server state
- React Hook Form + Zod for forms and validation
- Axios or Fetch for HTTP communication
- Generated TypeScript API types/client from OpenAPI

### Initial Frontend Setup

1. Create the React application.
2. Configure project structure and routing.
3. Install the UI component library.
4. Create the main application layout.
5. Implement login and logout.
6. Configure protected routes.
7. Configure the HTTP client and authentication handling.
8. Configure API error handling.
9. Build reusable UI components.
10. Create dashboards and business module pages.
11. Add loading, empty, success, and error states.
12. Implement responsive design and optional Arabic RTL support.

### Standard Module Pages

For each business module:

- List page with searching, filtering, sorting, and pagination.
- Create form.
- Edit form.
- Details page or modal.
- Delete confirmation where appropriate.
- Permission-based action visibility.
- Feedback for errors and successful operations.

**Deliverable:** A responsive frontend connected to the actual API, without duplicated business logic.

## Phase 6 — Feature Integration

Develop one complete feature at a time.

**Recommended sequence:**

Database Entity → Migration → API DTOs → Validation → Business Logic → Endpoint → API Tests → React Page → Frontend Tests.

Do not build every frontend page using mock data before validating the API integration.

Ensure that:
- Frontend API types match the backend contracts.
- Server-side permissions are always enforced.
- Forms display validation errors correctly.
- Lists use server-side pagination for large datasets.
- Loading and network failure states are handled.
- Integration testing covers critical workflows.

## Phase 7 — Quality, Performance, and Security

### Testing

- Unit tests for business logic.
- Integration tests for endpoints and database operations.
- Frontend component tests.
- End-to-end tests for important user journeys.
- Permission and unauthorized-access tests.

### Security

- HTTPS everywhere in production.
- Secure password hashing when managing credentials locally.
- Secure session or token handling.
- Server-side validation for all inputs.
- Role/policy-based authorization.
- Rate limiting for sensitive endpoints.
- Secure management of API keys and connection strings.
- Audit logs for important operations.
- Dependency vulnerability scanning.

### Performance

- Database indexing and query review.
- Efficient EF Core queries.
- Avoid N+1 database queries.
- Pagination for large results.
- Caching where justified.
- Frontend lazy loading and code splitting.
- Proper HTTP timeouts and cancellation.

**Deliverable:** Tested release candidate with completed security and performance checks.

## Phase 8 — Docker and Deployment

### Docker Setup

Containerize the application:

- ASP.NET Core API container
- React frontend served by NGINX
- PostgreSQL service where self-hosting the database
- Optional Redis service when needed

### Deployment Workflow

1. Create Dockerfiles.
2. Configure Docker Compose for development and production environments.
3. Configure persistent PostgreSQL storage.
4. Configure production environment variables and secrets.
5. Configure NGINX reverse proxy.
6. Enable SSL certificates.
7. Configure GitHub Actions CI/CD.
8. Run tests and builds before deployment.
9. Apply reviewed database migrations through a controlled deployment step.
10. Deploy the new application version.
11. Verify health checks and critical workflows.
12. Configure log monitoring, backups, and recovery.
13. Document the rollback procedure.

**Deliverable:** A deployed application with repeatable builds, monitoring, and recovery procedures.

## Phase 9 — Documentation and Handover

Maintain:

- `README.md` — Project overview and setup
- `requirements.md` — Functional requirements
- `architecture.md` — System architecture
- `database-design.md` — Entity relationships
- `api-contract.md` — Endpoint contracts
- `deployment.md` — Deployment instructions
- `.env.example` — Required environment variables without secrets

Document all major architectural decisions.

## Phase 10 — Definition of Done

A feature is complete only when:

- [ ] Business requirements are satisfied.
- [ ] Database schema/migration is complete.
- [ ] API endpoints are implemented.
- [ ] Input validation and permissions are implemented.
- [ ] API tests pass.
- [ ] React UI is connected to the live API.
- [ ] Loading and error states work.
- [ ] Critical frontend tests pass.
- [ ] Changes are reviewed and documented.
- [ ] The feature works in the target environment.

---

## Rules for Every New Project

1. Start with a clear MVP scope.
2. Use a consistent architecture and naming convention.
3. Complete the backend foundation before expanding business features.
4. Develop business modules vertically, from database to UI.
5. Keep business rules in the backend.
6. Prefer reusable infrastructure over copying unrelated business code.
7. Maintain database migrations and automated tests from the beginning.
8. Use Docker to keep environments reproducible.
9. Automate testing and deployment.
10. Keep the solution simple until complexity is justified.

**End Goal:** Every new project should start from the same reliable foundation, allowing development to focus primarily on its unique business requirements.