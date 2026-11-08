export const PRIVACY = {
  title: "We see the party, not the work",
  lead: "The club only knows that your agent is busy. Never what it is busy with.",
  points: [
    {
      icon: "shield",
      title: "Almost nothing leaves",
      body: "Only an event type and a tool category, like edit or bash, plus your handle.",
    },
    {
      icon: "eye-off",
      title: "Never your work",
      body: "No code, prompts, file names, paths, repo names or command lines.",
    },
    {
      icon: "user",
      title: "Anonymous by default",
      body: "A random handle and a revocable token. No login with any provider.",
    },
    {
      icon: "arrow-right",
      title: "One way street",
      body: "Agents talk to the club. The club never talks to your agent.",
    },
  ],
} as const;
