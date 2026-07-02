# API Gateway

## Description

`api-gateway` is the central REST gateway for the SMART CAMPUS UCE Module 2 monorepo. It exposes a single public entry point for external clients and forwards traffic to the upstream welfare microservices (`scholarship-service`, `socioeconomic-form-service`, and `psychological-care-service`).

The gateway is part of the `smart-campus-uce-module2` NestJS monorepo and follows the same backend conventions used by the other microservices.

## Functional Responsibility

This microservice is responsible for:

- Receiving external HTTP requests on `/api/*` routes.
- Proxying requests to the corresponding upstream welfare microservices.
- Providing a centralized health check endpoint.
- Preparing JWT-based route protection for future integration with a platform Auth Service.

This service does not implement business logic, user management, or persistence.

## Internal Architecture

The service follows a lightweight layered structure:

- `modules/proxy`: HTTP proxy controller and service that forward requests to upstream services.
- `modules/health`: service health endpoint.
- `modules/auth`: JWT guard infrastructure prepared for external authentication integration.
- `config`: environment mapping, validation, and Swagger setup.

### Proxy mappings

| External route | Upstream service | Target URL environment variable |
|---|---|---|
| `/api/scholarships` | Scholarship Service | `SCHOLARSHIP_SERVICE_URL` |
| `/api/socioeconomic-forms` | Socioeconomic Form Service | `SOCIOECONOMIC_SERVICE_URL` |
| `/api/psychological-care` | Psychological Care Service | `PSYCHOLOGICAL_SERVICE_URL` |

## Default Port and Base Route

- **Default port:** `8080`
- **Base route:** `/api/*`
- **Health route:** `/api/health`

## Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Gateway health check |
| `ALL` | `/api/*` | Proxy to upstream microservices |

## Environment Variables

Available variables are documented in `.env.example`.

```env
PORT=8080
CORS_ORIGIN=*
SCHOLARSHIP_SERVICE_URL=http://localhost:3000
SOCIOECONOMIC_SERVICE_URL=http://localhost:3001
PSYCHOLOGICAL_SERVICE_URL=http://localhost:3002
AUTH_ENABLED=false
JWT_SECRET=development-secret
```

Important behavior:

- `AUTH_ENABLED=false`: the proxy works without a token.
- `AUTH_ENABLED=true`: requests to `/api/*` require a valid Bearer JWT.
- `GET /api/health` remains public.

## Local Execution

From the monorepo root:

```bash
npx nest start api-gateway
```

Watch mode:

```bash
npx nest start api-gateway --watch
```

Build the service:

```bash
npx nest build api-gateway
```

Recommended local `.env` for running without authentication:

```env
PORT=8080
CORS_ORIGIN=*
SCHOLARSHIP_SERVICE_URL=http://localhost:3000
SOCIOECONOMIC_SERVICE_URL=http://localhost:3001
PSYCHOLOGICAL_SERVICE_URL=http://localhost:3002
AUTH_ENABLED=false
```

Health check:

```bash
curl http://localhost:8080/api/health
```

## Docker Execution

Docker files:

- `apps/api-gateway/Dockerfile`
- `apps/api-gateway/.env.docker`

Docker Compose service:

- `api-gateway`

Ports:

- API Gateway: `8080:8080`

Start the gateway together with the upstream services:

```bash
docker compose up -d
```

Health check in Docker:

```bash
curl http://localhost:8080/api/health
```

## Swagger

Swagger/OpenAPI is available at:

```text
/api/docs
```

Local default URL:

```text
http://localhost:8080/api/docs
```

Docker URL:

```text
http://localhost:8080/api/docs
```

OpenAPI metadata:

- **Title:** `SMART CAMPUS UCE - API Gateway`
- **Description:** `Central REST gateway for SMART CAMPUS UCE Module 2 microservices`
- **Version:** `1.0.0`
- **Tags:** `Gateway`, `Health`

## Tests

Run all tests from the monorepo root:

```bash
npm test -- --runInBand
```

Run all e2e tests:

```bash
npm run test:e2e -- --runInBand
```

Run only api-gateway unit tests:

```bash
npx jest apps/api-gateway --runInBand
```

Run only api-gateway e2e tests:

```bash
npx jest --config jest-e2e.config.ts apps/api-gateway/test --runInBand
```

## Future Integration

This service is prepared for integration with other SMART CAMPUS UCE services:

- **Auth Service:** JWT validation is already available through `JwtAuthGuard`. The gateway can become the central authentication enforcement point.
- **Rate limiting / request throttling:** can be added at the gateway level.
- **Service discovery:** upstream URLs can later be resolved through a registry instead of static environment variables.
- **Observability:** request logging, tracing, and metrics can be centralized here.

No synchronous dependency on those services exists yet.
