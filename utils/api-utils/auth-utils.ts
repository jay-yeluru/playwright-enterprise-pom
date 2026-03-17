import { APIRequestContext } from '@playwright/test';
import { ApiUtils } from './api-utils';
import config from '../config';
import { step } from 'allure-js-commons';

export class AuthUtils extends ApiUtils {
    constructor(request: APIRequestContext) {
        super(request);
    }

    async login(email: string, password: string) {
        return await step(`API Login for ${email}`, async () => {
            const response = await this.postRequest(`${config.apiBaseUrl}/users/login`, {
                user: {
                    email,
                    password,
                },
            });

            if (response.ok()) {
                const data = await response.json();
                // Conduit usually returns user object with a token
                return {
                    token: data.user.token,
                    user: data.user,
                    storageState: {
                        cookies: [],
                        origins: [
                        {
                            origin: config.baseUrl,
                                localStorage: [
                                    {
                                        name: 'jwtToken',
                                        value: data.user.token,
                                    },
                                ],
                            },
                        ],
                    },
                };
            }
            return null;
        });
    }

    async register(username: string, email: string, password: string) {
        return await step(`API Register for ${username}`, async () => {
            const response = await this.postRequest(`${config.apiBaseUrl}/users`, {
                user: {
                    username,
                    email,
                    password,
                },
            });

            return response;
        });
    }
}
