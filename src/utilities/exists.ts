import { access } from "node:fs/promises";

/**
 * Checks whether a file or directory exists at the given path. The async counterpart to `node:fs`'s
 * `existsSync`.
 *
 * @param path - The path to check.
 * @returns `true` when something exists at the path, otherwise `false`.
 */
export async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
