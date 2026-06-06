import { sessionFactory } from "../../test/factories/session.ts";
import { exitSpy, stderrSpy } from "../../test/helpers/process.ts";
import type { ProjectSource, Session } from "../types.ts";
import { newCommand } from "./new.ts";
import { describe, expect, it, mock } from "bun:test";
import { runCommand } from "citty";

const createSessionMock = mock((): Promise<void> => Promise.resolve());
const findSessionMock = mock((): Promise<Session | null> => Promise.resolve(null));
const tmuxinatorSourceMock = mock<(name: string) => Promise<ProjectSource>>((name) =>
  Promise.resolve({ kind: "tmuxinator", name, repositoryRoot: `/repos/${name}` }),
);

await mock.module("../sessions/create.ts", () => ({
  createSession: createSessionMock,
}));

await mock.module("../sessions/find.ts", () => ({
  findSession: findSessionMock,
}));

await mock.module("../sessions/project-sources.ts", () => ({
  tmuxinatorSource: tmuxinatorSourceMock,
}));

describe("newCommand", () => {
  describe("when no session with the same name exists", () => {
    it("creates the session", async () => {
      findSessionMock.mockResolvedValue(null);

      await runCommand(newCommand, { rawArgs: ["test-project", "feature-a"] });

      expect(findSessionMock).toHaveBeenCalledWith("test-project", "feature-a");
      expect(createSessionMock).toHaveBeenCalledWith(
        { kind: "tmuxinator", name: "test-project", repositoryRoot: "/repos/test-project" },
        "feature-a",
      );
    });
  });

  describe("when a session with the same name already exists", () => {
    it("prints an error and exits with code 1 without creating", async () => {
      findSessionMock.mockResolvedValue(
        sessionFactory.build({ project: "test-project", session: "feature-a" }),
      );

      await runCommand(newCommand, { rawArgs: ["test-project", "feature-a"] });

      expect(stderrSpy).toHaveBeenCalledWith("Session already exists: test-project/feature-a\n");
      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(createSessionMock).not.toHaveBeenCalled();
    });
  });
});
