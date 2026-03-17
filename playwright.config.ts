import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import * as dotenv from 'dotenv';
import config from './utils/config';

const testEnv = (process.env.TEST_ENV || 'stage').toLowerCase();

// 1. Load environment-specific file (defaults)
dotenv.config({ path: path.resolve(import.meta.dirname, 'env', `.env.${testEnv}`) });
// 2. Load root .env as a LOCAL OVERRIDE (Master Priority)
dotenv.config({ override: true });

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html', { outputFolder: 'reports/html-report' }],
        ['allure-playwright', { resultsDir: 'reports/allure-results' }],
    ],
    outputDir: 'reports/test-results',
    use: {
        baseURL: config.baseUrl,
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry',
    },

    projects: [
        {
            name: 'desktop',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'mobile',
            use: { ...devices['iPhone 12'] },
        },
    ],
});
