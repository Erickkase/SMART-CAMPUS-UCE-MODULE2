# Scholarship Service

## Description

`scholarship-service` is a NestJS microservice for the SMART CAMPUS UCE Student Welfare and Support module. It manages scholarship requests submitted by students, including creation, updates, status changes, and deletion.

The service is part of the `smart-campus-uce-module2` monorepo and follows the same backend conventions used by the other welfare microservices.

## Functional Responsibility

This microservice is responsible for:

- Registering scholarship requests from students.
- Listing and retrieving scholarship requests.
- Updating scholarship request data and status.
- Deleting scholarship requests.
- Exposing health and OpenAPI documentation endpoints.
- Preparing JWT-based route protection for future integration with an Auth Service or API Gateway.

This service does not implement user management, login, refresh tokens, or authentication workflows.

## Internal Architecture

The service follows Clean Architecture boundaries:

- `domain`: business entities, enums, and repository contracts.
- `application`: DTOs and use cases exposed through `ScholarshipService`.
- `infrastructure`: TypeORM and in-memory repository implementations.
- `presentation`: NestJS HTTP controllers.
- `config`: environment mapping, validation, and Swagger setup.
- `auth`: JWT infrastructure prepared for external authentication integration.
- `health`: service health endpoint.

Main domain entity:

- `ScholarshipRequest`

Persistence options:

- PostgreSQL with TypeORM when `DB_ENABLED=true`.
- In-memory repositories when `DB_ENABLED=false`, useful for local development and tests.

## Default Port and Base Route

- **Default port:** `3000`
- **Base business route:** `/scholarships`
- **Health route:** `/health`

## Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/scholarships` | Create a scholarship request |
| `GET` | `/scholarships` | List scholarship requests |
| `GET` | `/scholarships/:id` | Get a scholarship request by UUID |
| `PATCH` | `/scholarships/:id` | Update a scholarship request |
| `PATCH` | `/scholarships/:id/status` | Update the status of a scholarship request |
| `DELETE` | `/scholarships/:id` | Delete a scholarship request |

## Environment Variables

Available variables are documented in `.env.example`.

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*
AUTH_ENABLED=false
JWT_SECRET=development-secret
JWT_ISSUER=smart-campus-uce
JWT_AUDIENCE=scholarship-service
DB_ENABLED=false
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=scholarship_db
DB_SYNCHRONIZE=true
DB_LOGGING=false
```

Important behavior:

- `DB_ENABLED=false`: service starts without PostgreSQL and uses in-memory repositories.
- `DB_ENABLED=true`: service uses PostgreSQL through TypeORM.
- `AUTH_ENABLED=false`: protected endpoints work without a token.
- `AUTH_ENABLED=true`: business endpoints require a valid Bearer JWT.
- `GET /health` remains public.

## Local Execution

From the monorepo root:

```bash
npx nest start scholarship-service
```

Watch mode:

```bash
npx nest start scholarship-service --watch
```

Or using the root script:

```bash
npm run start:dev
```

Build the service:

```bash
npx nest build scholarship-service
```

Recommended local `.env` for running without PostgreSQL:

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*
AUTH_ENABLED=false
DB_ENABLED=false
```

Health check:

```bash
curl http://localhost:3000/health
```

## Docker Execution

Docker files:

- `apps/scholarship-service/Dockerfile`
- `apps/scholarship-service/.env.docker`

Docker Compose services:

- `scholarship-service`
- `postgres` (scholarship PostgreSQL)

Ports:

- Scholarship API: `3000:3000`
- Scholarship PostgreSQL: `5432:5432`

Start only this service and its database:

```bash
docker compose up -d postgres scholarship-service
```

Health check in Docker:

```bash
curl http://localhost:3000/health
```

Swagger in Docker:

```bash
http://localhost:3000/api/docs
```

## Swagger

Swagger/OpenAPI is available at:

```text
/api/docs
```

Local default URL:

```text
http://localhost:3000/api/docs
```

Docker URL:

```text
http://localhost:3000/api/docs
```

OpenAPI metadata:

- **Title:** `SMART CAMPUS UCE - Scholarship Service`
- **Description:** `Student Welfare and Support Module - Scholarship Management Microservice`
- **Version:** `1.0.0`
- **Tags:** `Scholarships`, `Health`

## Tests

Run all tests from the monorepo root:

```bash
npm test -- --runInBand
```

Run all e2e tests:

```bash
npm run test:e2e -- --runInBand
```

Run only scholarship-service unit tests:

```bash
npx jest apps/scholarship-service --runInBand
```

Run only scholarship-service e2e tests:

```bash
npx jest --config jest-e2e.config.ts apps/scholarship-service/test --runInBand
```

Current coverage includes:

- `ScholarshipService` unit tests.
- `HealthController` unit tests.
- Integration/e2e tests for health and scholarship request endpoints.

## Future Integration

This service is prepared for integration with other SMART CAMPUS UCE services:

- **Auth Service or API Gateway:** JWT validation is already available through `AuthModule`, `JwtAuthGuard`, `JwtPayload`, and `CurrentUser`.
- **Student profile service:** `studentId` is currently stored as a UUID and can later be validated against a student registry.
- **Notification service:** request creation and status changes can later publish events for email, SMS, or app notifications.
- **Analytics or welfare dashboard:** request statuses and outcomes can be exposed for aggregated reporting.

No synchronous dependency on those services exists yet.
