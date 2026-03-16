const base = require('@playwright/test');
const { POManager } = require('../pages/po-manager');
const { UtilsManager } = require('../utils/utils-manager');
const { Helpers } = require('../utils/helpers');
const { dataManager } = require('../utils/data-manager');

exports.test = base.test.extend({
    // Provides the core page fixture with environment setup
    page: async ({ browser, request }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const um = new UtilsManager(request, page, context);

        // Initial setup: Inject cookies
        await um.apiUtils.addEnvironmentCookies();

        try {
            await use(page);
        } catch (error) {
            console.error('[ERROR]: Exception in page fixture:', error);
            throw error;
        } finally {
            await page.close();
            await context.close();
        }
    },

    // Provides the specialized Utils Manager
    utils: async ({ request, page, context }, use) => {
        // Note: page and context are already configured by the 'page' fixture or the base test
        // We create a fresh UtilsManager instance to provide to tests
        const um = new UtilsManager(request, page, context);
        await use(um);
    },

    // Provides the central Page Object Manager
    app: async ({ page }, use) => {
        const poManager = new POManager(page);
        await use(poManager);
    },

    // Provides generic helpers (data gen, etc.)
    helpers: async ({ page }, use) => {
        const helpers = new Helpers(page);
        await use(helpers);
    },

    // Provides the centralized Data Manager
    data: async ({ }, use) => {
        await use(dataManager);
    },
});

exports.expect = base.expect;
exports.request = base.request;
