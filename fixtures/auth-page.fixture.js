const { test: baseTest, expect } = require('./page-manager.fixture');
const { UtilsManager } = require('../utils/utils-manager');
const config = require('../utils/config');

exports.expect = expect;

exports.test = baseTest.extend({
    // Specialized credentials fixture for easier override in tests
    creds: { username: '', password: '' },

    // Overriding page fixture to provide an authenticated environment
    page: async ({ request, browser, creds }, use, testInfo) => {
        // 1. Initial Login via API to get state
        const umInit = new UtilsManager(request);
        let sessionData = {};

        try {
            sessionData = (await umInit.authUtils.login(creds.username, creds.password)) || {};
            if (sessionData.token) {
                console.log(`[AUTH]: Successfully authenticated via API for ${creds.username}`);
            } else {
                console.warn(`[AUTH]: API Login returned no session data for ${creds.username}`);
            }
        } catch (e) {
            console.warn(
                `[WARN]: API Auth failed: ${e.message}. Testing as unauthenticated or with default state.`
            );
        }

        // 2. Setup Context and Page
        // Note: sessionData.storageState would usually be applied here if using API-based injection
        const context = await browser.newContext({
            storageState: sessionData.storageState || undefined,
        });
        const page = await context.newPage();

        // 3. Setup Utils Manager for the authenticated session
        const um = new UtilsManager(request, page, context);

        // Add environment-level setup
        await um.apiUtils.addEnvironmentCookies();

        if (process.env.HEADERS && process.env.HEADERS.trim()) {
            try {
                await um.apiUtils.addHeaders(process.env.HEADERS);
            } catch (e) {
                console.error('[ERROR]: Failed to add custom headers:', e.message);
            }
        }

        // 4. Attach API Error Listener
        const apiErrors = await um.apiUtils.requestErrorListener();

        // 5. Use the fully configured page
        await use(page);

        // 6. Post-test failure logging for API errors
        if (testInfo.status !== testInfo.expectedStatus && apiErrors.length > 0) {
            console.error('\n⚠️ API Errors detected during the failed test ⚠️');
            for (const err of apiErrors) {
                console.error(`\t[${err.status}] ${err.method} -> ${err.url}`);
                console.error(`\tResponse Body Snippet: ${err.body.slice(0, 500)}`);
                console.error('\t---');
            }
        }

        // 7. Cleanup
        await page.close();
        await context.close();
    },
});
