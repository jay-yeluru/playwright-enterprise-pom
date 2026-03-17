import { APIRequestContext, Page, BrowserContext, APIResponse, Response } from '@playwright/test';
import config from '../config';

export class ApiUtils {
    public readonly request: APIRequestContext;
    public readonly page: Page | null;
    public readonly context: BrowserContext | null;

    constructor(request: APIRequestContext, page: Page | null = null, context: BrowserContext | null = null) {
        this.request = request;
        this.page = page;
        this.context = context;
    }

    /**
     * Injects environment-specific cookies into the browser context.
     */
    async addEnvironmentCookies() {
        if (!this.context) {
            console.warn('Context is required to add cookies');
            return;
        }

        const domain = config.getDomain(config.baseUrl);
        const cookies = [
            {
                name: 'test-env',
                value: config.testEnv,
                domain: domain,
                path: '/',
            },
        ];

        await this.context.addCookies(cookies);
    }

    /**
     * Returns standard framework headers.
     */
    getFrameworkHeaders() {
        return {
            'X-Source': 'Playwright-Enterprise-Framework',
            'X-App-Version': '1.0.0',
        };
    }

    /**
     * Adds custom headers to the context.
     */
    async addHeaders(customHeaders: string | Record<string, string> = '') {
        if (!this.context) throw new Error('Context is required to set extra headers');
        if (!this.page) throw new Error('Page is required to set up header routing');

        let headerObj: Record<string, string> = {};

        if (customHeaders) {
            if (typeof customHeaders === 'string') {
                try {
                    headerObj = JSON.parse(customHeaders);
                } catch (_e) {
                    customHeaders.split(',').forEach((pair) => {
                        const [key, value] = pair.split(':');
                        if (key && value) {
                            headerObj[key.trim()] = value.trim();
                        }
                    });
                }
            } else if (typeof customHeaders === 'object') {
                headerObj = customHeaders;
            }
        }

        const frameworkHeaders = this.getFrameworkHeaders();

        await this.page.route('**/*', async (route, request) => {
            const headers = {
                ...request.headers(),
                ...frameworkHeaders,
                ...headerObj,
            };
            await route.continue({ headers });
        });

        await this.context.setExtraHTTPHeaders({
            ...frameworkHeaders,
            ...headerObj,
        });
    }

    /**
     * Sets up a listener for API errors
     */
    async requestErrorListener() {
        if (!this.page) throw new Error('Page is required to attach response listener');
        const apiErrors: any[] = [];
        this.page.on('response', async (response: Response) => {
            const status = response.status();
            if (status >= 400 || status === 0) {
                const request = response.request();
                const url = request.url();
                const method = request.method();
                let body;
                try {
                    body = await response.text();
                } catch (_e) {
                    body = '<unreadable>';
                }
                apiErrors.push({ status, method, url, body });
            }
        });
        return apiErrors;
    }

    async postRequest(url: string, data?: any, options: any = {}) {
        return await this.request.post(url, {
            data,
            ...options,
        });
    }

    async getRequest(url: string, options: any = {}) {
        return await this.request.get(url, {
            ...options,
        });
    }

    async putRequest(url: string, data?: any, options: any = {}) {
        return await this.request.put(url, {
            data,
            ...options,
        });
    }

    async deleteRequest(url: string, options: any = {}) {
        return await this.request.delete(url, {
            ...options,
        });
    }

    async verifyResponse(response: APIResponse, responseName: string = '', _requestBody: any = null) {
        if (response.ok()) {
            return response.json();
        }
        const status = response.status();
        const url = response.url();
        let responseBody;
        try {
            responseBody = await response.json();
        } catch (_e) {
            responseBody = await response.text();
        }
        throw new Error(
            `API call Failed: ${responseName}: ${status} ${url} ${JSON.stringify(responseBody)}`
        );
    }
}
