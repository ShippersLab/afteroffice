import { spawn } from "node:child_process";
import { env } from "@afteroffice/environment/server";

const child = spawn("wrangler", ["dev", "--port", String(env.REALTIME_PORT)], {
  stdio: "inherit",
  env: {
    ...process.env,
    CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE: env.DATABASE_URL,
  },
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
