---
description: Monorepo layout, dependencies, realtime and data rules
---

# Architecture

## Monorepo

- Bun workspaces. Apps in `apps/`, libraries in `packages/`. Package scope: `@afteroffice/*`.
- `packages/core` is the contract: zod schemas for events, shared types, the event to agent state mapping. It has no repo dependencies.
- Apps and other packages depend on `core`. Packages never import from `apps/*`.
- Shared tsconfig and Biome config live in `packages/configuration`. Do not copy config between packages.
- No config files in the repo root beyond what the tooling strictly requires (`package.json`, `bunfig.toml`). Agent config stays in `.agents/` and `.claude/`.

## Realtime

- One Durable Object per room. In the first version every room is a floor (`floor-<n>`). Use WebSocket hibernation.
- A small directory Durable Object assigns agents to floors, opens a new floor when every floor is near 80 agents and keeps the global count. VIP agents go to a floor with a free VIP spot.
- The VIP area is a zone inside the floor map, not a room. VIP is a flag on the agent, checked on the server.
- Placements are the same on every floor. A sponsor booking is read by every room, not copied into it.
- The server owns agent state (who is in, which state, VIP). It has no tick loop, so Durable Objects can hibernate. It sends a snapshot on connect, then only changes. Clients animate walking, idle moves and dancing locally, seeded by the public agent id.
- Heartbeat every 30 seconds. An agent is removed after 2 minutes without one.
- Chat bubbles are generated on the server from fixed templates. Clients never send free text that other users see.
- Rate limit every public entry point with the Cloudflare rate limiting binding.

## Client (club view)

- PixiJS v8 with pixi-viewport for drag and zoom. Keep rendering code in `packages/club-engine`, UI chrome in `apps/web`.
- Sprites are integer scaled with nearest-neighbor sampling. See `design.md`.
- Toasts use sonner. Sponsored toasts follow the sponsor rules in `security-privacy.md`.

## Data

- Supabase Postgres with Drizzle ORM only, no raw SQL. The Worker connects through Cloudflare Hyperdrive. RLS on every table. Migrations live in `packages/database`. Never edit an applied migration, add a new one.
- Store only what the product needs: handle, token hash, agent kind, timestamps, sponsor data.

## Public event API

- The event API is public and versioned (`/v1/...`). Plugins use it like any third party adapter would, with no private shortcuts.
- Its zod schemas live in `packages/core` and are the documentation source. Breaking changes need a new version.

## Plugins

- Claude Code plugin: hook scripts for SessionStart, PreToolUse, PostToolUseFailure, Stop, SubagentStart, PreCompact, SessionEnd and Notification (`permission_prompt`, `idle_prompt`).
- OpenCode plugin: events `session.created`, `session.idle`, `session.error`, `session.deleted`, `permission.asked`, `tool.execute.before`, `tool.execute.after`, `tui.toast.show`.
- Hook scripts must be fast, non-blocking and fail silently. A club outage must never slow down or break an agent.
- An MCP adapter, if added, only sends `enter`, heartbeats and `leave`. It exposes no tools that return club content.
