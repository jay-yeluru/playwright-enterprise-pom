import { Helpers } from '../../utils/helpers';
import { step } from 'allure-js-commons';
import { expect, Page, Locator } from '@playwright/test';

export class DashboardPage extends Helpers {
    public readonly yourFeedTab: Locator;
    public readonly globalFeedTab: Locator;
    public readonly newArticleLink: Locator;
    public readonly settingsLink: Locator;
    public readonly userProfileLink: Locator;

    constructor(page: Page) {
        super(page);
        this.yourFeedTab = page.getByRole('link', { name: 'Your Feed' });
        this.globalFeedTab = page.getByRole('link', { name: 'Global Feed' });
        this.newArticleLink = page.getByRole('link', { name: 'New Article' });
        this.settingsLink = page.getByRole('link', { name: 'Settings' });
        this.userProfileLink = page.locator('a.nav-link').filter({ has: page.locator('.user-pic') });
    }

    async clickYourFeed() {
        await step('Click Your Feed Tab', async () => {
            await this.yourFeedTab.click();
        });
    }

    async clickGlobalFeed() {
        await step('Click Global Feed Tab', async () => {
            await this.globalFeedTab.click();
        });
    }

    async open() {
        await step('Open Dashboard', async () => {
            await this.goto('/');
            await this.page.waitForLoadState('networkidle');
        });
    }

    async assertLoaded() {
        await step('Assert Dashboard Loaded', async () => {
            await expect(this.globalFeedTab).toBeVisible();
            await expect(this.newArticleLink).toBeVisible();
        });
    }

    async logout() {
        await step('Logout from Application', async () => {
            await this.settingsLink.click();
            await this.page.getByRole('button', { name: 'Or click here to logout.' }).click();
        });
    }

    async assertLoggedOut() {
        await step('Assert User is Logged Out', async () => {
            // After logout, Sign in link should be visible
            await expect(this.page.getByRole('link', { name: 'Sign in' })).toBeVisible();
        });
    }

    async assertFeedTabsVisible() {
        await step('Assert Feed Tabs are Visible', async () => {
            await expect(this.yourFeedTab).toBeVisible();
            await expect(this.globalFeedTab).toBeVisible();
        });
    }

    async assertUserProfileVisible() {
        await step('Assert User Profile is Visible', async () => {
            await expect(this.userProfileLink).toBeVisible();
        });
    }

    async assertTabsActive(globalActive = true, yourActive = false) {
        await step(`Assert Global Feed Active: ${globalActive}, Your Feed Active: ${yourActive}`, async () => {
            if (globalActive) {
                await expect(this.globalFeedTab).toHaveClass(/active/);
            } else {
                await expect(this.globalFeedTab).not.toHaveClass(/active/);
            }

            if (yourActive) {
                await expect(this.yourFeedTab).toHaveClass(/active/);
            } else {
                await expect(this.yourFeedTab).not.toHaveClass(/active/);
            }
        });
    }

    async assertSettingsElementsVisible() {
        await step('Assert Settings Page Elements are Visible', async () => {
            await expect(this.page.getByRole('heading', { name: 'Your Settings' })).toBeVisible();
        });
    }

    async assertUrl(regex: string | RegExp) {
        await step(`Assert Dashboard URL matches: ${regex}`, async () => {
            await expect(this.page).toHaveURL(regex);
        });
    }
}
