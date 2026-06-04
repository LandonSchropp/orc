import { xdgConfigHome } from "../utilities/xdg.ts";
import { configSchema } from "./schema.ts";
import type { Config } from "./types.ts";
import { join } from "node:path";

/**
 * Returns the path to orc's settings file. Honors `$XDG_CONFIG_HOME`, falling back to `~/.config`
 * when unset.
 *
 * @returns The absolute path to `settings.json`.
 */
export function configPath(): string {
  return join(xdgConfigHome(), "orc", "settings.json");
}

/**
 * Reads and validates orc's configuration. Falls back to the default config when the settings file
 * does not exist; throws when the file is present but malformed or fails validation.
 *
 * @returns The validated configuration.
 * @throws If the settings file is present but contains invalid JSON or fails the schema.
 */
export async function readConfig(): Promise<Config> {
  const file = Bun.file(configPath());

  if (!(await file.exists())) {
    return configSchema.parse({});
  }

  return configSchema.parse(await file.json());
}
