// @ts-check

import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import prettier from "eslint-plugin-prettier/recommended"

export default tseslint.config(eslint.configs.recommended, prettier, ...tseslint.configs.recommended, {
  ignores: ["**/node_modules", "**/dist"],
  rules: {
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          "{}": false,
        },
      },
    ],
    "@typescript-eslint/no-explicit-any": "off",
  },
})
