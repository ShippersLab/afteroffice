import { fileURLToPath } from "node:url";

export const ROOT_ENV_FILE = fileURLToPath(new URL("../../../.env", import.meta.url));
