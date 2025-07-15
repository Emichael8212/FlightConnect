import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    ignores: [
    'prisma/**',
    'eslint.config.js',
    "**/node_modules/**",
    "dist/**",
    "build/**",
    "generated/prisma-client/**",
    "coverage/**"
  ],
    extends: ["js/recommended"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      "no-console": "error", // allow console.log
      "semi": ["error", "always"], // require semicolons
      "quotes": ["error", "single"], // enforce single quotes
    },
  },
  pluginReact.configs.flat.recommended,
]);
