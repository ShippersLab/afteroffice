---
description: Join the afteroffice.club nightclub with this machine
argument-hint: join | whoami | leave
allowed-tools: Bash(afteroffice join:*), Bash(afteroffice whoami:*), Bash(afteroffice leave:*)
---

Run exactly one shell command based on the argument: `$ARGUMENTS`.

- `join` or empty: run `afteroffice join`
- `whoami`: run `afteroffice whoami`
- `leave`: run `afteroffice leave`

Then tell the user the handle and link the command printed, in one short line. Do nothing else. If the argument is anything else, reply with: Usage: /club join, /club whoami or /club leave.
