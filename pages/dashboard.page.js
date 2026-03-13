const { Helpers } = require('../utils/helpers');
const { step } = require('allure-js-commons');

class DashboardPage extends Helpers {
    constructor(page) {
        super(page);
        this.yourFeedTab = page.getByRole('button', { name: 'Your Feed' });
        this.globalFeedTab = page.getByRole('button', { name: 'Global Feed' });
        this.newArticleLink = page.getByRole('link', { name: 'New Article' });
        this.settingsLink = page.getByRole('link', { name: 'Settings' });
        this.userProfileLink = page.locator('.nav-link .user-pic + *'); // Username link
    }

    async open() {
        await step('Open Dashboard', async () => {
            await this.goto('/');
        });
    }

    async assertLoaded(expect) {
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
}

module.exports = { DashboardPage };
