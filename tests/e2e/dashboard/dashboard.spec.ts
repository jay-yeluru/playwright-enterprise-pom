import { test } from '../../../fixtures/page-manager.fixture';
import { dashboardTags, REGRESSION } from '../../../constants/tags';

test.describe(`Dashboard Tests (Authenticated) ${dashboardTags.CONDUIT} ${dashboardTags.DASHBOARD} ${dashboardTags.AUTH}`, () => {
    test.beforeEach(async ({ app, data }) => {
        const signUpPage = app.getSignUpPage();
        const user = data.createUser();
        await signUpPage.open();
        await signUpPage.register(user.username, user.email, user.password);
        await signUpPage.assertUrl(/.*show\/$/);
    });

    test(`should verify feed tabs are visible on dashboard ${dashboardTags.SMOKE}`, async ({ app }) => {
        const dashboardPage = app.getDashboardPage();

        await dashboardPage.open();
        await dashboardPage.assertLoaded();
        await dashboardPage.assertFeedTabsVisible();
    });

    test(`should switch between Global Feed and Your Feed tabs ${REGRESSION} ${dashboardTags.DASHBOARD}`, async ({ app }) => {
        const dashboardPage = app.getDashboardPage();

        // 1. Initial state (already registered in beforeEach)
        await dashboardPage.open();
        await dashboardPage.assertFeedTabsVisible();

        // 2. Click Global Feed and verify it has active class
        await dashboardPage.clickGlobalFeed();
        await dashboardPage.assertTabsActive(true, false);

        // 3. Click Your Feed and verify
        await dashboardPage.clickYourFeed();
        await dashboardPage.assertTabsActive(false, true);
    });
});
