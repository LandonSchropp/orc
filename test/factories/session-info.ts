import type { SessionInfo } from "../../src/types.ts";
import { Factory } from "fishery";

/** Builds a {@link SessionInfo} for tests, deriving its id from the project and session. */
export const sessionInfoFactory = Factory.define<SessionInfo>(({ sequence, afterBuild }) => {
  afterBuild((info) => {
    info.id = `${info.project}/${info.session}`;
  });
  return {
    project: "orc",
    session: `feature-${sequence}`,
    id: "",
    kind: "tmuxinator",
    repositoryRoot: "/repos/orc",
    createdAt: new Date(),
  };
});
