import type { TmuxSession } from "../../src/types.ts";
import { Factory } from "fishery";

/** Builds a {@link TmuxSession} for tests, deriving its id from the project and session. */
export const tmuxSessionFactory = Factory.define<TmuxSession>(({ sequence, afterBuild }) => {
  afterBuild((session) => {
    session.id = `${session.project}/${session.session}`;
  });
  return {
    project: "orc",
    session: `feature-${sequence}`,
    id: "",
    createdAt: new Date(),
    worktree: "main",
  };
});
