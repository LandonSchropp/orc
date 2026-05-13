import { sessionFactory } from "../../test/factories/session.ts";
import { exitSpy, stderrSpy } from "../../test/helpers/process.ts";
import type { Session } from "../types.ts";
import { switchCommand } from "./switch.ts";
import { describe, expect, it, mock } from "bun:test";
import { runCommand } from "citty";

const findSessionMock = mock((): Promise<Session | null> => Promise.resolve(null));
const switchSessionMock = mock((): Promise<void> => Promise.resolve());

await mock.module("../sessions/find.ts", () => ({
  findSession: findSessionMock,
}));

await mock.module("../sessions/switch.ts", () => ({
  switchSession: switchSessionMock,
}));

describe("switchCommand", () => {
  describe("when a matching session is found", () => {
    it("switches to it", async () => {
      const session = sessionFactory.build({ project: "orc", session: "feature-a" });
      findSessionMock.mockResolvedValue(session);

      await runCommand(switchCommand, { rawArgs: ["orc", "feature-a"] });

      expect(findSessionMock).toHaveBeenCalledWith("orc", "feature-a");
      expect(switchSessionMock).toHaveBeenCalledWith("orc", "feature-a");
    });
  });

  describe("when no matching session is found", () => {
    it("prints an error and exits with code 1", async () => {
      findSessionMock.mockResolvedValue(null);

      await runCommand(switchCommand, { rawArgs: ["orc", "missing"] });

      expect(stderrSpy).toHaveBeenCalledWith("Session not found: orc:missing\n");
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });
});
