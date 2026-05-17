import { homedir } from "node:os";
import { join } from "node:path";

/**
 * Returns the value of `$XDG_CONFIG_HOME`, falling back to `~/.config` when unset.
 *
 * @returns The user-level XDG configuration directory.
 */
export function xdgConfigHome(): string {
  return process.env.XDG_CONFIG_HOME ?? join(homedir(), ".config");
}

/**
 * Returns the value of `$XDG_CACHE_HOME`, falling back to `~/.cache` when unset.
 *
 * @returns The user-level XDG cache directory.
 */
export function xdgCacheHome(): string {
  return process.env.XDG_CACHE_HOME ?? join(homedir(), ".cache");
}

/**
 * Returns orc's configuration directory: `$XDG_CONFIG_HOME/orc`.
 *
 * @returns The absolute path to orc's configuration directory.
 */
export function orcConfigDirectory(): string {
  return join(xdgConfigHome(), "orc");
}

/**
 * Returns orc's cache directory: `$XDG_CACHE_HOME/orc`. Used for worktrees and any orc-managed
 * runtime state.
 *
 * @returns The absolute path to orc's cache directory.
 */
export function orcCacheDirectory(): string {
  return join(xdgCacheHome(), "orc");
}
