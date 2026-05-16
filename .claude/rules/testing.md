---
paths:
  - "**/*.test.ts"
---

# Testing Conventions

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
