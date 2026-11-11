---
description: Structure, Tailwind, SEO and copy rules for the marketing site
paths: ["apps/web/**"]
---

# Web

## Folders

```
apps/web/
  index.html          meta tags, canonical, OG, placeholders for JSON-LD and noscript content
  public/             robots.txt, sitemap.xml, llms.txt, llms-full.txt, og.svg and og.png, icons, manifest
  src/
    main.tsx  app.tsx
    pages/            one file per route kind: club-page (fullscreen game), content-page, content-route
    components/
      club/           game HUD: club-hud, club-intro
      sections/       one file per content section, named <name>-section.tsx
      layout/         top-bar, section wrapper
      ui/             small reusable pieces: button, link, badge, code-block, live-chip, logo, card
    hooks/            use-live-connection, use-club-view, use-pathname, use-page-metadata
    library/
      realtime/       url building, message parsing, message sink (tracks floor state), backoff
      routing/        route resolution, navigation
      seo/            JSON-LD builders, static noscript content, per page metadata
      security/       csp
    utilities/        tiny generic helpers
    configuration/    validated environment
    content/          all marketing copy and the route table as typed constants
    styles/app.css    the only stylesheet
```

- `/` is the club, fullscreen, with a small HUD over the canvas. It never scrolls. Every other route is a content page (top bar, section, footer) built from `content/routes.ts`.
- New page: add it to `ROUTES` (path, label, title, description), render it in `pages/content-route.tsx`, add it to `public/sitemap.xml`. Use `Link` for internal links, never a plain `<a href>`.
- Hosting must serve `index.html` for every route (single page app fallback).
- Every folder holds its own `__tests__/`. Keep each folder small. A new concern gets a new folder, not a bigger one.
- Copy lives only in `content/`. Components import it, they never inline marketing text.
- Sections do not import each other. Shared pieces go to `ui/` or `layout/`.

## Tailwind

- Tailwind v4, CSS first. Tokens live in `@theme` in `styles/app.css` and mirror the `--ao-*` palette of `documentation/design/DESIGN.md`. Do not hardcode hex values in components.
- Use utilities in JSX. No new CSS files. Custom CSS is only `@theme`, `@utility` and the `@layer base` reset.
- Calm look: neutral cards (`bg-panel/60`, 1px `border-line`), accents only on small things (magenta primary button, amber text labels, cyan status). `pixelated` on images, `steps()` for pixel motion.
- Every interactive element has a 200ms ease-out hover transition. HUD entrance uses the `animate-rise` token.
- Respect reduced motion. Keep the focus ring.

## SEO and GEO checklist

- `index.html`: title `The club for your agents | afteroffice.club`, description, canonical, robots, theme-color, Open Graph and Twitter tags, manifest, icons. Title and description must match `content/site.ts` (a test checks it).
- One `h1` per route, ordered headings, landmarks (`header`, `nav`, `main`, `footer`), `lang="en"`, alt text, aria labels.
- JSON-LD (Organization, WebSite, SoftwareApplication, FAQPage) is built from `content/` in `lib/seo` and injected by the Vite plugin. The FAQ in JSON-LD must equal the visible FAQ.
- Crawlers without JS read the `noscript` block rendered from `content/` at build time.
- Keep `public/llms.txt`, `llms-full.txt`, `sitemap.xml` and `robots.txt` in step with product changes. Re-export `og.png` from `og.svg` when the design changes (1200x630).

## Copy

- English, sentence case, punchy and a little cheeky. No exclamation marks, no emojis, never the em dash (a test checks it).
- Plugins are live. Only harnesses without a plugin yet (the "Codex and more" card) carry the amber "Coming soon" badge. Never present the club as only for one or two agents.
- Never promise what the product does not do. Privacy claims must match `.agents/rules/security-privacy.md`.
