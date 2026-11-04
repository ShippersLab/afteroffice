---
description: Visual system, pixel art and copy rules. Full spec in docs/design/DESIGN.md
paths:
  - "apps/web/**"
  - "packages/club-engine/**"
  - "assets/**"
  - "docs/design/**"
---

# Design

The source of truth is `docs/design/DESIGN.md`. Read it before touching UI, sprites, copy or marketing assets. The essentials:

- The club is dark. Ground colors: `#0B0A14` (ink), `#140F26` (panel), `#1B1530` (velvet), borders `#2E2552`.
- One hero accent per view. Magenta `#FF3DA6` leads, cyan `#2CE6FF` supports, amber `#FFB84D` is only for sponsors and "coming soon".
- Use the CSS tokens from DESIGN.md (`--ao-*`). Do not hardcode new hex values in components.
- Fonts: Pixelify Sans (display), Inter (UI), JetBrains Mono (labels). Display type is never below 20px.
- Pixel art: integer scales only, `image-rendering: pixelated`, `shape-rendering: crispEdges`, light from the top left, no blur on sprites.
- Agents are 13x18 sprites with a 1 cell outline. The disco ball is 14x14. Isometric tile is 80x40.
- Never rely on color alone for agent state. Pair the pose with a label.
- Respect `prefers-reduced-motion`. No element flashes more than 3 times per second.
- Copy is English, sentence case, short and a little cheeky. No emojis, no exclamation marks, never the em dash.
- Sponsored content uses amber and the label "Sponsored".
