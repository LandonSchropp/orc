import { projectFactory } from "../../../test/factories/project.ts";
import { storeFactory } from "../../../test/factories/store.ts";
import * as storeModule from "../state/store.tsx";
import { Project } from "./project.tsx";
import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { render } from "ink-testing-library";

beforeEach(() => {
  spyOn(storeModule, "useStore").mockReturnValue(storeFactory.build());
});

describe("Project", () => {
  it("renders the project name", () => {
    const project = projectFactory.build(
      { project: "orc" },
      { transient: { sessions: ["alpha"] } },
    );

    const { lastFrame } = render(<Project project={project} />);

    expect(lastFrame()).toContain("orc");
  });

  it("renders each session", () => {
    const project = projectFactory.build(
      { project: "orc" },
      { transient: { sessions: ["alpha", "bravo", "charlie"] } },
    );

    const { lastFrame } = render(<Project project={project} />);

    expect(lastFrame()).toContain("alpha");
    expect(lastFrame()).toContain("bravo");
    expect(lastFrame()).toContain("charlie");
  });
});
