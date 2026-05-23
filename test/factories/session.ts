import type { Session } from "../../src/types.ts";
import { Factory } from "fishery";

export const sessionFactory = Factory.define<Session>(({ sequence, afterBuild }) => {
  afterBuild((session) => {
    session.id = `${session.project}/${session.session}`;
  });
  return {
    project: "orc",
    session: `feature-${sequence}`,
    id: "",
    createdAt: new Date(),
    attached: false,
    agents: [],
  };
});
