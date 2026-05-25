import { Footer } from "./components/footer.tsx";
import { Header } from "./components/header.tsx";
import { ProjectList } from "./components/project-list.tsx";
import { useKeybindings } from "./hooks/use-keybindings.ts";
import { useStore } from "./state/store.tsx";
import { Box } from "ink";

/** The full-window TUI shell: header on top, project list filling the middle, footer at the bottom. */
export function App() {
  const { windowHeight } = useStore();

  useKeybindings();

  return (
    <Box flexDirection="column" height={windowHeight}>
      <Header />
      <ProjectList />
      <Footer />
    </Box>
  );
}
