import type { JsonValue, YamlValue } from "./types.ts";

declare module "bun" {
  namespace YAML {
    function parse(input: string): YamlValue;
  }

  interface BunFile {
    json(): Promise<JsonValue>;
  }
}
