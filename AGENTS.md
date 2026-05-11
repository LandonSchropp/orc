# Agent Instructions

## CLI Output

Use `process.stdout.write` for command output, not `console.log`. CLI output is program data that should pipe cleanly to other tools — `console.log` is for diagnostics and goes through Node's console formatting layer. Remember to include the trailing `\n` since `process.stdout.write` does not append one.
