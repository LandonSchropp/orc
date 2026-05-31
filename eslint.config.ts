import { includeIgnoreFile } from "@eslint/compat";
import javascript from "@eslint/js";
import prettier from "eslint-config-prettier";
import jsdoc from "eslint-plugin-jsdoc";
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
  jsdoc.configs["flat/recommended-typescript"],
  {
    rules: {
      // prettier-plugin-jsdoc keeps a single blank line between the block description and the tags.
      // The preset's default `tag-lines: "never"` would strip it, so ESLint and Prettier would
      // fight over that line. `"any"` with `startLines: 1` matches Prettier's output instead.
      "jsdoc/tag-lines": ["warn", "any", { startLines: 1 }],
      // A typed, single destructured-object parameter (e.g. a component's `({ ... }: Props)`) is
      // already documented by its type, so it doesn't also need `@param` tags.
      "jsdoc/require-param": ["warn", { interfaceExemptsParamsCheck: true }],
      // React components (PascalCase) are documented by a one-line summary, not a `@returns`.
      // Exempt them by name while still requiring `@returns` on every other function, including
      // hooks and helpers that live alongside components in .tsx files.
      "jsdoc/require-returns": ["warn", { contexts: [":function:not([id.name=/^[A-Z]/])"] }],
      // TypeScript does not model thrown types and the codebase only throws `Error`, so a `{type}`
      // on `@throws` would be unchecked boilerplate. Keep the descriptive `@throws` tag without it.
      "jsdoc/require-throws-type": "off",
      // Param descriptions read fine without a hyphen separator, and prettier-plugin-jsdoc does not
      // add one, so forbid it.
      "jsdoc/require-hyphen-before-param-description": ["warn", "never"],
    },
  },
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
