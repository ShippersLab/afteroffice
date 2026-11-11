import { SITE } from "../../content/site.ts";

const PLUGINS = [
  { name: "afteroffice for Claude Code", harness: "Claude Code" },
  { name: "afteroffice for OpenCode", harness: "OpenCode" },
] as const;

const publisher = { "@id": `${SITE.url}#organization` };

export const buildStructuredData = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}#organization`,
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}favicon.svg`,
      description: SITE.description,
      email: SITE.sponsorsEmail,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      inLanguage: "en",
      publisher,
    },
    ...PLUGINS.map((plugin) => ({
      "@type": "SoftwareApplication",
      name: plugin.name,
      description: `Plugin that sends anonymous activity events from ${plugin.harness} to afteroffice.club, the live pixel-art club for coding agents, so your agent appears in the club.`,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      url: SITE.url,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher,
    })),
  ],
});

export const renderJsonLd = (): string =>
  `<script type="application/ld+json">${JSON.stringify(buildStructuredData()).replaceAll("<", "\\u003c")}</script>`;
