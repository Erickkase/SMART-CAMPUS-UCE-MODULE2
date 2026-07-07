# Activity Board — SMART CAMPUS UCE MODULE 2

> **Tool:** GitHub Projects  
> **Board manager:** Jonathan  
> **Branch flow:** `feature/ACT-XXX` → Pull Request to `qa` → QA validation → Pull Request `qa` → `main` (production)  
> **Issue/PR title convention:** `[ACT-XXX] Brief description`  
> **Project URL:** https://github.com/users/steandres/projects/2
> **Last updated:** 2026-06-27

---

## Team

| Name | Role | GitHub username |
|---|---|---|
| Erick | Developer | @Erickkase |
| Estefan | DevOps | @steandres |
| Jonathan | QA / Board Manager | @Jhonatan-Caluguillin |

---

## Sprint Timeline

| Sprint | Period | Focus |
|---|---|---|
| Sprint 1 | Jun 27 – Jul 02 | Missing core services, authentication, multiplatform apps, cache |
| Sprint 2 | Jul 03 – Jul 07 | Communications, advanced security, AWS HA, monitoring, testing, docs |

---

## Workflow Stages

1. **Backlog** — ideas and future work, not yet committed.
2. **To Do** — committed work for the current sprint.
3. **In Progress** — actively being developed.
4. **Code Review** — PR open, waiting for review.
5. **QA / Testing** — merged to `qa`, being validated by Jonathan.
6. **Done** — merged to `main` and deployed.

---

## Backlog

| Code | Activity | Owner | Description | Acceptance criteria | Issue |
|---|---|---|---|---|
| BKL-001 | Define cross-service data model | Erick + Jonathan | Align `studentId`, status enums, IDs across all services. | Approved data contract document; DTOs aligned. | [#46](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/46) |
| BKL-002 | Select third database engine | Estefan + Erick | Redis is required for cache; choose one additional different engine (e.g., DynamoDB, Neo4j). | Decision documented with technical justification. | [#47](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/47) |
| BKL-003 | Design inter-service communication map | Erick + Estefan | Decide which services use Kafka / RabbitMQ / MQTT / gRPC / REST. | Approved architecture diagram. | [#48](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/48) |
| BKL-004 | Define monitoring and alerting strategy | Estefan + Jonathan | Choose Prometheus + Grafana + Site24x7 stack. | Tools selected; critical metrics defined. | [#49](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/49) |

---

## Sprint 1 — To Do

| Code | Activity | Owner | Description | Acceptance criteria | Effort | Issue |
|---|---|---|---|---|---|
| ACT-001 | Create `notification-service` | Erick | NestJS microservice for email / SMS / push notifications. | CRUD endpoints; Swagger; unit tests; Dockerfile; in `docker-compose.yml`. | 2 days | [#8](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/8) |
| ACT-002 | Create `appointment-service` | Erick | Manage psychological care appointments. | CRUD; status machine (pending, confirmed, cancelled, completed); Swagger; tests. | 2 days | [#9](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/9) |
| ACT-003 | Create `document-service` | Erick | Upload and manage welfare documents. | Upload to S3 / local; metadata persistence; REST endpoints; tests. | 2 days | [#10](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/10) |
| ACT-004 | Create `reporting-service` | Erick | Reports and KPIs for the welfare committee. | Report endpoints; aggregations; Swagger; tests. | 2 days | [#11](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/11) |
| ACT-005 | Complete `enrollment-service` | Erick | Currently a skeleton; implement full domain. | Full CRUD; persistence; Swagger; `docker-compose.yml`; e2e tests. | 2 days | [#12](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/12) |
| ACT-006 | Integrate `subject-service` with database and Docker | Erick | CRUD exists in-memory only. | TypeORM/Postgres persistence; added to `docker-compose.yml`; CI build and test. | 1 day | [#13](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/13) |
| ACT-007 | Create `welfare-mobile` (React Native + Expo) | Erick | Mobile app for the welfare module. | Working scaffold; consumes scholarship / socioeconomic APIs; login screen. | 3 days | [#14](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/14) |
| ACT-008 | Create `welfare-desktop` (Electron + Express) | Erick | Desktop app for the welfare module. | Electron shell + Express local backend; consumes APIs; login. | 3 days | [#15](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/15) |
| ACT-010 | Implement RBAC | Erick | Roles: student, administrator, committee, psychologist. | `@Roles()` decorator + guard; critical endpoints protected. | 1 day | [#17](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/17) |
| ACT-011 | Add Redis cache | Estefan + Erick | Required cache database. | Redis container; cached reads for scholarships / forms; documented. | 1 day | [#18](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/18) |

---

## Sprint 1 — In Progress

| Code | Activity | Owner | Started | Notes |
|---|---|---|---|---|
| ACT-009 | Implement centralized authentication | Erick | 2026-06-27 | JWT modules, guards, strategies and middleware exist but AUTH_ENABLED=false and no centralized login endpoint yet. |
| ACT-012 | Configure environment-based CORS | Estefan | 2026-06-27 | CORS reads CORS_ORIGIN from env in all services, but defaults remain wildcard ('*'). |

---

## Sprint 1 — Code Review

| Code | Activity | Owner | Reviewers | PR |
|---|---|---|---|---|
| — | — | — | — | — |

---

## Sprint 1 — QA / Testing

| Code | Activity | QA Owner | Notes |
|---|---|---|---|
| — | — | — | — |

---

## Sprint 1 — Done

| Code | Activity | Owner | Notes |
|---|---|---|---|
| — | — | — | — |

---

## Sprint 2 — To Do

| Code | Activity | Owner | Description | Acceptance criteria | Effort | Issue |
|---|---|---|---|---|---|
| ACT-013 | Implement Kafka event bus | Estefan + Erick | Domain events between services. | Kafka container; producer/consumer; sample event (scholarship approved). | 2 days | [#20](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/20) |
| ACT-014 | Implement RabbitMQ async tasks | Estefan + Erick | Queues for notifications and processing. | RabbitMQ container; worker consumer; tests. | 2 days | [#21](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/21) |
| ACT-015 | Implement MQTT alerts | Estefan + Erick | Alerts to mobile / devices. | MQTT broker; service publishes/subscribes; working demo. | 1 day | [#22](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/22) |
| ACT-016 | Implement gRPC between services | Erick | e.g., `api-gateway` ↔ `subject-service`. | `.proto` file; gRPC client/server; integration test. | 2 days | [#23](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/23) |
| ACT-017 | Implement WebSocket real-time notifications | Erick | Dashboard and mobile receive live updates. | WebSocket gateway; frontend connected; sample event. | 2 days | [#24](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/24) |
| ACT-018 | Implement GraphQL endpoint | Erick | In `api-gateway` or dedicated service. | `/graphql` endpoint; queries for scholarships/forms. | 2 days | [#25](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/25) |
| ACT-019 | Implement Webhooks | Erick | Notify external systems. | Subscription endpoint; security signature; tests. | 1 day | [#26](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/26) |
| ACT-020 | Implement SOAP client or server | Erick | Legacy university integration. | Working SOAP server with WSDL or external SOAP client. | 1 day | [#27](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/27) |
| ACT-021 | Apply CQRS in `scholarship-service` | Erick | Separate commands and queries. | Commands/queries split; tests; documentation. | 2 days | [#28](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/28) |
| ACT-022 | Apply Event Driven Architecture | Erick | Publish domain events via Kafka/RabbitMQ. | Versioned events; read projections; demo. | 2 days | [#29](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/29) |
| ACT-023 | Configure rate limiting and helmet | Erick | Protect APIs from abuse and unsafe headers. | `@nestjs/throttler` + helmet; rate-limit tests. | 1 day | [#30](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/30) |
| ACT-024 | Configure bastion host / jump box | Estefan | Secure access to private AWS resources. | Bastion EC2; restrictive security groups; access documented. | 1 day | [#31](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/31) |
| ACT-025 | Configure Cloudflare / WAF | Estefan | DDoS protection, DNS, WAF rules. | DNS pointing to ALB; basic rules; documentation. | 1 day | [#32](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/32) |
| ACT-026 | Configure ELB/ALB + ASG in Terraform | Estefan | Replace single EC2 with scalable infra. | Terraform ALB + ASG + multi-AZ; deployed to QA. | 2 days | [#33](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/33) |
| ACT-027 | Configure high availability | Estefan | RDS Multi-AZ, ALB, ASG, health checks. | HA architecture deployed and validated. | 2 days | [#34](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/34) |
| ACT-028 | Connect on-premise backups | Estefan | Site-to-site VPN or Storage Gateway. | Architecture document; backup/restore test. | 1 day | [#35](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/35) |
| ACT-029 | Implement n8n automation | Estefan | Scholarship approval workflow. | n8n workflow listens to events and sends emails. | 1 day | [#36](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/36) |
| ACT-030 | Configure Prometheus + Grafana | Estefan | Service and container metrics. | Dashboards for CPU, memory, requests, errors. | 2 days | [#37](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/37) |
| ACT-031 | Configure Site24x7 | Estefan | External uptime monitoring. | Email/Slack alerts; monitors critical endpoints. | 1 day | [#38](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/38) |
| ACT-032 | Integrate Supabase / Strapi / Contentful | Estefan + Erick | Use a PaaS in addition to AWS. | e.g., Supabase auth or Strapi CMS integrated. | 2 days | [#39](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/39) |
| ACT-033 | Implement load testing | Jonathan + Estefan | Artillery or k6. | Report with 100/500/1000 users on critical endpoints. | 1 day | [#40](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/40) |
| ACT-034 | Implement automated functional tests | Jonathan + Erick | Playwright or Cypress. | Frontend smoke tests running in CI. | 2 days | [#41](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/41) |
| ACT-035 | Include backend tests in CI/CD with coverage | Jonathan + Estefan | CI currently uses `--passWithNoTests`. | Coverage threshold; visible report; pipeline fails if below threshold. | 1 day | [#42](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/42) |
| ACT-036 | Publish images to Docker Hub | Estefan | Currently only GHCR. | Updated workflow; optional dual push. | 1 day | [#43](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/43) |
| ACT-037 | Implement conventional commits + PR templates | Jonathan + Estefan | Husky + commitlint + templates. | Validated commits; mandatory PR template. | 1 day | [#44](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/44) |
| ACT-038 | Update overall documentation | Erick + Jonathan | README, architecture, Swagger, runbooks. | README with diagrams; docs approved by team. | 1 day | [#45](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/45) |

---

## Sprint 2 — In Progress

| Code | Activity | Owner | Started | Notes |
|---|---|---|---|---|
| — | — | — | — | — |

---

## Sprint 2 — Code Review

| Code | Activity | Owner | Reviewers | PR |
|---|---|---|---|---|
| — | — | — | — | — |

---

## Sprint 2 — QA / Testing

| Code | Activity | QA Owner | Notes |
|---|---|---|---|
| — | — | — | — |

---

## Sprint 2 — Done

| Code | Activity | Owner | Notes |
|---|---|---|---|
| — | — | — | — |

---

## Baseline — Already Delivered

| Code | Activity | Owner |
|---|---|---|
| BASE-001 | NestJS monorepo structure | Erick |
| BASE-002 | `scholarship-service` CRUD + Swagger + tests | Erick |
| BASE-003 | `socioeconomic-form-service` CRUD + MongoDB + Swagger | Erick |
| BASE-004 | `psychological-care-service` CRUD + JWT preparation | Erick |
| BASE-005 | `welfare-frontend` web dashboard | Erick |
| BASE-006 | Local Docker Compose stack | Estefan |
| BASE-007 | Terraform EC2 base QA | Estefan |
| BASE-008 | Basic GitHub Actions CI/CD | Estefan |
| BASE-009 | Docker publish to GHCR | Estefan |
| BASE-010 | Swagger/OpenAPI on each backend | Erick |
| BASE-011 | CHANGELOG and release script | Estefan |

---

## How to update this board

1. When a task moves to **In Progress**, add the start date and any blockers.
2. When it enters **Code Review**, link the PR.
3. When it reaches **QA / Testing**, Jonathan records results and any defects.
4. When it is **Done**, move it to the Done column and update the `Last updated` date at the top.
5. For new requirements discovered later, create a new `ACT-XXX` code and add the row to the appropriate column.

---

## Board view setup (Trello style)

GitHub Projects does not expose a public API to create Board views, so this step must be completed manually by Jonathan:

1. Open the project: https://github.com/users/steandres/projects/2
2. Click the current view name near the top left (default is a table view).
3. Select **+ New view**.
4. Name the view **Board**.
5. Change the layout from **Table** to **Board**.
6. Click **Group by** and select the custom field **Workflow Stage**.
7. Save the view.

This will render the Trello-like columns:

- Backlog
- To Do
- In Progress
- Code Review
- QA / Testing
- Done

---

## Review notes

Review performed on 2026-06-27 against the current repository state:

- Most ACT items remain in **To Do** because the required functionality is not yet implemented.
- **ACT-009** was moved to **In Progress**: JWT auth modules, guards, strategies, and middleware exist in `scholarship-service`, `psychological-care-service`, and `api-gateway`, but `AUTH_ENABLED=false` by default and no centralized login endpoint is exposed yet.
- **ACT-012** was moved to **In Progress**: CORS is configured in all backend `main.ts` files reading `CORS_ORIGIN` from environment variables, but defaults remain wildcard (`*`) and per-environment restriction is still pending.
- No issues were closed because none of the new activity issues are fully completed yet. The baseline delivered work is documented in the **Baseline — Already Delivered** section.

