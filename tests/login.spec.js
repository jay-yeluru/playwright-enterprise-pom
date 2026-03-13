const { test, expect } = require('../fixtures/page-manager.fixture');

test.describe('Login Tests (No Auth)', { tag: '@noauth' }, () => {
    test('should load login page @smoke', async ({ app }) => {
        const loginPage = app.getLoginPage();

        await loginPage.open();
        await loginPage.assertLoaded(expect);
    });

    test('should show error on invalid login', async ({ app }) => {
        const loginPage = app.getLoginPage();
        await loginPage.open();

        await loginPage.login('invalid_user', 'invalid_pass');
        await loginPage.assertLoginFailed(expect);
    });
});
