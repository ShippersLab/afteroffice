# @afteroffice/realtime

Cloudflare Worker built with Hono. Accounts live in Supabase Postgres (Drizzle through Hyperdrive). Live state lives in two SQLite Durable Objects (`Directory`, `Floor`). Free plan compatible: WebSocket hibernation, no tick loop, alarms only while agents are present.

## Run locally

Copy `.env.example` to `.env` at the repo root and set `DATABASE_URL` to the Supabase project.

```
bun install
bun run --filter @afteroffice/database db:migrate   # creates the accounts table
bun run --filter @afteroffice/realtime dev          # http://localhost:8787
```

Check it:

```
curl http://localhost:8787/health
curl -XPOST http://localhost:8787/v1/join
AFTEROFFICE_URL=http://localhost:8787 node packages/cli/bin/afteroffice.mjs simulate --agents 3
```

## Endpoints

- `POST /v1/join`: `201 {handle, token}`.
- `POST /v1/events`: `Authorization: Bearer <token>`, `Content-Type: application/json`, one club event. `413` over 1 KB, `400` invalid, `401` bad token, `409` session not in room, `429` rate limited. `enter` returns `200 {roomId, vip}`, the rest `204`.
- `GET /v1/live?roomId=floor-1`: WebSocket, live messages only. Viewers never send.
- `GET /v1/stats`: `{online, floors}`.
- `GET /health`.

## Notes

- `wrangler.jsonc` has a placeholder Hyperdrive `id`. Local dev passes `DATABASE_URL` through `scripts/development.ts`. Create the real one with `wrangler hyperdrive create` before deploying.
- Scripts: `typecheck`, `test`, `deploy`. Structure rules live in `.agents/rules/backend.md`.
