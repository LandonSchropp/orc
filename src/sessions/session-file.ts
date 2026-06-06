import { PROJECT_KINDS } from "../constants.ts";
import type { SessionInfo } from "../types.ts";
import { safeGlob } from "../utilities/glob.ts";
import { orcCacheDirectory } from "../utilities/xdg.ts";
import { sessionId } from "./id.ts";
import { mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { z } from "zod";

/**
 * Schema for an on-disk session state file. Parses the stored ISO `createdAt` string into a `Date`
 * and derives the session `id`, so the parsed output is a {@link SessionInfo}.
 */
const sessionInfoSchema = z
  .object({
    project: z.string(),
    session: z.string(),
    kind: z.enum(PROJECT_KINDS),
    repositoryRoot: z.string(),
    createdAt: z.coerce.date(),
  })
  .transform((info) => ({ ...info, id: sessionId(info.project, info.session) }));

/**
 * Returns the path to a session's state file. Session files sit alongside pane files under
 * `$XDG_CACHE_HOME/orc/state/`, distinguished by having no pane segment.
 *
 * @param project The project name.
 * @param session The session name within the project.
 * @returns The absolute path under `$XDG_CACHE_HOME/orc/state/<project>:<session>.json`.
 */
export function sessionFilePath(project: string, session: string): string {
  return join(orcCacheDirectory(), "state", `${project}:${session}.json`);
}

/**
 * Writes a session's state file. Serializes `createdAt` as an ISO string and drops the derived
 * `id`, creating the state directory if needed.
 *
 * @param info The session info to persist.
 */
export async function writeSessionFile(info: SessionInfo): Promise<void> {
  const path = sessionFilePath(info.project, info.session);
  await mkdir(dirname(path), { recursive: true });
  await Bun.write(
    path,
    JSON.stringify({ ...info, id: undefined, createdAt: info.createdAt.toISOString() }),
  );
}

/**
 * Reads a session's state file.
 *
 * @param project The project name.
 * @param session The session name within the project.
 * @returns The parsed session info, or `null` if the file does not exist.
 * @throws If the file exists but cannot be parsed or fails the schema.
 */
export async function readSessionFile(
  project: string,
  session: string,
): Promise<SessionInfo | null> {
  const file = Bun.file(sessionFilePath(project, session));
  if (!(await file.exists())) return null;

  return sessionInfoSchema.parse(await file.json());
}

/**
 * Reports whether a session's state file exists.
 *
 * @param project The project name.
 * @param session The session name within the project.
 * @returns `true` when the session file exists, otherwise `false`.
 */
export async function sessionFileExists(project: string, session: string): Promise<boolean> {
  return Bun.file(sessionFilePath(project, session)).exists();
}

/**
 * Lists the session info for every session recorded in the state directory. Pane files (which carry
 * a third `:`-delimited pane segment) are ignored. No-op result when the state directory is
 * missing.
 *
 * @returns The parsed session info for each session file.
 * @throws If any session file cannot be parsed or fails the schema.
 */
export async function listSessionFiles(): Promise<SessionInfo[]> {
  const directory = join(orcCacheDirectory(), "state");
  const names = await safeGlob("*.json", { cwd: directory });
  const sessionNames = names.filter((name) => name.split(":").length === 2);

  return Promise.all(
    sessionNames.map(async (name) =>
      sessionInfoSchema.parse(await Bun.file(join(directory, name)).json()),
    ),
  );
}

/**
 * Removes a session's state file. No-op when the file does not exist.
 *
 * @param project The project name.
 * @param session The session name within the project.
 */
export async function removeSessionFile(project: string, session: string): Promise<void> {
  await rm(sessionFilePath(project, session), { force: true });
}
