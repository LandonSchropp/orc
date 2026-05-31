import { useConfirmKeybindings } from "./use-confirm-keybindings.ts";
import { describe, expect, it, mock } from "bun:test";
import { Text } from "ink";
import { render } from "ink-testing-library";

/** Renders `useConfirmKeybindings` so the tests can drive its key handling. */
function Harness({ onYes, onNo }: { onYes: () => void; onNo: () => void }) {
  const focused = useConfirmKeybindings(onYes, onNo);
  return <Text>focus={focused}</Text>;
}

const noop = () => {};

/**
 * Yields to the event loop so React can flush a state update before the next assertion or write.
 * `ink-testing-library` does not expose Ink's `waitUntilRenderFlush`, and React's `act` emits its
 * own warnings against Ink's internal effects, so a plain `setTimeout(0)` is the cleanest option.
 */
function flush() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe("useConfirmKeybindings", () => {
  describe("when first rendered", () => {
    it("focuses Yes", () => {
      const { lastFrame } = render(<Harness onYes={noop} onNo={noop} />);

      expect(lastFrame()).toContain("focus=yes");
    });
  });

  describe("when the right arrow is pressed", () => {
    it("focuses No", async () => {
      const { stdin, lastFrame } = render(<Harness onYes={noop} onNo={noop} />);

      stdin.write(String.fromCharCode(27) + "[C");
      await flush();

      expect(lastFrame()).toContain("focus=no");
    });
  });

  describe("when l is pressed", () => {
    it("focuses No", async () => {
      const { stdin, lastFrame } = render(<Harness onYes={noop} onNo={noop} />);

      stdin.write("l");
      await flush();

      expect(lastFrame()).toContain("focus=no");
    });
  });

  describe("when the left arrow is pressed after navigating right", () => {
    it("focuses Yes again", async () => {
      const { stdin, lastFrame } = render(<Harness onYes={noop} onNo={noop} />);

      stdin.write("l");
      await flush();
      stdin.write(String.fromCharCode(27) + "[D");
      await flush();

      expect(lastFrame()).toContain("focus=yes");
    });
  });

  describe("when h is pressed after navigating right", () => {
    it("focuses Yes again", async () => {
      const { stdin, lastFrame } = render(<Harness onYes={noop} onNo={noop} />);

      stdin.write("l");
      await flush();
      stdin.write("h");
      await flush();

      expect(lastFrame()).toContain("focus=yes");
    });
  });

  describe("when the left arrow is pressed with Yes focused", () => {
    it("stays focused on Yes", async () => {
      const { stdin, lastFrame } = render(<Harness onYes={noop} onNo={noop} />);

      stdin.write(String.fromCharCode(27) + "[D");
      await flush();

      expect(lastFrame()).toContain("focus=yes");
    });
  });

  describe("when the right arrow is pressed with No focused", () => {
    it("stays focused on No", async () => {
      const { stdin, lastFrame } = render(<Harness onYes={noop} onNo={noop} />);

      stdin.write("l");
      await flush();
      stdin.write("l");
      await flush();

      expect(lastFrame()).toContain("focus=no");
    });
  });

  describe("when enter is pressed without moving focus", () => {
    it("calls onYes", () => {
      const onYes = mock(() => {});
      const onNo = mock(() => {});

      const { stdin } = render(<Harness onYes={onYes} onNo={onNo} />);

      stdin.write("\r");

      expect(onYes).toHaveBeenCalled();
      expect(onNo).not.toHaveBeenCalled();
    });
  });

  describe("when enter is pressed after focusing No", () => {
    it("calls onNo", async () => {
      const onYes = mock(() => {});
      const onNo = mock(() => {});

      const { stdin } = render(<Harness onYes={onYes} onNo={onNo} />);

      stdin.write("l");
      await flush();
      stdin.write("\r");

      expect(onNo).toHaveBeenCalled();
      expect(onYes).not.toHaveBeenCalled();
    });
  });

  describe("when y is pressed", () => {
    it("calls onYes", () => {
      const onYes = mock(() => {});
      const onNo = mock(() => {});

      const { stdin } = render(<Harness onYes={onYes} onNo={onNo} />);

      stdin.write("y");

      expect(onYes).toHaveBeenCalled();
      expect(onNo).not.toHaveBeenCalled();
    });
  });

  describe("when n is pressed", () => {
    it("calls onNo", () => {
      const onYes = mock(() => {});
      const onNo = mock(() => {});

      const { stdin } = render(<Harness onYes={onYes} onNo={onNo} />);

      stdin.write("n");

      expect(onNo).toHaveBeenCalled();
      expect(onYes).not.toHaveBeenCalled();
    });
  });

  describe("when escape is pressed", () => {
    it("calls onNo", async () => {
      const onYes = mock(() => {});
      const onNo = mock(() => {});

      const { stdin } = render(<Harness onYes={onYes} onNo={onNo} />);

      stdin.write(String.fromCharCode(27));
      await new Promise((resolve) => setTimeout(resolve, 30));

      expect(onNo).toHaveBeenCalled();
      expect(onYes).not.toHaveBeenCalled();
    });
  });
});
