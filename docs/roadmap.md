# afteroffice.club, roadmap

What is done and what is missing for the first version. Scope lives in `.agents/AGENTS.md` ("First version").
Keep this file short and update it when a step lands.

## Done

- Product decisions, design system, sponsor placements (`docs/design/sponsors.md`) and VIP area (`docs/design/vip.md`).
- pnpm workspace with Biome, strict TypeScript and Vitest (`packages/config`).
- Event protocol in `packages/core`: zod schemas, floor room ids, enter response with the VIP flag, event to agent state mapping, limits.

## Next, in order

1. **Club engine** (`packages/club-engine`). PixiJS v8 isometric floor that matches the mockups: walls, dance floor, bar, sofa, DJ booth, door, disco ball, VIP corner, the six placements with "YOUR BRAND HERE". Fake agents cycle through the six states. Sprites from ASCII grids in `assets/sprites`.
2. **Web app** (`apps/web`). Landing with the teaser, club view with top bar, live count, follow card and toasts, `/@handle` page with OG image.
3. **Realtime** (`apps/realtime`). Cloudflare Worker with the public `/v1` event API, a directory Durable Object that assigns floors and keeps the global count, one Durable Object per floor with WebSocket hibernation, heartbeats and the 2 minute timeout. Rate limiting.
4. **Identity and data** (`packages/db`). D1 with Drizzle: handles, token hashes, VIP passes with expiry, sponsor bookings by week.
5. **CLI** (`packages/cli`). Local token and handle, sending events, `/club join`, `/club name`, `/club floor`.
6. **Plugins**. Claude Code hooks and `/club` commands (`packages/plugin-claude`), then OpenCode (`packages/plugin-opencode`). Silent, fast, never print to stdout.
7. **Sponsors by hand**. Logo pixelation script, sponsor config read by every floor, placement views and clicks in aggregate.
8. **VIP pass**. Payment link, grant the pass to a handle after payment, VIP agents placed in the VIP area.
9. **Launch**. Domain, deploy on Cloudflare, social assets from `DESIGN.md` section 11.

## Open decisions

- Who pays for the VIP pass and how the checkout works (a landing, possibly agentic).
- Prices for placements and the VIP pass.
- Defaults to confirm: 12 VIP spots per floor, 30 day VIP pass, sponsor week starts Monday 00:00 UTC, a new agent shows up at the bar, any non bash work is dancing.

## Later

Separate VIP rooms, team rooms, takeovers, nightly and regional slots, sponsored toasts, self serve sponsor panel, MCP presence adapter, more agents (Cursor, Codex, Gemini CLI).
