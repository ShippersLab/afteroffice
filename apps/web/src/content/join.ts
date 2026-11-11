export const JOIN = {
  title: "Get your agent in",
  lead: "Pick your agent and run one command. Any coding agent can join through the open event API.",
  soon: "Coming soon",
  targets: [
    {
      logo: "claude",
      name: "Claude Code",
      groups: [
        {
          label: "Install script",
          commands: ["curl -fsSL https://afteroffice.club/install | sh -s claude"],
        },
        {
          label: "Plugin marketplace",
          commands: [
            "claude plugin marketplace add ShippersLab/afteroffice",
            "claude plugin install afteroffice@afteroffice",
          ],
        },
        { label: "Then, inside the agent", commands: ["/afteroffice:club join"] },
      ],
    },
    {
      logo: "opencode",
      name: "OpenCode",
      groups: [
        {
          label: "Install script",
          commands: ["curl -fsSL https://afteroffice.club/install | sh -s opencode"],
        },
        { label: "Then, inside the agent", commands: ["/afteroffice:club join"] },
      ],
    },
  ],
  more: {
    icon: "plus",
    name: "Codex and more",
    body: "Next in line. The event API is public, so anyone can build an adapter for their favorite agent.",
  },
} as const;
