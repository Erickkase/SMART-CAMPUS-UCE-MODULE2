# Sprint 01 - Scholarship Service Architecture

## Project Information

Project: SMART CAMPUS UCE

Module: Student Welfare and Support

Microservice: scholarship-service

Environment Strategy:

- QA Environment
- Main Environment

Development Workflow:

feature/* → qa → Pull Request → main

All development activities are performed in the QA branch before being reviewed and promoted to the Main branch.

---

# Architecture Overview

The scholarship-service is part of Module 2: Student Welfare and Support within the SMART CAMPUS UCE distributed platform.

The service is responsible for managing scholarship requests submitted by students and will be integrated with other module services such as socioeconomic-form-service and psychological-care-service.

The architecture follows a distributed microservices approach using NestJS and PostgreSQL while respecting Clean Architecture and SOLID principles.

The service is designed to be independently deployable, scalable, and maintainable.

---

# Monorepo Structure

```text
smart-campus-uce/
│
├── apps/
│   ├── scholarship-service/
│
├── shared/
│
├── infra/
│   ├── docker/
│   ├── terraform/
│
├── docs/
│
├── .github/
│   └── workflows/
│
└── README.md
```

---

# Scholarship Service Responsibilities

The scholarship-service is responsible for:

- Creating scholarship requests
- Updating scholarship requests
- Approving scholarship requests
- Rejecting scholarship requests
- Listing scholarship requests
- Retrieving scholarship details
- Tracking scholarship status

---

# Planned Domain Model

Entity: Scholarship

Fields:

- id
- studentId
- scholarshipType
- reason
- status
- createdAt
- updatedAt

Status Values:

- PENDING
- UNDER_REVIEW
- APPROVED
- REJECTED

---

# Planned API Endpoints

POST /scholarships

GET /scholarships

GET /scholarships/:id

PATCH /scholarships/:id

PATCH /scholarships/:id/status

DELETE /scholarships/:id

---

# Planned Technology Stack

Frontend:
- Next.js

Backend:
- NestJS

Database:
- PostgreSQL

Documentation:
- Swagger

Authentication:
- JWT

Containerization:
- Docker

Infrastructure:
- Terraform

CI/CD:
- GitHub Actions

Cloud:
- AWS Academy

---

# Clean Architecture Design

The service will follow the following layers:

## Controllers

Responsible for receiving HTTP requests and returning responses.

## Services

Responsible for business logic and application rules.

## Repositories

Responsible for database access and persistence.

## DTOs

Responsible for input validation and data transfer.

## Entities

Responsible for representing domain objects.

---

# Future Integrations

The scholarship-service will be prepared for integration with:

- socioeconomic-form-service
- psychological-care-service
- API Gateway

Future event-driven communication:

- Kafka
- RabbitMQ
- WebSocket

These integrations are not implemented during Sprint 01.

---

# Deployment Strategy

The project will use two environments:

## QA

Environment used for development and testing.

All team members will deploy and validate their changes in QA.

## MAIN

Production-ready environment.

Changes will only reach MAIN through Pull Requests approved after review.

---

# Sprint 01 Deliverables

Completed:

- Initial architecture definition
- Monorepo structure definition
- Domain definition
- Responsibility definition
- Development workflow definition
- Environment strategy definition

Pending:

- Database design
- Entity implementation
- DTO implementation
- Repository implementation
- Service implementation
- API implementation
- Dockerization
- Terraform deployment
- CI/CD pipelines