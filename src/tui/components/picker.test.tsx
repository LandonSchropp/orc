import { Picker } from "./picker.tsx";
import { describe, expect, it, mock } from "bun:test";
import { Box } from "ink";
import { render } from "ink-testing-library";
import type { ReactNode } from "react";

/** Wraps the picker modal in a sized viewport so its full-window overlay has a parent to anchor to. */
function renderInViewport(children: ReactNode) {
  return render(
    <Box width={80} height={20}>
      {children}
    </Box>,
  );
}

const noop = () => {};

describe("Picker", () => {
  it("renders the title", () => {
    const { lastFrame } = renderInViewport(
      <Picker title="Pick a project" options={["alpha"]} onSelect={noop} onCancel={noop} />,
    );

    expect(lastFrame()).toContain("Pick a project");
  });

  it("renders each option", () => {
    const { lastFrame } = renderInViewport(
      <Picker title="Pick" options={["alpha", "beta", "gamma"]} onSelect={noop} onCancel={noop} />,
    );

    const frame = lastFrame();

    expect(frame).toContain("alpha");
    expect(frame).toContain("beta");
    expect(frame).toContain("gamma");
  });

  describe("when enter is pressed", () => {
    it("calls onSelect with the focused option", () => {
      const onSelect = mock(() => {});

      const { stdin } = renderInViewport(
        <Picker title="Pick" options={["alpha", "beta"]} onSelect={onSelect} onCancel={noop} />,
      );

      stdin.write("\r");

      expect(onSelect).toHaveBeenCalledWith("alpha");
    });
  });

  describe("when the user types a character that filters the list", () => {
    it("renders only the matching options and refocuses the first match", async () => {
      const { stdin, lastFrame } = renderInViewport(
        <Picker
          title="Pick"
          options={["apple", "cherry", "date"]}
          onSelect={noop}
          onCancel={noop}
        />,
      );

      stdin.write("c");
      await new Promise((resolve) => setTimeout(resolve, 0));

      const frame = lastFrame() ?? "";

      expect(frame).toContain("cherry");
      expect(frame).not.toContain("apple");
    });
  });

  describe("when enter is pressed and no options match the query", () => {
    it("does not call onSelect", async () => {
      const onSelect = mock(() => {});

      const { stdin } = renderInViewport(
        <Picker title="Pick" options={["apple"]} onSelect={onSelect} onCancel={noop} />,
      );

      stdin.write("z");
      await new Promise((resolve) => setTimeout(resolve, 0));
      stdin.write("\r");

      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe("when there are more options than visible rows", () => {
    it("scrolls the visible window to keep focus in view", async () => {
      const options = Array.from({ length: 20 }, (_, index) => `option-${index}`);

      const { stdin, lastFrame } = renderInViewport(
        <Picker title="Pick" options={options} onSelect={noop} onCancel={noop} />,
      );

      // Move focus down past the visible window's natural center so the list scrolls.
      for (let index = 0; index < 12; index++) {
        stdin.write(String.fromCharCode(27) + "[B");
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      const frame = lastFrame() ?? "";

      // The first option scrolls out of view once focus pushes past the center.
      expect(frame).not.toContain("option-0");
      expect(frame).toContain("option-12");
    });
  });

  describe("when the user types a newline", () => {
    it("strips the newline from the query", async () => {
      const { stdin, lastFrame } = renderInViewport(
        <Picker title="Pick" options={["apple"]} onSelect={noop} onCancel={noop} />,
      );

      stdin.write("\n");
      await new Promise((resolve) => setTimeout(resolve, 0));

      const frame = lastFrame() ?? "";

      // The header shows `> ` followed by the query, then the count. If `\n` were not stripped, the
      // header line would wrap and the layout would break.
      expect(frame).toContain("> ");
      expect(frame).toContain("1/1");
    });
  });
});
