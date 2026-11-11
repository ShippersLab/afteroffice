# afteroffice.club, roadmap

What is done and what is missing for the first version. Scope lives in `.agents/AGENTS.md` ("First version").
Keep this file short and update it when a step lands.

## Done

- Product decisions, design system, sponsor placements (`documentation/design/sponsors.md`) and VIP area (`documentation/design/vip.md`).
- Bun workspaces with oxlint, Biome (format only), strict TypeScript and Vitest in `__tests__` folders (`packages/configuration`), CI in `.github/workflows`, pinned dependencies and a 3 day release age.
- Event protocol in `packages/core`: zod schemas, floor room ids, enter response with the VIP flag, event to agent state mapping, limits, `agent-renamed` live message.
- Club engine (`packages/club-engine`): PixiJS v8 isometric floor with walls, dance floor, bar, sofa, DJ booth, door, disco ball, VIP corner, the six placements, fake agent cycling and rename handling.
- Web app (`apps/web`): landing, club view, `/@handle` page.
- Realtime (`apps/realtime`): Worker with the public `/v1` event API, join, events, handle rename (`/v1/name`), live WebSocket, stats, directory and floor Durable Objects, rate limiting.
- Identity and data (`packages/database`): Supabase Postgres with Drizzle, handles, token hashes.
- CLI (`packages/cli`): local token and handle, `join`, `name`, `whoami`, `floor`, `leave`, hooks, `simulate`, Claude Code and OpenCode event mappers.
- Plugins, installable with one command: Claude Code plugin in a git marketplace (`packages/plugin-claude` plus `.claude-plugin/marketplace.json`), OpenCode V2 plugin bundled to a dependency free `dist` (`packages/plugin-opencode`), and `install.sh` at the repo root for both at once.

## Next, in order

1. **Sponsors by hand**. Logo pixelation script, sponsor config read by every floor, placement views and clicks in aggregate.
2. **VIP pass**. Payment link, grant the pass to a handle after payment, VIP agents placed in the VIP area.
3. **Launch**. Domain, deploy on Cloudflare, flip the plugin default `AFTEROFFICE_URL` to the deployed club, social assets from `DESIGN.md` section 11.

## Open decisions

- Who pays for the VIP pass and how the checkout works (a landing, possibly agentic).
- Prices for placements and the VIP pass.
- Defaults to confirm: 12 VIP spots per floor, 30 day VIP pass, sponsor week starts Monday 00:00 UTC, a new agent shows up at the bar, any non bash work is dancing.

## Later

Separate VIP rooms, team rooms, takeovers, nightly and regional slots, sponsored toasts, self serve sponsor panel, MCP presence adapter, more agents (Cursor, Codex, Gemini CLI), publishing the OpenCode plugin to npm.
