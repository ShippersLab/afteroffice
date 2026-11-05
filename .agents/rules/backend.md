---
description: Backend structure, Drizzle only data access, Supabase and Cloudflare free plan limits
paths:
  - "apps/realtime/**"
  - "packages/database/**"
---

# Backend

## Structure of apps/realtime/src

```
worker.config.ts   entry: default export of the Hono app plus the Durable Object classes
app.ts             Hono app composition
routes/            route definitions only (middleware chain and validators)
controllers/       request handling, one file per route
services/          accounts, floors, bubbles, handles, tokens, account cache
durable-objects/   directory/ and floor/ (class, storage, broadcast)
middleware/        auth, database, rate-limit, security, error-handler
validators/        zod schemas for headers and queries that are not in core
db/                per request Drizzle client for the Worker
config/            env typing and constants
utils/             random and http helpers
__tests__/         mirrors the folders above
```

- No flat files in `src/`. Every file belongs to one of these folders.
- Validate every input with `@hono/zod-validator` or a zod schema. Event and live schemas come from `packages/core`.
- Bindings and context variables are typed in `config/env.ts` (`AppEnv`).

## Drizzle only, no raw SQL

- Postgres access goes through Drizzle (`packages/database`). No SQL strings in app code, no `sql` template for plain queries.
- Durable Objects keep live state through `ctx.storage.kv` with zod parsed values. No `storage.sql.exec`.
- Schema changes: edit `packages/database/src/schema.ts`, run `db:generate`, commit the new migration. Never edit an applied migration.
- Every table enables RLS (`.enableRLS()`) and has no public policy. The anon key must never read accounts.

## Supabase

- One hosted Supabase project, no local Supabase. `DATABASE_URL` in the root `.env` points at it (session pooler on port 5432 or the direct connection, never the transaction pooler).
- `db:generate` after editing the schema, then `db:migrate` applies migrations. Both read `DATABASE_URL` through `@afteroffice/environment/server`.

## Hyperdrive

- The Worker connects with postgres.js through the `HYPERDRIVE` binding and `nodejs_compat`.
- Local dev: `bun run dev` in `apps/realtime` runs `scripts/development.ts`, which validates the environment and passes `DATABASE_URL` to wrangler as `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE`. Replace the placeholder Hyperdrive `id` with the real one before deploy.
- Create the client per request (`middleware/database.ts`) and close it with `waitUntil`. Never keep a client across requests.
- Token hash to handle lookups are cached in the isolate for 60 seconds.

## Cloudflare free plan

- Durable Objects must be SQLite backed (`new_sqlite_classes`).
- WebSocket hibernation. No tick loop. Alarms only for the timeout sweep, and only while agents are present.
- Keep requests light: 10 ms CPU per request on the free plan, 50 subrequests, 100 000 Worker requests per day.
- Hyperdrive is free, but count every query. Avoid a database call on the hot path (events) when the cache can answer.
- Rate limits use the ratelimit bindings, never a Durable Object.
