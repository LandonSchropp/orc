import { listTmuxinatorProjects } from "../../commands/tmuxinator.ts";
import { useEffectAsync } from "../hooks/use-effect-async.ts";
import { useStore } from "../state/store.tsx";
import { Picker } from "./picker.tsx";
import { useState } from "react";

/**
 * The project-picker modal. Loads the available Tmuxinator projects, renders a Picker for the user
 * to fuzzy-search and pick one, then advances the new-session flow to the session-name prompt.
 */
export function ProjectPickerModal() {
  const { promptForSession, cancel } = useStore();
  const [projects, setProjects] = useState<string[] | null>(null);

  useEffectAsync(async () => {
    setProjects(await listTmuxinatorProjects());
  }, []);

  if (projects === null) return null;

  return (
    <Picker
      title="Pick a Project"
      options={projects}
      onSelect={promptForSession}
      onCancel={cancel}
    />
  );
}
