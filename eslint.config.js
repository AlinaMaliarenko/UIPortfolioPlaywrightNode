import path from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat();

export default [
    ...compat.extends("plugin:playwright/recommended"),

    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: (await import("@typescript-eslint/parser")).default,
            parserOptions: {
                sourceType: "module",
                ecmaVersion: "latest",
                project: "./tsconfig.json"
            }
        },
        plugins: {
            "@typescript-eslint": (await import("@typescript-eslint/eslint-plugin")).default,
            "require-await-playwright": {
                rules: {
                    "require-await-playwright": (await import(
                        path.resolve(__dirname, "eslint-rules/require-await-playwright.js")
                    )).default
                }
            }
        },
        rules: {
            "@typescript-eslint/no-unused-vars": "warn",
            "require-await-playwright/require-await-playwright": "error",
            "playwright/expect-expect": "error"
        }
    },

    // for test files:

    {
        files: ["tests/**/*.ts", "tests/**/*.tsx"],
        rules: {
            "playwright/expect-expect": "off" // disable for tests folder
        }
    }
];
