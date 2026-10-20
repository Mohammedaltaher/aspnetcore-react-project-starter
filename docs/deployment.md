# Deployment and recovery

## Development

`docker compose up --build -d` starts PostgreSQL, API, and NGINX. The development API applies migrations automatically. The PostgreSQL volume is named `postgres_data`.

## Production outline

1. Provision managed PostgreSQL or a separately backed-up server. Create a least-privilege application account and configure `DATABASE_CONNECTION_STRING` in a secret manager.
2. Review the generated EF Core migration SQL using `dotnet tool run dotnet-ef migrations script --idempotent --project backend/src/Starter.Infrastructure --startup-project backend/src/Starter.Api -o migration.sql`. Review and apply it through the deployment process before starting the new API image.
3. For the first deployment, set `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` in the secret manager to create the initial administrator, then remove those variables after verifying sign-in. Build images and start `docker compose -f compose.production.yaml up --build -d` in the target environment. The web service listens on loopback port 8080. Terminate HTTPS at an ingress or reverse proxy in front of it.
4. Check `/health/ready`, sign in, and exercise the critical workflow. Send application logs to the monitoring system.
5. Schedule encrypted database backups, keep copies off-host, and test restoring to a separate database.

Do not put production passwords in `.env` committed to Git. Do not enable `Database__AutoMigrate` in production.

## Rollback

If a release fails, switch the API and web images back to the prior tagged versions. Prefer forward-compatible additive migrations; reversing destructive schema changes requires a reviewed recovery plan. Restore a database backup only after assessing and accepting the data loss window.
