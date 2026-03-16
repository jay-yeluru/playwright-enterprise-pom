const { Helpers } = require('../../utils/helpers');
const { step } = require('allure-js-commons');
const { expect } = require('@playwright/test');

class SignUpPage extends Helpers {
    constructor(page) {
        super(page);
        this.usernameInput = page.getByPlaceholder('Username');
        this.emailInput = page.getByPlaceholder('Email');
        this.passwordInput = page.getByPlaceholder('Password');
        this.signUpButton = page.getByRole('button', { name: 'Sign up' });
    }

    async open() {
        await step('Open Sign Up Page', async () => {
            await this.goto('/');
            await this.page.getByRole('link', { name: 'Sign up' }).click();
            await this.usernameInput.waitFor({ state: 'visible' });
        });
    }

    async register(username, email, password) {
        await step(`Register user: ${username}`, async () => {
            await this.safeFill(this.usernameInput, username, 'username');
            await this.safeFill(this.emailInput, email, 'email');
            await this.safeFill(this.passwordInput, password, 'password');
            await this.safeClick(this.signUpButton, 'sign up button');
        });
    }

    async assertLoaded() {
        await step('Assert Sign Up Page Loaded', async () => {
            await expect(this.usernameInput).toBeVisible();
            await expect(this.signUpButton).toBeVisible();
        });
    }

    async assertUrl(regex) {
        await step(`Assert Sign Up URL matches: ${regex}`, async () => {
            await expect(this.page).toHaveURL(regex);
        });
    }
}

module.exports = { SignUpPage };
