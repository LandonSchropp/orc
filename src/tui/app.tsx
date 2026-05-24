import { Footer } from "./components/footer.tsx";
import { Header } from "./components/header.tsx";
import { SessionList } from "./components/session-list.tsx";
import { useStore } from "./state/store.tsx";
import { Box } from "ink";

/** The full-window TUI shell: header on top, session list filling the middle, footer at the bottom. */
export function App() {
  const { windowHeight } = useStore();

  return (
    <Box flexDirection="column" height={windowHeight}>
      <Header />
      <SessionList />
      <Footer />
    </Box>
  );
}
