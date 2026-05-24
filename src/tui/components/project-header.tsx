import type { Project as ProjectType } from "../../types.ts";
import { contentWidth } from "../state/content-width.ts";
import { useStore } from "../state/store.tsx";
import { Box, Text } from "ink";

type ProjectHeaderProps = {
  /** The project whose name and rule to render. */
  project: ProjectType;
};

/** A project's header: its name followed by a rule that spans the content width. */
export function ProjectHeader({ project }: ProjectHeaderProps) {
  const { numberOfColumns } = useStore();
  const ruleWidth = Math.max(0, contentWidth(numberOfColumns) - project.project.length - 3);

  return (
    <Box marginTop={1}>
      <Text color="gray">{"─ "}</Text>
      <Text color="blue" bold>
        {project.project}{" "}
      </Text>
      <Text color="gray">{"─".repeat(ruleWidth)}</Text>
    </Box>
  );
}
