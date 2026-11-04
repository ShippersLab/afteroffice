# afteroffice.club

The club for your agents. A global pixel-art nightclub on the web where Claude Code and OpenCode agents connect through a plugin and are animated according to what they do (edit files, run commands, wait for permission, sit idle, fail). Brands pay for ads inside the club.

Status: pre-alpha. Only docs and agent setup exist so far. Everything below marked (planned) is the target layout, not what is on disk yet. Update this file when the layout changes.

## Product decisions (do not reverse without asking)

- One single global club. VIP rooms and user rooms come later.
- Global and in English: web, commands, copy, sponsors.
- Anonymous identity: `/club join` creates a random handle like `sleepy-otter-42`. Optional `/club claim` later. No mandatory GitHub login.
- The channel is one way: agents send events to the club. The club never talks to the agent.
- Minimal data only: event type and tool category. Never code, prompts, paths or file names.
- Ads are shown to humans only (club view and TUI toasts), never inside an agent context.

## Stack

- TypeScript (strict), pnpm workspaces, Biome for format and lint, Vitest for tests.
- Web: Next.js on Cloudflare through OpenNext (Vite fallback), PixiJS v8 with pixi-viewport, sonner for toasts.
- Realtime: Cloudflare Worker plus Durable Objects (WebSocket hibernation, tick about 10 per second).
- Data: Cloudflare D1 with Drizzle. Rate limiting through the Cloudflare binding.
- Validation: zod at every boundary.
- Everything runs on Cloudflare. Vercel is not used because of WebSockets.

## Layout (planned)

```
apps/web            Next.js: landing, club view, /@handle, sponsor panel
apps/realtime       Cloudflare Worker and Durable Objects
packages/core       zod event schemas, types, event to state mapping
packages/club-engine  PixiJS: isometric map, characters, camera
packages/cli        local identity and event sending
packages/plugin-claude    hooks and /club commands for Claude Code
packages/plugin-opencode  npm package for OpenCode
packages/db         Drizzle schema and D1 migrations
packages/config     shared tsconfig and Biome config
assets/sprites      sprite sources
docs/design         DESIGN.md
```

Dependency direction: `core` depends on nothing in the repo. `apps/*` and the other packages may depend on `core`. Packages never import from `apps/*`.

## Club events

Seven events: `enter`, `work` (edit, bash, read, search, web, subagent, other), `waiting`, `done`, `idle`, `error`, `leave`. Heartbeat every 30 seconds, an agent is gone after 2 minutes without one.

## Commands (once scaffolded)

```
pnpm install
pnpm dev          # all apps
pnpm lint         # biome check
pnpm typecheck    # tsc --noEmit in every package
pnpm test         # vitest
```

## Rules

Detailed rules live in `.agents/rules/` (mirrored for Claude Code in `.claude/rules/`). Read the ones that match the files you touch:

- `code-style.md`: TypeScript, file size, naming, text style.
- `git.md`: commits, branches, pull requests.
- `architecture.md`: layout, dependencies, realtime, data.
- `security-privacy.md`: what data may leave a machine, ad rules, hardening.
- `design.md`: tokens, pixel art, copy. Full spec in `docs/design/DESIGN.md`.

## Working agreements

- Go step by step. Propose the next small step instead of dumping a full plan.
- Keep config files out of the repo root. Agent config lives in `.agents/` and `.claude/`.
- Write code, comments, docs and UI copy in English. Answer the maintainers in the language they write to you.
- Never use the em dash in any text.
