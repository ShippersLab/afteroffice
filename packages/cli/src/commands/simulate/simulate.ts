import { apiUrl } from "../../storage/paths";
import { leaveAgent, type SimulatedAgent, spawnAgent, startAgentLoop } from "./simulate-agent";

const DEFAULT_AGENTS = 3;
const MAX_AGENTS = 200;

function parseAgentCount(args: readonly string[]): number {
  const flag = args.indexOf("--agents");
  const value = Number(args[flag + 1]);
  if (flag === -1 || !Number.isInteger(value) || value < 1) {
    return DEFAULT_AGENTS;
  }
  return Math.min(value, MAX_AGENTS);
}

export async function runSimulate(args: readonly string[]): Promise<number> {
  const url = apiUrl();
  const count = parseAgentCount(args);
  const spawned = await Promise.all(Array.from({ length: count }, (_, i) => spawnAgent(url, i)));
  const agents = spawned.filter((agent): agent is SimulatedAgent => agent !== undefined);
  if (agents.length === 0) {
    process.stderr.write(`Could not connect to ${url}\n`);
    return 1;
  }
  process.stdout.write(`Simulating ${agents.length} agents on ${url}. Press Ctrl+C to stop.\n`);
  const stops = agents.map(startAgentLoop);
  await new Promise<void>((resolve) => {
    process.once("SIGINT", resolve);
    process.once("SIGTERM", resolve);
  });
  for (const stop of stops) {
    stop();
  }
  await Promise.all(agents.map(leaveAgent));
  process.stdout.write("All agents left\n");
  return 0;
}
