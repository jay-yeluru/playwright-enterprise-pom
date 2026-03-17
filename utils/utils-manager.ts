import { APIRequestContext, Page, BrowserContext } from '@playwright/test';
import { ApiUtils } from './api-utils/api-utils';
import { AuthUtils } from './api-utils/auth-utils';

/**
 * UtilsManager acts as a central registry for all utility classes.
 * It provides access to API and Auth utils.
 */
export class UtilsManager {
    public readonly request: APIRequestContext;
    public readonly page: Page | null;
    public readonly context: BrowserContext | null;
    public readonly apiUtils: ApiUtils;
    public readonly authUtils: AuthUtils;

    constructor(request: APIRequestContext, page: Page | null = null, context: BrowserContext | null = null) {
        this.request = request;
        this.page = page;
        this.context = context;

        // Specialized Utils with full context access
        this.apiUtils = new ApiUtils(this.request, this.page, this.context);
        this.authUtils = new AuthUtils(this.request);
    }
}
