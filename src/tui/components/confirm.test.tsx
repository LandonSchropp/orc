import { Confirm } from "./confirm.tsx";
import { describe, expect, it } from "bun:test";
import { Box } from "ink";
import { render } from "ink-testing-library";
import type { ReactNode } from "react";

/**
 * Wraps the confirm modal in a sized viewport so its full-window overlay has a parent to anchor to.
 *
 * @returns The ink-testing-library render result.
 */
function renderInViewport(children: ReactNode) {
  return render(
    <Box width={80} height={20}>
      {children}
    </Box>,
  );
}

const noop = () => {};

describe("Confirm", () => {
  it("renders the message", () => {
    const { lastFrame } = renderInViewport(
      <Confirm message="Delete the session?" onYes={noop} onNo={noop} />,
    );

    expect(lastFrame()).toContain("Delete the session?");
  });

  it("renders the Yes and No buttons with their mnemonics wrapped", () => {
    const { lastFrame } = renderInViewport(<Confirm message="x" onYes={noop} onNo={noop} />);

    const frame = lastFrame();

    expect(frame).toContain("(Y)es");
    expect(frame).toContain("(N)o");
  });
});
