import { isAgentState, isAgentStatus } from "./type-guards.ts";
import { describe, expect, it } from "bun:test";

describe("isAgentStatus", () => {
  describe("when the value is a valid status", () => {
    it("returns true for 'Working'", () => {
      expect(isAgentStatus("Working")).toBe(true);
    });

    it("returns true for 'Waiting'", () => {
      expect(isAgentStatus("Waiting")).toBe(true);
    });

    it("returns true for 'Idle'", () => {
      expect(isAgentStatus("Idle")).toBe(true);
    });
  });

  describe("when the value is a different string", () => {
    it("returns false", () => {
      expect(isAgentStatus("Bogus")).toBe(false);
    });
  });

  describe("when the value is not a string", () => {
    it("returns false for numbers", () => {
      expect(isAgentStatus(42)).toBe(false);
    });

    it("returns false for null", () => {
      expect(isAgentStatus(null)).toBe(false);
    });

    it("returns false for objects", () => {
      expect(isAgentStatus({ status: "Working" })).toBe(false);
    });
  });
});

describe("isAgentState", () => {
  describe("when the value is a valid agent state", () => {
    it("returns true for Working status", () => {
      expect(isAgentState({ status: "Working", timestamp: "2026-05-17T00:00:00.000Z" })).toBe(true);
    });

    it("returns true for Waiting status", () => {
      expect(isAgentState({ status: "Waiting", timestamp: "2026-05-17T00:00:00.000Z" })).toBe(true);
    });

    it("returns true for Idle status", () => {
      expect(isAgentState({ status: "Idle", timestamp: "2026-05-17T00:00:00.000Z" })).toBe(true);
    });
  });

  describe("when the status is not one of the valid values", () => {
    it("returns false", () => {
      expect(isAgentState({ status: "Bogus", timestamp: "2026-05-17T00:00:00.000Z" })).toBe(false);
    });
  });

  describe("when the timestamp is missing", () => {
    it("returns false", () => {
      expect(isAgentState({ status: "Working" })).toBe(false);
    });
  });

  describe("when the timestamp is not a string", () => {
    it("returns false", () => {
      expect(isAgentState({ status: "Working", timestamp: 12345 })).toBe(false);
    });
  });

  describe("when the status is missing", () => {
    it("returns false", () => {
      expect(isAgentState({ timestamp: "2026-05-17T00:00:00.000Z" })).toBe(false);
    });
  });

  describe("when the value is null", () => {
    it("returns false", () => {
      expect(isAgentState(null)).toBe(false);
    });
  });

  describe("when the value is not an object", () => {
    it("returns false for strings", () => {
      expect(isAgentState("not an object")).toBe(false);
    });

    it("returns false for numbers", () => {
      expect(isAgentState(42)).toBe(false);
    });

    it("returns false for arrays", () => {
      expect(isAgentState(["Working"])).toBe(false);
    });
  });
});
