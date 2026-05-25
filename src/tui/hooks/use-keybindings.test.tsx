import { storeFactory } from "../../../test/factories/store.ts";
import * as storeModule from "../state/store.tsx";
import { useKeybindings } from "./use-keybindings.ts";
import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import * as ink from "ink";
import { render } from "ink-testing-library";

const exit = mock(() => {});

function Harness() {
  useKeybindings();
  return null;
}

beforeEach(() => {
  spyOn(storeModule, "useStore").mockReturnValue(storeFactory.build());
  spyOn(ink, "useApp").mockReturnValue({ exit, waitUntilRenderFlush: () => Promise.resolve() });
});

describe("useKeybindings", () => {
  describe("when q is pressed", () => {
    it("exits the app", () => {
      const { stdin } = render(<Harness />);

      stdin.write("q");

      expect(exit).toHaveBeenCalled();
    });
  });

  describe("when escape is pressed", () => {
    it("exits the app", async () => {
      const { stdin } = render(<Harness />);

      // Ink holds a lone escape for ~20ms to disambiguate it from an escape sequence before
      // flushing it as the escape key, so wait past that delay.
      stdin.write(String.fromCharCode(27));
      await new Promise((resolve) => setTimeout(resolve, 30));

      expect(exit).toHaveBeenCalled();
    });
  });

  describe("when another key is pressed", () => {
    it("stays open", () => {
      const { stdin } = render(<Harness />);

      stdin.write("x");

      expect(exit).not.toHaveBeenCalled();
    });
  });

  describe("when the up arrow or k is pressed", () => {
    it("moves the selection up", () => {
      const moveUp = mock(() => {});
      spyOn(storeModule, "useStore").mockReturnValue(storeFactory.build({ moveUp }));

      const { stdin } = render(<Harness />);

      stdin.write(String.fromCharCode(27) + "[A");
      stdin.write("k");

      expect(moveUp).toHaveBeenCalledTimes(2);
    });
  });

  describe("when the down arrow or j is pressed", () => {
    it("moves the selection down", () => {
      const moveDown = mock(() => {});
      spyOn(storeModule, "useStore").mockReturnValue(storeFactory.build({ moveDown }));

      const { stdin } = render(<Harness />);

      stdin.write(String.fromCharCode(27) + "[B");
      stdin.write("j");

      expect(moveDown).toHaveBeenCalledTimes(2);
    });
  });

  describe("when the left arrow or h is pressed", () => {
    it("moves the selection left", () => {
      const moveLeft = mock(() => {});
      spyOn(storeModule, "useStore").mockReturnValue(storeFactory.build({ moveLeft }));

      const { stdin } = render(<Harness />);

      stdin.write(String.fromCharCode(27) + "[D");
      stdin.write("h");

      expect(moveLeft).toHaveBeenCalledTimes(2);
    });
  });

  describe("when the right arrow or l is pressed", () => {
    it("moves the selection right", () => {
      const moveRight = mock(() => {});
      spyOn(storeModule, "useStore").mockReturnValue(storeFactory.build({ moveRight }));

      const { stdin } = render(<Harness />);

      stdin.write(String.fromCharCode(27) + "[C");
      stdin.write("l");

      expect(moveRight).toHaveBeenCalledTimes(2);
    });
  });
});
