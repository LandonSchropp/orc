import { Box, Text } from "ink";
import type { ReactNode } from "react";

type ModalProps = {
  /** Optional title rendered at the top of the modal. */
  title?: string;
  /** The content rendered inside the modal frame. */
  children: ReactNode;
};

/**
 * A centered, bordered overlay that floats above the rest of the TUI. Renders as a full-viewport
 * absolute box so the underlying app stays mounted and visible behind it.
 */
export function Modal({ title, children }: ModalProps) {
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      justifyContent="center"
      alignItems="center"
    >
      <Box>
        <Box
          borderStyle="round"
          flexDirection="column"
          paddingX={2}
          paddingY={1}
          backgroundColor="default"
        >
          {children}
        </Box>
        {title === undefined ? null : (
          <Box position="absolute" top={0} left={0} right={0} justifyContent="center">
            <Text bold>{` ${title} `}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
