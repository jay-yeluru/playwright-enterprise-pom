const { test, expect } = require('../fixtures/auth-page-manager.fixture');

test.describe('Dashboard Tests (Authenticated)', { tag: '@auth' }, () => {
    test('should display welcome message on dashboard @smoke', async ({ app }) => {
        const dashboardPage = app.getDashboardPage();

        await dashboardPage.open();
        await dashboardPage.assertLoaded(expect);
        const welcomeText = await dashboardPage.getWelcomeText();

        expect(welcomeText || '').toMatch(/welcome/i);
    });

    test('should logout successfully', async ({ app }) => {
        const dashboardPage = app.getDashboardPage();
        await dashboardPage.open();

        await dashboardPage.logout();
        await dashboardPage.assertLoggedOut(expect);
    });
});
