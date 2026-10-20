# API contract

Base path: `/api/v1`. Development OpenAPI: `/openapi/v1.json` on the API process. Regenerate frontend types with `pnpm generate:api` while the API is running on port 5080.

| Method | Path | Access | Result |
| --- | --- | --- | --- |
| POST | `/auth/login` | Public | HttpOnly session cookie, 204 |
| POST | `/auth/logout` | Authenticated | 204 |
| GET | `/auth/me` | Authenticated | `{ email, isAdmin }` |
| GET | `/customers?search=&sort=newest&page=1&pageSize=20` | Authenticated | `{ items, page, pageSize, total }` |
| GET | `/customers/{id}` | Authenticated | Customer or 404 |
| POST | `/customers` | Authenticated | Customer, 201 |
| PUT | `/customers/{id}` | Authenticated | Customer or 404 |
| DELETE | `/customers/{id}` | Admin | 204 or 404 |

Customer input is `{ "name": "Example", "email": "example@example.com" }`. Customer output includes `id` and `createdAtUtc`. Search checks name and email. Sort values: `newest`, `oldest`, `name`, `-name`, `email`, `-email`. Page starts at 1, page size is 1–100. Validation failures return 400 Problem Details; duplicate email returns 409. All state-changing `/api/v1` requests require `X-CSRF: 1`.

For each new module, add exact request/response shapes, authorization rules, error cases, and pagination semantics here.
