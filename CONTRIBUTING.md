# Contributing

## Purpose

This document defines the collaboration flow for the SMART CAMPUS UCE Module 2 monorepo. It applies to backend services, frontend applications, release documentation, and environment configuration.

## Branch Strategy

The repository uses the following branch promotion flow:

```text
feature/* -> qa -> Pull Request -> main
```

## Contribution Workflow

1. Start from the latest `qa` branch.
2. Create a new branch using the `feature/*` naming convention.
3. Implement the change in the smallest correct scope.
4. Validate locally before requesting integration.
5. Merge the feature branch into `qa`.
6. Validate in `qa`.
7. Open a Pull Request from `qa` to `main`.
8. After review and approval, merge into `main`.
9. Create a release tag when the version is stable.

## Naming Conventions

### Branches

- `feature/<short-description>`
- `fix/<short-description>`
- `docs/<short-description>`

### Commits

Use concise conventional-style commit messages when possible.

Examples:

- `feat: add api gateway service`
- `feat(academic): add student management integration`
- `docs: prepare release v0.1.0 documentation`
- `fix: correct frontend environment variable reference`

## Pull Request Checklist

Before creating a Pull Request from `qa` to `main`, verify:

- The branch is updated from `qa`.
- The change scope is documented.
- Local tests were executed when applicable.
- Docker Compose validation was performed when the change affects runtime configuration.
- README or service documentation was updated when behavior changed.
- No unrelated files were included.

## Local Validation

### Install dependencies

```bash
npm install
```

### Run automated tests

```bash
npm test
npm run test:e2e
```

### Run the containerized stack

```bash
docker compose up -d --build
```

## Release Procedure

When the `main` branch is approved and stable:

1. Confirm the release scope.
2. Update documentation files such as `README.md`, `CHANGELOG.md`, and release notes.
3. Tag the release using semantic versioning.
4. Publish the release notes.

Example:

```bash
git tag v0.1.0
git push origin v0.1.0
```

## Documentation Scope

This repository currently maintains release documentation for:

- `scholarship-service`
- `socioeconomic-form-service`
- `psychological-care-service`
- `api-gateway`
- `welfare-frontend`

All new functional changes should update the relevant document when they affect:

- environment variables
- ports
- Docker behavior
- API routes
- local execution steps
- release scope
