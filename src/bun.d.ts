import type { YamlValue } from "./types.ts";

declare module "bun" {
  namespace YAML {
    function parse(input: string): YamlValue;
  }
}
