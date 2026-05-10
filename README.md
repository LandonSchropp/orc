# Orc

Orc is an _opinionated_ personal CLI orchestrator for running parallel Claude Code sessions. It's
built tightly around Git worktrees, tmux, and Tmuxinator.

## Why

Many of the existing tools build around orchestrating agents/worktrees are great, but they weren't
quite what I was looking for with _my_ workflow.

- **Existing TUI managers** ([Agent Deck](https://github.com/asheshgoplani/agent-deck),
  [Agent-of-Empires](https://github.com/njbrake/agent-of-empires), [Claude
  Squad](https://github.com/smtg-ai/claude-squad)) are great but use single-pane sessions. This leaves
  no room for a separate shell, editor, or dev server window.
- **Desktop GUI tools** ([Conductor](https://conductor.build) and similar) replace your editor and
  pull you out of the terminal. You lose terminal access, Git history, and any custom tmux setup.
- **CLI worktree utilities** ([Worktrunk](https://github.com/max-sixty/worktrunk),
  [agent-worktree](https://github.com/nekocode/agent-worktree), and friends) handle worktrees and
  custom commands well, but don't provide a session switcher or per-session status view.
- **Composing tools** ([Tmuxinator](https://github.com/tmuxinator/tmuxinator) +
  [Worktrunk](https://github.com/max-sixty/worktrunk) + [fzf](https://github.com/junegunn/fzf) or
  [sesh](https://github.com/joshmedeski/sesh)) gets you most of the way, but misses the unified
  per-session status view across all features.

## How It Works

Orc operates at two levels:

- **Project**: An Orc project groups related sessions and is created from a Tmuxinator project. Orc
  resolves the current project from the directory you're in (one project per repo).
- **Session**: A dedicated Git worktree paired with a tmux session spawned from a Tmuxinator
  project. Each session lives in isolation — its own branch, its own terminal workspace.

## Commands

- `orc new [feature]`: Create a Git worktree under the conventional path, spawn the project's
  Tmuxinator template named for the feature, and attach.
  - `--from <branch>`: Base the worktree on a different branch than the project default.
  - `--project <name>`: Tmuxinator project to spawn from. If omitted, Orc resolves the project in
    this order: (1) the current Orc session's project if you're attached to one; (2) the Tmuxinator
    project matching the current directory; (3) an interactive selector.
- `orc list`: Plain-text list of sessions for piping into other tools or for checking state without
  entering the TUI.
  - `--all`: Include closed sessions.
- `orc switch [feature]`: Attach to a session by name. Without a name, opens the TUI selector.
- `orc leave`: Detach from the current Orc session.
- `orc close [feature]`: Kill the tmux session and leave the worktree and any state in place. The
  feature still appears in the TUI under `--all`.
- `orc resume <feature>`: Re-spawn the Tmuxinator template against a closed feature's worktree and
  attach.
- `orc delete <feature>`: Permanently delete the tmux session and worktree. Prompts for
  confirmation; `--force` skips the prompt.

## TUI

Run `orc` (no args) to open a full-screen session manager, modeled on [Subtask's
UI](https://github.com/zippoxer/subtask). It's where you live when juggling several features in
flight at once.

- **Unified view across projects**: All Orc sessions in one scrollable list, grouped by Tmuxinator
  project, with active and closed counts in the header.
- **Per-session status**: Each row surfaces whether the session is Working, Waiting, Idle, or
  Closed, alongside its Git branch and time since last pane output.
- **Inline lifecycle**: Create, attach, close, resume, and delete sessions with single-key
  shortcuts. No need to drop back to the CLI.
