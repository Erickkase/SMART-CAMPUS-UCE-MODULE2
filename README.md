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

### `welfare-frontend`

| Variable | Example | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SCHOLARSHIP_API_URL` | `http://localhost:3000` | Scholarship API base URL |
| `NEXT_PUBLIC_SOCIOECONOMIC_API_URL` | `http://localhost:3001` | Socioeconomic API base URL |
| `NEXT_PUBLIC_PSYCHOLOGICAL_API_URL` | `http://localhost:3002` | Psychological API base URL |
| `NEXT_PUBLIC_API_GATEWAY_URL` | `http://localhost:8080` | Gateway API base URL |

## Docker Compose

The root `docker-compose.yml` orchestrates the full local stack.

### Included infrastructure

| Service | Purpose |
| --- | --- |
| `postgres` | Database for `scholarship-service` |
| `mongo` | Database for `socioeconomic-form-service` |
| `psychological-postgres` | Database for `psychological-care-service` |
| `subject-postgres` | Database for `subject-service` |
| `enrollment-postgres` | Database for `enrollment-service` |
| `student-postgres` | Database for `student-service` |

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
