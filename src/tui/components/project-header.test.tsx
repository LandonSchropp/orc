import { projectFactory } from "../../../test/factories/project.ts";
import { storeFactory } from "../../../test/factories/store.ts";
import * as storeModule from "../state/store.tsx";
import { ProjectHeader } from "./project-header.tsx";
import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { render } from "ink-testing-library";

beforeEach(() => {
  spyOn(storeModule, "useStore").mockReturnValue(storeFactory.build());
});

describe("ProjectHeader", () => {
  it("renders the project name", () => {
    const project = projectFactory.build({ project: "orc" });

    const { lastFrame } = render(<ProjectHeader project={project} />);

    expect(lastFrame()).toContain("orc");
  });

  it("wraps the project name in a rule", () => {
    const project = projectFactory.build({ project: "orc" });

    const { lastFrame } = render(<ProjectHeader project={project} />);

    expect(lastFrame()).toContain("─ orc ─");
  });
});
