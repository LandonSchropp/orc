import { App } from "./app.tsx";
import * as storeModule from "./state/store.tsx";
import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { render } from "ink-testing-library";

const store = {
  projects: [],
  selectedSessionId: null,
  numberOfColumns: 3,
  leftMargin: 4,
  rightMargin: 4,
  windowHeight: 30,
  lastSelectedColumn: null,
  setSessions: () => {},
  setWindowSize: () => {},
  moveLeft: () => {},
  moveRight: () => {},
  moveUp: () => {},
  moveDown: () => {},
};

beforeEach(() => {
  spyOn(storeModule, "useStore").mockReturnValue(store);
});

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
