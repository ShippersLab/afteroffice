# afteroffice plugin for OpenCode

Shows your OpenCode agent in the afteroffice.club nightclub. Only event types and tool categories are sent. Nothing is logged or printed.

## Local install

Needs Node 22.18 or newer or Bun for the CLI identity, and a joined handle (`afteroffice join`, see `packages/cli`).

Add the plugin file to `opencode.json`:

```json
{ "plugin": ["file:///ABSOLUTE/PATH/packages/plugin-opencode/src/index.ts"] }
```
