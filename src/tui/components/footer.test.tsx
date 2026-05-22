import { Footer } from "./footer.tsx";
import { describe, expect, it } from "bun:test";
import { render } from "ink-testing-library";

describe("Footer", () => {
  it("renders the footer placeholder", () => {
    const { lastFrame } = render(<Footer />);
    expect(lastFrame()).toContain("Footer");
  });
});
