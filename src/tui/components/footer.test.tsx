import { Footer } from "./footer.tsx";
import { describe, expect, it } from "bun:test";
import { render } from "ink-testing-library";

describe("Footer", () => {
  it("renders the move keybinding", () => {
    const { lastFrame } = render(<Footer />);
    expect(lastFrame()).toContain("move");
  });

  it("renders the attach keybinding", () => {
    const { lastFrame } = render(<Footer />);
    expect(lastFrame()).toContain("attach");
  });

  it("renders the new keybinding", () => {
    const { lastFrame } = render(<Footer />);
    expect(lastFrame()).toContain("new");
  });

  it("renders the delete keybinding", () => {
    const { lastFrame } = render(<Footer />);
    expect(lastFrame()).toContain("delete");
  });

  it("renders the quit keybinding", () => {
    const { lastFrame } = render(<Footer />);
    expect(lastFrame()).toContain("quit");
  });
});
