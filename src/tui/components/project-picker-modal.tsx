import { listTmuxinatorProjects } from "../../commands/tmuxinator.ts";
import { useEffectAsync } from "../hooks/use-effect-async.ts";
import { findProjectContaining } from "../state/find-project-containing.ts";
import { useStore } from "../state/store.tsx";
import { Picker } from "./picker.tsx";
import { useState } from "react";

/**
 * The project-picker modal. Loads the available Tmuxinator projects, renders a Picker for the user
 * to fuzzy-search and pick one, then advances the new-session flow to the session-name prompt.
 * Pre-selects the project of the currently selected session so the common "another session in this
 * project" path is one keystroke.
 */
export function ProjectPickerModal() {
  const { selectedSessionId, projects, promptForSession, cancel } = useStore();
  const [tmuxinatorProjects, setTmuxinatorProjects] = useState<string[] | null>(null);

  useEffectAsync(async () => {
    setTmuxinatorProjects(await listTmuxinatorProjects());
  }, []);

  if (tmuxinatorProjects === null) return null;

  const currentProject = findProjectContaining(projects, selectedSessionId)?.project;

  return (
    <Picker
      title="Pick a Project"
      options={tmuxinatorProjects}
      initialSelection={currentProject}
      onSelect={promptForSession}
      onCancel={cancel}
    />
  );
}
