import { main, orc } from "./index.ts";
import { describe, expect, it, mock } from "bun:test";

const runMainMock = mock(() => Promise.resolve());

await mock.module("citty", () => ({
  defineCommand: (def: unknown) => def,
  runMain: runMainMock,
}));

describe("main", () => {
  it("passes the arguments to citty", async () => {
    await main(["--help"]);
    expect(runMainMock).toHaveBeenCalledWith(orc, { rawArgs: ["--help"] });
  });
});
