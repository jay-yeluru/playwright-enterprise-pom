import { Helpers } from '../../utils/helpers';
import { step } from 'allure-js-commons';
import { expect, Page, Locator } from '@playwright/test';

export class SignUpPage extends Helpers {
    public readonly usernameInput: Locator;
    public readonly emailInput: Locator;
    public readonly passwordInput: Locator;
    public readonly signUpButton: Locator;

    constructor(page: Page) {
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

    async register(username: string, email: string, password: string) {
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

    async assertUrl(regex: string | RegExp) {
        await step(`Assert Sign Up URL matches: ${regex}`, async () => {
            await expect(this.page).toHaveURL(regex);
        });
    }
}
