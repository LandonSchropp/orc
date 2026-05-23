import { App } from "./app.tsx";
import { describe, expect, it } from "bun:test";
import { render } from "ink-testing-library";

describe("App", () => {
  it("renders the header", () => {
    const { lastFrame } = render(<App />);
    expect(lastFrame()).toContain("orc");
  });

  it("renders the session list", () => {
    const { lastFrame } = render(<App />);
    expect(lastFrame()).toContain("Sessions");
  });

  it("renders the footer", () => {
    const { lastFrame } = render(<App />);
    expect(lastFrame()).toContain("Footer");
  });
});
