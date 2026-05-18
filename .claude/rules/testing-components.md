---
paths:
  - "**/components/**/*.test.tsx"
---

# Testing Ink Components

Use `render` from `ink-testing-library`, not `@testing-library/react`. Ink uses its own renderer; the DOM library can't reach it.

```ts
import { render } from "ink-testing-library";

const { lastFrame, frames, rerender } = render(<MyComponent />);
expect(lastFrame()).toContain("expected text");
```

- `lastFrame()` returns the most recent rendered terminal frame as a string.
- `frames` is the full array of frames in render order.
- `rerender(<MyComponent prop={new} />)` re-renders with new props.
