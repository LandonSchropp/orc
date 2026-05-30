import { Modal } from "./modal.tsx";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import { useState } from "react";

/**
 * Width of the input bar, matched to the Modal's interior (MIN_WIDTH=40 minus its paddingX=2 each
 * side).
 */
const INPUT_WIDTH = 36;

type PromptProps = {
  /** Optional title rendered at the top of the modal. */
  title?: string;
  /** Message shown above the text input. */
  message: string;
  /** Initial value prefilled into the input. */
  defaultValue?: string;
  /** Fires when the user presses enter, with the current input value. */
  onSubmit: (value: string) => void;
  /** Fires when the user presses escape. */
  onCancel: () => void;
};

/**
 * A text-input modal. Typing, backspace, and cursor positioning are handled by `ink-text-input`;
 * enter submits the current value and escape cancels.
 */
export function Prompt({ title, message, defaultValue = "", onSubmit, onCancel }: PromptProps) {
  const [value, setValue] = useState(defaultValue);

  useInput((_, key) => {
    if (key.escape) onCancel();
  });

  return (
    <Modal title={title}>
      <Box flexDirection="column" alignItems="center" paddingTop={1}>
        {message.split("\n").map((line, index) => (
          <Text key={index}>{line}</Text>
        ))}
        <Box width={INPUT_WIDTH} flexDirection="column">
          <Text color="black">{"\u{2582}".repeat(INPUT_WIDTH)}</Text>
          <Box backgroundColor="black" paddingX={1} width="100%">
            <TextInput value={value} onChange={setValue} onSubmit={onSubmit} />
          </Box>
          <Text color="black">{"\u{1FB82}".repeat(INPUT_WIDTH)}</Text>
        </Box>
      </Box>
    </Modal>
  );
}
