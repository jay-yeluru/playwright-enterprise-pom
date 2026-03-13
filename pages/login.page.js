const { Helpers } = require('../utils/helpers');
const { step } = require('allure-js-commons');

class LoginPage extends Helpers {
    constructor(page) {
        super(page);
        this.emailInput = page.getByPlaceholder('Email');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Sign in' });
        this.errorMessage = page.locator('.error-messages');
    }

    async open() {
        await step('Open Login Page', async () => {
            await this.goto('/');
            await this.page.getByRole('link', { name: 'Sign in' }).click();
            await this.emailInput.waitFor({ state: 'visible' });
        });
    }

    async login(email, password) {
        await step(`Login with email: ${email}`, async () => {
            await this.safeFill(this.emailInput, email, 'email');
            await this.safeFill(this.passwordInput, password, 'password');
            await this.safeClick(this.loginButton, 'sign in button');
        });
    }

    async assertLoginFailed(expect) {
        await step('Assert Login Failed', async () => {
            await expect(this.errorMessage).toBeVisible();
        });
    }

    async assertLoaded(expect) {
        await step('Assert Login Page Loaded', async () => {
            await expect(this.emailInput).toBeVisible();
            await expect(this.passwordInput).toBeVisible();
            await expect(this.loginButton).toBeVisible();
        });
    }
}

module.exports = { LoginPage };
