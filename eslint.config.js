import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs, ts}"], // JavaScript-related files
    languageOptions: {
      globals: globals.node,
    },
    plugins: { js, "@typescript-eslint": tseslint },
    extends: [
      "plugin:@typescript-eslint/recommended", // TypeScript recommended rules
      "plugin:prettier/recommended",
    ],
    rules: {
      // You can add custom rules here, for example, allowing `any` type:
      "@typescript-eslint/no-explicit-any": "off",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  tseslint.configs.recommended,
]);
