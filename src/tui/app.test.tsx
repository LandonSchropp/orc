import { projectFactory } from "../../test/factories/project.ts";
import { storeFactory } from "../../test/factories/store.ts";
import { App } from "./app.tsx";
import * as storeModule from "./state/store.tsx";
import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import * as ink from "ink";
import { render } from "ink-testing-library";

const exit = mock(() => {});

beforeEach(() => {
  spyOn(storeModule, "useStore").mockReturnValue(
    storeFactory.build({
      projects: [projectFactory.build({ project: "demo" }, { transient: { sessions: ["alpha"] } })],
    }),
  );
  spyOn(ink, "useApp").mockReturnValue({ exit, waitUntilRenderFlush: () => Promise.resolve() });
});

describe("App", () => {
  it("renders the header", () => {
    const { lastFrame } = render(<App />);
    expect(lastFrame()).toContain("orc");
  });

  it("renders the project list", () => {
    const { lastFrame } = render(<App />);
    expect(lastFrame()).toContain("alpha");
  });

  it("renders the footer", () => {
    const { lastFrame } = render(<App />);
    expect(lastFrame()).toContain("quit");
  });

  describe("when q is pressed", () => {
    it("exits the app", () => {
      const { stdin } = render(<App />);

      stdin.write("q");

      expect(exit).toHaveBeenCalled();
    });
  });

  describe("when escape is pressed", () => {
    it("exits the app", async () => {
      const { stdin } = render(<App />);

      // Ink holds a lone escape for ~20ms to disambiguate it from an escape sequence before
      // flushing it as the escape key, so wait past that delay.
      stdin.write(String.fromCharCode(27));
      await new Promise((resolve) => setTimeout(resolve, 30));

      expect(exit).toHaveBeenCalled();
    });
  });

  describe("when another key is pressed", () => {
    it("stays open", () => {
      const { stdin } = render(<App />);

      stdin.write("x");

      expect(exit).not.toHaveBeenCalled();
    });
  });
});
