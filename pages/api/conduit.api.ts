import { step } from 'allure-js-commons';
import { expect, APIRequestContext, APIResponse } from '@playwright/test';

export class ConduitApiPage {
    public readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async assertStatus(response: APIResponse, expectedStatus: number) {
        await step(`Assert API Status is ${expectedStatus}`, async () => {
            expect(response.status()).toBe(expectedStatus);
        });
    }

    async assertResponseProperty(body: any, property: string, value?: any) {
        await step(`Assert property "${property}" is "${value}"`, async () => {
            expect(body).toHaveProperty(property);
            if (value !== undefined) {
                // Handle nested objects or direct values
                const actualValue = property.split('.').reduce((obj, key) => obj?.[key], body);
                expect(actualValue).toBe(value);
            }
        });
    }

    async assertTokenValid(token: string) {
        await step('Assert API Token is valid', async () => {
            expect(typeof token).toBe('string');
            expect(token.length).toBeGreaterThan(10);
        });
    }

    async assertErrorContains(errorBody: any, field: string, message: string) {
        await step(`Assert error for "${field}" contains "${message}"`, async () => {
            expect(errorBody).toHaveProperty('errors');
            expect(errorBody.errors).toHaveProperty(field);
            const fieldErrors = errorBody.errors[field];
            if (Array.isArray(fieldErrors)) {
                expect(fieldErrors).toContain(message);
            } else {
                expect(fieldErrors).toBe(message);
            }
        });
    }

    async assertIsArray(data: any, label: string = 'Data') {
        await step(`Assert ${label} is an array`, async () => {
            expect(Array.isArray(data)).toBeTruthy();
        });
    }

    async assertArticlesList(body: any, limit: number) {
        await step(`Assert articles list (Limit: ${limit})`, async () => {
            expect(body).toHaveProperty('articles');
            expect(body).toHaveProperty('articlesCount');
            expect(body.articles.length).toBeLessThanOrEqual(limit);
        });
    }
}
