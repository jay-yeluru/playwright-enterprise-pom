import { test } from '../../../fixtures/page-manager.fixture';
import { articleTags, dashboardTags } from '../../../constants/tags';

test.describe(`Conduit: Authenticated Flow ${articleTags.CONDUIT} ${articleTags.ARTICLE} ${dashboardTags.AUTH}`, () => {
    test(`should register, login and create an article ${articleTags.SMOKE} ${articleTags.ARTICLE}`, async ({
        app,
        data,
    }) => {
        const signUpPage = app.getSignUpPage();
        const articlePage = app.getArticlePage();

        // Generate data using factory
        const user = data.createUser();
        const article = data.createArticle();

        // 1. Sign Up
        await signUpPage.open();
        await signUpPage.register(user.username, user.email, user.password);

        console.log(`User registered: ${user.username}`);

        // 2. Create a New Article
        // Note: After registration, we are already logged in
        await articlePage.openEditor();
        await articlePage.createArticle(
            article.title,
            article.description,
            article.body,
            article.tagList
        );

        // 3. Verify Article Details
        await articlePage.assertArticleCreated(article.title);

        console.log(`\n✅ Flow Completed Successfully!`);
        console.log(`User: ${user.username} | Article: ${article.title}\n`);
    });
});
