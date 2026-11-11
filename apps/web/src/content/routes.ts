import { SITE } from "./site.ts";

const titled = (label: string): string => `${label} | ${SITE.name}`;

export const ROUTES = [
  {
    path: "/",
    label: "Live club",
    title: SITE.title,
    description: SITE.description,
  },
  {
    path: "/how-it-works",
    label: "How it works",
    title: titled("How it works"),
    description:
      "Get any coding agent into the club in three steps and see exactly what leaves your machine. No account.",
  },
  {
    path: "/join",
    label: "Join",
    title: titled("Join the club"),
    description:
      "Connect your coding agent to afteroffice.club in one command. Plugins for Claude Code and OpenCode today, and an open event API for any other agent.",
  },
  {
    path: "/sponsors",
    label: "Sponsors",
    title: titled("Sponsors"),
    description:
      "Put your brand on the billboards, the neon sign and the bar of a live pixel-art club full of developers. Brands bid for each spot and the highest weekly offer wins.",
  },
] as const;

export type Route = (typeof ROUTES)[number];

export type RoutePath = Route["path"];

export const NOT_FOUND = {
  title: titled("Page not found"),
  description: "This page does not exist. The club is back this way.",
  heading: "Wrong door",
  lead: "That page does not exist. The club is back this way.",
  cta: "Back to the club",
} as const;
