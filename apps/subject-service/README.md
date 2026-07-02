# Subject Service

## Description

`subject-service` is a NestJS microservice for the SMART CAMPUS UCE Academic Management module. It manages academic subjects (courses), including creation, retrieval, updates, and deletion.

The service is part of the `smart-campus-uce-module2` monorepo and follows the same backend conventions used by the other microservices.

## Functional Responsibility

This microservice is responsible for:

- Registering academic subjects.
- Listing and retrieving subjects.
- Updating subject data.
- Deleting subjects.
- Exposing health and OpenAPI documentation endpoints.

This service does not implement authentication or user management workflows.

## Internal Architecture

The service follows Clean Architecture boundaries:

- `domain`: business entities, value objects, and repository contracts.
- `application`: DTOs and use cases exposed through `SubjectService`.
- `infrastructure`: TypeORM and in-memory repository implementations.
- `presentation`: NestJS HTTP controllers.
- `config`: environment mapping, validation, and Swagger setup.
- `health`: service health endpoint.

Main domain entity:

- `Subject`

Persistence options:

- PostgreSQL with TypeORM when `DB_ENABLED=true`.
- In-memory repositories when `DB_ENABLED=false`, useful for local development and tests.

## Default Port and Base Route

- **Default port:** `3004`
- **Base business route:** `/subjects`
- **Health route:** `/health`

## Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/subjects` | Create a subject |
| `GET` | `/subjects` | List subjects |
| `GET` | `/subjects/:id` | Get a subject by UUID |
| `PATCH` | `/subjects/:id` | Update a subject |
| `DELETE` | `/subjects/:id` | Delete a subject |

## Environment Variables

Available variables are documented in `.env.example`.

```env
PORT=3004
CORS_ORIGIN=*
DB_ENABLED=false
DB_HOST=subject-postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=subject_db
DB_SYNCHRONIZE=true
DB_LOGGING=false
```

Important behavior:

- `DB_ENABLED=false`: service starts without PostgreSQL and uses in-memory repositories.
- `DB_ENABLED=true`: service uses PostgreSQL through TypeORM.
- `GET /health` remains public.

## Local Execution

From the monorepo root:

```bash
npx nest start subject-service
```

Watch mode:

```bash
npx nest start subject-service --watch
```

Build the service:

```bash
npx nest build subject-service
```

Recommended local `.env` for running without PostgreSQL:

```env
PORT=3004
CORS_ORIGIN=*
DB_ENABLED=false
```

Health check:

```bash
curl http://localhost:3004/health
```

## Docker Execution

Docker file:

- `apps/subject-service/Dockerfile`

There is currently no dedicated Docker Compose service for `subject-service` in the root `docker-compose.yml`. The service can be started locally with `npx nest start` or added to the compose stack when it needs to be integrated with its own PostgreSQL instance.

## Swagger

Swagger/OpenAPI is available at:

```text
/api/docs
```

Local default URL:

```text
http://localhost:3004/api/docs
```

OpenAPI metadata:

- **Title:** `SMART CAMPUS UCE - Subject Service`
- **Description:** `Academic Management Module - Subject Management Microservice`
- **Version:** `1.0.0`
- **Tags:** `Subjects`, `Health`

## Tests

Run all tests from the monorepo root:

```bash
npm test -- --runInBand
```

Run all e2e tests:

```bash
npm run test:e2e -- --runInBand
```

Run only subject-service unit tests:

```bash
npx jest apps/subject-service --runInBand
```

Run only subject-service e2e tests:

```bash
npx jest --config jest-e2e.config.ts apps/subject-service/test --runInBand
```

Current coverage includes:

- `SubjectService` unit tests.
- `HealthController` unit tests.
- E2E tests covering health and subject endpoints.

## Future Integration

This service is prepared for integration with other SMART CAMPUS UCE services:

- **Enrollment service:** subjects can be referenced by enrollment records to build course offerings and student schedules.
- **Academic program service:** subjects can later be grouped into curricula, careers, and academic periods.
- **Analytics or academic dashboard:** subject data can be exposed for reporting and curriculum planning.

No synchronous dependency on those services exists yet.
