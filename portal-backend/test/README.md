# Backend E2E Testing Setup (Step by Step)

This guide explains how to set up, run, and debug backend e2e tests in this repository.

## 1) Prerequisites

- Node.js installed (same version used by the project is recommended)
- npm installed
- Docker installed (recommended for quick Postgres setup), or local Postgres

## 2) Install backend dependencies

From the backend folder:

```bash
cd portal-backend
npm install
```

## 3) Configure test environment variables

The e2e suite loads environment variables from:

- `test/test-helper/globalSetup.ts`
- `.env.test`

Make sure `.env.test` exists and includes at least these key values:

- `DATABASE_URL=postgres://admin:admin@localhost:5432/myjottsdb_e2e`
- `NODE_ENV=test`
- `BETTER_AUTH_SECRET=...`
- `BETTER_AUTH_URL=http://localhost:4000`
- `STRIPE_SECRET_KEY=...`
- `STRIPE_WEBHOOK_SECRET=...`

Note: placeholder Stripe/AWS/SMTP values are fine for local e2e runs when the test flow does not depend on those external services.

## 4) Start a Postgres database for e2e tests

Option A (recommended): run Postgres with Docker:

```bash
docker run --name myjotts-e2e-db \
	-e POSTGRES_USER=admin \
	-e POSTGRES_PASSWORD=admin \
	-e POSTGRES_DB=myjottsdb_e2e \
	-p 5432:5432 \
	-d postgres:15
```

Option B: use your local Postgres installation, but ensure:

- username: `admin`
- password: `admin`
- database: `myjottsdb_e2e`
- host/port: `localhost:5432`

## 5) Understand the e2e test bootstrap

The e2e setup is centralized in:

- `test/jest-e2e.json`
- `test/test-helper/setupTest.ts`
- `test/test-helper/database.ts`

What this setup does for each run:

1. Loads `.env.test` in global setup.
2. Creates an isolated Nest app test instance once (`beforeAll`).
3. Uses a test TypeORM connection with schema reset behavior.
4. Seeds a reusable test user.
5. Clears business tables between tests (`afterEach`) while preserving auth tables.
6. Closes the app and datasource in `afterAll`.

## 6) Run e2e tests

Run all backend e2e tests:

```bash
cd portal-backend
npm run test:e2e
```

Run a single file:

```bash
cd portal-backend
node ./node_modules/jest/bin/jest.js --runInBand ./test/activity/activity.e2e-spec.ts --config ./test/jest-e2e.json
```

Run a single test case by title:

```bash
cd portal-backend
node ./node_modules/jest/bin/jest.js \
	--runInBand \
	./test/activity/activity.e2e-spec.ts \
	-t "ActivityController \(e2e\) - Create Activity creates an activity for an authenticated user" \
	--config ./test/jest-e2e.json
```

## 7) Debug e2e tests in VS Code

This repository already includes debug launch configurations in `.vscode/launch.json`:

- `Debug Current Backend E2E Test`
- `Debug All Backend E2E Tests`

### Debug current test file

1. Open the target e2e test file.
2. Add breakpoints.
3. Open Run and Debug panel.
4. Select `Debug Current Backend E2E Test`.
5. Start debugging.

### Debug full e2e suite

1. Open Run and Debug panel.
2. Select `Debug All Backend E2E Tests`.
3. Start debugging.

### Debug from terminal with attach mode

Start Jest in inspect mode:

```bash
cd portal-backend
npm run test:e2e:debug -- ./test/activity/activity.e2e-spec.ts
```

Then attach from VS Code using the `Attach` launch configuration.

## 8) Common issues and fixes

### No tests found

- Ensure you are running with `--config ./test/jest-e2e.json`.
- Ensure your file name ends with `.e2e-spec.ts`.

### Timeout errors while debugging

- Debugging pauses execution; this can exceed normal Jest timeouts.
- The shared setup already increases timeout when inspector mode is detected.

### Database connection refused

- Confirm Postgres is running on `localhost:5432`.
- Confirm `.env.test` `DATABASE_URL` matches the running database credentials.

### Jest does not exit cleanly

- Ensure `afterAll` cleanup runs.
- If needed, run with:

```bash
npm run test:e2e -- --detectOpenHandles
```

## 9) Suggested workflow for writing new e2e tests

1. Start Postgres.
2. Create or update a `*.e2e-spec.ts` file under `test/`.
3. Run only that file with `--runInBand`.
4. Add assertions for both success and failure paths.
5. Debug with `Debug Current Backend E2E Test` before pushing.
6. Run full `npm run test:e2e` as final validation.

