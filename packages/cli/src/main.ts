import { runHook } from "./commands/hook";
import { runHookWorker } from "./commands/hook-run";
import { runJoin } from "./commands/join";
import { runLeave } from "./commands/leave";
import { runSimulate } from "./commands/simulate/simulate";
import { runWhoami } from "./commands/whoami";

const USAGE = "Usage: afteroffice <join|whoami|leave|hook <event>|simulate --agents N>\n";

async function dispatch(command: string | undefined, args: readonly string[]): Promise<number> {
  switch (command) {
    case "hook":
      await runHook(args[0] ?? "");
      return 0;
    case "hook-run":
      await runHookWorker(args[0] ?? "");
      return 0;
    case "join":
      return runJoin();
    case "whoami":
      return runWhoami();
    case "leave":
      return runLeave();
    case "simulate":
      return runSimulate(args);
    default:
      process.stdout.write(USAGE);
      return command === undefined ? 0 : 1;
  }
}

export async function main(argv: readonly string[]): Promise<number> {
  const [command, ...args] = argv;
  try {
    return await dispatch(command, args);
  } catch {
    return command === "hook" || command === "hook-run" ? 0 : 1;
  }
}
