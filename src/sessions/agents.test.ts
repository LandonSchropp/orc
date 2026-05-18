import { paneFactory } from "../../test/factories/pane.ts";
import { isAgentPane } from "./agents.ts";
import { describe, expect, it } from "bun:test";

describe("isAgentPane", () => {
  describe("when the title contains a Braille spinner", () => {
    it("returns true for the first Braille character (U+2800)", () => {
      expect(isAgentPane(paneFactory.build({ paneTitle: "⠀ Working on something" }))).toBe(true);
    });

    it("returns true for a mid-range Braille character (U+2802)", () => {
      expect(
        isAgentPane(
          paneFactory.build({ paneTitle: "⠂ Add Claude process status tracking to orc" }),
        ),
      ).toBe(true);
    });

    it("returns true for the last Braille character (U+28FF)", () => {
      expect(isAgentPane(paneFactory.build({ paneTitle: "⣿ Almost done" }))).toBe(true);
    });
  });

  describe("when the title contains a done marker", () => {
    it("returns true for ✳", () => {
      expect(isAgentPane(paneFactory.build({ paneTitle: "✳ Explore TUI implementation" }))).toBe(
        true,
      );
    });

    it("returns true for ✻", () => {
      expect(isAgentPane(paneFactory.build({ paneTitle: "✻ Ready" }))).toBe(true);
    });

    it("returns true for ✽", () => {
      expect(isAgentPane(paneFactory.build({ paneTitle: "✽ Idle" }))).toBe(true);
    });

    it("returns true for ✶", () => {
      expect(isAgentPane(paneFactory.build({ paneTitle: "✶ Done" }))).toBe(true);
    });

    it("returns true for ✢", () => {
      expect(isAgentPane(paneFactory.build({ paneTitle: "✢ Finished" }))).toBe(true);
    });
  });

  describe("when the title is a plain program name", () => {
    it("returns false for nvim", () => {
      expect(isAgentPane(paneFactory.build({ paneTitle: "nvim" }))).toBe(false);
    });

    it("returns false for zsh", () => {
      expect(isAgentPane(paneFactory.build({ paneTitle: "zsh" }))).toBe(false);
    });
  });

  describe("when the title is empty", () => {
    it("returns false", () => {
      expect(isAgentPane(paneFactory.build({ paneTitle: "" }))).toBe(false);
    });
  });

  describe("when the title contains only unrelated unicode", () => {
    it("returns false", () => {
      expect(isAgentPane(paneFactory.build({ paneTitle: "📁 ~/Development/orc" }))).toBe(false);
    });
  });
});
