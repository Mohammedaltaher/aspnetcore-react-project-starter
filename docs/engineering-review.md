# Engineering review

Reviewed on 2026-10-20. The modular monolith is an appropriate starting point: Domain has no framework dependency, Application contains the customer use case and validation, Infrastructure owns EF Core and Identity, and Api owns HTTP and authorization. The Customer module is complete from migration to UI. Keep these boundaries as the starter grows; adding a mediator or separate services now would add complexity without solving a current problem.

## Changes made

| Finding | Change | Verification |
| --- | --- | --- |
| The web container could start while the API was still migrating or failing to seed its admin, leaving a page that returned 502 for API calls. | The API image now has a database readiness healthcheck. Both Compose files wait for it before starting web. | Docker startup reported the API healthy before starting web; the proxied readiness endpoint returned 200. |
| NGINX resolved the API address at startup, so replacing the API container alone could leave a stale address. | NGINX now uses Docker DNS with a short refresh interval. | Recreated only the API container; the existing web container still returned 200 from `/health/ready`. |
| In-memory tests could not catch migration, PostgreSQL query, or unique-index failures. | CI now starts PostgreSQL. An isolated integration test applies migrations, checks literal wildcard search and paging, then checks the unique constraint. | `dotnet test` passed against a temporary PostgreSQL 17 instance. |
| The frontend kept a cached signed-in state after a customer request received 401. | Query and mutation errors now invalidate the auth query, which lets the protected route redirect after the session expires. | Frontend test covers the 401 invalidation; build and lint pass. |
| The `/auth/me` response was anonymous in OpenAPI, so the frontend maintained its own copy of the type. | Added a named API response contract and regenerated TypeScript types. | Frontend typecheck and production build pass. |
| Updating a customer could briefly show stale details. | Successful saves update the detail cache before navigation. | Frontend build passes. |
| The login limiter saw NGINX as one client and allowed only ten attempts per minute across all users. | Raised the proxy-level backstop to 120 requests per minute. Identity account lockout remains enabled. | Backend tests and login smoke test pass. |

## Decisions for a real product

- Configure client-specific login throttling at a trusted TLS ingress. The sample API deliberately does not trust arbitrary `X-Forwarded-For` values; that header can be spoofed unless the proxy chain is explicitly trusted. The backend limit remains a coarse safety backstop.
- Define registration or invitations, account recovery, permission policies, and audit events for the product. The starter only creates a bootstrap admin and demonstrates one Admin-only action.
- Apply reviewed migrations as a deployment step, persist Data Protection keys across API replicas, and test backup restoration. The production Compose file assumes an external PostgreSQL server and TLS ingress.
- Review whether the product needs richer anti-forgery protection when adding cross-origin clients or changing cookie policy. The sample is designed for its same-origin NGINX deployment.
