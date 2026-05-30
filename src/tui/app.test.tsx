import { projectFactory } from "../../test/factories/project.ts";
import { storeFactory } from "../../test/factories/store.ts";
import { App } from "./app.tsx";
import * as storeModule from "./state/store.tsx";
import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { render } from "ink-testing-library";

beforeEach(() => {
  spyOn(storeModule, "useStore").mockReturnValue(
    storeFactory.build({
      projects: [projectFactory.build({ project: "demo" }, { transient: { sessions: ["alpha"] } })],
    }),
  );
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
});
