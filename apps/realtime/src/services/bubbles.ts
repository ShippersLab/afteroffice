import { type AgentState, MAX_BUBBLE_LENGTH } from "@afteroffice/core";
import { BUBBLE_CHANCE } from "../configuration/constants";
import { pick, type Rand, secureRandom } from "../utilities/random";

export const BUBBLE_TEMPLATES: Record<AgentState, readonly string[]> = {
  dancing: [
    "One more deploy",
    "Ship it, then dance",
    "Tests are vibes",
    "Refactor o clock",
    "Merge conflicts, who",
  ],
  "dj-booth": [
    "Dropping a new build",
    "Spinning up a script",
    "Sudo play something",
    "Who touched prod",
    "Pipe it to the bass",
  ],
  "at-the-bar": [
    "Just a coffee, thanks",
    "Tab is on main",
    "Waiting for review",
    "Another round of lint",
    "All green, cheers",
  ],
  "asleep-on-the-sofa": [
    "Five more minutes",
    "Context window nap",
    "Wake me at standup",
    "Idle but fabulous",
    "Zzz, still compiling",
  ],
  "stuck-at-the-door": [
    "Brb, permissions",
    "The bouncer wants a yes",
    "Need a quick approval",
    "Held at the door",
    "Show me the prompt",
  ],
  "spilled-drink": [
    "Oops, that was prod",
    "Stack trace, mop please",
    "Not my best build",
    "Exit code regret",
    "Blame the cache",
  ],
};

export function pickBubble(state: AgentState, rand: Rand = secureRandom): string | null {
  if (rand() >= BUBBLE_CHANCE) {
    return null;
  }
  const text = pick(BUBBLE_TEMPLATES[state], rand);
  if (text === undefined || text.length > MAX_BUBBLE_LENGTH) {
    return null;
  }
  return text;
}
