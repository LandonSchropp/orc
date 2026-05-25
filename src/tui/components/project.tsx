import type { Project as ProjectType } from "../../types.ts";
import { GUTTER } from "../state/constants.ts";
import { ProjectHeader } from "./project-header.tsx";
import { Session } from "./session.tsx";
import { Box } from "ink";

type ProjectProps = {
  /** The project to render, with its grouped sessions. */
  project: ProjectType;
};

/** A project section: the project header, then its sessions wrapping across rows. */
export function Project({ project }: ProjectProps) {
  return (
    <Box flexDirection="column">
      <ProjectHeader project={project} />
      <Box flexWrap="wrap" columnGap={GUTTER}>
        {project.sessions.map((session) => (
          <Session key={session.id} session={session} />
        ))}
      </Box>
    </Box>
  );
}
