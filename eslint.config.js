import pluginJs from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import configPrettier from 'eslint-config-prettier';
import pluginReact from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    configPrettier,
    {
        plugins: {
            '@typescript-eslint': typescriptEslint,
        },
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: typescriptParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-react': 'off',
        },
    },
    {
        //  ignores has to be as a separate object in flat config - otherwise it doesnt work
        //  https://github.com/eslint/eslint/issues/17400
        ignores: ['node_modules', 'dist'],
    },
];
