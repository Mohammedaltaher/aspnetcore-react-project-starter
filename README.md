# ASP.NET Core + React project starter

A copyable modular monolith starter for ASP.NET Core 10, PostgreSQL, React, TypeScript, Tailwind, shadcn/ui, and Docker. The **Customers** module is a working example to replace with a real business module. The [standard development plan](docs/standard-development-plan.md) and planning documents live under `docs/`.

## Start the sample

Requirements: Docker with Compose. Copy `.env.example` to `.env`, then replace all passwords with strong values. The bootstrap admin password must meet ASP.NET Identity's default complexity rules and be at least 12 characters.

```bash
cp .env.example .env
# edit .env
docker compose up --build -d
```

Open `http://localhost:8080` and sign in with `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD`. Development startup applies the checked-in EF Core migration and creates that admin if it does not exist. `/health/live` and `/health/ready` are available through the frontend proxy. The development OpenAPI JSON is at `http://localhost:5080/openapi/v1.json`.

## Use for a new project

1. Copy this entire folder to a new repository, or extract `StarterTemplate.zip` created by `python3 scripts/package_template.py`. The archive excludes dependencies, build output, and `.env`.
2. Run `python3 scripts/new_project.py Acme` from the copied folder, using your project's PascalCase name.
3. Fill in `docs/requirements.md`, `docs/modules.md`, `docs/database-design.md`, and `docs/api-contract.md` before adding features.
4. Replace the Customer example with your first real business module. Keep migration history in Git; create a new migration for your model changes.
5. Change `.env`, the database name/user, project branding, and deployment settings for the new project.
6. Run the build and tests shown below.

The rename script changes the `Starter` namespaces, project names, Docker entry point, Compose identifiers, and documentation in the copy. It leaves the original starter untouched.

## Work locally without building app containers

Start PostgreSQL with `docker compose up db -d`. Set the connection string and bootstrap credentials in your terminal or user secrets, then run:

```bash
dotnet tool restore
Database__AutoMigrate=true dotnet run --project backend/src/Starter.Api
cd frontend
pnpm install
pnpm dev
```

The API listens on `http://localhost:5080`; Vite proxies `/api` to it. In another terminal, run `dotnet test Starter.slnx` and `cd frontend && pnpm test && pnpm build && pnpm lint`. After changing endpoints, start the API and run `cd frontend && pnpm generate:api` to refresh the committed OpenAPI types.

## Structure

| Path | Purpose |
| --- | --- |
| `backend/src/Starter.Domain` | Entities and domain rules |
| `backend/src/Starter.Application` | DTOs, validation, use cases, persistence interfaces |
| `backend/src/Starter.Infrastructure` | EF Core, PostgreSQL, Identity, migrations |
| `backend/src/Starter.Api` | HTTP endpoints, auth, logging, Problem Details, health checks |
| `backend/tests/Starter.Tests` | Service and API foundation tests |
| `frontend` | React dashboard, routes, forms, generated API types |
| `docs` | Planning, architecture, API, deployment, and done criteria |

## Authentication and access

ASP.NET Core Identity stores users in PostgreSQL. Login uses an HttpOnly cookie. The bootstrap admin is created only when both bootstrap variables are set. Registration and password recovery are project-specific work to add before exposing them. Customer read/create/update requires a signed-in user; deletion requires the Admin role. State-changing API calls require the `X-CSRF: 1` header, and CORS is off unless `Cors__AllowedOrigins__0` is explicitly configured. Use same-origin hosting as the provided NGINX setup.

For a real product, define its registration/invitation flow, permission policies, account recovery, audit records, and cookie domain policy before release. The sample does not implement these business choices.

## Deployment

See [deployment.md](docs/deployment.md). `compose.production.yaml` expects an external PostgreSQL database and a TLS terminating ingress. It deliberately does not apply migrations automatically.
