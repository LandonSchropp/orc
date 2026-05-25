import { Footer } from "./components/footer.tsx";
import { Header } from "./components/header.tsx";
import { ProjectList } from "./components/project-list.tsx";
import { useStore } from "./state/store.tsx";
import { Box, useApp, useInput } from "ink";

/** The full-window TUI shell: header on top, project list filling the middle, footer at the bottom. */
export function App() {
  const { exit } = useApp();
  const { windowHeight } = useStore();

  useInput((input, key) => {
    if (input === "q" || key.escape) {
      exit();
    }
  });

  return (
    <Box flexDirection="column" height={windowHeight}>
      <Header />
      <ProjectList />
      <Footer />
    </Box>
  );
}
