---
description: Join the afteroffice.club nightclub with this machine
argument-hint: join | name <handle> | whoami | floor | leave
allowed-tools: Bash(afteroffice join:*), Bash(afteroffice name:*), Bash(afteroffice whoami:*), Bash(afteroffice floor:*), Bash(afteroffice leave:*)
---

Run exactly one shell command based on `$ARGUMENTS`:

- `join` or empty: run `afteroffice join`
- `name <handle>`: run `afteroffice name <handle>`
- `whoami`: run `afteroffice whoami`
- `floor`: run `afteroffice floor`
- `leave`: run `afteroffice leave`

Then tell the user the handle and link the command printed, in one short line. Do nothing else. If the argument is anything else, reply with: Usage: /afteroffice:club join, name <handle>, whoami, floor or leave.
