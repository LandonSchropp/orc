import { sessionFactory } from "../../test/factories/session.ts";
import type { Session } from "../types.ts";
import { listCommand } from "./list.ts";
import { describe, expect, it, mock, spyOn } from "bun:test";
import { runCommand } from "citty";

const listTmuxSessionsMock = mock((): Promise<Session[]> => Promise.resolve([]));

await mock.module("../commands/tmux.ts", () => ({
  listTmuxSessions: listTmuxSessionsMock,
}));

describe("listCommand", () => {
  describe("when there are no sessions", () => {
    it("prints nothing", async () => {
      listTmuxSessionsMock.mockResolvedValue([]);
      const writeSpy = spyOn(process.stdout, "write").mockImplementation(() => true);

      await runCommand(listCommand, { rawArgs: [] });

      expect(writeSpy).not.toHaveBeenCalled();
    });
  });

  describe("when there are sessions", () => {
    it("prints each session", async () => {
      listTmuxSessionsMock.mockResolvedValue([
        sessionFactory.build({ session: "feature-a" }),
        sessionFactory.build({ session: "feature-b" }),
      ]);
      const writeSpy = spyOn(process.stdout, "write").mockImplementation(() => true);

      await runCommand(listCommand, { rawArgs: [] });

      expect(writeSpy).toHaveBeenCalledWith("orc:feature-a\n");
      expect(writeSpy).toHaveBeenCalledWith("orc:feature-b\n");
    });

    describe("and a session is attached", () => {
      it("marks it as attached", async () => {
        listTmuxSessionsMock.mockResolvedValue([
          sessionFactory.build({ session: "feature-a", attached: true }),
        ]);
        const writeSpy = spyOn(process.stdout, "write").mockImplementation(() => true);

        await runCommand(listCommand, { rawArgs: [] });

        expect(writeSpy).toHaveBeenCalledWith("orc:feature-a (attached)\n");
      });
    });
  });
});
