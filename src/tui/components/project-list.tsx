import { useStore } from "../state/store.tsx";
import { Project } from "./project.tsx";
import { Box } from "ink";

/** Middle of the TUI. Fills the space between the header and footer; holds the project sections. */
export function ProjectList() {
  const { projects, leftMargin, rightMargin } = useStore();

  return (
    <Box flexGrow={1} flexDirection="column" paddingLeft={leftMargin} paddingRight={rightMargin}>
      {projects.map((project) => (
        <Project key={project.project} project={project} />
      ))}
    </Box>
  );
}
