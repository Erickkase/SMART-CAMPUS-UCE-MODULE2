# Changelog

All notable changes to this project will be documented in this file.

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
