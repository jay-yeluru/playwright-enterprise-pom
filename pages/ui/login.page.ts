import { Helpers } from '../../utils/helpers';
import { step } from 'allure-js-commons';
import { expect, Page, Locator } from '@playwright/test';

export class LoginPage extends Helpers {
    public readonly emailInput: Locator;
    public readonly passwordInput: Locator;
    public readonly loginButton: Locator;
    public readonly errorMessage: Locator;

    constructor(page: Page) {
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

    async login(email: string, password: string) {
        await step(`Login with email: ${email}`, async () => {
            await this.safeFill(this.emailInput, email, 'email');
            await this.safeFill(this.passwordInput, password, 'password');
            await this.safeClick(this.loginButton, 'sign in button');
        });
    }

    async assertLoginFailed() {
        await step('Assert Login Failed', async () => {
            await expect(this.errorMessage).toBeVisible();
        });
    }

    async assertLoaded() {
        await step('Assert Login Page Loaded', async () => {
            await expect(this.emailInput).toBeVisible();
            await expect(this.passwordInput).toBeVisible();
            await expect(this.loginButton).toBeVisible();
        });
    }

    async assertUrl(regex: string | RegExp) {
        await step(`Assert Login URL matches: ${regex}`, async () => {
            await expect(this.page).toHaveURL(regex);
        });
    }
}
