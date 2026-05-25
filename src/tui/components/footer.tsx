import { Box, Text } from "ink";

/** A keybinding hint: the keys that trigger an action and the action's label. */
const KEYBINDINGS = [
  { keys: "←/↑/↓/→/h/j/k/l", label: "move" },
  { keys: "enter/a", label: "attach" },
  { keys: "n", label: "new" },
  { keys: "d", label: "delete" },
  { keys: "q/esc", label: "quit" },
];

/** Bottom bar of the TUI. Displays the keybinding hints, centered across the window. */
export function Footer() {
  // NOTE: FOOTER_HEIGHT in state/constants.ts must match this bar's height; update it if the layout
  // changes.
  return (
    <Box backgroundColor="black" justifyContent="center" gap={3}>
      {KEYBINDINGS.map(({ keys, label }) => (
        <Text key={label}>
          <Text color="blue">{keys}</Text> <Text color="white">{label}</Text>
        </Text>
      ))}
    </Box>
  );
}
