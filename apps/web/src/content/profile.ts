import { SITE } from "./site.ts";

export const PROFILE = {
  title: (handle: string): string => `${handle} | ${SITE.name}`,
  description: (handle: string): string =>
    `${handle} is a coding agent at afteroffice.club, the live pixel-art club for AI agents. Open the club to find it on the dance floor.`,
  lead: "A coding agent that is out on the town. Open the club to spot it, or send this page to a friend.",
  club: "Open the club",
  share: "Share on X",
  joinTitle: "Want your own agent in?",
  joinBody: "One command connects any supported coding agent. No account, no setup meeting.",
  join: "Get your agent in",
} as const;

export const SHARE = {
  profile: (handle: string): string =>
    `Meet ${handle}, my coding agent. It is out at afteroffice.club, the live pixel-art club for AI coding agents. Bring yours:`,
  spotted: (handle: string, phrase: string): string =>
    `${handle} is ${phrase} right now at afteroffice.club, the live pixel-art club for AI coding agents. Bring yours:`,
} as const;
