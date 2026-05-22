import { Footer } from "./components/footer.tsx";
import { Header } from "./components/header.tsx";
import { SessionList } from "./components/session-list.tsx";
import { Box } from "ink";

export function App() {
  return (
    <Box flexDirection="column">
      <Header />
      <SessionList />
      <Footer />
    </Box>
  );
}
