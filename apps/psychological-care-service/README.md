# Psychological Care Service

## Description

`psychological-care-service` is a NestJS microservice for the SMART CAMPUS UCE Student Welfare and Support module. It manages psychological care requests, appointments, follow-ups, and referrals for students.

The service is part of the `smart-campus-uce-module2` monorepo and follows the same backend conventions used by the existing welfare microservices.

## Functional Responsibility

This microservice is responsible for:

- Registering psychological care requests from students.
- Scheduling psychological appointments with psychologists.
- Recording follow-up observations, recommendations, risk level, and next actions.
- Registering referrals to external or specialized care providers.
- Exposing health and OpenAPI documentation endpoints.
- Preparing JWT-based route protection for future integration with an Auth Service or API Gateway.

This service does not implement user management, login, refresh tokens, or authentication workflows.

## Internal Architecture

The service follows Clean Architecture boundaries:

- `domain`: business entities, enums, and repository contracts.
- `application`: DTOs and use cases exposed through `PsychologicalCareService`.
- `infrastructure`: TypeORM and in-memory repository implementations.
- `presentation`: NestJS HTTP controllers.
- `config`: environment mapping, validation, and Swagger setup.
- `auth`: JWT infrastructure prepared for external authentication integration.
- `health`: service health endpoint.

Main domain entities:

- `PsychologicalRequest`
- `PsychologicalAppointment`
- `PsychologicalFollowUp`
- `PsychologicalReferral`

Persistence options:

- PostgreSQL with TypeORM when `DB_ENABLED=true`.
- In-memory repositories when `DB_ENABLED=false`, useful for local development and tests.

## Endpoints

Base business route: `/psychological-care`

### Requests

- `POST /psychological-care/requests`
- `GET /psychological-care/requests`
- `GET /psychological-care/requests/:id`
- `PATCH /psychological-care/requests/:id/status`
- `DELETE /psychological-care/requests/:id`

### Appointments

- `POST /psychological-care/appointments`
- `GET /psychological-care/appointments`
- `GET /psychological-care/appointments/student/:studentId`
- `PATCH /psychological-care/appointments/:id/status`

### Follow-ups

- `POST /psychological-care/follow-ups`
- `GET /psychological-care/follow-ups/student/:studentId`

### Referrals

- `POST /psychological-care/referrals`
- `GET /psychological-care/referrals/student/:studentId`
- `PATCH /psychological-care/referrals/:id/status`

### Health

- `GET /health`

## Environment Variables

Available variables are documented in `.env.example`.

```env
NODE_ENV=development
PORT=3003
CORS_ORIGIN=*
AUTH_ENABLED=false
JWT_SECRET=development-secret
JWT_ISSUER=smart-campus-uce
JWT_AUDIENCE=psychological-care-service
DB_ENABLED=false
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=psychological_care_db
DB_SYNCHRONIZE=false
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
npx nest start psychological-care-service
```

Recommended local `.env` for running without PostgreSQL:

```env
NODE_ENV=development
PORT=3003
CORS_ORIGIN=*
AUTH_ENABLED=false
DB_ENABLED=false
```

Build the service:

```bash
npx nest build psychological-care-service
```

Health check:

```bash
GET http://localhost:3003/health
```

## Docker Execution

Docker files:

- `apps/psychological-care-service/Dockerfile`
- `apps/psychological-care-service/.env.docker`

Docker Compose services:

- `psychological-care-service`
- `psychological-postgres`

Ports:

- Psychological Care API: `3002:3002`
- Psychological PostgreSQL: `5434:5432`

Start only this service and its database:

```bash
docker-compose up -d psychological-postgres psychological-care-service
```

Health check in Docker:

```bash
GET http://localhost:3002/health
```

Swagger in Docker:

```bash
http://localhost:3002/api/docs
```

## Swagger

Swagger/OpenAPI is available at:

```text
/api/docs
```

Local default URL:

```text
http://localhost:3003/api/docs
```

Docker URL:

```text
http://localhost:3002/api/docs
```

OpenAPI metadata:

- Title: `SMART CAMPUS UCE - Psychological Care Service`
- Description: `Student Welfare and Support Module - Psychological Care Management Microservice`
- Version: `1.0.0`
- Tags: `Psychological Care`, `Health`

## Tests

Run all tests from the monorepo root:

```bash
npm test -- --runInBand
```

Run all e2e tests:

```bash
npm run test:e2e -- --runInBand
```

Run only psychological-care-service unit tests:

```bash
npx jest apps/psychological-care-service --runInBand
```

Run only psychological-care-service e2e tests:

```bash
npx jest --config jest-e2e.config.ts apps/psychological-care-service/test --runInBand
```

Current coverage includes:

- `PsychologicalCareService` unit tests.
- `HealthController` unit tests.
- E2E tests for health, request creation/listing, appointment creation, appointment status updates, and JWT guard behavior.

## Future Integration

This service is prepared for integration with other SMART CAMPUS UCE services:

- Auth Service or API Gateway: JWT validation is already available through `AuthModule`, `JwtAuthGuard`, `JwtPayload`, and `CurrentUser`.
- Student profile service: `studentId` is currently stored as a UUID and can later be validated against a student registry.
- Staff or psychologist service: `psychologistId` is currently stored as a UUID and can later be validated against staff records.
- Notification service: appointment creation and status changes can later publish events for email, SMS, or app notifications.
- Analytics or welfare dashboard: request statuses, appointment outcomes, referrals, and risk levels can be exposed for aggregated reporting.

No synchronous dependency on those services exists yet.
