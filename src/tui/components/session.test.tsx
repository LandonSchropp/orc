import { sessionFactory } from "../../../test/factories/session.ts";
import { storeFactory } from "../../../test/factories/store.ts";
import { WORKING_AGENT_STATUS } from "../../constants.ts";
import * as storeModule from "../state/store.tsx";
import { Session } from "./session.tsx";
import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { render } from "ink-testing-library";

beforeEach(() => {
  spyOn(storeModule, "useStore").mockReturnValue(storeFactory.build());
});

describe("Session", () => {
  it("renders the session name", () => {
    const session = sessionFactory.build({ session: "feature-a" });

    const { lastFrame } = render(<Session session={session} />);

    expect(lastFrame()).toContain("feature-a");
  });

  it("renders the agent status", () => {
    const session = sessionFactory.build({
      agents: [{ paneId: "%1", status: WORKING_AGENT_STATUS }],
    });

    const { lastFrame } = render(<Session session={session} />);

    expect(lastFrame()).toContain("working");
  });
});
