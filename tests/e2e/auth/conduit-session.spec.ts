import { test } from '../../../fixtures/auth-page-manager.fixture';
import { faker } from '@faker-js/faker';
import { articleTags, dashboardTags, REGRESSION } from '../../../constants/tags';
import { dataManager } from '../../../utils/data-manager';

test.describe(`Conduit: Authenticated Session ${articleTags.CONDUIT} ${dashboardTags.AUTH}`, () => {
    // EXPLICIT CONTROL: We pull the specific user from data/{env}/auth.js and "send" it to the fixture
    const user = dataManager.static('auth').user_login;

    test.use({
        creds: {
            username: user.email,
            password: user.password
        }
    });

    test.beforeAll(async ({ request }) => {
        const { UtilsManager } = await import('../../../utils/utils-manager');
        const um = new UtilsManager(request);
        // Register user if it doesn't exist (ignore error if already exists)
        await um.authUtils.register(user.username, user.email, user.password).catch(() => { });
    });

    test.beforeEach(async ({ app }) => {
        // Navigate to home page - should already be logged in
        await app.getDashboardPage().open();
    });

    test(`should create a new article using existing session ${REGRESSION} ${articleTags.ARTICLE}`, async ({ app }) => {
        const dashboardPage = app.getDashboardPage();
        const articlePage = app.getArticlePage();

        // 1. Verify we are logged in (New Article link should be visible)
        await dashboardPage.assertLoaded();

        // 2. Create Article
        await articlePage.openEditor();

        const title = `${faker.lorem.sentence()} [Session]`;
        const description = faker.lorem.sentence();
        const body = faker.lorem.paragraphs(1);
        const tags = ['session-test', 'playwright'];

        await articlePage.createArticle(title, description, body, tags);

        // 3. Verify
        await articlePage.assertArticleCreated(title);

        console.log(`\n✅ Article created via session: ${title}\n`);
    });
});
