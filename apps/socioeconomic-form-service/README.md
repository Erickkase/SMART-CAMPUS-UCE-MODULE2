# Socioeconomic Form Service

## Description

`socioeconomic-form-service` is a NestJS microservice for the SMART CAMPUS UCE Student Welfare and Support module. It manages socioeconomic information submitted by students, including creation, retrieval, updates, and deletion of socioeconomic forms.

The service is part of the `smart-campus-uce-module2` monorepo and follows the same backend conventions used by the other welfare microservices.

## Functional Responsibility

This microservice is responsible for:

- Registering socioeconomic forms from students.
- Listing and retrieving socioeconomic forms.
- Updating socioeconomic form data.
- Deleting socioeconomic forms.
- Exposing health and OpenAPI documentation endpoints.

This service does not implement authentication or user management workflows.

## Internal Architecture

The service follows Clean Architecture boundaries:

- `domain`: business entities, value objects, and repository contracts.
- `application`: DTOs and use cases exposed through `SocioeconomicFormService`.
- `infrastructure`: Mongoose and in-memory repository implementations.
- `presentation`: NestJS HTTP controllers.
- `config`: environment mapping, validation, and Swagger setup.
- `health`: service health endpoint.

Main domain entity:

- `SocioeconomicForm`

Persistence options:

- MongoDB with Mongoose when `MONGO_ENABLED=true`.
- In-memory repositories when `MONGO_ENABLED=false`, useful for local development and tests.

## Default Port and Base Route

- **Default port:** `3001`
- **Base business route:** `/socioeconomic-forms`
- **Health route:** `/health`

## Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/socioeconomic-forms` | Create a socioeconomic form |
| `GET` | `/socioeconomic-forms` | List socioeconomic forms |
| `GET` | `/socioeconomic-forms/student/:studentId` | Get forms by student ID |
| `GET` | `/socioeconomic-forms/:id` | Get a socioeconomic form by UUID |
| `PATCH` | `/socioeconomic-forms/:id` | Update a socioeconomic form |
| `DELETE` | `/socioeconomic-forms/:id` | Delete a socioeconomic form |

## Environment Variables

Available variables are documented in `.env.example`.

```env
NODE_ENV=development
PORT=3001
CORS_ORIGIN=*
MONGO_ENABLED=false
MONGODB_URI=mongodb://localhost:27017/socioeconomic_forms
```

Important behavior:

- `MONGO_ENABLED=false`: service starts without MongoDB and uses in-memory repositories.
- `MONGO_ENABLED=true`: service uses MongoDB through Mongoose.
- `GET /health` remains public.

## Local Execution

From the monorepo root:

```bash
npx nest start socioeconomic-form-service
```

Watch mode:

```bash
npx nest start socioeconomic-form-service --watch
```

Or using the root script:

```bash
npm run start:socioeconomic:dev
```

Build the service:

```bash
npx nest build socioeconomic-form-service
```

Recommended local `.env` for running without MongoDB:

```env
NODE_ENV=development
PORT=3001
CORS_ORIGIN=*
MONGO_ENABLED=false
```

Health check:

```bash
curl http://localhost:3001/health
```

## Docker Execution

Docker files:

- `apps/socioeconomic-form-service/Dockerfile`
- `apps/socioeconomic-form-service/.env.docker`

Docker Compose services:

- `socioeconomic-form-service`
- `mongo` (socioeconomic MongoDB)

Ports:

- Socioeconomic Form API: `3001:3001`
- Socioeconomic MongoDB: `27017:27017`

Start only this service and its database:

```bash
docker compose up -d mongo socioeconomic-form-service
```

Health check in Docker:

```bash
curl http://localhost:3001/health
```

Swagger in Docker:

```bash
http://localhost:3001/api/docs
```

## Swagger

Swagger/OpenAPI is available at:

```text
/api/docs
```

Local default URL:

```text
http://localhost:3001/api/docs
```

Docker URL:

```text
http://localhost:3001/api/docs
```

OpenAPI metadata:

- **Title:** `SMART CAMPUS UCE - Socioeconomic Form Service`
- **Description:** `Student Welfare and Support Module - Socioeconomic Form Management Microservice`
- **Version:** `1.0.0`
- **Tags:** `Socioeconomic Forms`, `Health`

## Tests

Run all tests from the monorepo root:

```bash
npm test -- --runInBand
```

Run all e2e tests:

```bash
npm run test:e2e -- --runInBand
```

Run only socioeconomic-form-service unit tests:

```bash
npx jest apps/socioeconomic-form-service --runInBand
```

Run only socioeconomic-form-service e2e tests:

```bash
npx jest --config jest-e2e.config.ts apps/socioeconomic-form-service/test --runInBand
```

Current coverage includes:

- `SocioeconomicFormService` unit tests.
- `HealthController` unit tests.
- E2E tests covering health and socioeconomic form endpoints.

## Future Integration

This service is prepared for integration with other SMART CAMPUS UCE services:

- **Student profile service:** `studentId` is currently stored as a UUID and can later be validated against a student registry.
- **Notification service:** form creation and updates can later publish events for email, SMS, or app notifications.
- **Analytics or welfare dashboard:** socioeconomic data can be exposed for aggregated reporting and vulnerability scoring.

No synchronous dependency on those services exists yet.
