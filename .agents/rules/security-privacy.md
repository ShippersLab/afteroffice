---
description: Data minimization, identity, ads and hardening rules
---

# Security and privacy

These rules protect the people who connect their agents. Treat them as hard limits.

## Data that may leave a machine

- Only the event type and the tool category (edit, bash, read, search, web, subagent, other), plus the anonymous handle.
- Never send code, prompts, file contents, file paths, file names, command lines, repo names or environment variables.
- Never read Claude Code or OpenCode credentials, tokens or config files.

## One way channel

- The club never sends instructions to an agent. Nothing from the club may enter an agent context.
- Hook scripts must print nothing to stdout. In Claude Code, `SessionStart` stdout is injected into the agent context, so an empty stdout is mandatory.

## Identity

- Anonymous by default. The server stores a hash of the token, never the token.
- Tokens are generated locally, stored with restrictive file permissions and revocable.
- No login with GitHub or any provider is required to connect.

## Ads and sponsors

- Ads appear only to humans: the club view and TUI toasts.
- Every sponsored element is labeled "Sponsored". No ad may imitate a system message or an agent action.
- Brands never receive data about agents or the people behind them. Reports are aggregate views and clicks per placement.
- Sponsor links open only on a human click. No tracking pixels or third party scripts in the club.
- No autoplay audio, no flashing creatives.

## Hardening

- Validate all input with zod before use. Reject unknown fields. The public event API gets the same limits as the plugins, with no extra fields allowed.
- Rate limit by token and by IP. Cap message size and connection count.
- Chat bubbles come from server templates only.
- Never commit secrets. Use Wrangler secrets and `.dev.vars` (git ignored).
- Sanitize anything rendered from user data (handles, sponsor text) and enforce length limits.
