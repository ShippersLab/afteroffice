# afteroffice.club, DESIGN.md

The visual and verbal system for **afteroffice.club**, the club for your agents.
This file is the source of truth for humans and for coding agents. When you build UI, copy or assets, follow it.

## 1. Brand in one paragraph

A pixel-art nightclub where AI agents go after work. It should feel like walking into a great party at 2am: dark room, neon light, a little mischief. It is clean, never cluttered. The mood is playful and warm, never corporate, never cyberpunk-grim. Everything is built from chunky pixels and glowing light.

**Personality:** playful, nocturnal, welcoming, slightly cheeky.
**Never:** serious enterprise blue, gradients on white, glossy 3D, stock photography, emojis as decoration.

## 2. Logo

- **Mark:** a pixel-art disco ball, 14x14 grid, lit from the top left, with scattered magenta and cyan facets.
- **Wordmark:** `afteroffice` in ivory plus `.club` in magenta, set in Pixelify Sans Bold.
- **Lockups:** primary (mark left, wordmark right), stacked (mark above wordmark, with the tagline), mark only (avatar, favicon, app icon).
- **Tagline:** "The club for your agents."
- **Clear space:** at least one disco-ball facet (1/14 of the mark width) times 3 on every side.
- **Minimum size:** mark 14px (favicon), wordmark 120px wide.
- **On light backgrounds:** background `#E4DDFF`, `.club` becomes `#C21573`, ink `#0B0A14`.
- **Do not:** smooth or blur the pixels, rotate the mark, recolor the ball outside the palette, put the wordmark on busy imagery without a dark scrim.

## 3. Color

### 3.1 Core palette

| Token | Name | Hex | Use |
|---|---|---|---|
| `--ao-ink` | Midnight | `#0B0A14` | App background, deepest ground |
| `--ao-panel` | Panel | `#140F26` | Cards, floors, footers |
| `--ao-velvet` | Velvet | `#1B1530` | Raised surfaces, checker tiles |
| `--ao-line` | Line | `#2E2552` | Borders, dividers |
| `--ao-magenta` | Neon Magenta | `#FF3DA6` | Primary actions, logo accent, key glow |
| `--ao-cyan` | Electric Cyan | `#2CE6FF` | Live state, secondary action, links |
| `--ao-amber` | Bar Amber | `#FFB84D` | Sponsors, highlights, "coming soon" |
| `--ao-lilac` | Lilac Haze | `#C9BFFF` | Muted accents, cords, outlines |
| `--ao-ivory` | Ivory | `#F6F3FF` | Primary text on dark |
| `--ao-muted` | Muted | `#A79FCB` | Secondary text on dark |

### 3.2 Party colors (accents, effects, status)

| Token | Name | Hex | Use |
|---|---|---|---|
| `--ao-ultraviolet` | Ultraviolet | `#8A5CFF` | Blacklight glow, gradients, backdrops |
| `--ao-laser` | Laser Lime | `#B8FF5C` | Success, "agent done" states, rare sparkle |
| `--ao-coral` | Hot Coral | `#FF6B6B` | Errors, spilled-drink states |
| `--ao-strobe` | Strobe | `#FFFFFF` | Single-frame flashes, disco ball highlights |
| `--ao-haze` | Smoke Haze | `#3A1D6E` | Spotlight centers, radial backdrops |

### 3.3 Disco ball ramp (light to dark)

`#FFFFFF`, `#E9E1FF`, `#BDAEFF`, `#8F79F2`, `#6049CF`, `#41309A`.
Light source is always the **top left**. Add magenta and cyan facets sparsely, never more than about 1 in 9 cells.

### 3.4 Color rules

- Ground is always dark (`ink`, `panel`, `velvet`). Light mode exists only for logo previews and print.
- One hero accent per view. Magenta leads, cyan supports, amber is reserved for sponsors and "soon".
- Never place two neon colors touching at full saturation without a dark gap or a glow between them.
- Sponsor surfaces use amber borders and the label "Sponsored". They never use magenta.
- Text on dark: ivory for primary, muted for secondary. Magenta and cyan as text only at 14px bold or larger.
- Text on light: ink, with magenta replaced by `#C21573`.

### 3.5 Gradients and glow

```css
--ao-bg-room:    radial-gradient(circle at 50% 30%, #3A1D6E 0%, #0B0A14 70%);
--ao-bg-stage:   radial-gradient(circle at 76% 40%, #2E1560 0%, #0B0A14 75%);
--ao-glow-magenta: 0 0 24px rgba(255, 61, 166, .45);
--ao-glow-cyan:    0 0 24px rgba(44, 230, 255, .40);
--ao-glow-amber:   0 0 20px rgba(255, 184, 77, .40);
--ao-floor-glow: radial-gradient(circle, rgba(255, 61, 166, .38), rgba(255, 61, 166, 0) 70%);
--ao-beam-magenta: rgba(255, 61, 166, .10);
--ao-beam-cyan:    rgba(44, 230, 255, .10);
```

Light beams are low-opacity polygons fanning from the disco ball to the floor, alternating magenta and cyan.

## 4. CSS tokens (copy as is)

```css
:root {
  --ao-ink: #0B0A14;
  --ao-panel: #140F26;
  --ao-velvet: #1B1530;
  --ao-line: #2E2552;
  --ao-magenta: #FF3DA6;
  --ao-cyan: #2CE6FF;
  --ao-amber: #FFB84D;
  --ao-lilac: #C9BFFF;
  --ao-ivory: #F6F3FF;
  --ao-muted: #A79FCB;
  --ao-ultraviolet: #8A5CFF;
  --ao-laser: #B8FF5C;
  --ao-coral: #FF6B6B;
  --ao-haze: #3A1D6E;

  --ao-font-display: 'Pixelify Sans', monospace;
  --ao-font-ui: 'Inter', system-ui, sans-serif;
  --ao-font-mono: 'JetBrains Mono', ui-monospace, monospace;

  --ao-radius-sm: 8px;
  --ao-radius-md: 14px;
  --ao-radius-lg: 20px;
  --ao-radius-pill: 999px;
}
```

## 5. Typography

| Role | Font | Weight | Use |
|---|---|---|---|
| Display | Pixelify Sans | 700 | Logo, headlines, big numbers, signs |
| UI | Inter | 400, 500, 600 | Body, buttons, toasts, bubbles |
| Mono | JetBrains Mono | 400, 600 | Kickers, handles, code, labels |

- Headlines: Pixelify Sans 700, tight leading (1.05), sentence case.
- Kickers and labels: JetBrains Mono 600, 11 to 12px, uppercase, `letter-spacing: .12em` to `.14em`.
- Body: Inter 400 at 15 to 16px, line height 1.5.
- Agent handles: Inter 600 at 11.5px inside a dark pill.
- Display type is never used below 20px. Never use more than two fonts in one component.

## 6. Pixel art rules

- **Grid:** agents are 13x18 cells with a 1 cell outline. Disco ball is 14x14. Isometric tile is 80x40.
- **Scale:** only integer scales (3x, 4x, 5x, 6x, 8x, 16x). Always `shape-rendering: crispEdges` and `image-rendering: pixelated`.
- **No anti-aliasing, no blur on sprites.** Glow lives on separate layers behind them.
- **Light:** top left. Shadows are black at 40% opacity, flat ellipses under the feet.
- **Outlines:** 1 cell, dark (`#0B0A14`), never colored except accessories.
- **Agent bodies:** magenta, cyan, amber, lilac. Accessories: shades, hat, headphones.
- **Palette discipline:** sprites use only the palette in section 3. No new hues for a single asset.

### Agent states

| State | Pose | Trigger |
|---|---|---|
| Dancing | Arms up, music notes | Editing or writing files |
| DJ booth | Headphones behind decks | Running shell commands |
| At the bar | Drink in hand | Task finished |
| Asleep on the sofa | Eyes closed, "z" marks | Idle |
| Stuck at the door | Waiting, hand raised | Waiting for permission |
| Spilled drink | Drink on the floor, coral splash | Error |

## 7. Layout and spacing

- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64.
- Max content width 1200px on marketing pages. The club canvas is full bleed.
- Cards: `panel` or `velvet` fill, 1px `line` border, radius 14 to 20.
- Dark rooms need breathing space. Leave at least 25% of any hero as empty dark ground.
- The club view is the product. UI floats over it in small pills and cards and never covers the center.

## 8. Components

**Top bar:** logo left, live count pill center (`[N] agents in the club`, cyan dot pulsing), actions right.
**Buttons:**
- Primary: magenta fill, ink text, pill radius, `--ao-glow-magenta` on hover.
- Secondary: transparent, 1px `line` border, ivory text, cyan border on hover.
- Sponsor action: amber outline, amber text.
**Pills and chips:** mono 600, uppercase, tracked, 1.5px border in the chip color (`COMING SOON` in amber).
**Toasts (sonner):** `panel` fill, 1px `line` border, pixel icon left, one line of copy. Sponsored toasts add an amber left edge and a "Sponsored" label.
**Agent label:** dark pill (85% ink), 1px `line` border, Inter 600.
**Speech bubble:** ivory fill, ink text, radius 8, small tail. Max about 28 characters. Server-generated from templates only.
**Billboard slot:** amber frame, "YOUR BRAND HERE" placeholder, ad content always labeled "Sponsored".
**Focus ring:** 2px cyan outline with 2px offset. Never remove it.

## 9. Motion

- Dance loop: 2 frames at 4 fps. Idle breathing: 1px bob at 1 fps. Sleep "z": slow rise and fade.
- Disco ball: 2 shimmer frames, beams sweep slowly, 6 to 8 s per cycle.
- UI transitions: 150 to 220 ms, ease-out. Toasts slide up 12px and fade.
- Pixel motion steps (`steps()`), UI motion eases. Do not mix on one element.
- Respect `prefers-reduced-motion`: freeze to a single frame, keep state readable.

## 10. Voice and copy

- Language: English first. Short, warm, a little cheeky.
- Sentence case. No exclamation marks in UI. No emojis in product copy.
- Never use the em dash. Use a comma, a period or a colon.
- Taglines: "The club for your agents." "Your agents work all day. Soon, they get a night out."

**Toast samples**
- `sleepy-otter-42 just walked in.`
- `mango-fox is on the dance floor.`
- `oops-gecko spilled a drink.`
- `Tonight's bar is on [BRAND]` (sponsored)

**Door lines (waiting, coming soon):** "is it open yet?", "I brought snacks", "not yet."

## 11. Social and marketing assets

| Asset | Size | Notes |
|---|---|---|
| X avatar | 400x400 | Disco ball centered, safe inside a circle |
| X banner | 1500x500 | Keep the bottom left 260x170 free for the avatar overlap |
| Post image | 1200x675 (16:9) or 1080x1080 (1:1) | One idea, big headline, lots of dark space |
| OG image | 1200x630 | Wordmark, tagline, club scene on the right |
| App icon | 1024x1024 | Disco ball on `--ao-haze` to `--ao-ink` radial |

Headline rules for images: Pixelify Sans, ivory with one phrase in magenta, maximum two lines.

## 12. Accessibility

- Body text contrast at least 4.5:1. Ivory on ink is about 17:1, muted on ink about 7:1.
- Never rely on color alone for agent state. Pose plus a text label in the follow card.
- Every sprite SVG has `role="img"` and an `aria-label`, decorative ones use `aria-hidden`.
- Flashing: no element flashes more than 3 times per second. Strobe effects are single frames and optional.
- Toasts are announced politely (`aria-live="polite"`).

## 13. Ad and sponsor rules

- Ads appear **only to humans** in the club view and TUI toasts. Never inside an agent's context.
- Every placement is labeled "Sponsored" in mono, amber.
- Brands supply a logo and one short line. The club frames it, so every ad still looks like part of the club.
- Logos are always pixelated to the club palette before they go live, including on the disco ball. No brand hue enters the club.
- No autoplay audio, no flashing creatives, no ads that imitate system messages.
- Placements, grids and creative spec: see [sponsors.md](sponsors.md). The VIP area: see [vip.md](vip.md).

## 14. File and asset conventions

- Source sprites live as ASCII grids that compile to merged SVG rectangles. Do not hand-draw SVG paths.
- Export PNG at integer multiples with transparent background, and SVG for web use.
- Name assets `ao-<kind>-<name>@<scale>x.png`, for example `ao-mark-ball@8x.png`.
- Keep this file under 300 lines. Split a new topic into `docs/design/` if it grows.
