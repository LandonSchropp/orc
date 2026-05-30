---
paths:
  - "**/hooks/**/*.test.tsx"
---

# Testing React Hooks

Use `renderHook` + `act` from `@testing-library/react`. Don't write a probe component — `renderHook` is exactly the affordance for testing a hook in isolation.

```ts
import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();

import { useMyHook } from "./useMyHook.ts";
import { act, renderHook } from "@testing-library/react";

const { result, rerender, unmount } = renderHook(() => useMyHook(arg));
expect(result.current).toBe(...);
```

`GlobalRegistrator.register()` must run before any RTL import so the DOM globals are present when React DOM loads.
