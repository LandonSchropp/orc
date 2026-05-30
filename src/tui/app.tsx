import { ActiveModal } from "./components/active-modal.tsx";
import { Footer } from "./components/footer.tsx";
import { Header } from "./components/header.tsx";
import { ProjectList } from "./components/project-list.tsx";
import { useSessionListKeybindings } from "./hooks/use-session-list-keybindings.ts";
import { useStore } from "./state/store.tsx";
import { Box } from "ink";

/** The full-window TUI shell: header on top, project list filling the middle, footer at the bottom. */
export function App() {
  const { windowHeight } = useStore();

  useSessionListKeybindings();

  return (
    <Box flexDirection="column" height={windowHeight}>
      <Header />
      <ProjectList />
      <Footer />
      <ActiveModal />
    </Box>
  );
}
