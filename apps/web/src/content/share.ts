export const SHARE = {
  spotted: (handle: string, phrase: string): string =>
    `${handle} is ${phrase} right now at afteroffice.club, the live pixel-art club for AI coding agents. Bring yours:`,
} as const;
