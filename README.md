# SMART CAMPUS UCE

## Module 2 - Student Welfare and Support

This repository contains the `v0.1.0` release baseline for the SMART CAMPUS UCE Module 2 monorepo. The project groups backend microservices, an API Gateway, and a frontend application focused on student welfare and support processes.

## Release Scope

The first stable release documents and packages these applications:

| Application | Type | Purpose |
| --- | --- | --- |
| `scholarship-service` | NestJS microservice | Scholarship request management |
| `socioeconomic-form-service` | NestJS microservice | Socioeconomic form management |
| `psychological-care-service` | NestJS microservice | Psychological care requests and appointments |
| `api-gateway` | NestJS gateway | Unified REST entry point for backend services |
| `welfare-frontend` | Next.js frontend | User interface for the welfare module |

The monorepo also contains supporting academic services currently used by the API Gateway and frontend integration:

| Application | Type | Purpose |
| --- | --- | --- |
| `subject-service` | NestJS microservice | Subject management |
| `enrollment-service` | NestJS microservice | Enrollment management |
| `student-service` | NestJS microservice | Student management |

## Repository Structure

```text
smart-campus-uce-module2/
|-- apps/
|   |-- api-gateway/
|   |-- enrollment-service/
|   |-- psychological-care-service/
|   |-- scholarship-service/
|   |-- socioeconomic-form-service/
|   |-- student-service/
|   |-- subject-service/
|   `-- welfare-frontend/
|-- docs/
|   |-- architecture/
|   |-- frontend-demo.md
|   `-- services/
|-- docker-compose.yml
|-- CHANGELOG.md
|-- CONTRIBUTING.md
`-- RELEASE_NOTES_v0.1.0.md
```

## Technology Stack

| Layer | Technology |
| --- | --- |
| Backend | NestJS, TypeScript |
| Frontend | Next.js, React, Tailwind CSS |
| Relational persistence | PostgreSQL |
| Document persistence | MongoDB |
| API documentation | Swagger / OpenAPI |
| Containerization | Docker, Docker Compose |
| Testing | Jest, Supertest |

## Ports

### Local Development Ports

| Component | URL / Port | Notes |
| --- | --- | --- |
| `scholarship-service` | `http://localhost:3000` | Swagger: `/api/docs` |
| `socioeconomic-form-service` | `http://localhost:3001` | Swagger: `/api/docs` |
| `psychological-care-service` | `http://localhost:3003` | Swagger: `/api/docs` in local standalone mode |
| `api-gateway` | `http://localhost:8080` | Gateway root for proxied backend routes |
| `welfare-frontend` | `http://localhost:3003` | Next.js dev server |
| `mqtt-broker` | `localhost:1883` | MQTT broker for async event integration |
| `rabbitmq` | `localhost:5672` | AMQP broker for queue-based messaging |
| `rabbitmq-management` | `http://localhost:15672` | RabbitMQ management console |
| `kafka` | `localhost:9094` | Kafka broker for event streaming |
| `redis` | `localhost:6379` | Cache and shared transient data |

### Docker Compose Ports

| Service | Host Port | Container Port |
| --- | --- | --- |
| `postgres` | `5432` | `5432` |
| `scholarship-service` | `3000` | `3000` |
| `mongo` | `27017` | `27017` |
| `socioeconomic-form-service` | `3001` | `3001` |
| `psychological-postgres` | `5434` | `5432` |
| `psychological-care-service` | `3002` | `3002` |
| `subject-postgres` | `5435` | `5432` |
| `subject-service` | `3004` | `3004` |
| `enrollment-postgres` | `5436` | `5432` |
| `enrollment-service` | `3005` | `3005` |
| `student-postgres` | `5437` | `5432` |
| `student-service` | `3006` | `3006` |
| `api-gateway` | `8080` | `8080` |
| `welfare-frontend` | `3003` | `3002` |
| `mqtt-broker` | `1883` | `1883` |
| `rabbitmq` | `5672` | `5672` |
| `rabbitmq-management` | `15672` | `15672` |
| `kafka` | `9094` | `9094` |
| `redis` | `6379` | `6379` |

Important note: `welfare-frontend` and `psychological-care-service` both use `3003` in standalone local execution, but not at the same time. In Docker Compose, the frontend is exposed on `3003` and the psychological service on `3002`.

## Environment Variables

Each application provides `.env.example` for local execution and `.env.docker` for Docker Compose execution.

### `scholarship-service`

| Variable | Example | Description |
| --- | --- | --- |
| `NODE_ENV` | `development` | Runtime environment |
| `PORT` | `3000` | HTTP port |
| `CORS_ORIGIN` | `*` | Allowed origin configuration |
| `AUTH_ENABLED` | `false` | Enables JWT-protected routes |
| `JWT_SECRET` | `development-secret` | JWT signing secret |
| `JWT_ISSUER` | `smart-campus-uce` | JWT issuer |
| `JWT_AUDIENCE` | `scholarship-service` | JWT audience |
| `DB_ENABLED` | `false` or `true` | Enables PostgreSQL persistence |
| `DB_HOST` | `localhost` or `postgres` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USERNAME` | `postgres` | PostgreSQL user |
| `DB_PASSWORD` | `postgres` | PostgreSQL password |
| `DB_NAME` | `scholarship_db` | Database name |
| `MQTT_ENABLED` | `false` or `true` | Enables MQTT integration hooks |
| `MQTT_BROKER_URL` | `mqtt://localhost:1883` | MQTT broker connection URL |
| `MQTT_CLIENT_ID` | `scholarship-service` | MQTT client identifier |
| `REDIS_ENABLED` | `false` or `true` | Enables Redis integration hooks |
| `REDIS_HOST` | `localhost` or `redis` | Redis host |
| `REDIS_PORT` | `6379` | Redis port |
| `DB_SYNCHRONIZE` | `true` | TypeORM synchronize flag |
| `DB_LOGGING` | `false` | TypeORM query logging |

### `socioeconomic-form-service`

| Variable | Example | Description |
| --- | --- | --- |
| `NODE_ENV` | `development` | Runtime environment |
| `PORT` | `3001` | HTTP port |
| `CORS_ORIGIN` | `*` | Allowed origin configuration |
| `MONGO_ENABLED` | `false` or `true` | Enables MongoDB persistence |
| `MONGODB_URI` | `mongodb://localhost:27017/socioeconomic_forms` | MongoDB connection string |

### `psychological-care-service`

| Variable | Example | Description |
| --- | --- | --- |
| `NODE_ENV` | `development` | Runtime environment |
| `PORT` | `3003` locally, `3002` in Docker | HTTP port |
| `CORS_ORIGIN` | `*` | Allowed origin configuration |
| `AUTH_ENABLED` | `false` | Enables JWT-protected routes |
| `JWT_SECRET` | `development-secret` | JWT signing secret |
| `JWT_ISSUER` | `smart-campus-uce` | JWT issuer |
| `JWT_AUDIENCE` | `psychological-care-service` | JWT audience |
| `DB_ENABLED` | `false` or `true` | Enables PostgreSQL persistence |
| `DB_HOST` | `localhost` or `psychological-postgres` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USERNAME` | `postgres` | PostgreSQL user |
| `DB_PASSWORD` | `postgres` | PostgreSQL password |
| `DB_NAME` | `psychological_care_db` | Database name |
| `MQTT_ENABLED` | `false` or `true` | Enables MQTT integration hooks |
| `MQTT_BROKER_URL` | `mqtt://localhost:1883` | MQTT broker connection URL |
| `MQTT_CLIENT_ID` | `psychological-care-service` | MQTT client identifier |
| `REDIS_ENABLED` | `false` or `true` | Enables Redis integration hooks |
| `REDIS_HOST` | `localhost` or `redis` | Redis host |
| `REDIS_PORT` | `6379` | Redis port |
| `DB_SYNCHRONIZE` | `false` or `true` | TypeORM synchronize flag |
| `DB_LOGGING` | `false` | TypeORM query logging |

### `api-gateway`

| Variable | Example | Description |
| --- | --- | --- |
| `PORT` | `8080` | HTTP port |
| `CORS_ORIGIN` | `*` | Allowed origin configuration |
| `SCHOLARSHIP_SERVICE_URL` | `http://localhost:3000` | Scholarship service base URL |
| `SOCIOECONOMIC_SERVICE_URL` | `http://localhost:3001` | Socioeconomic service base URL |
| `PSYCHOLOGICAL_SERVICE_URL` | `http://localhost:3002` | Psychological service base URL |
| `SUBJECT_SERVICE_URL` | `http://localhost:3004` | Subject service base URL |
| `ENROLLMENT_SERVICE_URL` | `http://localhost:3005` | Enrollment service base URL |
| `STUDENT_SERVICE_URL` | `http://localhost:3006` | Student service base URL |
| `AUTH_ENABLED` | `false` | Enables gateway JWT guard |
| `JWT_SECRET` | `development-secret` | JWT signing secret |
| `MQTT_ENABLED` | `false` or `true` | Enables MQTT integration hooks |
| `MQTT_BROKER_URL` | `mqtt://localhost:1883` | MQTT broker connection URL |
| `MQTT_CLIENT_ID` | `api-gateway` | MQTT client identifier |
| `REDIS_ENABLED` | `false` or `true` | Enables Redis integration hooks |
| `REDIS_HOST` | `localhost` or `redis` | Redis host |
| `REDIS_PORT` | `6379` | Redis port |
| `RATE_LIMIT_TTL` | `60000` | Rate limiting window in milliseconds |
| `RATE_LIMIT_LIMIT` | `30` | Maximum requests per window |
| `CIRCUIT_BREAKER_TIMEOUT_MS` | `5000` | Upstream timeout before failure |
| `CIRCUIT_BREAKER_FAILURE_THRESHOLD` | `3` | Failures before opening circuit |
| `CIRCUIT_BREAKER_RESET_TIMEOUT_MS` | `15000` | Time before retrying an open circuit |

### `welfare-frontend`

| Variable | Example | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SCHOLARSHIP_API_URL` | `http://localhost:3000` | Scholarship API base URL |
| `NEXT_PUBLIC_SOCIOECONOMIC_API_URL` | `http://localhost:3001` | Socioeconomic API base URL |
| `NEXT_PUBLIC_PSYCHOLOGICAL_API_URL` | `http://localhost:3002` | Psychological API base URL |
| `NEXT_PUBLIC_API_GATEWAY_URL` | `http://localhost:8080` | Gateway API base URL |

## Docker Compose

The root `docker-compose.yml` orchestrates the full local stack.

### MQTT event topics

| Topic | Publisher | Consumer | Purpose |
| --- | --- | --- | --- |
| `scholarship.created` | `scholarship-service` | `psychological-care-service` | Signals that a scholarship request was created |
| `scholarship.status.updated` | `scholarship-service` | `psychological-care-service` | Signals that a scholarship request changed status |

### RabbitMQ routing keys

RabbitMQ currently uses the `welfare.events` topic exchange with these routing keys:

| Routing key | Publisher | Consumer | Purpose |
| --- | --- | --- | --- |
| `scholarship.created` | `scholarship-service` | `psychological-care-service` | Queue-based scholarship creation event |
| `scholarship.status.updated` | `scholarship-service` | `psychological-care-service` | Queue-based scholarship status update event |

### Kafka topic

Kafka currently streams scholarship domain events through this topic:

| Topic | Publisher | Consumer | Purpose |
| --- | --- | --- | --- |
| `scholarship.events` | `scholarship-service` | `psychological-care-service` | Event streaming for scholarship lifecycle changes |

### Included infrastructure

| Service | Purpose |
| --- | --- |
| `postgres` | Database for `scholarship-service` |
| `mongo` | Database for `socioeconomic-form-service` |
| `psychological-postgres` | Database for `psychological-care-service` |
| `subject-postgres` | Database for `subject-service` |
| `enrollment-postgres` | Database for `enrollment-service` |
| `student-postgres` | Database for `student-service` |
| `mqtt-broker` | MQTT broker for event-driven communication |
| `rabbitmq` | AMQP broker for asynchronous queues and workers |
| `kafka` | Event streaming broker for domain events and audit flows |
| `redis` | In-memory cache and shared transient storage |

### Included applications

| Service | Purpose |
| --- | --- |
| `scholarship-service` | Scholarship API |
| `socioeconomic-form-service` | Socioeconomic API |
| `psychological-care-service` | Psychological care API |
| `subject-service` | Academic subject API |
| `enrollment-service` | Academic enrollment API |
| `student-service` | Academic student API |
| `api-gateway` | Unified backend entry point |
| `welfare-frontend` | Web application |

### Gateway protection

The `api-gateway` includes two runtime protection mechanisms:

| Mechanism | Purpose |
| --- | --- |
| Rate limiting | Limits repeated requests inside a fixed time window |
| Circuit breaker | Stops forwarding calls temporarily after repeated downstream failures |

### Redis cache usage

Current Redis usage introduced in this iteration:

| Service | Cached resource | Invalidation strategy |
| --- | --- | --- |
| `scholarship-service` | Scholarship list queries | Cleared on create, update, status change, and delete |

### Start the full stack

```bash
docker compose up -d --build
```

### Stop the full stack

```bash
docker compose down
```

### Rebuild after documentation or dependency changes

```bash
docker compose up -d --build
```

## Run Locally

### Prerequisites

| Tool | Recommended Version |
| --- | --- |
| Node.js | 20.x or later |
| npm | 10.x or later |
| Docker Desktop | Current stable |

Install dependencies from the monorepo root:

```bash
npm install
```

### Full stack with Docker

```bash
docker compose up -d --build
```

Open these URLs after the containers are healthy:

| URL | Purpose |
| --- | --- |
| `http://localhost:3003` | Frontend |
| `http://localhost:3000/api/docs` | Scholarship Swagger |
| `http://localhost:3001/api/docs` | Socioeconomic Swagger |
| `http://localhost:3002/api/docs` | Psychological Swagger |
| `http://localhost:8080/api/docs` | API Gateway Swagger |

### Standalone local execution

1. Create local `.env` files from each `.env.example` where needed.
2. Start the desired backend service from the monorepo root.
3. Start the frontend from `apps/welfare-frontend`.

Backend commands from the repository root:

```bash
npm run start:dev
npm run start:socioeconomic:dev
npm run start:psychological:dev
```

Frontend commands:

```bash
cd apps/welfare-frontend
npm install
npm run dev
```

Frontend standalone URL:

```text
http://localhost:3003
```

## QA to Main Flow

The project follows a branch promotion flow based on the repository conventions:

```text
feature/* -> qa -> Pull Request -> main
```

### Recommended process

1. Create a branch from `qa` using the `feature/*` naming pattern.
2. Implement and validate changes locally.
3. Merge the feature branch into `qa`.
4. Perform validation in the `qa` branch.
5. Open a Pull Request from `qa` to `main`.
6. After approval, merge into `main`.
7. Tag the stable version, for example `v0.1.0`.

## Service Documentation

Detailed application documentation is available here:

| Document | Description |
| --- | --- |
| `docs/services/scholarship-service.md` | Scholarship service release documentation |
| `docs/services/socioeconomic-form-service.md` | Socioeconomic service release documentation |
| `docs/services/psychological-care-service.md` | Psychological care service release documentation |
| `docs/services/api-gateway.md` | API Gateway release documentation |
| `docs/services/welfare-frontend.md` | Frontend release documentation |

## Current CQRS Adoption

The first explicit CQRS implementation in the monorepo is currently applied in:

| Service | Read side | Write side |
| --- | --- | --- |
| `scholarship-service` | query handlers | command handlers |

## Additional Release Files

| File | Purpose |
| --- | --- |
| `CHANGELOG.md` | Version history |
| `CONTRIBUTING.md` | Contribution and branch process |
| `RELEASE_NOTES_v0.1.0.md` | Stable release summary |

## Tests

Run the monorepo automated tests from the root:

```bash
npm test
npm run test:e2e
```

## Current Stable Release

The documentation in this repository prepares the project for the first documented stable release:

```text
v0.1.0
```
