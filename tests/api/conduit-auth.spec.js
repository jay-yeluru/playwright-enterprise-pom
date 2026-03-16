const { test } = require('../../fixtures/page-manager.fixture');
const { apiTags } = require('../../constants/tags');
const config = require('../../utils/config');

test.describe(`Conduit API: Authentication ${apiTags.CONDUIT} ${apiTags.API}`, () => {

    test('should login successfully with valid credentials @smoke', async ({ app, utils, data }) => {
        const authUtils = utils.authUtils;
        const apiUtils = utils.apiUtils;
        const conduitApi = app.getConduitApi();
        const user = data.createUser();

        // 1. Pre-requisite: Register the user via API
        const registerResponse = await authUtils.register(user.username, user.email, user.password);
        await apiUtils.verifyResponse(registerResponse, 'User Registration');
        await conduitApi.assertStatus(registerResponse, 201);

        // 2. Perform Login via API
        const loginResponse = await apiUtils.postRequest(`${config.apiBaseUrl}/users/login`, {
            user: {
                email: user.email,
                password: user.password
            }
        });

        const loginBody = await apiUtils.verifyResponse(loginResponse, 'User Login');

        // 3. Assertions (All handled by ConduitApiPage)
        await conduitApi.assertStatus(loginResponse, 200);
        await conduitApi.assertResponseProperty(loginBody, 'user.email', user.email.toLowerCase());
        await conduitApi.assertResponseProperty(loginBody, 'user.username', user.username);
        await conduitApi.assertTokenValid(loginBody.user.token);

        console.log(`Successfully logged in as: ${loginBody.user.username}`);
    });

    test('should return 401 for login with invalid password', async ({ app, utils, data }) => {
        const apiUtils = utils.apiUtils;
        const conduitApi = app.getConduitApi();
        const user = data.createUser();

        // Attempt login with invalid credentials
        const loginResponse = await apiUtils.postRequest(`${config.apiBaseUrl}/users/login`, {
            user: {
                email: user.email,
                password: 'wrong_password'
            }
        });

        await conduitApi.assertStatus(loginResponse, 401);
        const errorBody = await loginResponse.json();
        await conduitApi.assertErrorContains(errorBody, 'credentials', 'invalid');
    });
});
