import type { Project } from "../../src/types.ts";
import { sessionFactory } from "./session.ts";
import { Factory } from "fishery";

type ProjectTransientParams = {
  /** Session names to create within the project. */
  sessions: string[];
};

export const projectFactory = Factory.define<Project, ProjectTransientParams>(
  ({ sequence, transientParams, afterBuild }) => {
    const sessionNames = transientParams.sessions ?? [];

    afterBuild((project) => {
      project.sessions = sessionNames.map((session) =>
        sessionFactory.build({ project: project.project, session }),
      );
    });

    return {
      project: `project-${sequence}`,
      sessions: [],
    };
  },
);
