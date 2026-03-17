import { test as base, expect, request, Page, BrowserContext, APIRequestContext } from '@playwright/test';
import { POManager } from '../pages/po-manager';
import { UtilsManager } from '../utils/utils-manager';
import { Helpers } from '../utils/helpers';
import { dataManager, DataManager } from '../utils/data-manager';

// Define the types for our fixtures
export type TestFixtures = {
    utils: UtilsManager;
    app: POManager;
    helpers: Helpers;
    data: DataManager;
};

export const test = base.extend<TestFixtures>({
    // Provides the core context fixture with environment setup
    context: async ({ browser }, use) => {
        const context = await browser.newContext();
        await use(context);
        await context.close();
    },

    // Provides the core page fixture
    page: async ({ context, request }, use, testInfo) => {
        const page = await context.newPage();
        const um = new UtilsManager(request, page, context);

        // Initial setup
        await um.apiUtils.addEnvironmentCookies();

        // Add custom headers if specified in environment
        if (process.env.HEADERS && process.env.HEADERS.trim()) {
            try {
                await um.apiUtils.addHeaders(process.env.HEADERS);
            } catch (e: any) {
                console.error('[ERROR]: Failed to add custom headers:', e.message);
            }
        }

        // Attach API Error Listener for debugging
        const apiErrors = await um.apiUtils.requestErrorListener();

        await use(page);

        // Post-test failure logging for API errors
        if (testInfo.status !== testInfo.expectedStatus && apiErrors.length > 0) {
            console.error('\n⚠️ API Errors detected during the failed test ⚠️');
            for (const err of apiErrors) {
                console.error(`\t[${err.status}] ${err.method} -> ${err.url}`);
                console.error(`\tResponse Body Snippet: ${err.body.slice(0, 500)}`);
                console.error('\t---');
            }
        }

        await page.close();
    },

    // Provides the specialized Utils Manager
    utils: async ({ request, page, context }, use) => {
        const um = new UtilsManager(request, page, context);
        await use(um);
    },

    // Provides the central Page Object Manager
    app: async ({ page }, use) => {
        const poManager = new POManager(page);
        await use(poManager);
    },

    // Provides generic helpers
    helpers: async ({ page }, use) => {
        const helpers = new Helpers(page);
        await use(helpers);
    },

    // Provides the centralized Data Manager
    data: async ({ }, use) => {
        await use(dataManager);
    },
});

export { expect, request };
