# API Gateway

## Overview

`api-gateway` is a NestJS gateway that centralizes access to backend services through proxied REST routes.

## Responsibilities

- Expose a unified entry point for backend services.
- Forward REST requests to configured downstream services.
- Provide an independent health endpoint.
- Support optional JWT route protection.
- Expose Swagger documentation.

## Base Routes

| Route | Purpose |
| --- | --- |
| `/api/*` | Proxied backend routes |
| `/api/health` | Gateway health check |
| `/api/docs` | Swagger UI |

## Routing Behavior

The gateway forwards requests under `/api/*path` to the corresponding downstream service according to internal route mapping and configured service URLs.

The frontend currently uses the gateway for academic module operations and direct service access for some welfare-specific screens.

## Runtime Port

| Mode | URL |
| --- | --- |
| Local standalone | `http://localhost:8080` |
| Docker Compose | `http://localhost:8080` |

## Environment Variables

Source files:

- `apps/api-gateway/.env.example`
- `apps/api-gateway/.env.docker`

| Variable | Description |
| --- | --- |
| `PORT` | HTTP port |
| `CORS_ORIGIN` | Allowed origins |
| `SCHOLARSHIP_SERVICE_URL` | Scholarship service base URL |
| `SOCIOECONOMIC_SERVICE_URL` | Socioeconomic service base URL |
| `PSYCHOLOGICAL_SERVICE_URL` | Psychological service base URL |
| `SUBJECT_SERVICE_URL` | Subject service base URL |
| `ENROLLMENT_SERVICE_URL` | Enrollment service base URL |
| `STUDENT_SERVICE_URL` | Student service base URL |
| `AUTH_ENABLED` | Enables gateway JWT guard behavior |
| `JWT_SECRET` | JWT secret |

## Local Execution

The root `package.json` does not currently define a dedicated `start:gateway:dev` script. Run the gateway from the monorepo root with Nest CLI:

```bash
npm install
npx nest start api-gateway --watch
```

Swagger URL:

```text
http://localhost:8080/api/docs
```

Health URL:

```text
http://localhost:8080/api/health
```

## Docker Compose Execution

```bash
docker compose up -d api-gateway
```

## Release Notes

This gateway is part of the `v0.1.0` stable release baseline.
