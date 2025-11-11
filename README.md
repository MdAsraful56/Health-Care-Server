# Health-Care-Server

Comprehensive backend server for a health-care/clinic application built with Node.js, TypeScript, Express, and Prisma. This README documents the project structure, setup, database migrations, running the app, module descriptions (A → Z), environment variables, and developer workflows.

## Table of contents

-   Project overview
-   Tech stack
-   Folder & file structure (explained)
-   Environment variables
-   Setup & run (development / production)
-   Database (Prisma) — migrations, seeds, studio
-   API overview — modules & main endpoints
-   File uploads
-   Testing & linting (notes)
-   Contributing
-   License & contacts

## Project overview

Health-Care-Server is a modular backend for a healthcare application. It provides authentication, user/doctor/patient management, scheduling, appointment booking, payments, prescriptions, reviews, admin utilities and metadata endpoints. The server uses Prisma ORM for database access and migrations and exposes a RESTful API consumed by a frontend (not included).

Goals:

-   Provide CRUD and business logic for a clinic-like application.
-   Keep modules separated for maintainability (auth, doctor, schedule, appointment, patient, admin, etc.).
-   Use TypeScript for types and safety.
-   Use Prisma for schema and migrations.

## Tech stack

-   Node.js
-   TypeScript
-   Express
-   Prisma (Postgres / MySQL / SQLite — configured via DATABASE_URL)
-   JWT based authentication
-   Stripe (payment helper present in utils)
-   Multer (likely used for uploads — see `uploads/`)

Notes: Some integrations (Stripe, email sending) rely on environment variables and external keys.

## Project structure

Top-level files & folders (important ones):

-   `package.json` — project scripts & dependencies (assumed typical: `dev`, `build`, `start`).
-   `tsconfig.json` — TypeScript configuration.
-   `prisma/` — Prisma schemas and migrations.
    -   `schema/` — multiple `.prisma` model files (user, schedule, appointment, etc.) and `schema.prisma` which composes them.
    -   `migrations/` — generated SQL migrations.
-   `src/` — application source code.
    -   `app.ts` — app initialization (Express setup, global middlewares, routes mounting).
    -   `server.ts` — server bootstrap (listen on port, start tasks).
    -   `app/config/` — config files (e.g., database connection wrapper: `db.ts`).
    -   `app/error/` — application error classes (e.g., `ApiError.ts`).
    -   `app/helpers/` — utility helpers (file uploader, jwt helper, pagination, stripe, openAIsdk, etc.).
    -   `app/middlewares/` — `auth.ts`, `globalErrorHandler.ts`, `notFound.ts`, `validateRequest.ts`.
    -   `app/modules/` — feature modules (each has controllers, routes, services, validations, constants):
        -   `admin/` — admin controllers & services.
        -   `appointment/` — appointment booking and management.
        -   `auth/` — login, register, password reset, email sender helper.
        -   `doctor/` — doctor profile, availability, details.
        -   `doctorSchedule/` — schedule creation and queries.
        -   `meta/` — metadata endpoints (app info, health checks, version).
        -   `patient/` — patient-specific endpoints & models.
        -   `payment/` — payment processing and helpers (Stripe integration helper in utils).
        -   `prescription/` — prescription management.
        -   `review/` — reviews & ratings.
        -   `schedule/` — schedule utilities and calendar queries.
        -   `specialties/` — list/manage specialties.
        -   `user/` — user management.
    -   `app/routes/index.ts` — central route registration (mount modules).
    -   `app/types/common.ts` — shared TypeScript types.
    -   `app/utils/` — `catchAsync.ts`, `sendResponse.ts`, and other utilities used app-wide.
-   `uploads/` — uploaded files (images, documents). Keep this directory out of version control if it contains user data.
-   `Tasks/` — developer notes or completed-work tracking.

### File-by-file purpose (selected)

-   `src/app.ts` — creates Express app, applies middlewares, sets up route mounting and global error handling.
-   `src/server.ts` — loads env, connects DB, starts HTTP server.
-   `src/app/config/db.ts` — initializes Prisma client and performs connection logic.
-   `src/app/middlewares/auth.ts` — JWT verification and role checking.
-   `src/app/modules/*` — each folder groups domain logic: validation, service layer, controller, and router.

## Environment variables

Create a `.env` in the project root (or configure in your hosting provider). Typical variables used by the app:

-   `PORT` — port to run the server (default: 3000).
-   `NODE_ENV` — `development` or `production`.
-   `DATABASE_URL` — Prisma database connection string (Postgres/MySQL/SQLite).
-   `JWT_SECRET` — secret for signing JWT tokens.
-   `JWT_EXPIRES_IN` — token ttl (e.g., `7d`).
-   `STRIPE_SECRET_KEY` — (if using Stripe flows).
-   `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — for email sending.
-   `UPLOADS_DIR` — local storage path for file uploads (optional; defaults to `uploads/`).
-   `OPENAI_API_KEY` — if `openAIsdk` helper is used.

Note: Exact variable names may vary slightly in the code. Search `process.env` usage if unsure.

## Setup & run (development)

Assumptions:

-   `node` >= 16 is available.
-   `npm` or `pnpm` / `yarn` is used.
-   `prisma` CLI will be available via `npx prisma` if not globally installed.

Steps:

1. Install dependencies

```powershell
npm install
```

2. Create `.env` and set required keys (see Environment variables above).

3. Generate Prisma client

```powershell
npx prisma generate
```

4. Run database migrations (creates or updates DB schema)

```powershell
npx prisma migrate dev --name init
```

If you already have migrations and want to apply them to a database, use:

```powershell
npx prisma migrate deploy
```

5. Start in development mode (assumes a script `dev` exists that runs `ts-node-dev` or `nodemon`)

```powershell
npm run dev
```

Common script names (if not present, create them in `package.json`):

-   `dev` — start in dev with auto-reload
-   `build` — compile TypeScript to JS
-   `start` — run compiled JS in production

Example `package.json` scripts (suggested):

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

## Database (Prisma)

-   Schema files are in `prisma/schema/` with domain models for users, doctors, schedules, appointments, specialties, etc.
-   Migrations live under `prisma/migrations/` and have been committed to source control.
-   Run `npx prisma studio` to open a UI to inspect DB records.

Quick Prisma commands:

```powershell
npx prisma generate        # generate client
npx prisma migrate dev     # run dev migrations and create migration files
npx prisma migrate deploy  # apply migrations (CI/production)
npx prisma studio          # open local DB GUI
```

## API Overview — modules & common endpoints

This project is modular. Each module exposes REST endpoints mounted under a prefixed route. The exact route paths are defined in `src/app/modules/*/*.route.ts` and aggregated in `src/app/routes/index.ts`.

High-level module responsibilities and example routes (conventionally):

-   Auth (`/api/v1/auth`):

    -   `POST /register` — create new user (patient or provider depending on payload)
    -   `POST /login` — authenticate and receive JWT
    -   `POST /forgot-password` — start reset flow
    -   `POST /reset-password` — complete reset

-   User (`/api/v1/users`):

    -   `GET /me` — get current user profile
    -   `PUT /me` — update profile
    -   `GET /:id` — get user by ID

-   Doctor (`/api/v1/doctors`):

    -   `GET /` — list doctors (with filters, specialties)
    -   `GET /:id` — doctor profile
    -   `POST /:id/schedule` — (admin/doctor) add schedule entries

-   DoctorSchedule (`/api/v1/doctor-schedules`):

    -   `GET /doctor/:doctorId` — fetch a doctor's schedule
    -   `POST /` — create availability slots

-   Schedule (`/api/v1/schedules`): calendar-like queries and slot availability.

-   Appointment (`/api/v1/appointments`):

    -   `POST /` — book an appointment (patient)
    -   `GET /patient/:patientId` — list patient appointments
    -   `PUT /:id/cancel` — cancel appointment
    -   `PUT /:id/confirm` — provider confirms

-   Payment (`/api/v1/payments`):

    -   Integrates with Stripe helper in `app/helpers/stripe.ts` for creating payments and webhooks.

-   Prescription (`/api/v1/prescriptions`): manage prescriptions tied to appointments or physicians.

-   Review (`/api/v1/reviews`): reviews & ratings for doctors or appointments.

-   Specialties (`/api/v1/specialties`): list and CRUD specialties used for doctor filtering.

-   Admin (`/api/v1/admin`): admin-only endpoints for user management, role changes, and system maintenance.

-   Meta (`/api/v1/meta`): health check, app version, public metadata.

For exact routes, see each module's `*.route.ts` file. Example implementation pattern:

-   Controllers: handle request/response and call services
-   Services: business logic and DB access via Prisma client
-   Validations: request payload validation (e.g., `*.validation.ts`)

Authentication & Authorization:

-   JWT middleware (`src/app/middlewares/auth.ts`) protects routes. Some routes are public (e.g., login), others require authentication and sometimes role checks (doctor/admin).

Response format:

-   A utility `sendResponse` is used to standardize responses (status, message, data, meta when paginated).

Error handling:

-   Global error handler is in `src/app/middlewares/globalErrorHandler.ts` and `ApiError` class in `src/app/error/ApiError.ts`.

## File uploads

-   Local uploads are stored in `uploads/` by default. Uploaded filenames in that directory follow a prefixed naming style (`file-<timestamp>-<random>`).
-   The `fileUploader.ts` helper handles storage. Ensure `uploads/` has correct write permissions and is excluded from VCS if it will hold user files.

## Testing & linting

-   There are no explicit test files in this repository snapshot. Recommended additions:

    -   Unit tests with Jest (or Vitest) for service layer.
    -   Integration tests for key endpoints using Supertest.

-   Linting & formatting: add `eslint` and `prettier` to keep code style consistent.

## Deployment notes

-   Build: `npm run build` -> outputs JS (e.g., `dist/`)
-   Environment: set `NODE_ENV=production` and ensure `DATABASE_URL` points to the production DB.
-   Migrations: use `npx prisma migrate deploy` on CI before starting app.
-   Process manager: use PM2, systemd, Docker container, or similar.

Docker (optional)

Add a `Dockerfile` that builds the project and runs `npm start`. Ensure to run `npx prisma generate` and `npx prisma migrate deploy` during CI or container startup if appropriate.

## Security & hardening

-   Keep `JWT_SECRET` and payment/email keys out of source control.
-   Rate-limit public auth endpoints to protect against brute force.
-   Validate/limit uploaded file size & types.

## Contributing

If you'd like to contribute:

1. Fork the repo, create a feature branch from `main` (or the repo's contribution advice branch).
2. Add tests for new behavior.
3. Open a PR describing the changes.

Coding style: prefer TypeScript types, keep controllers thin, push business logic into services.

## Useful commands (quick reference)

```powershell
npm install
npx prisma generate
npx prisma migrate dev --name <migration-name>
npm run dev
npm run build
npm run start
npx prisma studio
```

## Where to look next in the codebase

-   App bootstrap: `src/app.ts`, `src/server.ts`
-   DB config & Prisma usage: `src/app/config/db.ts`, `prisma/` folder
-   Routes & modules: `src/app/routes/index.ts` and each `src/app/modules/*/*.route.ts`
-   Shared helpers: `src/app/helpers/` and `src/app/utils/`

## Final notes & assumptions

-   This README was created from the repository layout and file names. If scripts in `package.json` or exact env var names differ, adjust commands and env key names accordingly.
-   If you'd like, I can also:
    -   Inspect `package.json` and update the scripts section with recommended scripts.
    -   Create an example `.env.example` with required keys.
    -   Add a basic `Dockerfile` and `docker-compose.yml` for local dev with a database service.

---

If you want, I can now:

1. run a quick repo search to extract exact scripts and env var names and update the README accordingly, or
2. add an `.env.example` file and a `Dockerfile` for local dev.

Tell me which follow-up you'd like and I'll proceed.
