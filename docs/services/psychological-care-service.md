# Psychological Care Service

## Overview

`psychological-care-service` is a NestJS microservice responsible for psychological care requests, appointments, follow-ups, and referrals in SMART CAMPUS UCE Module 2.

## Responsibilities

- Register psychological care requests.
- Schedule psychological appointments.
- Manage follow-ups and referrals.
- Expose health and Swagger endpoints.
- Support optional JWT-protected routes.

## Base Routes

| Route | Purpose |
| --- | --- |
| `/psychological-care` | Main business resource |
| `/health` | Health check |
| `/api/docs` | Swagger UI |

## Main Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/psychological-care/requests` | Create request |
| `GET` | `/psychological-care/requests` | List requests |
| `GET` | `/psychological-care/requests/:id` | Get request by id |
| `PATCH` | `/psychological-care/requests/:id/status` | Update request status |
| `DELETE` | `/psychological-care/requests/:id` | Delete request |
| `POST` | `/psychological-care/appointments` | Create appointment |
| `GET` | `/psychological-care/appointments` | List appointments |
| `GET` | `/psychological-care/appointments/student/:studentId` | List appointments by student |
| `PATCH` | `/psychological-care/appointments/:id/status` | Update appointment status |
| `POST` | `/psychological-care/follow-ups` | Create follow-up |
| `GET` | `/psychological-care/follow-ups/student/:studentId` | List follow-ups by student |
| `POST` | `/psychological-care/referrals` | Create referral |
| `GET` | `/psychological-care/referrals/student/:studentId` | List referrals by student |
| `PATCH` | `/psychological-care/referrals/:id/status` | Update referral status |
| `GET` | `/health` | Health status |

## Runtime Ports

| Mode | URL |
| --- | --- |
| Local standalone | `http://localhost:3003` |
| Docker Compose | `http://localhost:3002` |

## Environment Variables

Source files:

- `apps/psychological-care-service/.env.example`
- `apps/psychological-care-service/.env.docker`

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
- The Compose database service name is `psychological-postgres`.

## Local Execution

From the monorepo root:

```bash
npm install
npm run start:psychological:dev
```

Swagger URL:

```text
http://localhost:3003/api/docs
```

Health URL:

```text
http://localhost:3003/health
```

## Docker Compose Execution

```bash
docker compose up -d psychological-postgres psychological-care-service
```

## Additional Reference

Detailed internal service documentation also exists in:

```text
apps/psychological-care-service/README.md
```

## Release Notes

This service is part of the `v0.1.0` stable release baseline.
