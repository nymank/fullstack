
const js = require("@eslint/js")
const globals = require("globals")

module.exports = [
    { ignores: ["node_modules", "coverage", "dist"] },
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: globals.node
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
            indent: ["error", 4],
            "linebreak-style": ["error", "unix"],
            quotes: ["error", "double"],
            semi: ["error", "never"],
            eqeqeq: "error",
            "no-trailing-spaces": "error",
            "object-curly-spacing": ["error", "always"],
            "arrow-spacing": ["error", { before: true, after: true }],
            "no-console": "off"
        }
    }
]
