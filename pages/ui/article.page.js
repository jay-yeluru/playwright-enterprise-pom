const { Helpers } = require('../../utils/helpers');
const { step } = require('allure-js-commons');
const { expect } = require('@playwright/test');

class ArticlePage extends Helpers {
    constructor(page) {
        super(page);
        this.newArticleLink = page.getByRole('link', { name: 'New Article' });
        this.titleInput = page.getByPlaceholder('Article Title');
        this.descriptionInput = page.getByPlaceholder("What's this article about?");
        this.bodyInput = page.getByPlaceholder('Write your article (in markdown)');
        this.tagsInput = page.getByPlaceholder('Enter tags');
        this.publishButton = page.getByRole('button', { name: 'Publish Article' });

        // Locators for the created article
        this.articleTitle = page.locator('h1');
        this.articleBody = page.locator('.article-content');
    }

    async openEditor() {
        await step('Open Article Editor', async () => {
            await this.safeClick(this.newArticleLink, 'new article link');
        });
    }

    async assertEditorVisible() {
        await step('Assert Article Editor is Visible', async () => {
            await expect(this.titleInput).toBeVisible();
            await expect(this.publishButton).toBeVisible();
        });
    }

    async createArticle(title, description, body, tags = []) {
        await step(`Create article: ${title}`, async () => {
            await this.safeFill(this.titleInput, title, 'article title');
            await this.safeFill(this.descriptionInput, description, 'article description');
            await this.safeFill(this.bodyInput, body, 'article body');

            for (const tag of tags) {
                await this.safeFill(this.tagsInput, tag, 'article tag');
                await this.page.keyboard.press('Enter');
            }

            await this.safeClick(this.publishButton, 'publish button');
        });
    }

    async assertArticleCreated(title) {
        await step(`Verify article: ${title} is created`, async () => {
            await expect(this.articleTitle).toHaveText(title);
        });
    }

    async assertUrl(regex) {
        await step(`Assert Article URL matches: ${regex}`, async () => {
            await expect(this.page).toHaveURL(regex);
        });
    }
}

module.exports = { ArticlePage };
