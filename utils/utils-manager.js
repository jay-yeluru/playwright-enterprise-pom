const { ApiUtils } = require('./api-utils/api-utils');
const { AuthUtils } = require('./api-utils/auth-utils');

/**
 * UtilsManager acts as a central registry for all utility classes.
 * It provides access to API and Auth utils.
 */
class UtilsManager {
    /**
     * @param {import('@playwright/test').APIRequestContext} request
     * @param {import('@playwright/test').Page} [page]
     * @param {import('@playwright/test').BrowserContext} [context]
     */
    constructor(request, page = null, context = null) {
        this.request = request;
        this.page = page;
        this.context = context;

        // Specialized Utils with full context access
        this.apiUtils = new ApiUtils(this.request, this.page, this.context);
        this.authUtils = new AuthUtils(this.request);
    }
}

module.exports = { UtilsManager };
