import { Helpers } from '../../utils/helpers';
import { step } from 'allure-js-commons';
import { expect, Page, Locator } from '@playwright/test';

export class ArticlePage extends Helpers {
    public readonly newArticleLink: Locator;
    public readonly titleInput: Locator;
    public readonly descriptionInput: Locator;
    public readonly bodyInput: Locator;
    public readonly tagsInput: Locator;
    public readonly publishButton: Locator;
    public readonly articleTitle: Locator;
    public readonly articleBody: Locator;

    constructor(page: Page) {
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

    async createArticle(title: string, description: string, body: string, tags: string[] = []) {
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

    async assertArticleCreated(title: string) {
        await step(`Verify article: ${title} is created`, async () => {
            await expect(this.articleTitle).toHaveText(title);
        });
    }

    async assertUrl(regex: string | RegExp) {
        await step(`Assert Article URL matches: ${regex}`, async () => {
            await expect(this.page).toHaveURL(regex);
        });
    }
}
