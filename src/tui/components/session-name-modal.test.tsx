import { projectFactory } from "../../../test/factories/project.ts";
import { storeFactory } from "../../../test/factories/store.ts";
import { waitFor } from "../../../test/helpers/wait-for.ts";
import * as storeModule from "../state/store.tsx";
import { SessionNameModal } from "./session-name-modal.tsx";
import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import { Box } from "ink";
import { render } from "ink-testing-library";
import type { ReactNode } from "react";

const createSessionMock = mock(() => Promise.resolve());

await mock.module("../../sessions/create.ts", () => ({
  createSession: createSessionMock,
}));

/**
 * Wraps the modal in a sized viewport so its overlay has a parent to anchor to.
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

beforeEach(() => {
  spyOn(storeModule, "useStore").mockReturnValue(storeFactory.build());
});

describe("SessionNameModal", () => {
  describe("when no session-name modal is active", () => {
    it("renders nothing", () => {
      spyOn(storeModule, "useStore").mockReturnValue(storeFactory.build({ activeModal: null }));

      const { lastFrame } = renderInViewport(<SessionNameModal />);

      expect(lastFrame()?.trim()).toBe("");
    });
  });

  it("displays the project name in the message", () => {
    spyOn(storeModule, "useStore").mockReturnValue(
      storeFactory.build({
        activeModal: { type: "session-name", project: "agent-toolkit" },
        projects: [],
      }),
    );

    const { lastFrame } = renderInViewport(<SessionNameModal />);

    expect(lastFrame()).toContain("agent-toolkit");
  });

  describe("when no session on the project uses the main worktree", () => {
    it("defaults the input value to 'main'", () => {
      spyOn(storeModule, "useStore").mockReturnValue(
        storeFactory.build({
          activeModal: { type: "session-name", project: "orc" },
          projects: [],
        }),
      );

      const { lastFrame } = renderInViewport(<SessionNameModal />);

      expect(lastFrame()).toContain("main");
    });
  });

  describe("when a session on the project already uses the main worktree", () => {
    it("defaults the input value to empty", () => {
      const project = projectFactory.build(
        { project: "orc" },
        { transient: { sessions: ["existing"] } },
      );
      // The factory builds sessions with worktree="main" by default.
      spyOn(storeModule, "useStore").mockReturnValue(
        storeFactory.build({
          activeModal: { type: "session-name", project: "orc" },
          projects: [project],
        }),
      );

      const { lastFrame } = renderInViewport(<SessionNameModal />);

      expect(lastFrame()).not.toContain("main");
    });
  });

  describe("when the user submits a session name", () => {
    it("creates the session and closes the modal", async () => {
      const cancel = mock(() => {});
      spyOn(storeModule, "useStore").mockReturnValue(
        storeFactory.build({
          activeModal: { type: "session-name", project: "orc" },
          projects: [],
          cancel,
        }),
      );

      const { stdin } = renderInViewport(<SessionNameModal />);

      stdin.write("\r");
      await waitFor(() => cancel.mock.calls.length > 0);

      expect(createSessionMock).toHaveBeenCalledWith("orc", "main");
      expect(cancel).toHaveBeenCalled();
    });
  });

  describe("when a session with the entered name already exists", () => {
    it("shows an error and does not create the session", async () => {
      const cancel = mock(() => {});
      const project = projectFactory.build(
        { project: "orc" },
        { transient: { sessions: ["main"] } },
      );
      spyOn(storeModule, "useStore").mockReturnValue(
        storeFactory.build({
          activeModal: { type: "session-name", project: "orc" },
          projects: [project],
          cancel,
        }),
      );

      const { lastFrame, stdin } = renderInViewport(<SessionNameModal />);

      stdin.write("main");
      await waitFor(() => lastFrame()?.includes("main") ?? false);
      stdin.write("\r");
      await waitFor(() => lastFrame()?.includes("already exists") ?? false);

      // The message breaks onto its own line at "already exists", so the name and the rest of the
      // sentence land on separate rows.
      const nameRow = (lastFrame() ?? "")
        .split("\n")
        .find((row) => row.includes("A session named"));
      expect(nameRow).not.toContain("already exists");

      expect(createSessionMock).not.toHaveBeenCalled();
      expect(cancel).not.toHaveBeenCalled();
    });
  });

  describe("when the user cancels", () => {
    it("closes the modal without creating", async () => {
      const cancel = mock(() => {});
      spyOn(storeModule, "useStore").mockReturnValue(
        storeFactory.build({
          activeModal: { type: "session-name", project: "orc" },
          projects: [],
          cancel,
        }),
      );

      const { stdin } = renderInViewport(<SessionNameModal />);

      stdin.write(String.fromCharCode(27));
      await new Promise((resolve) => setTimeout(resolve, 30));

      expect(cancel).toHaveBeenCalled();
      expect(createSessionMock).not.toHaveBeenCalled();
    });
  });
});
