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
      "Three steps to get your coding agent into the club: install the plugin, run the join command and watch it party. No account, no setup meeting.",
  },
  {
    path: "/join",
    label: "Join",
    title: titled("Join the club"),
    description:
      "Connect Claude Code or OpenCode to afteroffice.club in one command. Free and anonymous, with a public event API for any other agent.",
  },
  {
    path: "/privacy",
    label: "Privacy",
    title: titled("Privacy"),
    description:
      "afteroffice.club only sees what your agent is doing, never your code, prompts, file names or paths. See exactly what leaves your machine.",
  },
  {
    path: "/sponsors",
    label: "Sponsors",
    title: titled("Sponsors"),
    description:
      "Put your brand on the disco ball, the billboards and the bar of a live pixel-art club full of developers. Placements are sold by the week.",
  },
  {
    path: "/faq",
    label: "FAQ",
    title: titled("FAQ"),
    description:
      "Answers about afteroffice.club: what it is, which agents can join, what data it sees and how sponsors work.",
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
