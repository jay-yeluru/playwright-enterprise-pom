const playwright = require('eslint-plugin-playwright');
const prettier = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');
const js = require('@eslint/js');

module.exports = [
    {
        ignores: [
            '**/node_modules/**',
            '**/reports/**',
            '**/test-results/**',
            '**/playwright-report/**',
            '**/allure-results/**',
            '**/allure-report/**',
        ],
    },
    js.configs.recommended,
    {
        files: ['**/*.js', '**/*.ts'],
        plugins: {
            playwright: playwright,
            prettier: prettier,
        },
        rules: {
            ...playwright.configs['recommended'].rules,
            ...prettierConfig.rules,
            'prettier/prettier': 'error',
            'playwright/no-commented-out-tests': 'warn',
            'playwright/no-duplicate-hooks': 'error',
            'playwright/no-focused-test': 'error',
            'playwright/no-skipped-test': 'warn',
            'playwright/no-wait-for-timeout': 'error',
            'playwright/prefer-to-have-length': 'warn',
            'playwright/valid-expect': 'error',
            'playwright/expect-expect': [
                'warn',
                {
                    assertFunctionNames: ['expect', 'assert*'],
                },
            ],
            'no-console': 'off',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                // Common globals
                process: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                module: 'readonly',
                require: 'readonly',
                exports: 'readonly',
                console: 'readonly',
                // Browser globals if needed
                window: 'readonly',
                document: 'readonly',
            },
        },
    },
];
