# Enrollment Service

## Description

`enrollment-service` is a NestJS microservice placeholder for the SMART CAMPUS UCE Academic Management module. It is intended to manage student enrollments in academic subjects and programs.

The service is part of the `smart-campus-uce-module2` monorepo and follows the same backend conventions used by the other microservices.

## Functional Responsibility

This microservice will eventually be responsible for:

- Registering student enrollments in subjects or academic periods.
- Listing and retrieving enrollment records.
- Updating enrollment statuses.
- Canceling enrollments.
- Exposing health and OpenAPI documentation endpoints.

Currently, the service only exposes a health check endpoint and has PostgreSQL/TypeORM infrastructure prepared for future business entities.

## Internal Architecture

The service follows the standard NestJS modular structure:

- `modules/health`: service health endpoint.
- `config`: environment mapping, validation, and Swagger setup.
- `app.module.ts`: global configuration with TypeORM connection (manual initialization when `DB_ENABLED=false`).

Persistence options:

- PostgreSQL with TypeORM when `DB_ENABLED=true`.
- Connection is initialized manually when `DB_ENABLED=false`, so the service can start without a database.

## Default Port and Base Route

- **Default port:** `3005`
- **Business routes:** none yet (only `/health` is available)
- **Health route:** `/health`

## Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/health` | Health check |

## Environment Variables

Available variables are documented in `.env.example`.

```env
PORT=3005
CORS_ORIGIN=*
DB_ENABLED=false
DB_HOST=enrollment-postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=enrollment_db
DB_SYNCHRONIZE=true
DB_LOGGING=false
```

Important behavior:

- `DB_ENABLED=false`: service starts without PostgreSQL. The TypeORM connection is initialized manually and no business entities are loaded.
- `DB_ENABLED=true`: service connects to PostgreSQL through TypeORM.
- `GET /health` remains public.

## Local Execution

From the monorepo root:

```bash
npx nest start enrollment-service
```

Watch mode:

```bash
npx nest start enrollment-service --watch
```

Build the service:

```bash
npx nest build enrollment-service
```

Recommended local `.env` for running without PostgreSQL:

```env
PORT=3005
CORS_ORIGIN=*
DB_ENABLED=false
```

Health check:

```bash
curl http://localhost:3005/health
```

## Docker Execution

Docker file:

- `apps/enrollment-service/Dockerfile`

There is currently no dedicated Docker Compose service for `enrollment-service` in the root `docker-compose.yml`. The service can be started locally with `npx nest start` or added to the compose stack when it needs its own PostgreSQL instance.

## Swagger

Swagger/OpenAPI is available at:

```text
/api/docs
```

Local default URL:

```text
http://localhost:3005/api/docs
```

OpenAPI metadata:

- **Title:** `SMART CAMPUS UCE - Enrollment Service`
- **Description:** `Academic Management Module - Enrollment Management Microservice`
- **Version:** `1.0.0`
- **Tags:** `Enrollments`, `Health`

## Tests

Run all tests from the monorepo root:

```bash
npm test -- --runInBand
```

Run all e2e tests:

```bash
npm run test:e2e -- --runInBand
```

Run only enrollment-service unit tests:

```bash
npx jest apps/enrollment-service --runInBand
```

Run only enrollment-service e2e tests:

```bash
npx jest --config jest-e2e.config.ts apps/enrollment-service/test --runInBand
```

Currently there are no `.spec.ts` or `.e2e-spec.ts` files; the `test/` folder is reserved for future tests.

## Future Integration

This service is planned for integration with other SMART CAMPUS UCE services:

- **Subject service:** enrollments will reference subjects managed by `subject-service`.
- **Student profile service:** enrollments will reference students from a central student registry.
- **Academic period service:** enrollments can later be grouped by academic period, career, and cohort.
- **Notification service:** enrollment confirmations and status changes can later publish events for email, SMS, or app notifications.

No synchronous dependency on those services exists yet.
