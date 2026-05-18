import { sessionIdentifier } from "./identifier.ts";
import { describe, expect, it } from "bun:test";

describe("sessionIdentifier", () => {
  it("joins the project and session with a slash", () => {
    expect(sessionIdentifier("orc", "feature-a")).toBe("orc/feature-a");
  });
});
