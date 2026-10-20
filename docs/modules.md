# Modules

| Module | Responsibility | Data | API | UI |
| --- | --- | --- | --- | --- |
| Identity | Accounts and authentication | ASP.NET Identity tables | `/api/v1/auth/*` | Login |
| Customers (example) | Contact records | `customers` | `/api/v1/customers` | List, form, details |
| TODO | TODO | TODO | TODO | TODO |

Keep modules centered on business capabilities. Add a module only when it owns distinct rules and data. Build each module from migration through UI before starting another.
