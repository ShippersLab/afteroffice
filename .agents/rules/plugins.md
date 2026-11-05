---
description: Layout and behavior of plugin packages for agent harnesses
paths:
  - "packages/plugin-*/**"
  - "packages/cli/**"
---

# Plugins

Applies to `packages/plugin-claude`, `packages/plugin-opencode` and any later harness (Codex and others).

## Layout

```
packages/plugin-<harness>/
  src/
    index.ts        entry, wires the harness events to the mapper
    map-event.ts    harness payload to a core event, pure
    send.ts         the only file that does network or file IO
    __tests__/      tests for every file above
  <harness files>   manifest, hooks config, /club command files, as the harness requires
  package.json
  tsconfig.json     extends @afteroffice/configuration/tsconfig.base.json
```

- Depend only on `@afteroffice/core` and `packages/cli`. Never import from `apps/*` or another plugin.
- One mapper per harness. Everything the harness gives us is `unknown` and is parsed with zod before use.
- Share identity, token storage and sending in `packages/cli`, not in each plugin.

## Behavior

- Fast and non-blocking: send with a short timeout (about 1 second) and never await the club on the agent path.
- Fail silently. Catch every error at the entry point and exit 0. A club outage must never slow down or break an agent.
- Print nothing to stdout. No logs, no debug output. `SessionStart` stdout enters the agent context in Claude Code.
- Send only what `security-privacy.md` allows: event type, tool category, `sessionId`. Map tool names to a category and drop everything else (inputs, outputs, paths, prompts).
- Never read harness credentials or config. Read only the plugin's own token file.
- Receive nothing from the club into the agent. Ads and toasts are for humans only.
- No comments in code, no new dependencies without asking.
