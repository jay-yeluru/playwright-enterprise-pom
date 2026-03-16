const { test } = require('../../../fixtures/auth-page-manager.fixture');
const { dashboardTags, REGRESSION } = require('../../../constants/tags');

test.describe(`Conduit: Dynamic Auth Session ${dashboardTags.CONDUIT} ${dashboardTags.AUTH}`, () => {
    
    // We can generate random credentials for EACH test run to avoid data collisions
    const randomNum = Math.floor(Math.random() * 100000);
    const dynamicUser = {
        username: `user_${randomNum}`,
        email: `user_${randomNum}@example.com`,
        password: 'Password123!'
    };

    // We override the 'creds' fixture to use our dynamic user
    // The 'auth-page.fixture' will use these to login via API
    test.use({ 
        creds: {
            username: dynamicUser.email,
            password: dynamicUser.password
        } 
    });

    // Since we are using fresh credentials, we need to REGISTER them first
    // We do this in a global setup or a beforeAll, but for simplicity here's a beforeAll
    test.beforeAll(async ({ request }) => {
        const { UtilsManager } = require('../../../utils/utils-manager');
        const um = new UtilsManager(request);
        
        console.log(`\nRegistering dynamic user: ${dynamicUser.username}`);
        const response = await um.authUtils.register(dynamicUser.username, dynamicUser.email, dynamicUser.password);
        
        if (!response.ok()) {
            const body = await response.text();
            throw new Error(`Failed to register dynamic user for session test: ${body}`);
        }
    });

    test(`should access dashboard with dynamically created session ${dashboardTags.SMOKE}`, async ({ app }) => {
        const dashboardPage = app.getDashboardPage();

        // 1. Open home page - should be automatically logged in by the fixture
        await dashboardPage.open();

        // 2. Verify UI elements that only appear when logged in
        await dashboardPage.assertLoaded();
        await dashboardPage.assertFeedTabsVisible();
        await dashboardPage.assertUserProfileVisible();
        
        console.log(`✅ Verified authenticated session for: ${dynamicUser.username}`);
    });

    test(`should be able to navigate to settings while authenticated ${REGRESSION}`, async ({ app }) => {
        const dashboardPage = app.getDashboardPage();
        
        await dashboardPage.open();
        await dashboardPage.settingsLink.click();
        
        await dashboardPage.assertUrl(/.*settings$/);
        await dashboardPage.assertSettingsElementsVisible();
    });
});
