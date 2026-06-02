import { projectSourceFactory } from "../../../test/factories/project-source.ts";
import { projectFactory } from "../../../test/factories/project.ts";
import { storeFactory } from "../../../test/factories/store.ts";
import { waitFor } from "../../../test/helpers/wait-for.ts";
import type { ProjectSource } from "../../types.ts";
import * as storeModule from "../state/store.tsx";
import { ProjectPickerModal } from "./project-picker-modal.tsx";
import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import { Box } from "ink";
import { render } from "ink-testing-library";
import type { ReactNode } from "react";

const listProjectSourcesMock = mock(() => Promise.resolve<ProjectSource[]>([]));

await mock.module("../../sessions/project-sources.ts", () => ({
  listProjectSources: listProjectSourcesMock,
}));

/**
 * Builds tmuxinator project sources for the given names.
 *
 * @param names The project names to build sources for.
 * @returns A source per name.
 */
function sourcesFor(names: string[]): ProjectSource[] {
  return names.map((name) => projectSourceFactory.build({ name }));
}

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

describe("ProjectPickerModal", () => {
  describe("when the projects have loaded", () => {
    it("renders the picker with the projects as options", async () => {
      listProjectSourcesMock.mockResolvedValue(sourcesFor(["orc", "dotfiles", "notes"]));

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
      const [source] = sourcesFor(["orc"]);
      listProjectSourcesMock.mockResolvedValue([source]);

      const { stdin, lastFrame } = renderInViewport(<ProjectPickerModal />);
      await waitFor(() => lastFrame()?.includes("orc") ?? false);
      await new Promise((resolve) => setTimeout(resolve, 30));

      stdin.write("\r");

      expect(promptForSession).toHaveBeenCalledWith(source);
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
      const sources = sourcesFor(["orc", "dotfiles", "notes"]);
      const dotfilesSource = sources.find((source) => source.name === "dotfiles");
      listProjectSourcesMock.mockResolvedValue(sources);

      const { stdin, lastFrame } = renderInViewport(<ProjectPickerModal />);
      await waitFor(() => lastFrame()?.includes("dotfiles") ?? false);
      await new Promise((resolve) => setTimeout(resolve, 30));

      stdin.write("\r");

      expect(promptForSession).toHaveBeenCalledWith(dotfilesSource);
    });
  });

  describe("when the user cancels", () => {
    it("closes the modal", async () => {
      const cancel = mock(() => {});
      spyOn(storeModule, "useStore").mockReturnValue(storeFactory.build({ cancel }));
      listProjectSourcesMock.mockResolvedValue(sourcesFor(["orc"]));

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
      listProjectSourcesMock.mockResolvedValue(sourcesFor(["orc"]));

      const { lastFrame } = renderInViewport(<ProjectPickerModal />);

      expect(lastFrame()?.trim()).toBe("");
    });
  });
});
