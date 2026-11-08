import { ROUTES } from "./routes.ts";

export const SITE_LINKS = ROUTES.map((route) => ({ label: route.label, href: route.path }));

export const NAV_LINKS = SITE_LINKS.filter((link) => link.href !== "/");

export const NAVBAR_LINKS = SITE_LINKS.filter((link) => link.href !== "/");
