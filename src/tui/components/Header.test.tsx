import { Header } from "./Header.tsx";
import { describe, expect, it } from "bun:test";
import { render } from "ink-testing-library";

describe("Header", () => {
  it("renders the header placeholder", () => {
    const { lastFrame } = render(<Header />);
    expect(lastFrame()).toContain("Header");
  });
});
