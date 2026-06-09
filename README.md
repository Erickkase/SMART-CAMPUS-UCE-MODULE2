# SMART CAMPUS UCE

## Module 2 - Student Welfare and Support

This monorepo contains the backend microservices and frontend application for the Student Welfare and Support module.

## Applications

- `apps/scholarship-service`: NestJS microservice for scholarship management.
- `apps/socioeconomic-form-service`: NestJS microservice for socioeconomic forms.
- `apps/welfare-frontend`: Next.js frontend for the welfare module.

## Local URLs

- Frontend: `http://localhost:3002`
- Scholarship Service: `http://localhost:3000`
- Scholarship Swagger: `http://localhost:3000/api/docs`
- Socioeconomic Form Service: `http://localhost:3001`
- Socioeconomic Swagger: `http://localhost:3001/api/docs`

## Frontend Environment Variables

Create `apps/welfare-frontend/.env.local` with:

```env
NEXT_PUBLIC_SCHOLARSHIP_API_URL=http://localhost:3000
NEXT_PUBLIC_SOCIOECONOMIC_API_URL=http://localhost:3001
```

The Docker environment uses `apps/welfare-frontend/.env.docker` with the same public API URLs.

## Run Frontend Locally

```bash
cd apps/welfare-frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3003
```

Note: local frontend dev mode uses port `3003`. Docker exposes the frontend on port `3002`.

## Run Full Stack With Docker

From the monorepo root:

```bash
docker compose up -d --build
```

This starts:

- `postgres` on `5432`
- `mongo` on `27017`
- `scholarship-service` on `3000`
- `socioeconomic-form-service` on `3001`
- `welfare-frontend` on `3002`

Open:

```text
http://localhost:3002
```

## Health Checks

Use these URLs to verify backend availability:

```text
http://localhost:3000/health
http://localhost:3001/health
```

The frontend dashboard also checks both endpoints and displays service status.

## Professor Demo Flow

1. Start the full stack with `docker compose up -d --build`.
2. Open `http://localhost:3002`.
3. Verify the dashboard title: `Student Welfare and Support Module`.
4. Confirm both services show as healthy.
5. Open `Scholarships` and create a scholarship request.
6. Approve or reject the scholarship request.
7. Open `Socioeconomic Forms` and create a socioeconomic form.
8. Search the socioeconomic form by `studentId`.
9. Explain that the frontend is consuming the REST APIs from both backend microservices.

For detailed steps, see `docs/frontend-demo.md`.
