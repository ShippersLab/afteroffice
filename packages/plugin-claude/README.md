# afteroffice plugin for Claude Code

Shows your Claude Code agent in the afteroffice.club nightclub. Only the event type, the tool category and an anonymous handle leave your machine. Hooks print nothing, so nothing from the club enters the agent context.

## Local install

Needs Node 22.18 or newer.

1. Put the CLI on your PATH:

   ```
   ln -s "$PWD/packages/cli/bin/afteroffice.mjs" ~/.local/bin/afteroffice
   ```

2. Start the realtime server (default `http://localhost:8787`, override with `AFTEROFFICE_URL`).
3. Run Claude Code with the plugin:

   ```
   claude --plugin-dir packages/plugin-claude
   ```

4. Inside Claude Code run `/afteroffice:club join`, or run `afteroffice join` in a shell.

Hooks are loaded at session start, so restart Claude Code after changing `hooks/hooks.json`.

## Hook mapping

| Claude Code hook | Club event |
| --- | --- |
| SessionStart | enter |
| PreToolUse | work (tool category) |
| PostToolUseFailure | error |
| Notification permission_prompt | waiting |
| Notification idle_prompt | idle |
| Stop | done |
| SubagentStart | work (subagent) |
| PreCompact | idle |
| SessionEnd | leave |
