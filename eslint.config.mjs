import { defineConfig, globalIgnores } from "eslint/config"
import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"

const config = defineConfig([
  globalIgnores([
    "node_modules/**",
    ".next/**",
    "out/**",
    "design_system/**",
    "next-env.d.ts",
  ]),
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
    rules: {
      // Aderência ao DS (espelha _adherence.oxlintrc.json, com severidade error):
      // cores, espaçamentos e fontes só via tokens var(--...) — hex/px crus vivem
      // exclusivamente em app/globals.css.
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/#[0-9a-fA-F]{3,8}\\b/]",
          message: "Hex cru — use um token de cor do design system via var(--...).",
        },
        {
          selector: "Literal[value=/\\b\\d+px\\b/]",
          message: "px cru — use número (React aplica px) ou um token de espaçamento via var(--...).",
        },
        {
          selector: "Property[key.name='fontFamily'] > Literal[value!=/var\\(--font-(display|body|mono)\\)/]",
          message: "Fonte fora do sistema — use var(--font-display|--font-body|--font-mono).",
        },
      ],
    },
  },
])

export default config
