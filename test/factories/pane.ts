import type { TmuxPane } from "../../src/types.ts";
import { Factory } from "fishery";

export const paneFactory = Factory.define<TmuxPane>(({ sequence }) => ({
  sessionIdentifier: "orc/feature-a",
  paneId: `%${sequence}`,
  paneTitle: "",
}));
