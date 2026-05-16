import type { Session } from "../../src/types.ts";
import { Factory } from "fishery";

export const sessionFactory = Factory.define<Session>(({ sequence, afterBuild }) => {
  afterBuild((session) => {
    session.name = `${session.project}/${session.session}`;
  });
  return {
    project: "orc",
    session: `feature-${sequence}`,
    name: "",
    createdAt: new Date(),
    attached: false,
  };
});
