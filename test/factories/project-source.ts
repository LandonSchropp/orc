import type { ProjectSource } from "../../src/types.ts";
import { Factory } from "fishery";

/** Builds a {@link ProjectSource} for tests, defaulting to a tmuxinator source. */
export const projectSourceFactory = Factory.define<ProjectSource>(({ sequence }) => ({
  kind: "tmuxinator",
  name: `project-${sequence}`,
  repositoryRoot: `/repos/project-${sequence}`,
}));
