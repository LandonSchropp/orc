import { projectFactory } from "../../../test/factories/project.ts";
import { storeFactory } from "../../../test/factories/store.ts";
import { waitFor } from "../../../test/helpers/wait-for.ts";
import * as storeModule from "../state/store.tsx";
import { ProjectPickerModal } from "./project-picker-modal.tsx";
import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import { Box } from "ink";
import { render } from "ink-testing-library";
import type { ReactNode } from "react";

const listTmuxinatorProjectsMock = mock(() => Promise.resolve<string[]>([]));

await mock.module("../../commands/tmuxinator.ts", () => ({
  listTmuxinatorProjects: listTmuxinatorProjectsMock,
}));

/** Wraps the modal in a sized viewport so its overlay has a parent to anchor to. */
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

describe("ProjectPickerModal", () => {
  describe("when the projects have loaded", () => {
    it("renders the picker with the projects as options", async () => {
      listTmuxinatorProjectsMock.mockResolvedValue(["orc", "dotfiles", "notes"]);

      const { lastFrame } = renderInViewport(<ProjectPickerModal />);
      await waitFor(() => lastFrame()?.includes("orc") ?? false);

      const frame = lastFrame() ?? "";

      expect(frame).toContain("orc");
      expect(frame).toContain("dotfiles");
      expect(frame).toContain("notes");
    });
  });

  describe("when a project is picked", () => {
    it("opens the session-name prompt for that project", async () => {
      const promptForSession = mock(() => {});
      spyOn(storeModule, "useStore").mockReturnValue(storeFactory.build({ promptForSession }));
      listTmuxinatorProjectsMock.mockResolvedValue(["orc"]);

      const { stdin, lastFrame } = renderInViewport(<ProjectPickerModal />);
      await waitFor(() => lastFrame()?.includes("orc") ?? false);
      await new Promise((resolve) => setTimeout(resolve, 30));

      stdin.write("\r");

      expect(promptForSession).toHaveBeenCalledWith("orc");
    });
  });

  describe("when a session is currently selected", () => {
    it("pre-selects that session's project", async () => {
      const promptForSession = mock(() => {});
      const project = projectFactory.build(
        { project: "dotfiles" },
        { transient: { sessions: ["tui"] } },
      );
      const session = project.sessions[0];
      spyOn(storeModule, "useStore").mockReturnValue(
        storeFactory.build({
          promptForSession,
          selectedSessionId: session.id,
          projects: [project],
        }),
      );
      listTmuxinatorProjectsMock.mockResolvedValue(["orc", "dotfiles", "notes"]);

      const { stdin, lastFrame } = renderInViewport(<ProjectPickerModal />);
      await waitFor(() => lastFrame()?.includes("dotfiles") ?? false);
      await new Promise((resolve) => setTimeout(resolve, 30));

      stdin.write("\r");

      expect(promptForSession).toHaveBeenCalledWith("dotfiles");
    });
  });

  describe("when the user cancels", () => {
    it("closes the modal", async () => {
      const cancel = mock(() => {});
      spyOn(storeModule, "useStore").mockReturnValue(storeFactory.build({ cancel }));
      listTmuxinatorProjectsMock.mockResolvedValue(["orc"]);

      const { stdin, lastFrame } = renderInViewport(<ProjectPickerModal />);
      await waitFor(() => lastFrame()?.includes("orc") ?? false);
      await new Promise((resolve) => setTimeout(resolve, 30));

      stdin.write(String.fromCharCode(27));
      await new Promise((resolve) => setTimeout(resolve, 30));

      expect(cancel).toHaveBeenCalled();
    });
  });

  describe("when the projects are still loading", () => {
    it("renders nothing", () => {
      listTmuxinatorProjectsMock.mockResolvedValue(["orc"]);

      const { lastFrame } = renderInViewport(<ProjectPickerModal />);

      expect(lastFrame()?.trim()).toBe("");
    });
  });
});
