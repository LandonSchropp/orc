import { main, orc } from "./index.ts";
import { describe, expect, it, mock } from "bun:test";

const runMainMock = mock(() => Promise.resolve());

await mock.module("citty", () => ({
  defineCommand: (def: unknown) => def,
  runMain: runMainMock,
}));

describe("when no arguments are provided", () => {
  it("renders the help text", async () => {
    await main([]);
    expect(runMainMock).toHaveBeenCalledWith(orc, { rawArgs: ["--help"] });
  });
});

describe("when the --help flag is provided", () => {
  it("renders the help text", async () => {
    await main(["--help"]);
    expect(runMainMock).toHaveBeenCalledWith(orc, { rawArgs: ["--help"] });
  });
});
