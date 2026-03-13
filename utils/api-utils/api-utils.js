const config = require('../config');

class ApiUtils {
    constructor(request, page = null, context = null) {
        this.request = request;
        this.page = page;
        this.context = context;
    }

    /**
     * Injects environment-specific cookies into the browser context.
     * Logic moved from env.js for better encapsulation.
     */
    async addEnvironmentCookies() {
        if (!this.context) {
            console.warn('Context is required to add cookies');
            return;
        }

        const domain = config.getDomain(config.baseUrl);
        const cookies = [
            {
                name: 'env-type',
                value: config.envType,
                domain: domain,
                path: '/',
            },
        ];

        await this.context.addCookies(cookies);
    }

    /**
     * Returns standard framework headers.
     * Logic moved from env.js.
     */
    getFrameworkHeaders() {
        return {
            'X-Source': 'Playwright-Enterprise-Framework',
            'X-App-Version': '1.0.0',
        };
    }

    /**
     * Adds custom headers to the context.
     * Supports:
     * 1. JSON string: '{"X-Header": "Value"}'
     * 2. Formatted string: 'Key1:Value1, Key2:Value2'
     * 3. Native object: { 'X-Header': 'Value' }
     */
    async addHeaders(customHeaders = '') {
        if (!this.context) throw new Error('Context is required to set extra headers');
        if (!this.page) throw new Error('Page is required to set up header routing');

        let headerObj = {};

        if (customHeaders) {
            if (typeof customHeaders === 'string') {
                try {
                    // Try parsing as JSON first
                    headerObj = JSON.parse(customHeaders);
                } catch (_e) {
                    // Fallback: Parse as 'Key:Value, Key:Value' string
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
            if (process.env.ENV !== 'prod' && Object.keys(headerObj).length > 0) {
                console.log('adding custom headers: ', headerObj, 'to URL: ', request.url());
            }
            await route.continue({ headers });
        });

        // Ensure headers are also applied to direct API calls (this.request)
        await this.context.setExtraHTTPHeaders({
            ...frameworkHeaders,
            ...headerObj,
        });
    }

    /**
     * Sets up a listener for API errors (non-2xx/3xx responses)
     * @returns {Array} List of captured errors
     */
    async requestErrorListener() {
        if (!this.page) throw new Error('Page is required to attach response listener');
        const apiErrors = [];
        this.page.on('response', async (response) => {
            const status = response.status();
            if (status >= 400 || status === 0) {
                const request = response.request();
                const url = request.url();
                const method = request.method();
                let body;
                try {
                    body = await response.text();
                } catch (_e) {
                    // Body might not be available
                    body = '<unreadable>';
                }
                apiErrors.push({ status, method, url, body });
            }
        });
        return apiErrors;
    }

    async postRequest(url, data, options = {}) {
        return await this.request.post(url, {
            data,
            ...options,
        });
    }

    //verify response
    async verifyResponse(response, responseName = '', _requestBody = null) {
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
        if (_requestBody) {
            console.error(`request Body: ${JSON.stringify(_requestBody)}`);
        }
        throw new Error(
            `API call Failed: ${responseName}: ${status} ${url} ${JSON.stringify(responseBody)}`
        );
    }
}

module.exports = { ApiUtils };
