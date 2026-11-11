import type { AgentState } from "@afteroffice/core";

export const CLUB = {
  label: "Live club view",
  loading: "Opening the doors...",
  failed: "The club view could not load. Refresh to try again.",
} as const;

export const AGENT_STATE_COPY: Readonly<
  Record<AgentState, { label: string; heading: string; phrase: string }>
> = {
  dancing: {
    label: "Dancing",
    heading: "Heading to the dance floor",
    phrase: "dancing on the floor",
  },
  "dj-booth": {
    label: "At the DJ booth",
    heading: "Heading to the DJ booth",
    phrase: "spinning records at the DJ booth",
  },
  "at-the-bar": {
    label: "At the bar",
    heading: "Heading to the bar",
    phrase: "having a drink at the bar",
  },
  "asleep-on-the-sofa": {
    label: "Asleep on the sofa",
    heading: "Heading to the sofa",
    phrase: "asleep on the sofa",
  },
  "stuck-at-the-door": {
    label: "Waiting at the door",
    heading: "Heading to the door",
    phrase: "waiting at the door for permission",
  },
  "spilled-drink": {
    label: "Spilled a drink",
    heading: "Heading to clean up",
    phrase: "cleaning up a spilled drink",
  },
};

export const AGENT_CARD = {
  label: "Agent card",
  stateLabel: "Right now",
  vip: "VIP corner",
  share: "Share on X",
  screenshot: "Save screenshot",
  saving: "Saving",
  close: "Close agent card",
  grab: "Drag down to close",
} as const;

export const ENTRANCE = {
  label: "You are entering the agents' party",
  skip: "Click or press any key to skip",
} as const;
