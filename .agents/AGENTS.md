# afteroffice.club

The club for your agents. A global pixel-art nightclub on the web where Claude Code and OpenCode agents connect through a plugin and are animated according to what they do (edit files, run commands, wait for permission, sit idle, fail). Two separate paid products: brands pay for placements inside the club (disco ball, billboards, neon, bar), and users pay to put their agent in the VIP area.

Status: pre-alpha. Only docs and agent setup exist so far. Everything below marked (planned) is the target layout, not what is on disk yet. Update this file when the layout changes.

## Product decisions (do not reverse without asking)

- Ship a simple first version fast. Scope is in "First version" below. Anything outside it waits.
- One single global club, split into floors. A floor holds about 80 agents and new floors open on their own. The web shows a global live count.
- Every event carries a `roomId` from day one. In the first version every room is a floor.
- Every floor has a VIP area: a roped corner of the same floor, not a separate room. Agents with a VIP pass hang out there.
- Brand placements and VIP passes are separate products, bought separately.
- Global and in English: web, commands, copy, sponsors.
- Anonymous identity: `/club join` creates a random handle like `sleepy-otter-42`. Optional `/club claim` later. No mandatory GitHub login.
- Agents connect through plugins (Claude Code and OpenCode first) that call a public, documented event API. Anyone may build an adapter on that API. An MCP adapter may come later and only reports presence.
- The channel is one way: agents send events to the club. The club never talks to the agent.
- Brand logos are always pixelated to the club palette. Placements live in `docs/design/sponsors.md`.
- Minimal data only: event type and tool category. Never code, prompts, paths or file names.
- Ads are shown to humans only (club view and TUI toasts), never inside an agent context.

## First version

In:

- Claude Code and OpenCode plugins send events to the public API. Agents show up and animate on a floor.
- Floors open on their own when a floor is full. The server picks a random floor with free space.
- Brand placements are the same on every floor. Sold by week, set up by hand.
- A VIP area on every floor. A VIP agent goes to a floor with a free VIP spot. The pass is bought through a payment link and granted to the handle.

Out, for later: VIP rooms as separate rooms, team rooms, takeovers, regional slots, sponsored toasts, self serve sponsor panel, MCP adapter.

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
apps/realtime       Cloudflare Worker: public event API and one Durable Object per room
packages/core       zod event schemas, types, event to state mapping, room ids
packages/club-engine  PixiJS: isometric map, characters, camera
packages/cli        local identity and event sending
packages/plugin-claude    hooks and /club commands for Claude Code
packages/plugin-opencode  npm package for OpenCode
packages/db         Drizzle schema and D1 migrations
packages/config     shared tsconfig and Biome config
assets/sprites      sprite sources
docs/design         DESIGN.md, sponsors.md, vip.md
```

Dependency direction: `core` depends on nothing in the repo. `apps/*` and the other packages may depend on `core`. Packages never import from `apps/*`.

## Club events

Seven events: `enter`, `work` (edit, bash, read, search, web, subagent, other), `waiting`, `done`, `idle`, `error`, `leave`. Heartbeat every 30 seconds, an agent is gone after 2 minutes without one.

Agents do not pick a floor. The server assigns a random floor with free space on `enter` and returns its `roomId` to the plugin, which keeps it out of the agent context. An agent with a VIP pass gets a floor with a free VIP spot and stands in the VIP area.

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
- `design.md`: tokens, pixel art, copy. Full spec in `docs/design/DESIGN.md`, sponsors in `docs/design/sponsors.md`.

## Working agreements

- Go step by step. Propose the next small step instead of dumping a full plan.
- Keep config files out of the repo root. Agent config lives in `.agents/` and `.claude/`.
- Write code, comments, docs and UI copy in English. Answer the maintainers in the language they write to you.
- Never use the em dash in any text.
