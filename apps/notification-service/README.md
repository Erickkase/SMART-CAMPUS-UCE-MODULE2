# Notification Service

## Description

`notification-service` is a NestJS microservice for the SMART CAMPUS UCE Student Welfare and Support module. It manages notifications sent to students and staff through email, SMS, and push channels.

The service is part of the `smart-campus-uce-module2` monorepo and follows the same backend conventions used by the existing welfare microservices.

## Functional Responsibility

This microservice is responsible for:

- Creating notification records for students and staff.
- Listing and retrieving notifications.
- Updating notification content and metadata.
- Changing notification status (pending, sent, failed, cancelled).
- Deleting notification records.
- Exposing health and OpenAPI documentation endpoints.

This service does not implement authentication, user management, or the actual delivery providers (SMTP, SMS gateway, push notification providers). Those integrations are planned for future activities.

## Internal Architecture

The service follows Clean Architecture boundaries:

- `domain`: business entities, enums, and repository contracts.
- `application`: DTOs and use cases exposed through `NotificationService`.
- `infrastructure`: TypeORM and in-memory repository implementations.
- `presentation`: NestJS HTTP controllers.
- `config`: environment mapping, validation, and Swagger setup.
- `health`: service health endpoint.

Main domain entity:

- `Notification`

Persistence options:

- PostgreSQL with TypeORM when `DB_ENABLED=true`.
- In-memory repositories when `DB_ENABLED=false`, useful for local development and tests.

## Default Port and Base Route

- **Default port:** `3007`
- **Base business route:** `/notifications`
- **Health route:** `/health`

## Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/notifications` | Create a notification |
| `GET` | `/notifications` | List notifications |
| `GET` | `/notifications/:id` | Get a notification by UUID |
| `GET` | `/notifications/recipient/:recipientId` | List notifications by recipient |
| `PATCH` | `/notifications/:id` | Update a notification |
| `PATCH` | `/notifications/:id/status` | Update notification status |
| `DELETE` | `/notifications/:id` | Delete a notification |

## Environment Variables

Available variables are documented in `.env.example`.

```env
PORT=3007
CORS_ORIGIN=*
DB_ENABLED=false
DB_HOST=notification-postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=notification_db
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
npx nest start notification-service
```

Watch mode:

```bash
npx nest start notification-service --watch
```

Or using the root script:

```bash
npm run start:notification:dev
```

Build the service:

```bash
npx nest build notification-service
```

Recommended local `.env` for running without PostgreSQL:

```env
PORT=3007
CORS_ORIGIN=*
DB_ENABLED=false
```

Health check:

```bash
curl http://localhost:3007/health
```

## Docker Execution

Docker files:

- `apps/notification-service/Dockerfile`
- `apps/notification-service/.env.docker`

Docker Compose services:

- `notification-service`
- `notification-postgres`

Ports:

- Notification API: `3007:3007`
- Notification PostgreSQL: `5438:5432`

Start only this service and its database:

```bash
docker compose up -d notification-postgres notification-service
```

Health check in Docker:

```bash
curl http://localhost:3007/health
```

Swagger in Docker:

```bash
http://localhost:3007/api/docs
```

## Swagger

Swagger/OpenAPI is available at:

```text
/api/docs
```

Local default URL:

```text
http://localhost:3007/api/docs
```

Docker URL:

```text
http://localhost:3007/api/docs
```

OpenAPI metadata:

- **Title:** `SMART CAMPUS UCE - Notification Service`
- **Description:** `Student Welfare and Support Module - Notification Management Microservice`
- **Version:** `1.0.0`
- **Tags:** `Notifications`, `Health`

## Tests

Run all tests from the monorepo root:

```bash
npm test -- --runInBand
```

Run all e2e tests:

```bash
npm run test:e2e -- --runInBand
```

Run only notification-service unit tests:

```bash
npx jest apps/notification-service --runInBand
```

Run only notification-service e2e tests:

```bash
npx jest --config jest-e2e.config.ts apps/notification-service/test --runInBand
```

Current coverage includes:

- `NotificationService` unit tests.
- `HealthController` unit tests.
- E2E tests for health, notification creation, listing, status updates, and recipient filtering.

## Future Integration

This service is prepared for integration with other SMART CAMPUS UCE services:

- **Event broker (Kafka/RabbitMQ):** a `messaging` module can be added under `modules/` to consume events from `scholarship-service`, `psychological-care-service`, and other welfare microservices, automatically creating notifications when relevant business events occur.
- **Delivery providers:** the `channel` field is designed to support `email`, `sms`, and `push`. Future activities can add adapter modules for SMTP, SMS gateways, and push notification services.
- **Student/Staff registry:** `recipientId` is currently stored as a UUID and can later be validated against a central user registry.
- **API Gateway:** `api-gateway` can later proxy `/api/notifications` to this service.

No synchronous dependency on those services exists yet.
