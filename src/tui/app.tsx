import { Footer } from "./components/footer.tsx";
import { Header } from "./components/header.tsx";
import { SessionList } from "./components/session-list.tsx";
import { StoreProvider } from "./state/store.tsx";
import { Box } from "ink";

// TODO: Replace this hardcoded value with a `useNumberOfColumns` hook that derives it from the
// terminal width.
const INITIAL_NUMBER_OF_COLUMNS = 3;

export function App() {
  return (
    <StoreProvider initialNumberOfColumns={INITIAL_NUMBER_OF_COLUMNS}>
      <Box flexDirection="column">
        <Header />
        <SessionList />
        <Footer />
      </Box>
    </StoreProvider>
  );
}
