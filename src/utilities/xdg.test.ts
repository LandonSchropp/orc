import { stubEnv } from "../../test/helpers/env.ts";
import { orcCacheDirectory, orcConfigDirectory, xdgCacheHome, xdgConfigHome } from "./xdg.ts";
import { beforeEach, describe, expect, it } from "bun:test";
import { homedir } from "node:os";

describe("xdgConfigHome", () => {
  describe("when $XDG_CONFIG_HOME is set", () => {
    beforeEach(() => {
      stubEnv("XDG_CONFIG_HOME", "/tmp/orc-test-config");
    });

    it("returns the value of $XDG_CONFIG_HOME", () => {
      expect(xdgConfigHome()).toBe("/tmp/orc-test-config");
    });
  });

  describe("when $XDG_CONFIG_HOME is not set", () => {
    beforeEach(() => {
      stubEnv("XDG_CONFIG_HOME", undefined);
    });

    it("returns ~/.config", () => {
      expect(xdgConfigHome()).toBe(`${homedir()}/.config`);
    });
  });
});

describe("xdgCacheHome", () => {
  describe("when $XDG_CACHE_HOME is set", () => {
    beforeEach(() => {
      stubEnv("XDG_CACHE_HOME", "/tmp/orc-test-cache");
    });

    it("returns the value of $XDG_CACHE_HOME", () => {
      expect(xdgCacheHome()).toBe("/tmp/orc-test-cache");
    });
  });

  describe("when $XDG_CACHE_HOME is not set", () => {
    beforeEach(() => {
      stubEnv("XDG_CACHE_HOME", undefined);
    });

    it("returns ~/.cache", () => {
      expect(xdgCacheHome()).toBe(`${homedir()}/.cache`);
    });
  });
});

describe("orcConfigDirectory", () => {
  describe("when $XDG_CONFIG_HOME is set", () => {
    beforeEach(() => {
      stubEnv("XDG_CONFIG_HOME", "/tmp/orc-test-config");
    });

    it("returns $XDG_CONFIG_HOME/orc", () => {
      expect(orcConfigDirectory()).toBe("/tmp/orc-test-config/orc");
    });
  });

  describe("when $XDG_CONFIG_HOME is not set", () => {
    beforeEach(() => {
      stubEnv("XDG_CONFIG_HOME", undefined);
    });

    it("returns ~/.config/orc", () => {
      expect(orcConfigDirectory()).toBe(`${homedir()}/.config/orc`);
    });
  });
});

describe("orcCacheDirectory", () => {
  describe("when $XDG_CACHE_HOME is set", () => {
    beforeEach(() => {
      stubEnv("XDG_CACHE_HOME", "/tmp/orc-test-cache");
    });

    it("returns $XDG_CACHE_HOME/orc", () => {
      expect(orcCacheDirectory()).toBe("/tmp/orc-test-cache/orc");
    });
  });

  describe("when $XDG_CACHE_HOME is not set", () => {
    beforeEach(() => {
      stubEnv("XDG_CACHE_HOME", undefined);
    });

    it("returns ~/.cache/orc", () => {
      expect(orcCacheDirectory()).toBe(`${homedir()}/.cache/orc`);
    });
  });
});
