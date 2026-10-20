# Project rules for coding assistants

This repository is a reusable starter. When copied for a new product:

1. Read `README.md` and `docs/standard-development-plan.md` first.
2. Fill in the planning documents before adding product-specific features.
3. Keep Domain free of framework dependencies. Put use cases and validation in Application, EF Core and integrations in Infrastructure, and HTTP wiring in Api.
4. Build one complete module from database migration through API and React UI before starting the next.
5. Enforce permissions and validation in the API. Keep API contracts separate from EF entities.
6. Add migrations for schema changes and keep them in source control.
7. Run `dotnet test Starter.slnx` and `cd frontend && pnpm test && pnpm build && pnpm lint` after changes. Use the renamed solution file after running `scripts/new_project.py`.
8. Keep secrets out of Git. Use `.env.example` only as a list of required variables.
