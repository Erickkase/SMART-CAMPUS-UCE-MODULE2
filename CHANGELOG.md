# Changelog

All notable changes to this project will be documented in this file.

<<<<<<< HEAD
The format is based on Keep a Changelog and the project uses semantic versioning for release tags.

## [0.1.0] - 2026-06-17

### Added

- Monorepo structure for SMART CAMPUS UCE Module 2.
- `scholarship-service` for scholarship request management.
- `socioeconomic-form-service` for socioeconomic form management.
- `psychological-care-service` for psychological request and appointment management.
- `api-gateway` for centralized backend routing.
- `welfare-frontend` for welfare module visualization and CRUD interaction.
- Supporting academic services: `student-service`, `subject-service`, and `enrollment-service`.
- Docker Compose stack for local orchestration.
- Swagger/OpenAPI documentation endpoints in backend services.
- Jest and e2e test scaffolding across backend services.

### Documentation

- Release baseline README for the monorepo.
- Release notes for `v0.1.0`.
- Contribution guidelines and branch promotion flow.
- Service-level release documentation.

### Notes

- `v0.1.0` is the first documented stable release baseline of the repository.
=======
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-17

### Added

- Scholarship management microservice (`apps/scholarship-service`) with domain model, DTOs, repository, business logic, REST endpoints, and Swagger documentation.
- Socioeconomic form microservice (`apps/socioeconomic-form-service`) with Mongoose, Swagger, and Docker support.
- Psychological care microservice (`apps/psychological-care-service`) with domain model, DTOs, JWT authentication preparation, and Docker support.
- Welfare frontend (`apps/welfare-frontend`) for scholarship and socioeconomic form management, built with Next.js.
- JWT authentication preparation shared across backend services.
- Unit tests for the scholarship service.
- Docker and Docker Compose configuration for local full-stack development.
- Terraform infrastructure provisioning for AWS QA environment.
- GitHub Actions CI workflow for building and testing services and the frontend.
- Manual GitHub Actions workflow for deploying to AWS QA with Terraform.
- Project documentation including architecture, frontend usage, and psychological care service docs.

### Changed

- Docker files updated to support service bootstrapping and containerized deployments.
- Terraform QA configuration updated for Amazon Linux 2023 compatibility.

### Fixed

- Local bootstrap configuration support for scholarship service.

[1.0.0]: https://github.com/steandres/SMART-CAMPUS-UCE-MODULE2/releases/tag/v1.0.0
>>>>>>> c16002fba506ae2392df07ae537a1c8cf21863bd
