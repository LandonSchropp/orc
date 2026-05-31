import { usePickerKeybindings } from "./use-picker-keybindings.ts";
import { describe, expect, it, mock } from "bun:test";
import { Text } from "ink";
import { render } from "ink-testing-library";

/** Renders `usePickerKeybindings` so the tests can drive its key handling. */
function Harness({ totalRows, onCancel }: { totalRows: number; onCancel: () => void }) {
  const { focusedIndex } = usePickerKeybindings(totalRows, onCancel);
  return <Text>focus={focusedIndex}</Text>;
}

const noop = () => {};

/**
 * Yields to the event loop so React can flush a state update before the next assertion or write.
 *
 * @returns A promise that resolves on the next tick.
 */
function flush() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe("usePickerKeybindings", () => {
  describe("when first rendered", () => {
    it("focuses the first row", () => {
      const { lastFrame } = render(<Harness totalRows={3} onCancel={noop} />);

      expect(lastFrame()).toContain("focus=0");
    });
  });

  describe("when the down arrow is pressed", () => {
    it("focuses the next row", async () => {
      const { stdin, lastFrame } = render(<Harness totalRows={3} onCancel={noop} />);

      stdin.write(String.fromCharCode(27) + "[B");
      await flush();

      expect(lastFrame()).toContain("focus=1");
    });
  });

  describe("when the down arrow is pressed past the last row", () => {
    it("stays at the last row", async () => {
      const { stdin, lastFrame } = render(<Harness totalRows={2} onCancel={noop} />);

      stdin.write(String.fromCharCode(27) + "[B");
      await flush();
      stdin.write(String.fromCharCode(27) + "[B");
      await flush();

      expect(lastFrame()).toContain("focus=1");
    });
  });

  describe("when the up arrow is pressed past the first row", () => {
    it("stays at the first row", async () => {
      const { stdin, lastFrame } = render(<Harness totalRows={2} onCancel={noop} />);

      stdin.write(String.fromCharCode(27) + "[A");
      await flush();

      expect(lastFrame()).toContain("focus=0");
    });
  });

  describe("when escape is pressed", () => {
    it("calls onCancel", async () => {
      const onCancel = mock(() => {});

      const { stdin } = render(<Harness totalRows={1} onCancel={onCancel} />);

      stdin.write(String.fromCharCode(27));
      await new Promise((resolve) => setTimeout(resolve, 30));

      expect(onCancel).toHaveBeenCalled();
    });
  });
});
