import { AgentStatus } from "./agent-status.tsx";
import { describe, expect, it, mock } from "bun:test";
import { render } from "ink-testing-library";

const useIntervalMock = mock(() => 0);

await mock.module("../hooks/use-interval.ts", () => ({
  useInterval: useIntervalMock,
}));

const SPINNER_FRAMES = ["", "", "", "", "", ""];
const WAITING_ICON = "";
const IDLE_ICON = "\u{F0130}";

describe("AgentStatus", () => {
  describe("when the status is Waiting", () => {
    it("renders the clock icon", () => {
      const { lastFrame } = render(<AgentStatus status="Waiting" />);
      expect(lastFrame()).toContain(WAITING_ICON);
    });

    it("renders the status label", () => {
      const { lastFrame } = render(<AgentStatus status="Waiting" />);
      expect(lastFrame()).toContain("waiting");
    });
  });

  describe("when the status is Idle", () => {
    it("renders the empty circle icon", () => {
      const { lastFrame } = render(<AgentStatus status="Idle" />);
      expect(lastFrame()).toContain(IDLE_ICON);
    });

    it("renders the status label", () => {
      const { lastFrame } = render(<AgentStatus status="Idle" />);
      expect(lastFrame()).toContain("idle");
    });
  });

  describe("when the status is Working", () => {
    it("renders the status label", () => {
      useIntervalMock.mockReturnValue(0);
      const { lastFrame } = render(<AgentStatus status="Working" />);
      expect(lastFrame()).toContain("working");
    });

    describe("at tick 0", () => {
      it("renders the first spinner frame", () => {
        useIntervalMock.mockReturnValue(0);
        const { lastFrame } = render(<AgentStatus status="Working" />);
        expect(lastFrame()).toContain(SPINNER_FRAMES[0]);
      });
    });

    describe("at tick 1", () => {
      it("renders the second spinner frame", () => {
        useIntervalMock.mockReturnValue(1);
        const { lastFrame } = render(<AgentStatus status="Working" />);
        expect(lastFrame()).toContain(SPINNER_FRAMES[1]);
      });
    });

    describe("when the tick exceeds the frame count", () => {
      it("wraps back to the first frame", () => {
        useIntervalMock.mockReturnValue(SPINNER_FRAMES.length);
        const { lastFrame } = render(<AgentStatus status="Working" />);
        expect(lastFrame()).toContain(SPINNER_FRAMES[0]);
      });
    });
  });
});
