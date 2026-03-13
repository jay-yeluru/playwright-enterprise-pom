const base = require('./auth-page.fixture');
const { POManager } = require('../pages/po-manager');
const { Helpers } = require('../utils/helpers');

exports.test = base.test.extend({
    // Provides authenticated app (POManager)
    app: async ({ page }, use) => {
        const poManager = new POManager(page);
        await use(poManager);
    },

    // Provides authenticated generic helpers
    helpers: async ({ page }, use) => {
        const helpers = new Helpers(page);
        await use(helpers);
    },
});

exports.expect = base.expect;
exports.request = base.request;
