# Activities To Do — SMART CAMPUS UCE MODULE 2

> **Ordered roadmap of remaining activities.**  
> **Roadmap ordenado de actividades pendientes.**  
> **Last updated / Última actualización:** 2026-06-27

---

## Cómo usar este documento / How to use this document

- Cada actividad incluye su código, título en español, título en inglés, responsable, esfuerzo estimado y enlace al issue de GitHub.
- Each activity includes its code, Spanish title, English title, owner, estimated effort, and link to the GitHub issue.
- Sigue el orden propuesto para minimizar dependencias y avanzar de forma coherente.
- Follow the proposed order to minimize dependencies and advance coherently.

---

## Sprint 1 — Fundamentos / Foundations

### Fase 1: Completar servicios base / Complete base services

#### ACT-005 — Completar `enrollment-service` / Complete `enrollment-service`
- **Responsable / Owner:** Erick
- **Esfuerzo / Effort:** 2 días / 2 days
- **Issue:** [#12](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/12)
- **Descripción:** El `enrollment-service` es solo un esqueleto. Implementar capas de dominio, aplicación, infraestructura y presentación.
- **Description:** The `enrollment-service` is currently a skeleton. Implement domain, application, infrastructure, and presentation layers.

#### ACT-006 — Integrar `subject-service` con base de datos y Docker / Integrate `subject-service` with database and Docker
- **Responsable / Owner:** Erick
- **Esfuerzo / Effort:** 1 día / 1 day
- **Issue:** [#13](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/13)
- **Descripción:** El CRUD existe solo en memoria. Agregar persistencia con TypeORM/PostgreSQL, integrar en `docker-compose.yml` y CI.
- **Description:** CRUD exists only in-memory. Add TypeORM/PostgreSQL persistence, integrate into `docker-compose.yml` and CI.

#### ACT-011 — Agregar Redis como base de datos caché / Add Redis as cache database
- **Responsable / Owner:** Estefan + Erick
- **Esfuerzo / Effort:** 1 día / 1 day
- **Issue:** [#18](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/18)
- **Descripción:** Agregar Redis al stack para cumplir con el requisito de al menos 3 tipos de bases de datos, una de ellas caché.
- **Description:** Add Redis to the stack to satisfy the requirement of at least 3 database types, one of which must be a cache.

---

### Fase 2: Seguridad / Security

#### ACT-009 — Implementar autenticación centralizada / Implement centralized authentication
- **Responsable / Owner:** Erick
- **Esfuerzo / Effort:** 2 días / 2 days
- **Issue:** [#16](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/16)
- **Descripción:** Habilitar JWT en API Gateway y microservicios. Actualmente está preparado pero desactivado (`AUTH_ENABLED=false`).
- **Description:** Enable JWT across API Gateway and microservices. Currently prepared but disabled (`AUTH_ENABLED=false`).

#### ACT-010 — Implementar RBAC / Implement RBAC
- **Responsable / Owner:** Erick
- **Esfuerzo / Effort:** 1 día / 1 day
- **Issue:** [#17](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/17)
- **Descripción:** Roles: estudiante, administrador, comité de bienestar, psicólogo. Decorador `@Roles()` + guardia.
- **Description:** Roles: student, administrator, welfare committee, psychologist. `@Roles()` decorator + guard.

#### ACT-012 — Configurar CORS basado en ambiente / Configure environment-based CORS
- **Responsable / Owner:** Estefan
- **Esfuerzo / Effort:** 0.5 días / 0.5 days
- **Issue:** [#19](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/19)
- **Descripción:** Reemplazar el wildcard `*` por orígenes restringidos según el ambiente (QA/producción).
- **Description:** Replace wildcard `*` with restricted origins per environment (QA/production).

---

### Fase 3: Nuevos microservicios / New microservices

#### ACT-001 — Crear `notification-service` / Create `notification-service`
- **Responsable / Owner:** Erick
- **Esfuerzo / Effort:** 2 días / 2 days
- **Issue:** [#8](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/8)
- **Descripción:** Microservicio NestJS para enviar correos, SMS y notificaciones push.
- **Description:** NestJS microservice for sending email, SMS, and push notifications.

#### ACT-002 — Crear `appointment-service` / Create `appointment-service`
- **Responsable / Owner:** Erick
- **Esfuerzo / Effort:** 2 días / 2 days
- **Issue:** [#9](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/9)
- **Descripción:** Gestión de citas de atención psicológica: disponibilidad, reserva, cancelación, completada.
- **Description:** Psychological care appointment management: availability, booking, cancellation, completion.

#### ACT-003 — Crear `document-service` / Create `document-service`
- **Responsable / Owner:** Erick
- **Esfuerzo / Effort:** 2 días / 2 days
- **Issue:** [#10](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/10)
- **Descripción:** Subida y gestión de documentos de bienestar (certificados, cédulas) a S3 o almacenamiento local.
- **Description:** Upload and management of welfare documents (certificates, IDs) to S3 or local storage.

#### ACT-004 — Crear `reporting-service` / Create `reporting-service`
- **Responsable / Owner:** Erick
- **Esfuerzo / Effort:** 2 días / 2 days
- **Issue:** [#11](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/11)
- **Descripción:** Reportes y KPIs para el comité de bienestar estudiantil.
- **Description:** Reports and KPIs for the student welfare committee.

---

### Fase 4: Multiplataforma / Multiplatform

#### ACT-007 — Crear app móvil `welfare-mobile` con React Native + Expo / Create `welfare-mobile` app with React Native + Expo
- **Responsable / Owner:** Erick
- **Esfuerzo / Effort:** 3 días / 3 days
- **Issue:** [#14](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/14)
- **Descripción:** Aplicación móvil del módulo de bienestar dentro del monorepo.
- **Description:** Mobile application for the welfare module within the monorepo.

#### ACT-008 — Crear app desktop `welfare-desktop` con Electron + Express / Create `welfare-desktop` app with Electron + Express
- **Responsable / Owner:** Erick
- **Esfuerzo / Effort:** 3 días / 3 days
- **Issue:** [#15](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/15)
- **Descripción:** Aplicación de escritorio del módulo de bienestar con Electron y Express local.
- **Description:** Desktop application for the welfare module using Electron and a local Express backend.

---

## Sprint 2 — Integración, infraestructura y testing / Integration, infrastructure and testing

### Fase 5: Métodos de comunicación / Communication methods

#### ACT-013 — Implementar bus de eventos Kafka / Implement Kafka event bus
- **Responsable / Owner:** Estefan + Erick
- **Esfuerzo / Effort:** 2 días / 2 days
- **Issue:** [#20](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/20)
- **Descripción:** Introducir Apache Kafka para eventos de dominio entre microservicios.
- **Description:** Introduce Apache Kafka for domain events between microservices.

#### ACT-014 — Implementar colas asíncronas con RabbitMQ / Implement RabbitMQ async task queues
- **Responsable / Owner:** Estefan + Erick
- **Esfuerzo / Effort:** 2 días / 2 days
- **Issue:** [#21](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/21)
- **Descripción:** Colas asíncronas para notificaciones y procesamiento de formularios.
- **Description:** Asynchronous queues for notifications and form processing.

#### ACT-015 — Implementar alertas MQTT / Implement MQTT alerts
- **Responsable / Owner:** Estefan + Erick
- **Esfuerzo / Effort:** 1 día / 1 day
- **Issue:** [#22](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/22)
- **Descripción:** Alertas ligeras a dispositivos móviles u endpoints IoT.
- **Description:** Lightweight alerts to mobile devices or IoT endpoints.

#### ACT-016 — Implementar comunicación gRPC entre servicios / Implement gRPC service communication
- **Responsable / Owner:** Erick
- **Esfuerzo / Effort:** 2 días / 2 days
- **Issue:** [#23](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/23)
- **Descripción:** Comunicación gRPC, por ejemplo entre `api-gateway` y `subject-service`.
- **Description:** gRPC communication, for example between `api-gateway` and `subject-service`.

#### ACT-017 — Implementar notificaciones en tiempo real con WebSocket / Implement WebSocket real-time notifications
- **Responsable / Owner:** Erick
- **Esfuerzo / Effort:** 2 días / 2 days
- **Issue:** [#24](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/24)
- **Descripción:** Dashboard y móvil reciben actualizaciones de estado en tiempo real.
- **Description:** Dashboard and mobile receive real-time status updates.

#### ACT-018 — Implementar endpoint GraphQL / Implement GraphQL endpoint
- **Responsable / Owner:** Erick
- **Esfuerzo / Effort:** 2 días / 2 days
- **Issue:** [#25](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/25)
- **Descripción:** Exponer `/graphql` en API Gateway o servicio dedicado.
- **Description:** Expose `/graphql` in API Gateway or a dedicated service.

#### ACT-019 — Implementar Webhooks / Implement Webhooks
- **Responsable / Owner:** Erick
- **Esfuerzo / Effort:** 1 día / 1 day
- **Issue:** [#26](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/26)
- **Descripción:** Permitir que sistemas externos se suscriban a eventos de bienestar.
- **Description:** Allow external systems to subscribe to welfare events.

#### ACT-020 — Implementar cliente o servidor SOAP / Implement SOAP client or server
- **Responsable / Owner:** Erick
- **Esfuerzo / Effort:** 1 día / 1 day
- **Issue:** [#27](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/27)
- **Descripción:** Integración con sistema legado de la universidad usando SOAP.
- **Description:** Integration with a legacy university system using SOAP.

---

### Fase 6: Arquitectura / Architecture

#### ACT-021 — Aplicar CQRS en `scholarship-service` / Apply CQRS in `scholarship-service`
- **Responsable / Owner:** Erick
- **Esfuerzo / Effort:** 2 días / 2 days
- **Issue:** [#28](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/28)
- **Descripción:** Separar comandos y consultas en `scholarship-service`.
- **Description:** Separate commands and queries in `scholarship-service`.

#### ACT-022 — Aplicar arquitectura orientada a eventos / Apply Event Driven Architecture
- **Responsable / Owner:** Erick
- **Esfuerzo / Effort:** 2 días / 2 days
- **Issue:** [#29](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/29)
- **Descripción:** Publicar eventos de dominio a través de Kafka o RabbitMQ.
- **Description:** Publish domain events through Kafka or RabbitMQ.

---

### Fase 7: Seguridad avanzada / Advanced security

#### ACT-023 — Configurar rate limiting y helmet / Configure rate limiting and helmet
- **Responsable / Owner:** Erick
- **Esfuerzo / Effort:** 1 día / 1 day
- **Issue:** [#30](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/30)
- **Descripción:** Proteger APIs contra abuso y headers inseguros.
- **Description:** Protect APIs from abuse and unsafe headers.

#### ACT-024 — Configurar bastion host / jump box / Configure bastion host / jump box
- **Responsable / Owner:** Estefan
- **Esfuerzo / Effort:** 1 día / 1 day
- **Issue:** [#31](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/31)
- **Descripción:** Acceso seguro a recursos privados de AWS.
- **Description:** Secure access to private AWS resources.

#### ACT-025 — Configurar Cloudflare / WAF / Configure Cloudflare / WAF
- **Responsable / Owner:** Estefan
- **Esfuerzo / Effort:** 1 día / 1 day
- **Issue:** [#32](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/32)
- **Descripción:** Protección DDoS, DNS y reglas WAF.
- **Description:** DDoS protection, DNS, and WAF rules.

---

### Fase 8: AWS y alta disponibilidad / AWS and high availability

#### ACT-026 — Configurar ELB/ALB + ASG en Terraform / Configure ELB/ALB and ASG in Terraform
- **Responsable / Owner:** Estefan
- **Esfuerzo / Effort:** 2 días / 2 days
- **Issue:** [#33](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/33)
- **Descripción:** Reemplazar la EC2 única por un ALB y Auto Scaling Group.
- **Description:** Replace the single EC2 with an ALB and Auto Scaling Group.

#### ACT-027 — Configurar alta disponibilidad / Configure high availability
- **Responsable / Owner:** Estefan
- **Esfuerzo / Effort:** 2 días / 2 days
- **Issue:** [#34](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/34)
- **Descripción:** RDS Multi-AZ, ALB, ASG, health checks y recuperación automática.
- **Description:** RDS Multi-AZ, ALB, ASG, health checks, and auto-recovery.

#### ACT-028 — Conectar backups on-premise / Connect on-premise backups
- **Responsable / Owner:** Estefan
- **Esfuerzo / Effort:** 1 día / 1 day
- **Issue:** [#35](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/35)
- **Descripción:** VPN site-to-site o Storage Gateway para respaldos.
- **Description:** Site-to-site VPN or Storage Gateway for backups.

---

### Fase 9: Automatización y monitoreo / Automation and monitoring

#### ACT-029 — Implementar flujo de automatización con n8n / Implement n8n automation workflow
- **Responsable / Owner:** Estefan
- **Esfuerzo / Effort:** 1 día / 1 day
- **Issue:** [#36](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/36)
- **Descripción:** Automatizar proceso de negocio, por ejemplo aprobación de becas.
- **Description:** Automate a business process, for example scholarship approval.

#### ACT-030 — Configurar Prometheus y Grafana / Configure Prometheus and Grafana
- **Responsable / Owner:** Estefan
- **Esfuerzo / Effort:** 2 días / 2 days
- **Issue:** [#37](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/37)
- **Descripción:** Métricas de servicios y contenedores.
- **Description:** Service and container metrics.

#### ACT-031 — Configurar Site24x7 / Configure Site24x7
- **Responsable / Owner:** Estefan
- **Esfuerzo / Effort:** 1 día / 1 day
- **Issue:** [#38](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/38)
- **Descripción:** Monitoreo externo de disponibilidad con alertas.
- **Description:** External uptime monitoring with alerts.

#### ACT-032 — Integrar Supabase / Strapi / Contentful / Integrate Supabase / Strapi / Contentful
- **Responsable / Owner:** Estefan + Erick
- **Esfuerzo / Effort:** 2 días / 2 days
- **Issue:** [#39](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/39)
- **Descripción:** Usar una plataforma PaaS además de AWS.
- **Description:** Use a PaaS platform in addition to AWS.

---

### Fase 10: Testing / Testing

#### ACT-033 — Implementar pruebas de carga / Implement load testing
- **Responsable / Owner:** Jonathan + Estefan
- **Esfuerzo / Effort:** 1 día / 1 day
- **Issue:** [#40](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/40)
- **Descripción:** Artillery o k6 contra endpoints críticos.
- **Description:** Artillery or k6 against critical endpoints.

#### ACT-034 — Implementar pruebas funcionales automatizadas / Implement automated functional tests
- **Responsable / Owner:** Jonathan + Erick
- **Esfuerzo / Effort:** 2 días / 2 days
- **Issue:** [#41](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/41)
- **Descripción:** Playwright o Cypress para flujos de frontend.
- **Description:** Playwright or Cypress for frontend flows.

#### ACT-035 — Incluir tests backend en CI/CD con cobertura / Include backend tests in CI/CD with coverage
- **Responsable / Owner:** Jonathan + Estefan
- **Esfuerzo / Effort:** 1 día / 1 day
- **Issue:** [#42](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/42)
- **Descripción:** CI debe fallar si la cobertura es insuficiente.
- **Description:** CI should fail if coverage is insufficient.

---

### Fase 11: DevOps y documentación / DevOps and documentation

#### ACT-036 — Publicar imágenes en Docker Hub / Publish images to Docker Hub
- **Responsable / Owner:** Estefan
- **Esfuerzo / Effort:** 1 día / 1 day
- **Issue:** [#43](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/43)
- **Descripción:** Extender el workflow para publicar también en Docker Hub.
- **Description:** Extend the workflow to also publish to Docker Hub.

#### ACT-037 — Implementar conventional commits y PR templates / Implement conventional commits and PR templates
- **Responsable / Owner:** Jonathan
- **Esfuerzo / Effort:** 1 día / 1 day
- **Issue:** [#44](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/44)
- **Descripción:** Husky + commitlint + plantillas de PR.
- **Description:** Husky + commitlint + PR templates.

#### ACT-038 — Actualizar documentación general / Update overall project documentation
- **Responsable / Owner:** Jonathan
- **Esfuerzo / Effort:** 1 día / 1 day
- **Issue:** [#45](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/45)
- **Descripción:** README, diagramas de arquitectura, Swagger y runbooks.
- **Description:** README, architecture diagrams, Swagger, and runbooks.

---

## Actividades de backlog / Backlog activities

Estas actividades son de planificación y diseño, no de implementación inmediata.
These activities are for planning and design, not immediate implementation.

#### BKL-001 — Definir modelo de datos transversal / Define cross-service data model
- **Responsable / Owner:** Erick + Jonathan
- **Issue:** [#46](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/46)

#### BKL-002 — Seleccionar tercer motor de base de datos / Select third database engine
- **Responsable / Owner:** Estefan + Erick
- **Issue:** [#47](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/47)

#### BKL-003 — Diseñar mapa de comunicación entre servicios / Design inter-service communication map
- **Responsable / Owner:** Erick + Estefan
- **Issue:** [#48](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/48)

#### BKL-004 — Definir estrategia de monitoreo y alertas / Define monitoring and alerting strategy
- **Responsable / Owner:** Estefan + Jonathan
- **Issue:** [#49](https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues/49)

---

## Enlaces útiles / Useful links

- **GitHub Project / Tablero:** https://github.com/users/steandres/projects/2
- **Issues del proyecto / Project issues:** https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2/issues
- **Tablero local / Local board:** `docs/activity-board.md`
