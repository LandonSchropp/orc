import { Glob, type GlobScanOptions } from "bun";

/** Scan error codes that mean a path matches nothing: missing (`ENOENT`) or unreadable. */
const EMPTY_MATCH_CODES = new Set(["ENOENT", "EPERM", "EACCES"]);

/**
 * Reports whether a glob scan error should be treated as an empty match — a missing path or one we
 * are not permitted to read — rather than re-thrown as an unexpected failure.
 *
 * @param error The error thrown by the scan.
 * @returns `true` when the error is a missing or unreadable path.
 */
function isEmptyMatchError(error: unknown): boolean {
  return error instanceof Error && "code" in error && EMPTY_MATCH_CODES.has(String(error.code));
}

/**
 * Scans `pattern` and returns the matching paths. A missing or unreadable path matches nothing
 * rather than throwing, so a glob over a directory that has been deleted or that the process cannot
 * read yields an empty array. Any other error propagates.
 *
 * @param pattern The glob pattern to scan.
 * @param options Scan options forwarded to Bun's glob.
 * @returns The matching paths.
 * @throws If the scan fails for any reason other than a missing or unreadable path.
 */
export async function safeGlob(pattern: string, options?: GlobScanOptions): Promise<string[]> {
  try {
    return await Array.fromAsync(new Glob(pattern).scan(options));
  } catch (error) {
    if (isEmptyMatchError(error)) {
      return [];
    }

    throw error;
  }
}
