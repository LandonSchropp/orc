import { includeIgnoreFile } from "@eslint/compat";
import javascript from "@eslint/js";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
import globals from "globals";
import { fileURLToPath } from "node:url";
import typescript from "typescript-eslint";

const GITIGNORE_PATH = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig([
  includeIgnoreFile(GITIGNORE_PATH),
  {
    ignores: ["**/*.d.ts"],
  },
  javascript.configs.recommended,
  ...typescript.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  prettier,
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]);
