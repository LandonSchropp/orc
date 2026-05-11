// TODO: Replace this manual implementation with `spyOn(process.env, key)` + `mock.restore()` once
// Bun supports spying on env var properties reliably. `spyOn` accepts data properties in isolation
// but breaks with "spyOn(target, prop) does not support accessor properties yet" in larger test
// runs — likely because previous spies leave properties as accessors. File an issue on
// oven-sh/bun if one doesn't exist.

const stubbed = new Map<string, string | undefined>();

/**
 * Temporarily sets a `process.env` variable for the current test. Pass `undefined` to delete the
 * variable. The original value is restored automatically by `unstubAllEnvs` in `test/setup.ts`.
 *
 * @param key - The environment variable to stub.
 * @param value - The value to set, or `undefined` to delete the variable.
 */
export function stubEnv(key: string, value: string | undefined): void {
  if (!stubbed.has(key)) {
    stubbed.set(key, process.env[key]);
  }
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
}

/** Restores every env variable previously set with `stubEnv`. */
export function unstubAllEnvs(): void {
  for (const [key, original] of stubbed.entries()) {
    if (original === undefined) delete process.env[key];
    else process.env[key] = original;
  }
  stubbed.clear();
}
