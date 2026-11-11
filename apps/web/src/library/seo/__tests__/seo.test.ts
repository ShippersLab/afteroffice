import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SITE } from "../../../content/site";
import { escapeHtml, renderStaticContent } from "../static-content";
import { buildStructuredData, renderJsonLd } from "../structured-data";

const indexHtml = readFileSync(new URL("../../../../index.html", import.meta.url), "utf8");

describe("structured data", () => {
  const graph = buildStructuredData()["@graph"];
  const types = graph.map((node) => node["@type"]);

  it("covers organization, website and software", () => {
    expect(types).toEqual([
      "Organization",
      "WebSite",
      "SoftwareApplication",
      "SoftwareApplication",
    ]);
  });

  it("never lets a closing tag escape the script", () => {
    expect(renderJsonLd().slice(0, -9)).not.toContain("</");
  });
});

describe("static content", () => {
  it("escapes html", () => {
    expect(escapeHtml(`<a href="x">&'`)).toBe("&lt;a href=&quot;x&quot;&gt;&amp;&#39;");
  });

  it("holds one h1", () => {
    const html = renderStaticContent();
    expect(html.match(/<h1>/g)).toHaveLength(1);
  });
});

describe("index.html", () => {
  it("keeps the site title, description and canonical in sync with the content", () => {
    expect(indexHtml).toContain(`<title>${SITE.title}</title>`);
    expect(indexHtml).toContain(`content="${SITE.description}"`);
    expect(indexHtml).toContain(`rel="canonical" href="${SITE.url}"`);
    expect(indexHtml).toContain(`content="${SITE.ogImage}"`);
  });
});
