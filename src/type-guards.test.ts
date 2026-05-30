import { isAgentState, isAgentStatus, isClaudeSettings, isHookPayload } from "./type-guards.ts";
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

describe("isHookPayload", () => {
  describe("when hook_event_name names a non-Notification event orc handles", () => {
    it("returns true", () => {
      expect(isHookPayload({ hook_event_name: "Stop" })).toBe(true);
    });

    it("returns true even with additional fields", () => {
      expect(isHookPayload({ hook_event_name: "Stop", session_id: "abc", extra: 42 })).toBe(true);
    });
  });

  describe("when hook_event_name is Notification", () => {
    describe("when notification_type is a string", () => {
      it("returns true", () => {
        expect(
          isHookPayload({
            hook_event_name: "Notification",
            notification_type: "permission_prompt",
          }),
        ).toBe(true);
      });
    });

    describe("when notification_type is missing", () => {
      it("returns false", () => {
        expect(isHookPayload({ hook_event_name: "Notification" })).toBe(false);
      });
    });

    describe("when notification_type is not a string", () => {
      it("returns false", () => {
        expect(isHookPayload({ hook_event_name: "Notification", notification_type: 42 })).toBe(
          false,
        );
      });
    });
  });

  describe("when hook_event_name names an event orc does not handle", () => {
    it("returns false", () => {
      expect(isHookPayload({ hook_event_name: "PreToolUse" })).toBe(false);
    });
  });

  describe("when hook_event_name is missing", () => {
    it("returns false", () => {
      expect(isHookPayload({ session_id: "abc" })).toBe(false);
    });
  });

  describe("when hook_event_name is not a string", () => {
    it("returns false", () => {
      expect(isHookPayload({ hook_event_name: 42 })).toBe(false);
    });
  });

  describe("when the value is null", () => {
    it("returns false", () => {
      expect(isHookPayload(null)).toBe(false);
    });
  });

  describe("when the value is not an object", () => {
    it("returns false for strings", () => {
      expect(isHookPayload("Stop")).toBe(false);
    });

    it("returns false for arrays", () => {
      expect(isHookPayload(["Stop"])).toBe(false);
    });
  });
});

describe("isClaudeSettings", () => {
  describe("when the value is an empty object", () => {
    it("returns true", () => {
      expect(isClaudeSettings({})).toBe(true);
    });
  });

  describe("when the value has hooks with the expected shape", () => {
    it("returns true", () => {
      expect(
        isClaudeSettings({
          hooks: {
            Stop: [{ hooks: [{ type: "command", command: "echo stop" }] }],
          },
        }),
      ).toBe(true);
    });
  });

  describe("when the value has unrelated fields alongside hooks", () => {
    it("returns true", () => {
      expect(
        isClaudeSettings({
          permissions: { allow: ["Read"] },
          hooks: {},
        }),
      ).toBe(true);
    });
  });

  describe("when hooks is not an object", () => {
    it("returns false for an array", () => {
      expect(isClaudeSettings({ hooks: [] })).toBe(false);
    });

    it("returns false for a string", () => {
      expect(isClaudeSettings({ hooks: "Stop" })).toBe(false);
    });

    it("returns false for null", () => {
      expect(isClaudeSettings({ hooks: null })).toBe(false);
    });
  });

  describe("when a hooks event value is not an array", () => {
    it("returns false", () => {
      expect(isClaudeSettings({ hooks: { Stop: "not an array" } })).toBe(false);
    });
  });

  describe("when the value is null", () => {
    it("returns false", () => {
      expect(isClaudeSettings(null)).toBe(false);
    });
  });

  describe("when the value is an array", () => {
    it("returns false", () => {
      expect(isClaudeSettings([])).toBe(false);
    });
  });

  describe("when the value is not an object", () => {
    it("returns false", () => {
      expect(isClaudeSettings("settings")).toBe(false);
    });
  });
});
