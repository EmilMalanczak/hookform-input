/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig } */
const config = {
    plugins: ['@ianvs/prettier-plugin-sort-imports'],
    importOrder: [
        '<TYPES>',
        '^(react/(.*)$)|^(react$)',
        '<THIRD_PARTY_MODULES>',
        '',
        '<TYPES>^[.|..|~]',
        '^~/',
        '^[../]',
        '^[./]',
    ],
    importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
    printWidth: 120,
    tabWidth: 4,
    trailingComma: 'all',
    singleQuote: true,
    semi: true,
};

export default config;
