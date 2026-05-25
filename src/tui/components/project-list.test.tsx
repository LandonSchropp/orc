import { ProjectList } from "./project-list.tsx";
import { describe, expect, it } from "bun:test";
import { render } from "ink-testing-library";

describe("ProjectList", () => {
  it("renders the session list placeholder", () => {
    const { lastFrame } = render(<ProjectList />);
    expect(lastFrame()).toContain("Sessions");
  });
});
