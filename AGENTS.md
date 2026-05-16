# Agent Instructions

## Architecture

The code is organized in three layers, lowest to highest:

1. **`src/commands/`** — thin wrappers around external CLI tools (`tmux`, `git`, `tmuxinator`) and a generic shell utility (`runCommand`, `runAttachedCommand`). Functions in this layer are tool-specific and keep the tool name in their identifier (e.g. `isTmuxInstalled`, `listTmuxSessions`, `switchTmuxSession`).
2. **`src/sessions/`** — orc-specific logic that composes the low-level commands into operations on the orc domain. Functions here drop the tool qualifier (e.g. `getCurrentSession`, `findMatchingSession`, `switchSession`).
3. **`src/cli/`** — high-level CLI commands defined with citty (`new`, `list`, `switch`, `detach`, `delete`). These wire arguments to the mid-layer functions.

Tests live alongside their source as `*.test.ts`. Shared test infrastructure (`setup.ts`, `factories/`, `helpers/`) lives in `test/`.

## CLI vs TUI

Orc has two interaction modes:

- **CLI**: every subcommand (`orc <subcommand>`) is non-interactive. All required arguments must be supplied; missing arguments produce an error rather than a prompt or interactive picker. This keeps subcommands predictable for agents and scripts.
- **TUI**: launched by running `orc` with no subcommand. All interactive flows (session selection, confirmations, browsing) live here.

Subcommands never fall back to interactive prompts. If a user needs interaction, they launch the TUI.

## CLI Output

Use `process.stdout.write` for command output, not `console.log`. CLI output is program data that should pipe cleanly to other tools — `console.log` is for diagnostics and goes through Node's console formatting layer. Remember to include the trailing `\n` since `process.stdout.write` does not append one.

## Git Workflow

- REQUIRED: invoke the `git-atomic-commit` skill at the start of every session.
- Each commit captures one logical change. Before presenting work, evaluate whether the diff could be split into atomic commits and propose the split.
- Code under review must be unstaged. The unstaged diff should reflect exactly what will be committed — never present a staged diff for review.
