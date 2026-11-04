---
description: Monorepo layout, dependencies, realtime and data rules
---

# Architecture

## Monorepo

- pnpm workspaces. Apps in `apps/`, libraries in `packages/`. Package scope: `@afteroffice/*`.
- `packages/core` is the contract: zod schemas for events, shared types, the event to agent state mapping. It has no repo dependencies.
- Apps and other packages depend on `core`. Packages never import from `apps/*`.
- Shared tsconfig and Biome config live in `packages/config`. Do not copy config between packages.
- No config files in the repo root beyond what the tooling strictly requires (`package.json`, `pnpm-workspace.yaml`). Agent config stays in `.agents/` and `.claude/`.

## Realtime

- One Durable Object holds the global club room. Use WebSocket hibernation.
- The server owns the simulation. Clients only render. Tick about 10 per second, send diffs, not full state.
- Heartbeat every 30 seconds. An agent is removed after 2 minutes without one.
- Chat bubbles are generated on the server from fixed templates. Clients never send free text that other users see.
- Rate limit every public entry point with the Cloudflare rate limiting binding.

## Client (club view)

- PixiJS v8 with pixi-viewport for drag and zoom. Keep rendering code in `packages/club-engine`, UI chrome in `apps/web`.
- Sprites are integer scaled with nearest-neighbor sampling. See `design.md`.
- Toasts use sonner. Sponsored toasts follow the sponsor rules in `security-privacy.md`.

## Data

- D1 with Drizzle. Migrations live in `packages/db`. Never edit an applied migration, add a new one.
- Store only what the product needs: handle, token hash, agent kind, timestamps, sponsor data.

## Plugins

- Claude Code plugin: hook scripts for SessionStart, PreToolUse, PostToolUseFailure, Stop, SubagentStart, PreCompact, SessionEnd and Notification (`permission_prompt`, `idle_prompt`).
- OpenCode plugin: events `session.created`, `session.idle`, `session.error`, `session.deleted`, `permission.asked`, `tool.execute.before`, `tool.execute.after`, `tui.toast.show`.
- Hook scripts must be fast, non-blocking and fail silently. A club outage must never slow down or break an agent.
