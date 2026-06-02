import { listProjectSources, tmuxinatorSource } from "./project-sources.ts";
import { describe, expect, it, mock } from "bun:test";

const listTmuxinatorProjectsMock = mock<() => Promise<string[]>>(() => Promise.resolve([]));
const readTmuxinatorProjectMock = mock<(name: string) => Promise<{ root: string }>>(() =>
  Promise.resolve({ root: "" }),
);

await mock.module("../commands/tmuxinator.ts", () => ({
  listTmuxinatorProjects: listTmuxinatorProjectsMock,
  readTmuxinatorProject: readTmuxinatorProjectMock,
}));

describe("tmuxinatorSource", () => {
  it("builds a tmuxinator source carrying the project's root", async () => {
    readTmuxinatorProjectMock.mockResolvedValue({ root: "/repos/orc" });

    expect(await tmuxinatorSource("orc")).toEqual({
      kind: "tmuxinator",
      name: "orc",
      root: "/repos/orc",
    });
  });
});

describe("listProjectSources", () => {
  describe("when tmuxinator projects exist", () => {
    it("returns a tmuxinator source for each project", async () => {
      listTmuxinatorProjectsMock.mockResolvedValue(["orc", "notes"]);
      readTmuxinatorProjectMock.mockImplementation((name) =>
        Promise.resolve({ root: `/repos/${name}` }),
      );

      expect(await listProjectSources()).toEqual([
        { kind: "tmuxinator", name: "orc", root: "/repos/orc" },
        { kind: "tmuxinator", name: "notes", root: "/repos/notes" },
      ]);
    });
  });

  describe("when no tmuxinator projects exist", () => {
    it("returns an empty array", async () => {
      listTmuxinatorProjectsMock.mockResolvedValue([]);

      expect(await listProjectSources()).toEqual([]);
    });
  });
});
