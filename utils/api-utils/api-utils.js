const config = require('../config');

class ApiUtils {
    constructor(request, page = null, context = null) {
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
    async addHeaders(customHeaders = '') {
        if (!this.context) throw new Error('Context is required to set extra headers');
        if (!this.page) throw new Error('Page is required to set up header routing');

        let headerObj = {};

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

    async getRequest(url, options = {}) {
        return await this.request.get(url, {
            ...options,
        });
    }

    async putRequest(url, data, options = {}) {
        return await this.request.put(url, {
            data,
            ...options,
        });
    }

    async deleteRequest(url, options = {}) {
        return await this.request.delete(url, {
            ...options,
        });
    }

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
        throw new Error(
            `API call Failed: ${responseName}: ${status} ${url} ${JSON.stringify(responseBody)}`
        );
    }
}

module.exports = { ApiUtils };
