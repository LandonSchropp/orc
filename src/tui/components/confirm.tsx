import { useConfirmKeybindings } from "../hooks/use-confirm-keybindings.ts";
import { Modal } from "./modal.tsx";
import { Box, Text } from "ink";

type ConfirmProps = {
  /** Optional title rendered at the top of the modal. */
  title?: string;
  /** Message shown above the button row. */
  message: string;
  /** Fires when the user picks Yes. */
  onYes: () => void;
  /** Fires when the user picks No, presses escape, or otherwise dismisses the modal. */
  onNo: () => void;
};

/**
 * Renders a single button: black background when unfocused, gray when focused, matching the session
 * cards.
 */
function Button({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Box backgroundColor={focused ? "gray" : "black"} paddingX={1}>
      <Text>{label}</Text>
    </Box>
  );
}

/**
 * A Yes/No confirmation modal. The user activates a button by pressing `y` or `n`, by pressing
 * enter on the focused button, or by pressing escape (equivalent to No).
 */
export function Confirm({ title, message, onYes, onNo }: ConfirmProps) {
  const focused = useConfirmKeybindings(onYes, onNo);

  return (
    <Modal title={title}>
      <Box flexDirection="column" alignItems="center" paddingY={1}>
        <Text>{message}</Text>
        <Box marginTop={1} gap={2} justifyContent="center">
          <Button label="(Y)es" focused={focused === "yes"} />
          <Button label="(N)o" focused={focused === "no"} />
        </Box>
      </Box>
    </Modal>
  );
}
