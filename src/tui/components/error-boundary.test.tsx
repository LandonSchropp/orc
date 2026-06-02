import { ErrorBoundary } from "./error-boundary.tsx";
import { describe, expect, it, mock } from "bun:test";
import { Text } from "ink";
import { render } from "ink-testing-library";

/** Throws during render so the boundary catches it. */
function Boom(): never {
  throw new Error("render boom");
}

describe("ErrorBoundary", () => {
  describe("when its children render without throwing", () => {
    it("renders the children", () => {
      const { lastFrame } = render(
        <ErrorBoundary onError={() => {}}>
          <Text>all good</Text>
        </ErrorBoundary>,
      );

      expect(lastFrame()).toContain("all good");
    });

    it("does not call onError", () => {
      const onError = mock(() => {});

      render(
        <ErrorBoundary onError={onError}>
          <Text>all good</Text>
        </ErrorBoundary>,
      );

      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe("when a child throws during render", () => {
    it("calls onError with the thrown error", () => {
      const onError = mock(() => {});

      render(
        <ErrorBoundary onError={onError}>
          <Boom />
        </ErrorBoundary>,
      );

      expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: "render boom" }));
    });

    it("renders nothing in place of the children", () => {
      const { lastFrame } = render(
        <ErrorBoundary onError={() => {}}>
          <Boom />
        </ErrorBoundary>,
      );

      expect(lastFrame()).not.toContain("render boom");
    });
  });
});
