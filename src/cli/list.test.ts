import { sessionFactory } from "../../test/factories/session.ts";
import { stdoutSpy } from "../../test/helpers/process.ts";
import type { Session } from "../types.ts";
import { listCommand } from "./list.ts";
import { describe, expect, it, mock } from "bun:test";
import { runCommand } from "citty";

const listTmuxSessionsMock = mock((): Promise<Session[]> => Promise.resolve([]));

await mock.module("../commands/tmux.ts", () => ({
  listTmuxSessions: listTmuxSessionsMock,
}));

describe("listCommand", () => {
  describe("when there are no sessions", () => {
    it("prints nothing", async () => {
      listTmuxSessionsMock.mockResolvedValue([]);

      await runCommand(listCommand, { rawArgs: [] });

      expect(stdoutSpy).not.toHaveBeenCalled();
    });
  });

  describe("when there are sessions", () => {
    it("prints each session", async () => {
      listTmuxSessionsMock.mockResolvedValue([
        sessionFactory.build({ session: "feature-a" }),
        sessionFactory.build({ session: "feature-b" }),
      ]);

      await runCommand(listCommand, { rawArgs: [] });

      expect(stdoutSpy).toHaveBeenCalledWith("orc/feature-a\n");
      expect(stdoutSpy).toHaveBeenCalledWith("orc/feature-b\n");
    });
  });
});
