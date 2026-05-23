import { Footer } from "./components/footer.tsx";
import { Header } from "./components/header.tsx";
import { SessionList } from "./components/session-list.tsx";
import { StoreProvider } from "./state/store.tsx";
import { Box } from "ink";

// TODO: Replace this hardcoded value with `useStdoutDimensions` and wire `setWindowWidth` to
// terminal resizes.
const INITIAL_WINDOW_WIDTH = 100;

export function App() {
  return (
    <StoreProvider initialWindowWidth={INITIAL_WINDOW_WIDTH}>
      <Box flexDirection="column">
        <Header />
        <SessionList />
        <Footer />
      </Box>
    </StoreProvider>
  );
}
