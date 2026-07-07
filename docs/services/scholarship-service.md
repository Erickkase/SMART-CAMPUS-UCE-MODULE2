# Scholarship Service

## Overview

`scholarship-service` is a NestJS microservice responsible for scholarship request management in SMART CAMPUS UCE Module 2.

## CQRS Structure

This service now follows a lightweight CQRS organization:

- commands handle write operations such as create, update, status changes, and delete
- queries handle read operations such as list and get by id
- handlers orchestrate command and query execution from the controller layer

## Responsibilities

- Create scholarship requests.
- List scholarship requests.
- Get scholarship details by identifier.
- Update scholarship request data.
- Update scholarship request status.
- Delete scholarship requests.
- Expose health and Swagger endpoints.

## Base Routes

| Route | Purpose |
| --- | --- |
| `/scholarships` | Main business resource |
| `/health` | Health check |
| `/api/docs` | Swagger UI |

## Main Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/scholarships` | Create scholarship request |
| `GET` | `/scholarships` | List scholarship requests |
| `GET` | `/scholarships/:id` | Get scholarship by id |
| `PATCH` | `/scholarships/:id` | Update scholarship fields |
| `PATCH` | `/scholarships/:id/status` | Update scholarship status |
| `DELETE` | `/scholarships/:id` | Delete scholarship |
| `GET` | `/health` | Health status |

## Runtime Ports

| Mode | URL |
| --- | --- |
| Local standalone | `http://localhost:3000` |
| Docker Compose | `http://localhost:3000` |

## Environment Variables

Source files:

- `apps/scholarship-service/.env.example`
- `apps/scholarship-service/.env.docker`

| Variable | Description |
| --- | --- |
| `NODE_ENV` | Runtime environment |
| `PORT` | HTTP port |
| `CORS_ORIGIN` | Allowed origins |
| `AUTH_ENABLED` | Enables JWT guard behavior |
| `JWT_SECRET` | JWT secret |
| `JWT_ISSUER` | JWT issuer |
| `JWT_AUDIENCE` | JWT audience |
| `DB_ENABLED` | Enables PostgreSQL persistence |
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_USERNAME` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_NAME` | PostgreSQL database |
| `MQTT_ENABLED` | Enables MQTT integration hooks |
| `MQTT_BROKER_URL` | MQTT broker connection URL |
| `MQTT_CLIENT_ID` | MQTT client identifier |
| `REDIS_ENABLED` | Enables Redis integration hooks |
| `REDIS_HOST` | Redis host |
| `REDIS_PORT` | Redis port |
| `DB_SYNCHRONIZE` | TypeORM schema synchronization |
| `DB_LOGGING` | TypeORM query logging |

## Persistence

- Local development can run without PostgreSQL when `DB_ENABLED=false`.
- Docker Compose uses PostgreSQL with `DB_ENABLED=true`.
- The Compose database service name is `postgres`.

## Redis Cache

This service uses Redis to cache scholarship list queries.

| Cache key | Purpose |
| --- | --- |
| `scholarships:list` | Caches the full scholarship list |

The cache is invalidated when a scholarship is:

- created
- updated
- approved or rejected
- deleted

## MQTT Events

This service publishes the following MQTT topics:

| Topic | Trigger |
| --- | --- |
| `scholarship.created` | A scholarship request is created |
| `scholarship.status.updated` | A scholarship request status changes |

## RabbitMQ Events

This service also publishes RabbitMQ messages to the `welfare.events` topic exchange:

| Routing key | Trigger |
| --- | --- |
| `scholarship.created` | A scholarship request is created |
| `scholarship.status.updated` | A scholarship request status changes |

## Kafka Events

This service also publishes Kafka messages to the `scholarship.events` topic.

## Local Execution

From the monorepo root:

```bash
npm install
npm run start:dev
```

Swagger URL:

```text
http://localhost:3000/api/docs
```

Health URL:

```text
http://localhost:3000/health
```

## Docker Compose Execution

```bash
docker compose up -d postgres scholarship-service
```

## Release Notes

This service is part of the `v0.1.0` stable release baseline.
