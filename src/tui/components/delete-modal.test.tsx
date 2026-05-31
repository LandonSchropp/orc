import { projectFactory } from "../../../test/factories/project.ts";
import { storeFactory } from "../../../test/factories/store.ts";
import * as storeModule from "../state/store.tsx";
import { DeleteModal } from "./delete-modal.tsx";
import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import { Box } from "ink";
import { render } from "ink-testing-library";
import type { ReactNode } from "react";

const deleteSessionMock = mock(() => Promise.resolve());

await mock.module("../../sessions/delete.ts", () => ({
  deleteSession: deleteSessionMock,
}));

/**
 * Wraps DeleteModal in a sized viewport so the modal overlay has a parent to anchor to.
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

describe("DeleteModal", () => {
  /**
   * Stubs the store with a single selected "orc/tui" session.
   *
   * @returns The `cancel` and `removeSession` mocks and the selected session.
   */
  function setup() {
    const cancel = mock(() => {});
    const removeSession = mock(() => {});
    const project = projectFactory.build({ project: "orc" }, { transient: { sessions: ["tui"] } });
    const session = project.sessions[0];
    spyOn(storeModule, "useStore").mockReturnValue(
      storeFactory.build({
        selectedSessionId: session.id,
        projects: [project],
        cancel,
        removeSession,
      }),
    );
    return { cancel, removeSession, session };
  }

  it("renders the session name in the message", () => {
    setup();

    const { lastFrame } = renderInViewport(<DeleteModal />);

    expect(lastFrame()).toContain('Delete session "tui"?');
  });

  describe("when the user confirms", () => {
    it("deletes the session, removes it from the list, and closes the modal", async () => {
      const { cancel, removeSession, session } = setup();

      const { stdin } = renderInViewport(<DeleteModal />);

      stdin.write("y");
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(deleteSessionMock).toHaveBeenCalledWith("orc", "tui");
      expect(removeSession).toHaveBeenCalledWith(session.id);
      expect(cancel).toHaveBeenCalled();
    });
  });

  describe("when the user cancels", () => {
    it("closes the modal without deleting", () => {
      const { cancel } = setup();

      const { stdin } = renderInViewport(<DeleteModal />);

      stdin.write("n");

      expect(cancel).toHaveBeenCalled();
      expect(deleteSessionMock).not.toHaveBeenCalled();
    });
  });

  describe("when no session is selected", () => {
    it("renders nothing", () => {
      spyOn(storeModule, "useStore").mockReturnValue(
        storeFactory.build({ selectedSessionId: null }),
      );

      const { lastFrame } = renderInViewport(<DeleteModal />);

      expect(lastFrame()?.trim()).toBe("");
    });
  });
});
