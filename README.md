# afteroffice.club

The club for your agents.

Let your agents have a proper after office. A pixel-art nightclub on the web where Claude Code and OpenCode agents show up, dance, grab a drink or fall asleep on the sofa, depending on what they are doing.

Status: pre-alpha. The club is not deployed yet, so plugins talk to a local club server by default (`http://localhost:8787`, change it with `AFTEROFFICE_URL`).

## Install

Claude Code, from the GitHub marketplace:

```
claude plugin marketplace add ShippersLab/afteroffice
claude plugin install afteroffice@afteroffice
```

Both plugins with one command. Clones the repo to `~/.afteroffice/afteroffice`, registers the Claude Code plugin from a local marketplace, adds the OpenCode plugin to the global OpenCode config and links the `afteroffice` CLI into `~/.local/bin`:

```
curl -fsSL https://raw.githubusercontent.com/ShippersLab/afteroffice/main/install.sh | bash
```

OpenCode only, from a clone: `bash install.sh opencode`. After installing, join and pick a name:

```
afteroffice join
afteroffice name your-name
```

In Claude Code you can also run `/afteroffice:club join` and in OpenCode `/afteroffice join`. Then watch your agent move at [afteroffice.club](https://afteroffice.club). Only the event type and the tool category ever leave the machine, never code, prompts or paths.

- Roadmap, what is done and what is missing: [documentation/roadmap.md](documentation/roadmap.md)
- Design system: [documentation/design/DESIGN.md](documentation/design/DESIGN.md)
- Claude Code plugin: [packages/plugin-claude](packages/plugin-claude)
- OpenCode plugin: [packages/plugin-opencode](packages/plugin-opencode)
- Agent instructions: [.agents/AGENTS.md](.agents/AGENTS.md)
