import { storeFactory } from "../../../test/factories/store.ts";
import * as storeModule from "../state/store.tsx";
import { ActiveModal } from "./active-modal.tsx";
import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import { Box } from "ink";
import { render } from "ink-testing-library";
import type { ReactNode } from "react";

const DeleteModalMock = mock(() => null);

await mock.module("./delete-modal.tsx", () => ({
  DeleteModal: DeleteModalMock,
}));

/** Wraps ActiveModal in a sized viewport so any modal overlay has a parent to anchor to. */
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

describe("ActiveModal", () => {
  describe("when no modal is active", () => {
    it("renders nothing", () => {
      const { lastFrame } = renderInViewport(<ActiveModal />);

      expect(lastFrame()?.trim()).toBe("");
    });
  });

  describe("when the delete modal is active", () => {
    it("renders the DeleteModal", () => {
      spyOn(storeModule, "useStore").mockReturnValue(
        storeFactory.build({ activeModal: { type: "delete" } }),
      );

      renderInViewport(<ActiveModal />);

      expect(DeleteModalMock).toHaveBeenCalled();
    });
  });

  describe("when the project picker modal is active", () => {
    it("renders nothing (not yet implemented)", () => {
      spyOn(storeModule, "useStore").mockReturnValue(
        storeFactory.build({ activeModal: { type: "project-picker" } }),
      );

      const { lastFrame } = renderInViewport(<ActiveModal />);

      expect(lastFrame()?.trim()).toBe("");
    });
  });

  describe("when the session name modal is active", () => {
    it("renders nothing (not yet implemented)", () => {
      spyOn(storeModule, "useStore").mockReturnValue(
        storeFactory.build({
          activeModal: { type: "session-name", project: "orc" },
        }),
      );

      const { lastFrame } = renderInViewport(<ActiveModal />);

      expect(lastFrame()?.trim()).toBe("");
    });
  });
});
