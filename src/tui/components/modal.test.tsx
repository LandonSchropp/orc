import { Modal } from "./modal.tsx";
import { describe, expect, it } from "bun:test";
import { Box, Text } from "ink";
import { render } from "ink-testing-library";
import type { ReactNode } from "react";

/** Wraps the Modal in a sized viewport so its `position="absolute"` fill has a parent to anchor to. */
function renderInViewport(children: ReactNode) {
  return render(
    <Box width={80} height={20}>
      {children}
    </Box>,
  );
}

describe("Modal", () => {
  it("renders its children", () => {
    const { lastFrame } = renderInViewport(
      <Modal>
        <Text>hello</Text>
      </Modal>,
    );

    expect(lastFrame()).toContain("hello");
  });

  describe("when a title is provided", () => {
    it("renders the title", () => {
      const { lastFrame } = renderInViewport(
        <Modal title="Confirm">
          <Text>hello</Text>
        </Modal>,
      );

      expect(lastFrame()).toContain("Confirm");
    });
  });
});
