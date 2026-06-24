# AGENTS.md — SMART CAMPUS UCE Module 2

High-signal notes for OpenCode sessions working in this repo.

## Repo layout

- NestJS monorepo (Nest CLI monorepo mode) with three backend apps and one Next.js frontend.
  - `apps/scholarship-service` — default NestJS app; PostgreSQL/TypeORM or in-memory.
  - `apps/socioeconomic-form-service` — NestJS; MongoDB/Mongoose or in-memory.
  - `apps/psychological-care-service` — NestJS; PostgreSQL/TypeORM or in-memory.
  - `apps/welfare-frontend` — Next.js 15, separate `package.json`, path alias `@/*`.
- Infrastructure as code: `infra/terraform/` (AWS QA, single EC2, Docker Compose on host).

## Install

- Root deps: `npm install` at repo root (backend + shared tooling).
- Frontend deps: `cd apps/welfare-frontend && npm install` (own `package-lock.json`).

## Run / build

- Nest default app is `scholarship-service`; `npm run start:dev` and `npm run build` target it.
- Other apps need explicit scripts:
  - `npm run start:socioeconomic:dev`
  - `npm run start:psychological:dev`
  - `npm run build:socioeconomic`
  - `npm run build:psychological`
- Or use `npx nest start <app> --watch` / `npx nest build <app>`.
- Frontend dev: `cd apps/welfare-frontend && npm run dev` → port `3003`.
- Docker full stack: `docker compose up -d --build` from root.

## Ports (defaults and collisions)

| App | Default local port | Docker host port |
|---|---|---|
| scholarship-service | 3000 | 3000 |
| socioeconomic-form-service | 3001 | 3001 |
| psychological-care-service | 3003 | 3002 |
| welfare-frontend (dev) | 3003 | 3003 |

- `psychological-care-service` defaults to `3003`, which collides with the Next.js dev server. Run only one on that port or override `PORT`.
- Docker Compose exposes the frontend on host `3003` (container `3002`), while psychological-care-service is on host `3002`. Some docs still say `3002` for the frontend — trust `docker-compose.yml`.

## Environment / local dev without databases

- Each backend app loads `.env` then `apps/<app>/.env` (see `envFilePath` in each `app.module.ts`).
- `.env.example` files are tracked; real `.env` / `.env.docker` files are gitignored.
- Examples set `DB_ENABLED=false` / `MONGO_ENABLED=false`, so services start with in-memory repositories and do not need Postgres/Mongo locally.
- Docker Compose expects `apps/<app>/.env.docker` files (not in repo) with database flags enabled.
- Frontend needs `apps/welfare-frontend/.env.local` (dev) or build-args (Docker):
  - `NEXT_PUBLIC_SCHOLARSHIP_API_URL`
  - `NEXT_PUBLIC_SOCIOECONOMIC_API_URL`
  - `NEXT_PUBLIC_PSYCHOLOGICAL_API_URL`
- Note: `.env.example` sets psychological API to `http://localhost:3002` (Docker port); for local psychological backend default use `http://localhost:3003`.

## Tests

- Unit / integration: `npm test` (`jest.config.ts`, matches `*.spec.ts` and `*.int-spec.ts`).
- E2E: `npm run test:e2e` (`jest-e2e.config.ts`, matches `*.e2e-spec.ts` and `*.int-spec.ts`).
- CI runs `npm run test -- --passWithNoTests`.
- Run a single app: `npx jest apps/<app>` or `npx jest --config jest-e2e.config.ts apps/<app>/test --runInBand`.
- Use `--runInBand` when tests start HTTP servers to avoid port collisions.

## Auth / DB behavior

- JWT auth is prepared but disabled by default (`AUTH_ENABLED=false`). Enabling it requires `JWT_SECRET`.
- Health endpoints (`GET /health`) stay public even with auth enabled.
- Swagger/OpenAPI is available at `/api/docs` on each backend.
- `DB_ENABLED=false` uses in-memory repositories; `DB_ENABLED=true` uses TypeORM/Postgres. `MONGO_ENABLED=false` skips Mongoose and uses in-memory.

## CI / release / branches

- CI triggers on `push` and `pull_request` to `main` and `qa` only.
- Pushes to `qa` or `main` also trigger `.github/workflows/docker-publish.yml` (images to GHCR) and `.github/workflows/deploy.yml` (Terraform apply).
- Documented branch flow: `feature/* → qa → main`; `qa` is the integration branch. A `develop` branch exists but is not part of the documented release flow.
- Release: from `main`, run `./scripts/release.sh`. It bumps `package.json`, updates `CHANGELOG.md`, commits, creates annotated tag `v*`, and pushes branch + tag. Pushing a `v*` tag triggers the GitHub Actions `Release` workflow.
- Manual Terraform deploy is also available via `workflow_dispatch` in `.github/workflows/deploy-aws-qa.yml`.

## Terraform / AWS QA

- Code: `infra/terraform/main`; vars in `infra/terraform/main/environments/qa.tfvars`.
- One-time bootstrap: `chmod +x infra/terraform/scripts/*.sh && ./infra/terraform/scripts/bootstrap.sh` creates the S3 state bucket and DynamoDB lock table. Bucket name defaults to `smart-campus-uce-module2-tfstate-832682702884` and must be globally unique; change it in `infra/terraform/bootstrap/variables.tf` if needed.
- Then: `./infra/terraform/scripts/init.sh qa us-east-1 ...` and `./infra/terraform/scripts/deploy.sh plan qa` / `apply qa`.
- Automated deploy also runs via `.github/workflows/deploy.yml` on every push to `qa` or `main`.
- AWS Academy constraints: no IAM roles/instance profiles, no ALB, no Elastic IP, everything runs on a single EC2 instance via Docker Compose.

## Tooling notes

- No repo-wide lint / format scripts. Frontend has `npm run lint` (Next.js ESLint). CI only builds and tests.
- Root `tsconfig.json` includes `apps/**/*.ts`; frontend uses its own `tsconfig.json` with `bundler` module resolution and `@/*` alias.
