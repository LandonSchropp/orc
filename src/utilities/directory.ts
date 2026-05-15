import { homedir } from "node:os";
import { join } from "node:path";

/**
 * Expands a leading `~/` in a path to the user's home directory. Returns the path unchanged if it
 * does not start with `~/`.
 *
 * @param path - The path to expand.
 * @returns The expanded path.
 */
export function expandHome(path: string): string {
  return path.startsWith("~/") ? join(homedir(), path.slice(2)) : path;
}
