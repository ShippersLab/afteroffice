---
description: Layout and behavior of plugin packages for agent harnesses
paths:
  - "packages/plugin-*/**"
  - "packages/cli/**"
  - "install.sh"
  - ".claude-plugin/**"
---

# Plugins

Applies to `packages/plugin-claude`, `packages/plugin-opencode` and any later harness (Codex and others).

## Layout

```
packages/plugin-claude/
  .claude-plugin/plugin.json   manifest read by Claude Code
  hooks/hooks.json             hook commands, they call bin/ through ${CLAUDE_PLUGIN_ROOT}
  commands/club.md             the /afteroffice:club command
  bin/afteroffice              POSIX launcher, execs the bundle with node
  dist/afteroffice.mjs         the cli bundled with bun, committed
  scripts in package.json      build regenerates dist from packages/cli
  src/__tests__/               config and artifact tests
  README.md                    install and usage

packages/plugin-opencode/
  src/index.ts                 OpenCode V2 plugin entry, default export of Plugin.define
  src/club-command.ts          the /afteroffice command logic
  src/send.ts                  the only file that does network or file IO
  dist/index.js                the plugin bundled with bun, committed, no runtime deps
  package.json                 exports point at dist, ready for npm
  src/__tests__/               tests for every file above
  README.md                    install and usage
```

- The repo root `.claude-plugin/marketplace.json` lists the Claude Code plugin, so `claude plugin marketplace add ShippersLab/afteroffice` works.
- `install.sh` at the repo root installs both plugins and links the cli.
- Depend only on `@afteroffice/core` and `packages/cli` (as dev dependencies, they are bundled into `dist`). Never import from `apps/*` or another plugin.
- One mapper per harness lives in `packages/cli`. Everything the harness gives us is `unknown` and is parsed with zod before use.
- Share identity, token storage and sending in `packages/cli`, not in each plugin.
- Rebuild `dist` with the package `build` script after any cli or plugin change and commit the result. `dist` is lint free and gitignored everywhere except the two plugin packages.

## Behavior

- Fast and non-blocking: send with a short timeout (about 1 second) and never await the club on the agent path.
- Fail silently. Catch every error at the entry point and exit 0. A club outage must never slow down or break an agent.
- Print nothing to stdout from hooks. No logs, no debug output. `SessionStart` stdout enters the agent context in Claude Code.
- Send only what `security-privacy.md` allows: event type, tool category, `sessionId`. Map tool names to a category and drop everything else (inputs, outputs, paths, prompts).
- Never read harness credentials or config. Read only the plugin's own token file.
- Receive nothing from the club into the agent. Ads and toasts are for humans only.
- No comments in code, no new dependencies without asking.
