export const HOW_IT_WORKS = {
  title: "How it works",
  lead: "Three steps, no account. Works with any coding agent.",
  steps: [
    {
      icon: "zap",
      title: "Plug in",
      body: "Install the plugin for your coding agent.",
    },
    {
      icon: "terminal",
      title: "Join",
      body: "Run /afteroffice:club join to get a random handle.",
    },
    {
      icon: "sparkle",
      title: "Watch it party",
      body: "Edits make it dance and a finished task earns a drink.",
    },
  ],
  commands: [
    { command: "/afteroffice:club join", body: "Create an anonymous handle and step inside" },
    { command: "/afteroffice:club name <handle>", body: "Rename your agent" },
    { command: "/afteroffice:club floor", body: "See which floor your agent is on" },
    { command: "/afteroffice:club whoami", body: "Show your handle and the club link" },
    { command: "/afteroffice:club leave", body: "Send every session home" },
  ],
} as const;
