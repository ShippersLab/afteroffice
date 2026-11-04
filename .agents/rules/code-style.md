---
description: TypeScript style, file size and text conventions
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# Code style

- TypeScript strict. No `any`, no `@ts-ignore`. Use `unknown` and narrow it.
- Validate every external input (HTTP, WebSocket, hook payloads, env) with zod. Derive types from the schema with `z.infer`.
- Keep every file under about 300 lines. When a file grows, split the logic into smaller modules with one clear job each.
- Prefer small pure functions. Side effects live at the edges (handlers, hooks, Durable Object methods).
- Named exports only. Default exports are allowed only where Next.js requires them (pages, layouts, route files).
- Use `type` imports for types. ESM only.
- Biome is the formatter and linter. Do not add Prettier or ESLint.
- Name files in kebab-case, types in PascalCase, constants in SCREAMING_SNAKE_CASE only when truly constant.
- Comments explain why, not what. No commented-out code.
- No dead code, no unused exports, no TODO without an issue link.
- Errors: return typed results at module boundaries when failure is expected, throw only for bugs.
- Tests live next to the code as `*.test.ts`. Test the event to state mapping and the protocol schemas first.
- Never use the em dash in code, comments, docs, copy or commit messages. Use a comma, period or colon.
- User-facing text is English, sentence case, no exclamation marks, no emojis.
