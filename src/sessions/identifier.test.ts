import { parseSessionIdentifier, sessionIdentifier } from "./identifier.ts";
import { describe, expect, it } from "bun:test";

describe("sessionIdentifier", () => {
  it("joins the project and session with a slash", () => {
    expect(sessionIdentifier("orc", "feature-a")).toBe("orc/feature-a");
  });
});

describe("parseSessionIdentifier", () => {
  describe("when the identifier contains a slash", () => {
    it("returns the project and session as a tuple", () => {
      expect(parseSessionIdentifier("orc/feature-a")).toEqual(["orc", "feature-a"]);
    });

    it("splits on the first slash, preserving slashes in the session part", () => {
      expect(parseSessionIdentifier("project/sub/feature")).toEqual(["project", "sub/feature"]);
    });
  });

  describe("when the identifier has no slash", () => {
    it("returns null", () => {
      expect(parseSessionIdentifier("foreign-session")).toBeNull();
    });
  });

  describe("when the identifier is empty", () => {
    it("returns null", () => {
      expect(parseSessionIdentifier("")).toBeNull();
    });
  });
});
