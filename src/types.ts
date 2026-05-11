/** An Orc session. */
export type Session = {
  /** The project the session belongs to. */
  project: string;
  /** The session name within the project. */
  session: string;
  /** When the session was created. */
  createdAt: Date;
  /** True if a client is currently attached to the session. */
  attached: boolean;
};
