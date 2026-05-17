import { AGENT_STATUSES } from "./constants.ts";

/** An Orc session. */
export type Session = {
  /** The project the session belongs to. */
  project: string;
  /** The session name within the project. */
  session: string;
  /** The fully qualified session identifier, `project:session`. */
  name: string;
  /** When the session was created. */
  createdAt: Date;
  /** True if a client is currently attached to the session. */
  attached: boolean;
};

/** The current status of a Claude agent running in an orc session. */
export type AgentStatus = (typeof AGENT_STATUSES)[number];

/** A Claude agent running in a tmux pane within an orc session. */
export type Agent = {
  /** The tmux pane identifier (e.g. `%5`) that hosts the agent. */
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

/** A YAML scalar, array, or mapping as returned by `Bun.YAML.parse`. */
export type YamlValue = string | number | boolean | null | YamlValue[] | YamlObject;

/** A YAML mapping (top-level object). */
export type YamlObject = { [key: string]: YamlValue };

/** A tmuxinator project — a YAML object with at least a `name` and `root`. */
export type TmuxinatorProject = YamlObject & { name: string; root: string };
