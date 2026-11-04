---
description: Commit, branch and pull request conventions
---

# Git

## Commits

- Conventional commits in this exact shape: `feature(topic): short imperative summary`.
- Allowed types: `feature`, `fix`, `refactor`, `docs`, `chore`, `test`.
- One line only. No body, no description.
- No `Co-Authored-By` line and no other trailers.
- Keep commits small and focused. One logical change per commit.

Examples:

```
feature(club-engine): add isometric camera
fix(realtime): drop agents after missed heartbeats
docs(design): add party color tokens
```

## Branches

- `feature/<topic>`, `fix/<topic>`, `chore/<topic>`. Lowercase, kebab-case.
- Branch from `main`. Never push directly to `main` after the initial setup.

## Pull requests

- Small and reviewable. Describe what changed and why in a few lines.
- Link the issue when there is one.
- Lint, typecheck and tests must pass before requesting review.
