# Release Notes - v0.1.0

## Release Summary

`v0.1.0` establishes the first stable documented baseline for SMART CAMPUS UCE Module 2 - Student Welfare and Support.

This release consolidates the monorepo structure, backend service portfolio, API Gateway integration, web frontend, Docker Compose orchestration, and initial documentation package required for release management.

## Included Applications

| Application | Description |
| --- | --- |
| `scholarship-service` | Manages scholarship requests and status updates |
| `socioeconomic-form-service` | Manages socioeconomic form registration and lookup |
| `psychological-care-service` | Manages psychological requests and appointments |
| `api-gateway` | Central backend access point for proxied REST routes |
| `welfare-frontend` | Frontend interface for welfare and academic module screens |

## Supporting Applications Included In The Monorepo

| Application | Description |
| --- | --- |
| `student-service` | Student CRUD support |
| `subject-service` | Subject CRUD support |
| `enrollment-service` | Enrollment CRUD support |

## Main Capabilities In This Release

- Scholarship request CRUD and status transitions.
- Socioeconomic form CRUD and student-based search.
- Psychological care request and appointment management.
- Gateway-based routing for backend integration.
- Frontend dashboard with integrated welfare and academic screens.
- Docker Compose local environment for databases, services, gateway, and frontend.
- Swagger/OpenAPI documentation for backend APIs.

## Runtime Endpoints

### Docker Compose

| Component | URL |
| --- | --- |
| Frontend | `http://localhost:3003` |
| Scholarship API | `http://localhost:3000` |
| Socioeconomic API | `http://localhost:3001` |
| Psychological API | `http://localhost:3002` |
| API Gateway | `http://localhost:8080` |

### Swagger

| Component | URL |
| --- | --- |
| Scholarship Swagger | `http://localhost:3000/api/docs` |
| Socioeconomic Swagger | `http://localhost:3001/api/docs` |
| Psychological Swagger | `http://localhost:3002/api/docs` |
| API Gateway Swagger | `http://localhost:8080/api/docs` |

## Environment Summary

- Local standalone execution uses `.env.example` as the baseline.
- Docker Compose execution uses `.env.docker` per application.
- Frontend public API URLs target host-exposed service ports.

## Validation Scope

This release documentation assumes validation through:

- `npm test`
- `npm run test:e2e`
- `docker compose up -d --build`
- manual verification of health and Swagger endpoints

## Branch Promotion Model

```text
feature/* -> qa -> Pull Request -> main
```

`v0.1.0` should be tagged from `main` after QA validation is complete.

## Known Notes

- The frontend uses port `3003` both in local dev mode and in Docker Compose exposure.
- The psychological care service uses `3003` in standalone local mode and `3002` in Docker Compose.
- Academic services are present in the monorepo and support gateway-based integration, even though the release focus is the welfare module.
