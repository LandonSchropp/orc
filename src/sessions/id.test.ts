import { parseSessionId, sessionId } from "./id.ts";
import { describe, expect, it } from "bun:test";

describe("sessionId", () => {
  it("joins the project and session with a slash", () => {
    expect(sessionId("orc", "feature-a")).toBe("orc/feature-a");
  });
});

describe("parseSessionId", () => {
  describe("when the id contains a slash", () => {
    it("returns the project and session as a tuple", () => {
      expect(parseSessionId("orc/feature-a")).toEqual(["orc", "feature-a"]);
    });

    it("splits on the first slash, preserving slashes in the session part", () => {
      expect(parseSessionId("project/sub/feature")).toEqual(["project", "sub/feature"]);
    });
  });

  describe("when the id has no slash", () => {
    it("returns null", () => {
      expect(parseSessionId("foreign-session")).toBeNull();
    });
  });

  describe("when the id is empty", () => {
    it("returns null", () => {
      expect(parseSessionId("")).toBeNull();
    });
  });
});
