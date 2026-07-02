# Socioeconomic Form Service

## Overview

`socioeconomic-form-service` is a NestJS microservice responsible for student socioeconomic form management in SMART CAMPUS UCE Module 2.

## Responsibilities

- Create socioeconomic forms.
- List all socioeconomic forms.
- Search a socioeconomic form by `studentId`.
- Get a socioeconomic form by identifier.
- Update socioeconomic forms.
- Delete socioeconomic forms.
- Expose health and Swagger endpoints.

## Base Routes

| Route | Purpose |
| --- | --- |
| `/socioeconomic-forms` | Main business resource |
| `/health` | Health check |
| `/api/docs` | Swagger UI |

## Main Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/socioeconomic-forms` | Create socioeconomic form |
| `GET` | `/socioeconomic-forms` | List socioeconomic forms |
| `GET` | `/socioeconomic-forms/student/:studentId` | Search by student id |
| `GET` | `/socioeconomic-forms/:id` | Get by id |
| `PATCH` | `/socioeconomic-forms/:id` | Update by id |
| `DELETE` | `/socioeconomic-forms/:id` | Delete by id |
| `GET` | `/health` | Health status |

## Runtime Ports

| Mode | URL |
| --- | --- |
| Local standalone | `http://localhost:3001` |
| Docker Compose | `http://localhost:3001` |

## Environment Variables

Source files:

- `apps/socioeconomic-form-service/.env.example`
- `apps/socioeconomic-form-service/.env.docker`

| Variable | Description |
| --- | --- |
| `NODE_ENV` | Runtime environment |
| `PORT` | HTTP port |
| `CORS_ORIGIN` | Allowed origins |
| `MONGO_ENABLED` | Enables MongoDB persistence |
| `MONGODB_URI` | MongoDB connection string |

## Persistence

- Local development can run without MongoDB when `MONGO_ENABLED=false`.
- Docker Compose uses MongoDB with `MONGO_ENABLED=true`.
- The Compose database service name is `mongo`.

## Local Execution

From the monorepo root:

```bash
npm install
npm run start:socioeconomic:dev
```

Swagger URL:

```text
http://localhost:3001/api/docs
```

Health URL:

```text
http://localhost:3001/health
```

## Docker Compose Execution

```bash
docker compose up -d mongo socioeconomic-form-service
```

## Release Notes

This service is part of the `v0.1.0` stable release baseline.
