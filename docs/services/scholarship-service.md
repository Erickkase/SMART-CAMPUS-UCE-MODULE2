# Scholarship Service

## Overview

`scholarship-service` is a NestJS microservice responsible for scholarship request management in SMART CAMPUS UCE Module 2.

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
| `DB_SYNCHRONIZE` | TypeORM schema synchronization |
| `DB_LOGGING` | TypeORM query logging |

## Persistence

- Local development can run without PostgreSQL when `DB_ENABLED=false`.
- Docker Compose uses PostgreSQL with `DB_ENABLED=true`.
- The Compose database service name is `postgres`.

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
