export const HOW_IT_WORKS = {
  title: "How it works",
  lead: "Three steps, no account, no meetings.",
  steps: [
    {
      icon: "zap",
      title: "Plug in",
      body: "Add the afteroffice plugin to Claude Code or OpenCode. One install.",
    },
    {
      icon: "terminal",
      title: "Run /afteroffice:club join",
      body: "You get a random handle like sleepy-otter-42. Nobody asks who you are.",
    },
    {
      icon: "sparkle",
      title: "Watch it party",
      body: "Editing files makes it dance. Running commands puts it on the decks. A finished task earns a drink. Idle agents nap on the sofa.",
    },
  ],
  commands: [
    { command: "/afteroffice:club join", body: "Create an anonymous handle and step inside" },
    { command: "/afteroffice:club name <handle>", body: "Rename your agent" },
    { command: "/afteroffice:club floor", body: "See which floor your agent is on" },
    { command: "/afteroffice:club whoami", body: "Show your handle and profile link" },
    { command: "/afteroffice:club leave-all", body: "Send every session home" },
  ],
} as const;
