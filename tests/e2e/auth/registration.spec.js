const { test } = require('../../../fixtures/page-manager.fixture');
const { signupTags, REGRESSION } = require('../../../constants/tags');

test.describe(`Conduit: Account Setup ${signupTags.CONDUIT} ${signupTags.SIGNUP}`, () => {
    // Generate random user details for the demo
    const randomNum = Math.floor(Math.random() * 10000);
    const username = `testuser_${randomNum}`;
    const email = `testuser_${randomNum}@example.com`;
    const password = 'Password123!';

    test(`should register a new user ${REGRESSION}`, async ({ app }) => {
        const signUpPage = app.getSignUpPage();

        await signUpPage.open();
        await signUpPage.register(username, email, password);

        // After registration, it usually redirects to the home page
        await signUpPage.assertUrl('https://demo.realworld.show/');

        console.log('\n--- NEW USER REGISTERED ---');
        console.log(`Username: ${username}`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('---------------------------\n');
    });
});
