import { unstubAllEnvs } from "./helpers/env.ts";
import "./helpers/process.ts";
import { afterEach, beforeEach, mock } from "bun:test";

beforeEach(() => {
  mock.clearAllMocks();
});

afterEach(() => {
  unstubAllEnvs();
});
