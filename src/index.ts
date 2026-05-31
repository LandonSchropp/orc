#!/usr/bin/env bun

import { orc } from "./cli/orc.ts";
import { runMain } from "citty";

export { orc } from "./cli/orc.ts";

/**
 * Runs the orc CLI against the given arguments.
 *
 * @param args - The raw command-line arguments, excluding the executable and script path.
 */
export async function main(args: string[]) {
  await runMain(orc, { rawArgs: args });
}

if (import.meta.main) {
  await main(process.argv.slice(2));
}
