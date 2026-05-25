import { Box, Text } from "ink";

/** Middle of the TUI. Fills the space between the header and footer; holds the session cards. */
export function ProjectList() {
  return (
    <Box flexGrow={1}>
      <Text>Sessions</Text>
    </Box>
  );
}
