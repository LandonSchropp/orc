import { Footer } from "./components/Footer.tsx";
import { Header } from "./components/Header.tsx";
import { SessionList } from "./components/SessionList.tsx";
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
