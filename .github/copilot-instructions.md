# MyJotts Codebase Guide

## Architecture Overview

**Full-stack monorepo** with three main services orchestrated via Docker Compose:

- **Frontend**: React 18 + Vite + TypeScript (Material-UI + Tailwind CSS)
- **Backend**: NestJS + TypeScript (REST API on port 4000)
- **Database**: PostgreSQL 15 (managed via TypeORM migrations)
- **Reverse Proxy**: Traefik v2.10 (handles SSL/TLS with Let's Encrypt)

### Service Communication

- Frontend → Backend: REST API calls via `ApiHandler` in `frontend/src/app/api-service/ApiRequestManager.ts`
- Backend uses **Better Auth** (not traditional JWT) for authentication - session cookies managed automatically
- API routes prefixed with `/api/v1` except auth routes at `/api/auth`
- CORS configured in `portal-backend/src/main.ts` - production allows `https://myjotts.com`, dev allows `http://localhost:5173`

## Critical Developer Workflows

### Local Development Setup

```bash
# Start all services in dev mode
task dev:start  # Uses docker-compose.dev.yml

# Backend only (local dev without Docker)
cd portal-backend
task start-dev  # npm run start:dev with nodemon hot-reload

# Frontend only
cd frontend
npm run dev  # Vite dev server on port 5173
```

### Database Migrations (TypeORM)

```bash
cd portal-backend

# Generate migration from entity changes
task db:migration:generate -- migration-name

# Create empty migration
task db:migration:create -- migration-name

# Run pending migrations
task db:migration:up
```

**Migration location**: `portal-backend/sql/db_migrations/`  
**Data source config**: `portal-backend/sql/data-source.ts` (uses `DATABASE_URL` env var)

### Production Deployment

```bash
# Build and start production containers
task prod:start  # Uses docker-compose.prod.yml with Traefik for SSL
```

## Authentication Pattern (Better Auth)

**Not using traditional JWT** - uses Better Auth library with session-based auth:

### Backend Setup

- Auth configuration: `portal-backend/auth.ts` (exports `auth` instance)
- Uses `@hedystia/better-auth-typeorm` adapter with TypeORM
- Email verification required on signup
- Password reset via email templates in `portal-backend/src/html-templates/`
- Role-based access control: `admin`, `user`, `customUser` (defined in `portal-backend/src/permissions/permissions.ts`)

### Frontend Integration

- Better Auth client: `frontend/src/app/libs/betterAuthClient.ts`
- Context provider: `frontend/src/app/webapp/utils/contexts/BetterAuthContext.tsx`
- Session management: `authClient.useSession()` hook
- **Do NOT manually manage JWT tokens** - Better Auth handles session cookies

### Auth Guards

- `@thallesp/nestjs-better-auth` decorators: `@AllowAnonymous` for public endpoints
- Custom guards: `portal-backend/src/auth/guards/auth.guard.ts` and `roles.guard.ts`
- User object attached to request as `req['user']` by Better Auth middleware

## Project-Specific Patterns

### Entity Conventions (TypeORM)

- **Snake_case** for database column names: `activity_title`, `category_id`
- **PascalCase** for entity class names: `Activity`, `Category`, `User`
- Use `@Expose()` with DTO names for API responses (e.g., `@Expose({ name: 'activityTitle' })`)
- Better Auth entities (User, Account, Session, Verification) live in `portal-backend/src/users/entities/`

### API Request Pattern (Frontend)

- Centralized API client: `ApiHandler` class in `frontend/src/app/api-service/ApiRequestManager.ts`
- Endpoints defined in `frontend/src/app/api-service/EndPoints.ts`
- DTOs mirrored between frontend and backend (e.g., `CategoryResponseDto`)
- Error handling: Check with `isApiError(error)` helper function
- **File uploads**: Use `FormData` with `createActivityFormData()` pattern (see `ApiHandler.createActivity`)

### Environment Configuration

**Frontend** (runtime injection for Docker):

- `frontend/generate-env-config.js` generates `env.js` at build time
- Access via `window.env` in production, `import.meta.env` in development
- Config wrapper: `frontend/src/config/env.ts`

**Backend**:

- Uses `@nestjs/config` with `portal-backend/src/envvars.ts`
- Database connection via `DATABASE_URL` (PostgreSQL connection string)
- Better Auth requires: `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`
- Email (nodemailer): `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

### Testing

- Frontend: Vitest + React Testing Library (`npm run test` or `npm run test:ui`)
- Backend: Jest (`npm run test`, `npm run test:e2e`)
- Test files colocated in `__tests__/` directories

## Key Integration Points

### Stripe Subscription

- Backend plugin: `@better-auth/stripe` in `portal-backend/auth.ts`
- Frontend: `@stripe/react-stripe-js` integration in `frontend/src/app/webapp/components/Subscription/`
- Webhook handling at `/api/auth/stripe/webhook`
- Payment plans: `portal-backend/src/subscription/entities/payment-plan.entity.ts`

### Image Upload (AWS S3)

- Backend service: `portal-backend/src/image/` and `portal-backend/src/upload/`
- AWS SDK v3: `@aws-sdk/client-s3`
- Activities can have multiple images via `OneToMany` relation with `ImageFile` entity
- Frontend compression: `browser-image-compression` before upload

### Email System

- Transporter config: `portal-backend/src/utils/services/transporter.ts` (nodemailer)
- Handlebars templates: `portal-backend/src/html-templates/`
- Template loader: `portal-backend/src/utils/services/load-template-config.ts`

## Docker & Task Commands

### Taskfile.yml (root)

- `task dev:build` / `task dev:start` / `task dev:stop` - Development environment
- `task prod:build` / `task prod:start` / `task prod:stop` - Production with Traefik
- `task clean` - Prune Docker resources
- `task logs` - View backend logs

### Docker Compose Files

- `docker-compose.dev.yml` - Hot-reload for both frontend/backend
- `docker-compose.prod.yml` - Production with Traefik SSL
- `docker-compose.yml` - Base production config (Traefik + services)

### Traefik Configuration

- Static config: `traefik/traefik.yml`
- Labels in docker-compose define routing rules
- Let's Encrypt certs stored in `traefik/acme.json` (must have 600 permissions)
- Dashboard accessible when `api.dashboard=true`

## Common Pitfalls

1. **Database connection in Docker**: Service name is `database` in production, `db` in local `.env` files
2. **Migrations**: Always run `task db:migration:generate` after entity changes, never modify entities directly in production
3. **Better Auth session**: Don't try to manually decode/verify tokens - use `authClient.useSession()` hook
4. **CORS**: Update allowed origins in `portal-backend/src/main.ts` for new domains
5. **Environment variables**: Frontend requires rebuild to update env vars (injected at runtime via `env.js`)
