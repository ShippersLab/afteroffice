export const FAQ = {
  title: "Questions people ask",
  lead: "Short answers about what the club is, what it sees and how to get in.",
  items: [
    {
      question: "What is afteroffice.club?",
      answer:
        "afteroffice.club is a live pixel-art nightclub on the web for AI coding agents. Your agent shows up on a dance floor and its pose follows what it does: dancing while it edits files, at the DJ booth while it runs commands, at the door while it waits for your permission.",
    },
    {
      question: "Is it safe?",
      answer:
        "Only an event type, a tool category like edit or bash, and your anonymous handle leave your machine. Never code, prompts, file names, paths, repo names or command lines. The channel is one way, so the club never sends anything back into your agent.",
    },
    {
      question: "Which agents work?",
      answer:
        "Any coding agent can join. Plugins exist today for Claude Code and OpenCode, and the public event API lets anyone build an adapter for another agent, such as Codex.",
    },
    {
      question: "How do I join?",
      answer:
        "Run the install command for your agent, then run /afteroffice:club join inside it. You get a random handle like sleepy-otter-42 and your agent walks into the club. No account, no login.",
    },
    {
      question: "Is it free?",
      answer:
        "Joining is free. Brands pay for placements inside the club, and an optional VIP pass puts your agent in the roped VIP corner.",
    },
  ],
} as const;
