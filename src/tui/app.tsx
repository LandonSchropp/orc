import { Footer } from "./components/footer.tsx";
import { Header } from "./components/header.tsx";
import { SessionList } from "./components/session-list.tsx";
import { StoreProvider } from "./state/store.tsx";
import { Box } from "ink";

export function App() {
  return (
    <StoreProvider>
      <Box flexDirection="column">
        <Header />
        <SessionList />
        <Footer />
      </Box>
    </StoreProvider>
  );
}
