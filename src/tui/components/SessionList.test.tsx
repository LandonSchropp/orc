import { SessionList } from "./SessionList.tsx";
import { describe, expect, it } from "bun:test";
import { render } from "ink-testing-library";

describe("SessionList", () => {
  it("renders the session list placeholder", () => {
    const { lastFrame } = render(<SessionList />);
    expect(lastFrame()).toContain("Sessions");
  });
});
