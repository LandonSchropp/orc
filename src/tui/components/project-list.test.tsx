import { projectFactory } from "../../../test/factories/project.ts";
import { storeFactory } from "../../../test/factories/store.ts";
import * as storeModule from "../state/store.tsx";
import { ProjectList } from "./project-list.tsx";
import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { render } from "ink-testing-library";

beforeEach(() => {
  spyOn(storeModule, "useStore").mockReturnValue(storeFactory.build());
});

describe("ProjectList", () => {
  it("renders each project", () => {
    spyOn(storeModule, "useStore").mockReturnValue(
      storeFactory.build({
        projects: [
          projectFactory.build({ project: "orc" }, { transient: { sessions: ["alpha"] } }),
          projectFactory.build({ project: "notes" }, { transient: { sessions: ["bravo"] } }),
        ],
      }),
    );

    const { lastFrame } = render(<ProjectList />);

    expect(lastFrame()).toContain("orc");
    expect(lastFrame()).toContain("notes");
  });

  it("renders the sessions within a project", () => {
    spyOn(storeModule, "useStore").mockReturnValue(
      storeFactory.build({
        projects: [
          projectFactory.build({ project: "orc" }, { transient: { sessions: ["alpha", "bravo"] } }),
        ],
      }),
    );

    const { lastFrame } = render(<ProjectList />);

    expect(lastFrame()).toContain("alpha");
    expect(lastFrame()).toContain("bravo");
  });

  describe("when there are no projects", () => {
    it("renders nothing", () => {
      const { lastFrame } = render(<ProjectList />);

      expect(lastFrame()).toBe("");
    });
  });
});
