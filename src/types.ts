import { AGENT_STATUSES } from "./constants.ts";

/** A tmux pane on orc's isolated server. */
export type TmuxPane = {
  /** The orc id of the session this pane belongs to (e.g. `project/feature-a`). */
  sessionId: string;
  /** The tmux pane id (e.g. `%5`). */
  paneId: string;
  /** The pane's current title, as set by the running program via OSC 2. */
  paneTitle: string;
};

/** An Orc session. */
export type Session = {
  /** The project the session belongs to. */
  project: string;
  /** The session name within the project. */
  session: string;
  /** The fully qualified session id, `project/session`. */
  id: string;
  /** When the session was created. */
  createdAt: Date;
  /** True if a client is currently attached to the session. */
  attached: boolean;
  /** Which worktree the session runs on: the project's main worktree or a dedicated linked one. */
  worktree: "main" | "linked";
  /** Claude agents currently running in this session. Empty when there are none. */
  agents: Agent[];
};

/** A group of sessions that share a Tmuxinator project. */
export type Project = {
  /** The Tmuxinator project name. */
  project: string;
  /** Sessions belonging to this project, in display order. */
  sessions: Session[];
};

/** The current status of a Claude agent running in an orc session. */
export type AgentStatus = (typeof AGENT_STATUSES)[number];

/** A Claude agent running in a tmux pane within an orc session. */
export type Agent = {
  /** The tmux pane id (e.g. `%5`) that hosts the agent. */
  paneId: string;
  /** The current status of the agent. */
  status: AgentStatus;
};

/** The on-disk shape of an agent state file. */
export type AgentState = {
  /** The current status of the agent. */
  status: AgentStatus;
  /** ISO 8601 timestamp when the state was written. */
  timestamp: string;
};

/** The shape of a Claude Code hook payload read from stdin by `orc hook status`. */
export type HookPayload = {
  /** The hook event name (e.g. `UserPromptSubmit`, `Stop`, `Notification`). */
  hook_event_name: string;
};

/** A single Claude Code hook handler entry. */
export type HookHandler = { type: "command"; command: string };

/** A matcher + handlers group within a Claude Code hook event array. */
export type HookMatcher = { matcher?: string; hooks: HookHandler[] };

/** The shape of a Claude Code settings file (e.g. `.claude/settings.local.json`). */
export type ClaudeSettings = JsonObject & { hooks?: Record<string, HookMatcher[]> };

/** A JSON value: scalar, array, or object. */
export type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject;

/** A JSON object (top-level mapping). */
export type JsonObject = { [key: string]: JsonValue };

/** A YAML scalar, array, or mapping as returned by `Bun.YAML.parse`. Structurally identical to JSON. */
export type YamlValue = JsonValue;

/** A YAML mapping (top-level object). */
export type YamlObject = JsonObject;

/** A tmuxinator project — a YAML object with at least a `name` and `root`. */
export type TmuxinatorProject = YamlObject & { name: string; root: string };
