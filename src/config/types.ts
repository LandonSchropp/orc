import type { configSchema } from "./schema.ts";
import type { z } from "zod";

/** Orc's validated configuration. */
export type Config = z.infer<typeof configSchema>;
