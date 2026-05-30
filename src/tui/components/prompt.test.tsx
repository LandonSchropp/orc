import { Prompt } from "./prompt.tsx";
import { describe, expect, it, mock } from "bun:test";
import { Box } from "ink";
import { render } from "ink-testing-library";
import type { ReactNode } from "react";

/** Wraps the prompt in a sized viewport so its full-window overlay has a parent to anchor to. */
function renderInViewport(children: ReactNode) {
  return render(
    <Box width={80} height={20}>
      {children}
    </Box>,
  );
}

const noop = () => {};

describe("Prompt", () => {
  it("renders the message", () => {
    const { lastFrame } = renderInViewport(
      <Prompt message="Session name?" onSubmit={noop} onCancel={noop} />,
    );

    expect(lastFrame()).toContain("Session name?");
  });

  describe("when a default value is provided", () => {
    it("renders the default value", () => {
      const { lastFrame } = renderInViewport(
        <Prompt message="x" defaultValue="main" onSubmit={noop} onCancel={noop} />,
      );

      expect(lastFrame()).toContain("main");
    });
  });

  describe("when enter is pressed", () => {
    it("calls onSubmit with the current value", () => {
      const onSubmit = mock(() => {});
      const onCancel = mock(() => {});

      const { stdin } = renderInViewport(
        <Prompt message="x" defaultValue="main" onSubmit={onSubmit} onCancel={onCancel} />,
      );

      stdin.write("\r");

      expect(onSubmit).toHaveBeenCalledWith("main");
      expect(onCancel).not.toHaveBeenCalled();
    });
  });

  describe("when escape is pressed", () => {
    it("calls onCancel", async () => {
      const onSubmit = mock(() => {});
      const onCancel = mock(() => {});

      const { stdin } = renderInViewport(
        <Prompt message="x" defaultValue="main" onSubmit={onSubmit} onCancel={onCancel} />,
      );

      stdin.write(String.fromCharCode(27));
      await new Promise((resolve) => setTimeout(resolve, 30));

      expect(onCancel).toHaveBeenCalled();
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
});
