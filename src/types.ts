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

/** A YAML scalar, array, or mapping as returned by `Bun.YAML.parse`. */
export type YamlValue = string | number | boolean | null | YamlValue[] | YamlObject;

/** A YAML mapping (top-level object). */
export type YamlObject = { [key: string]: YamlValue };

/** A tmuxinator project — a YAML object with at least a `name` and `root`. */
export type TmuxinatorProject = YamlObject & { name: string; root: string };
