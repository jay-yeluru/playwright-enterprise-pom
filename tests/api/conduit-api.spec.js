const { test } = require('../../fixtures/page-manager.fixture');
const { apiTags } = require('../../constants/tags');
const config = require('../../utils/config');

test.describe(`Conduit API: Public Endpoints ${apiTags.CONDUIT} ${apiTags.API}`, () => {
    
    test(`should fetch all tags ${apiTags.SMOKE}`, async ({ app, utils }) => {
        const apiUtils = utils.apiUtils;
        const conduitApi = app.getConduitApi();
        
        const response = await apiUtils.getRequest(`${config.apiBaseUrl}/tags`);
        const body = await apiUtils.verifyResponse(response, 'Get Tags');
        
        await conduitApi.assertStatus(response, 200);
        await conduitApi.assertResponseProperty(body, 'tags');
        await conduitApi.assertIsArray(body.tags, 'Tags property');
        
        console.log(`Retrieved ${body.tags.length} tags`);
    });

    test(`should fetch articles from global feed`, async ({ app, utils }) => {
        const apiUtils = utils.apiUtils;
        const conduitApi = app.getConduitApi();
        
        const response = await apiUtils.getRequest(`${config.apiBaseUrl}/articles`, {
            params: {
                limit: 10,
                offset: 0
            }
        });
        const body = await apiUtils.verifyResponse(response, 'Get Articles');
        
        await conduitApi.assertStatus(response, 200);
        await conduitApi.assertArticlesList(body, 10);
        
        if (body.articles.length > 0) {
            await conduitApi.assertResponseProperty(body.articles[0], 'title');
            await conduitApi.assertResponseProperty(body.articles[0], 'slug');
            await conduitApi.assertResponseProperty(body.articles[0].author, 'username');
        }
    });

    test(`should return 404 for non-existent endpoint`, async ({ app, utils }) => {
        const apiUtils = utils.apiUtils;
        const conduitApi = app.getConduitApi();
        
        const response = await apiUtils.getRequest(`${config.apiBaseUrl}/non-existent-endpoint`);
        await conduitApi.assertStatus(response, 404);
    });
});
