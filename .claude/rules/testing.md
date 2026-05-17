---
paths:
  - "**/*.test.ts"
---

# Testing Conventions

REQUIRED: fetch the [Bun mocks documentation](https://bun.com/docs/test/mocks.md) before writing or modifying tests.

## `describe` context blocks

Context `describe` blocks (the ones nested inside a top-level `describe` for the unit under test) should almost always start with `when`. They describe the state, input, or condition the assertions below apply to.

- Good: `describe("when the file does not exist", ...)`, `describe("when the --no-worktree flag is provided", ...)`, `describe("when $XDG_CONFIG_HOME is set", ...)`.
- Bad: `describe("with --no-worktree", ...)` — prefer `describe("when the --no-worktree flag is provided", ...)`.
- Bad: `describe("but the project is missing", ...)` — `but` is a continuation, not a condition. Rewrite as `when`.
- Bad: `describe("happy path", ...)` or `describe("error case", ...)` — describe the condition, not the outcome.

The top-level `describe` names the unit (function, class, command) and does not start with `when`.

## Bun mock helpers

Prefer the specific mock helpers over `mockImplementation` when possible:

- `mockResolvedValue(value)` — for async functions returning a value
- `mockResolvedValueOnce(value)` — single-call variant
- `mockRejectedValue(error)` — for async functions that throw
- `mockRejectedValueOnce(error)` — single-call variant
- `mockReturnValue(value)` — for sync functions
- `mockReturnValueOnce(value)` — single-call variant

Only reach for `mockImplementation` when behavior depends on arguments or call count.

## Spying on object methods

Never reassign properties on global or imported objects to stub them. Use `spyOn` instead. Re-spy in `beforeEach` so each test starts from a known state.

Bad:

```ts
const originalStdin = Bun.stdin;
let stdinPayload = "";

beforeEach(() => {
  // @ts-expect-error - reassigning Bun.stdin for test isolation
  Bun.stdin = { json: () => Promise.resolve(JSON.parse(stdinPayload)) };
});

afterEach(() => {
  // @ts-expect-error - restoring original Bun.stdin
  Bun.stdin = originalStdin;
});
```

Good:

```ts
import { spyOn } from "bun:test";

it("processes the payload", async () => {
  spyOn(Bun.stdin, "json").mockResolvedValue({ hook_event_name: "Stop" });
  // ... assertions
});
```

Set mock return values close to the test that asserts on them, with the concrete value the test needs. Indirection through shared variables or transformations makes tests harder to read.

## Mocking modules

Use static imports — Bun's ESM live bindings let `mock.module()` update modules that have already been imported. No dynamic `await import()` needed.

`mock.module()` returns a promise, so it must be awaited:

```ts
import { isGitInstalled } from "../../src/commands/git.ts";
import { describe, expect, it, mock } from "bun:test";

const runCommandMock = mock(() => Promise.resolve({ exitCode: 0, stdout: "", stderr: "" }));

await mock.module("../../src/commands/shell.ts", () => ({
  runCommand: runCommandMock,
}));
```

Mocks are cleared between tests automatically via the global `beforeEach` in `test/setup.ts`, so individual test files don't need their own clearing logic.
