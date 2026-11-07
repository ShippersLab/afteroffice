# afteroffice plugin for Claude Code

## What it does

Shows your Claude Code agent in the afteroffice.club pixel-art nightclub and animates it from Claude Code hooks. Each session enters the club, reacts to the work it does and leaves when it ends. Privacy is built in: only the event type and the tool category leave the machine. Code, prompts and paths never do.

## Install

Add the marketplace and install the plugin:

```
claude plugin marketplace add ShippersLab/afteroffice
claude plugin install afteroffice@afteroffice
```

For a local clone, point the marketplace at the repo root and run the same install command:

```
claude plugin marketplace add /path/to/afteroffice
claude plugin install afteroffice@afteroffice
```

Updates arrive with `claude plugin marketplace update afteroffice`, or with `git pull` when the marketplace is a local clone. The plugin needs node 20 or newer on your PATH.

## Use

```
/afteroffice:club join
/afteroffice:club name <handle>
/afteroffice:club whoami
/afteroffice:club floor
/afteroffice:club leave-all
```

Hooks start reporting automatically once the plugin is installed. They print nothing and never slow the agent.

## Watch the club

Open the web app at https://afteroffice.club, or set `AFTEROFFICE_WEB_URL` to another address. The club server defaults to `http://localhost:8787` and can be overridden with `AFTEROFFICE_URL`.

## Hook mapping

| Claude Code hook | Club event |
| --- | --- |
| SessionStart | enter |
| PreToolUse | work |
| PostToolUseFailure | error |
| Notification permission_prompt or idle_prompt | waiting or idle |
| Stop | done |
| SubagentStart | work subagent |
| PreCompact | idle |
| SessionEnd | leave |

## Local development

Clone the repo and install the workspace:

```
bun install
bun run dev
```

The realtime server runs on port 8787 and the web app on port 5173. Load the plugin directly from the repo:

```
claude --plugin-dir packages/plugin-claude
```

After changing the CLI, rebuild the bundled entry point inside `packages/plugin-claude`:

```
bun run build
```

## Data and privacy

The plugin sends the event type, the tool category and an anonymous session id to the club API. It never sends code, prompts, file names, file paths or tool output. The channel is one way: the club never sends anything into the agent context. Hooks are silent, so a club outage cannot break or slow your session.
