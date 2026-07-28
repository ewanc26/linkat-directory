// ESLint flat config: JS recommended, TypeScript strict, Svelte rules
import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import ts from "typescript-eslint";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.svelte"],

    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
  {
    // `.vercel/` holds generated deployment output (minified bundles). Linting
    // it produced hundreds of errors that had nothing to do with the source.
    ignores: ["build/", ".svelte-kit/", ".vercel/", "dist/", "node_modules/"],
  },
);
