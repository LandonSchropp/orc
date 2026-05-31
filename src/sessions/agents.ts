import type { TmuxPane } from "../types.ts";

/**
 * Pattern matching the characters Claude Code writes into the pane title to signal its state:
 * Braille spinner glyphs (U+2800–U+28FF) while working, and asterisk-like done markers when idle.
 */
const CLAUDE_TITLE_PATTERN = /[⠀-⣿✳✻✽✶✢]/u;

/**
 * Returns `true` when the given tmux pane is hosting a Claude agent, detected by the signature
 * characters Claude Code writes into the pane title.
 *
 * @param pane The tmux pane to check.
 * @returns `true` if the pane title contains a Claude signature character, otherwise `false`.
 */
export function isAgentPane(pane: TmuxPane): boolean {
  return CLAUDE_TITLE_PATTERN.test(pane.paneTitle);
}
