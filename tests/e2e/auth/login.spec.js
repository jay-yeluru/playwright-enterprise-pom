const { test } = require('../../../fixtures/page-manager.fixture');
const { loginTags } = require('../../../constants/tags');

test.describe('Login Tests (No Auth)', { tag: [loginTags.LOGIN, loginTags.CONDUIT] }, () => {
    test(`should load login page ${loginTags.SMOKE}`, async ({ app }) => {
        const loginPage = app.getLoginPage();

        await loginPage.open();
        await loginPage.assertLoaded();
    });

    test('should show error on invalid login', async ({ app }) => {
        const loginPage = app.getLoginPage();
        await loginPage.open();

        await loginPage.login('invalid_user', 'invalid_pass');
        await loginPage.assertLoginFailed();
    });
});
