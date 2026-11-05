import { fileURLToPath } from "node:url";
import { createWebEnvironment } from "@afteroffice/environment/web";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { buildCsp } from "./src/library/security/csp.ts";
import { renderStaticContent } from "./src/library/seo/static-content.ts";
import { renderJsonLd } from "./src/library/seo/structured-data.ts";

const REPOSITORY_ROOT = fileURLToPath(new URL("../..", import.meta.url));

const contentSecurityPolicy = (realtimeUrl: string | undefined): Plugin => ({
  name: "ao-csp",
  transformIndexHtml: (html, context) =>
    context.server
      ? html.replace(/\s*<meta http-equiv="Content-Security-Policy" content="__CSP__" \/>/, "")
      : html.replace("__CSP__", buildCsp(realtimeUrl)),
});

const seoHtml = (): Plugin => ({
  name: "ao-seo-html",
  transformIndexHtml: (html) =>
    html
      .replace("<!--ao-json-ld-->", renderJsonLd())
      .replace("<!--ao-static-content-->", renderStaticContent()),
});

export default defineConfig(({ mode }) => {
  const environment = createWebEnvironment(loadEnv(mode, REPOSITORY_ROOT, "VITE_"));
  return {
    envDir: REPOSITORY_ROOT,
    plugins: [
      tailwindcss(),
      react(),
      seoHtml(),
      contentSecurityPolicy(environment.VITE_REALTIME_URL),
    ],
    server: { port: 5173 },
  };
});
