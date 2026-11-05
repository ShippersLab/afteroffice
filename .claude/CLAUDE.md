@../.agents/AGENTS.md

# Claude Code notes

- Project rules are in `.claude/rules/` (symlinks to `.agents/rules/`). Edit the files in `.agents/rules/`, never the symlinks.
- The design spec is `documentation/design/DESIGN.md`. Open it when you work on UI, sprites, copy or social assets. It is not imported here on purpose, to keep context small.
- Work step by step. For anything that adds a package or changes the layout, outline the step first and wait for a go.
- Do not create config files in the repo root. Put agent config under `.agents/` or `.claude/`.
- Commit messages follow `.agents/rules/git.md`: one line, `feature(topic): summary`, no body, no co-author line.
- Never use the em dash in any text you write.
