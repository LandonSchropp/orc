import { runCommand } from "./shell.ts";
import { describe, expect, it } from "bun:test";

describe("runCommand", () => {
  describe("when the command succeeds", () => {
    it("returns exit code 0", async () => {
      const { exitCode } = await runCommand(["echo", "hello"]);
      expect(exitCode).toBe(0);
    });
  });

  describe("when the command prints to stdout", () => {
    it("captures stdout", async () => {
      const { stdout } = await runCommand(["echo", "hello"]);
      expect(stdout.trim()).toBe("hello");
    });
  });

  describe("when the command prints to stderr", () => {
    it("captures stderr", async () => {
      const { stderr } = await runCommand(["sh", "-c", "echo hello >&2"]);
      expect(stderr.trim()).toBe("hello");
    });
  });

  describe("when the command fails", () => {
    it("returns a non-zero exit code without throwing", async () => {
      const { exitCode } = await runCommand(["false"]);
      expect(exitCode).not.toBe(0);
    });
  });

  describe("when the command is not found", () => {
    it("returns exit code 127", async () => {
      const { exitCode } = await runCommand(["notarealcommand"]);
      expect(exitCode).toBe(127);
    });
  });

  describe("when a non-spawn error occurs", () => {
    it("rethrows the error", async () => {
      const tmpFile = "/tmp/orc-test-no-exec";
      await Bun.write(tmpFile, "#!/bin/sh\necho hello");
      // No execute permission — Bun.spawn throws EACCES, not ENOENT
      expect(runCommand([tmpFile])).rejects.toThrow();
    });
  });
});
