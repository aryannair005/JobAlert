# DevAlert

Developer-focused job and internship alerts. Follow companies, browse software engineering roles, and build a foundation for timely notifications.

**Status:** initial scaffold. Dashboard and APIs use illustrative sample records. Real job discovery, personalized matching, and browser push are not production integrations yet.

## Architecture

~~~mermaid
flowchart LR
 Browser[React and Vite] --> Gateway[Express API Gateway]
 Gateway --> Auth[Auth Service]
 Gateway --> Companies[Company Directory Service]
 Gateway --> Jobs[Job Catalog Service]
 Auth --> Mongo[(MongoDB)]
 Companies --> Mongo
 Jobs --> Mongo
 Ingestion[Ingestion Worker] --> Sources[Mock adapter / approved APIs later]
 Ingestion --> Mongo
 Ingestion --> Redis[(Redis and BullMQ)]
 Redis --> Notifications[Notification Worker]
 Notifications --> SMTP[SMTP provider when configured]
~~~

## Run with Docker

1. Install Docker Desktop and Docker Compose.
2. Copy .env.example to .env. On macOS/Linux use cp .env.example .env; on Windows PowerShell use Copy-Item .env.example .env.
3. Change the example database password and JWT secret in .env before shared deployment.
4. Run docker compose up --build from the project root.
5. Open the UI at http://localhost:5173, gateway health at http://localhost:4000/api/health, jobs at http://localhost:4000/api/jobs, and companies at http://localhost:4000/api/companies.

Stop with Ctrl+C or docker compose down. Remove local data volumes with docker compose down -v.

## Run without Docker

Use Node.js 22 or a recent compatible release, npm, MongoDB, and Redis. Copy .env.example to .env, use a host Mongo URI with 127.0.0.1 instead of the Docker hostname mongo, and set REDIS_URL to redis://127.0.0.1:6379. Then run:

~~~bash
npm install
npm run dev
~~~

Individual services can be run with npm run dev:gateway, npm run dev:auth, npm run dev:users, npm run dev:jobs, npm run dev:ingestion, and npm run dev:notifications.

## API

- GET /api/health — gateway health.
- POST /api/auth/register — JSON body: displayName, email, password.
- POST /api/auth/login — JSON body: email, password.
- GET /api/companies — company directory.
- GET /api/jobs?q=node&company=Microsoft&type=Internship&page=1&limit=20 — search and paginate jobs.
- GET /api/jobs/:id — retrieve a job by MongoDB ID.

The auth service hashes passwords and returns a short-lived JWT. Before production, add refresh-token lifecycle, email verification, password resets, brute-force controls, rate limits, and stronger authorization.

## Data-source strategy

Initial ingestion intentionally uses mock records. Add live sources behind an adapter interface such as fetchJobs() and normalizeJob(), one source at a time. Potential sources include the [Greenhouse Job Board API](https://docs.greenhouse.io/job-board.html), the [Lever Postings API](https://github.com/lever/postings-api) for participating employers, or an approved aggregator such as [Adzuna](https://developer.adzuna.com/).

Do not assume every company exposes a public feed. Check each integration's current documentation, terms, attribution, rate limits, and permitted use. Do not bypass logins, CAPTCHAs, or technical access controls.

## Redis and notifications

- The job-ingestion queue holds scheduled source-check tasks.
- The notification worker can process queued delivery tasks.
- Demo jobs are upserted by external source identity to reduce duplicates.
- Current ingestion refreshes illustrative records; it does not discover live vacancies or match users to jobs.
- Notification delivery stays in demo mode until SMTP and a recipient are configured.
- Production milestones: persisted user preferences and watchlists, a matching workflow, durable notification records and idempotency keys, unsubscribe enforcement, browser push, automated tests, monitoring, and CI.

## Security

Never commit .env files or provider credentials. Example database credentials and JWT secret are for local development only. Auth is a starter, not a production-complete identity system. Before public deployment, add HTTPS, secret management, input validation, authorization checks, rate limits, email verification, password reset, and a security review.

No open-source license has been selected yet. Add one before accepting external contributions.
