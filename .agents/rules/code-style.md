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
- Named exports only. Default exports are allowed only where a tool requires them (for example `vite.config.ts`).
- Use `type` imports for types. ESM only.
- oxlint is the linter and Biome is the formatter only (Biome linter is off so they never overlap). Config lives in `packages/configuration`. Do not add Prettier or ESLint.
- Name files in kebab-case, types in PascalCase, constants in SCREAMING_SNAKE_CASE only when truly constant.
- No comments in code. Names and small functions carry the meaning. Lint blocks inline and TODO style comments. Put the why in the commit or in `documentation/`.
- No `eval`, `new Function`, `console`, non-null assertions (`!`), or `@ts-*` directives.
- Pin every dependency to an exact version. No `^` or `~`.
- No dead code, no unused exports, no TODO without an issue link.
- Errors: return typed results at module boundaries when failure is expected, throw only for bugs.
- Tests live in a `__tests__` folder next to the source, named `*.test.ts` or `*.test.tsx`. Vitest only picks up `src/**/__tests__/**/*.test.ts`. Test the event to state mapping and the protocol schemas first.
- Never use the em dash in code, comments, docs, copy or commit messages. Use a comma, period or colon.
- User-facing text is English, sentence case, no exclamation marks, no emojis.

## Folder structure

- Every package and app organizes `src/` in purpose-named subfolders, for example `commands/`, `services/`, `utilities/`, `components/sections/`.
- A folder holds one concern. When a folder has more than about 6 files, split it.
- No flat `src/` with many files. Only the barrel and the entry point sit at the root of `src/`.
- One `index.ts` barrel per package is the only public API.
- Folder names are full words: `utilities/`, `database/`, `configuration/`, `library/`, `environment/`, never `utils/`, `db/`, `config/`, `lib/`, `env/`. Common acronyms (`seo/`, `ui/`) are fine.
- Tests live in `__tests__` and mirror the source folders.
