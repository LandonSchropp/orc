import { spyOn } from "bun:test";

/** Spy on `process.stdout.write`. Installed at module load; swallows output. */
export const stdoutSpy = spyOn(process.stdout, "write").mockImplementation(() => true);

/** Spy on `process.stderr.write`. Installed at module load; swallows output. */
export const stderrSpy = spyOn(process.stderr, "write").mockImplementation(() => true);

/** Spy on `process.exit`. Installed at module load; does not actually exit. */
export const exitSpy = spyOn(process, "exit").mockImplementation((() => undefined) as never);
