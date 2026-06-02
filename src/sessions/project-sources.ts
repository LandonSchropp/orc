import { listTmuxinatorProjects, readTmuxinatorProject } from "../commands/tmuxinator.ts";
import type { ProjectSource } from "../types.ts";

/**
 * Builds a tmuxinator {@link ProjectSource}, reading the project's root from its tmuxinator config.
 *
 * @param name The tmuxinator project name.
 * @returns The project source, tagged `tmuxinator`.
 */
export async function tmuxinatorSource(name: string): Promise<ProjectSource> {
  const { root } = await readTmuxinatorProject(name);
  return { kind: "tmuxinator", name, root };
}

/**
 * Lists the project sources a new session can be created in. Currently the available tmuxinator
 * projects, each resolved to its root.
 *
 * @returns The available project sources.
 */
export async function listProjectSources(): Promise<ProjectSource[]> {
  const names = await listTmuxinatorProjects();
  return Promise.all(names.map(tmuxinatorSource));
}
