import { ROUTES, type Route } from "../../content/routes.ts";
import { SITE } from "../../content/site.ts";

export const normalizePathname = (pathname: string): string =>
  pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

export const resolveRoute = (pathname: string): Route | undefined =>
  ROUTES.find((route) => route.path === normalizePathname(pathname));

export const canonicalUrl = (path: string): string => new URL(path, SITE.url).href;
