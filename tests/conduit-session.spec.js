const { test, expect } = require('../fixtures/page-manager.fixture');
const { faker } = require('@faker-js/faker');

test.describe('Conduit: Authenticated Session', () => {
    // This test assumes global-setup has already logged in and saved storageState

    test.beforeEach(async ({ app }) => {
        // Navigate to home page - should already be logged in
        await app.getDashboardPage().open();
    });

    test('should create a new article using existing session', async ({ app, page }) => {
        const dashboardPage = app.getDashboardPage();
        const articlePage = app.getArticlePage();

        // 1. Verify we are logged in (New Article link should be visible)
        await dashboardPage.assertLoaded(expect);

        // 2. Create Article
        await articlePage.openEditor();

        const title = `${faker.lorem.sentence()} [Session]`;
        const description = faker.lorem.sentence();
        const body = faker.lorem.paragraphs(1);
        const tags = ['session-test', 'playwright'];

        await articlePage.createArticle(title, description, body, tags);

        // 3. Verify
        await articlePage.assertArticleCreated(expect, title);

        console.log(`\n✅ Article created via session: ${title}\n`);
    });
});
