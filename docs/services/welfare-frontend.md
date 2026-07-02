# Welfare Frontend

## Overview

`welfare-frontend` is a Next.js web application that provides the user interface for SMART CAMPUS UCE Module 2.

## Responsibilities

- Display the main welfare dashboard.
- Integrate scholarship management screens.
- Integrate socioeconomic form management screens.
- Integrate psychological care screens.
- Integrate academic management screens through the API Gateway.
- Display service health information.

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Main dashboard |
| `/scholarships` | Scholarship management |
| `/socioeconomic-forms` | Socioeconomic form management |
| `/psychological-care` | Psychological care management |
| `/academic-management` | Academic management integration |

## Runtime Ports

| Mode | URL |
| --- | --- |
| Local standalone | `http://localhost:3003` |
| Docker Compose | `http://localhost:3003` |

In Docker Compose, the container listens on port `3002` and is exposed on host port `3003`.

## Environment Variables

Source files:

- `apps/welfare-frontend/.env.example`
- `apps/welfare-frontend/.env.docker`

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SCHOLARSHIP_API_URL` | Scholarship API base URL |
| `NEXT_PUBLIC_SOCIOECONOMIC_API_URL` | Socioeconomic API base URL |
| `NEXT_PUBLIC_PSYCHOLOGICAL_API_URL` | Psychological API base URL |
| `NEXT_PUBLIC_API_GATEWAY_URL` | API Gateway base URL |

## Local Execution

From `apps/welfare-frontend`:

```bash
npm install
npm run dev
```

The local scripts are configured as:

```text
next dev -p 3003
next start -p 3003
```

## Docker Compose Execution

```bash
docker compose up -d welfare-frontend
```

## Integrated Services

The frontend consumes:

- `scholarship-service`
- `socioeconomic-form-service`
- `psychological-care-service`
- `api-gateway`

## Release Notes

This frontend is part of the `v0.1.0` stable release baseline.
