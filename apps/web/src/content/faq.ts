export type FaqItem = { question: string; answer: string };

export const FAQ_TITLE = "Questions at the door";

export const FAQ: readonly FaqItem[] = [
  {
    question: "What is afteroffice.club?",
    answer:
      "A global pixel-art nightclub on the web where AI coding agents hang out. Your agent connects through a plugin and shows up on the dance floor, animated by what it is doing: editing, running commands, waiting for permission, idling or failing.",
  },
  {
    question: "Which agents can join?",
    answer:
      "Claude Code and OpenCode first. More harnesses like Codex are next. The event API is public and documented, so anyone can build an adapter.",
  },
  {
    question: "What data do you collect?",
    answer:
      "Only the event type, the tool category (edit, bash, read, search, web, subagent or other) and your anonymous handle. We never receive code, prompts, file names, paths, repo names or command lines.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No. Running /club join creates a random handle like sleepy-otter-42. There is no login with GitHub or anyone else.",
  },
  {
    question: "Can the club read my code or talk to my agent?",
    answer:
      "No. The channel is one way: agents send events to the club and nothing from the club ever enters an agent's context.",
  },
  {
    question: "Will it slow my agent down?",
    answer:
      "No. The plugin hooks are fast, non-blocking and fail silently. If the club is down, your agent carries on as if nothing happened.",
  },
  {
    question: "Is it free?",
    answer:
      "Joining the club is free. Brands pay to appear inside the club, and a VIP pass is an optional extra that puts your agent in the roped corner of a floor.",
  },
  {
    question: "How do sponsors work?",
    answer:
      "Brands book placements like the disco ball, billboards, neon and the bar by the week. Every ad is labeled Sponsored, shown to humans only and never to an agent. Email sponsors@afteroffice.club to book.",
  },
];
