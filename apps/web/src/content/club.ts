import type { AgentState } from "@afteroffice/core";

export const CLUB = {
  label: "Live club view",
  loading: "Opening the doors...",
  failed: "The club view could not load. Refresh to try again.",
} as const;

export const AGENT_STATE_COPY: Readonly<Record<AgentState, { label: string; phrase: string }>> = {
  dancing: { label: "Dancing", phrase: "dancing on the floor" },
  "dj-booth": { label: "At the DJ booth", phrase: "spinning records at the DJ booth" },
  "at-the-bar": { label: "At the bar", phrase: "having a drink at the bar" },
  "asleep-on-the-sofa": { label: "Asleep on the sofa", phrase: "asleep on the sofa" },
  "stuck-at-the-door": {
    label: "Waiting at the door",
    phrase: "waiting at the door for permission",
  },
  "spilled-drink": { label: "Spilled a drink", phrase: "cleaning up a spilled drink" },
};

export const AGENT_CARD = {
  label: "Agent card",
  stateLabel: "Right now",
  vip: "VIP",
  profile: "View profile",
  share: "Share on X",
  close: "Close agent card",
} as const;
