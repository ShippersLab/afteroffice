#!/usr/bin/env node
import { register } from "node:module";

register(new URL("./resolve-ts.mjs", import.meta.url));

const { main } = await import("../src/main.ts");
process.exitCode = await main(process.argv.slice(2));
process.exit();
