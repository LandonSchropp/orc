import { deleteCommand } from "./delete.ts";
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { runCommand } from "citty";

const deleteSessionMock = mock((): Promise<void> => Promise.resolve());
const isDeleteWorkerMock = mock((): boolean => false);
const spawnDeleteWorkerMock = mock((): void => {});
const currentTmuxSessionMock = mock((): Promise<string | null> => Promise.resolve(null));
const isInsideOrcTmuxSessionMock = mock((): boolean => false);

await mock.module("../sessions/delete.ts", () => ({
  deleteSession: deleteSessionMock,
}));

await mock.module("../sessions/delete-worker.ts", () => ({
  isDeleteWorker: isDeleteWorkerMock,
  spawnDeleteWorker: spawnDeleteWorkerMock,
}));

await mock.module("../commands/tmux.ts", () => ({
  currentTmuxSession: currentTmuxSessionMock,
  isInsideOrcTmuxSession: isInsideOrcTmuxSessionMock,
}));

beforeEach(() => {
  isDeleteWorkerMock.mockReturnValue(false);
  isInsideOrcTmuxSessionMock.mockReturnValue(false);
  currentTmuxSessionMock.mockResolvedValue(null);
});

describe("deleteCommand", () => {
  describe("when run as the detached worker", () => {
    beforeEach(() => {
      isDeleteWorkerMock.mockReturnValue(true);
    });

    it("deletes the session in-process", async () => {
      await runCommand(deleteCommand, { rawArgs: ["test-project", "feature-a"] });
      expect(deleteSessionMock).toHaveBeenCalledWith("test-project", "feature-a");
    });

    it("does not spawn another worker", async () => {
      await runCommand(deleteCommand, { rawArgs: ["test-project", "feature-a"] });
      expect(spawnDeleteWorkerMock).not.toHaveBeenCalled();
    });
  });

  describe("when deleting the session the command is running in", () => {
    beforeEach(() => {
      isInsideOrcTmuxSessionMock.mockReturnValue(true);
      currentTmuxSessionMock.mockResolvedValue("test-project/feature-a");
    });

    it("hands the deletion to a detached worker", async () => {
      await runCommand(deleteCommand, { rawArgs: ["test-project", "feature-a"] });
      expect(spawnDeleteWorkerMock).toHaveBeenCalledWith("test-project", "feature-a");
    });

    it("does not delete in-process", async () => {
      await runCommand(deleteCommand, { rawArgs: ["test-project", "feature-a"] });
      expect(deleteSessionMock).not.toHaveBeenCalled();
    });
  });

  describe("when deleting a different session", () => {
    beforeEach(() => {
      isInsideOrcTmuxSessionMock.mockReturnValue(true);
      currentTmuxSessionMock.mockResolvedValue("test-project/other");
    });

    it("deletes in-process and does not spawn a worker", async () => {
      await runCommand(deleteCommand, { rawArgs: ["test-project", "feature-a"] });
      expect(deleteSessionMock).toHaveBeenCalledWith("test-project", "feature-a");
      expect(spawnDeleteWorkerMock).not.toHaveBeenCalled();
    });
  });

  describe("when not inside an orc tmux session", () => {
    it("deletes in-process", async () => {
      await runCommand(deleteCommand, { rawArgs: ["test-project", "feature-a"] });
      expect(deleteSessionMock).toHaveBeenCalledWith("test-project", "feature-a");
    });
  });
});
