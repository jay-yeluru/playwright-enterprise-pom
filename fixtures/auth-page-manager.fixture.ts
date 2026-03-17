import { test as base, expect, AuthFixtures } from './auth-page.fixture';
import { POManager } from '../pages/po-manager';
import { Helpers } from '../utils/helpers';

export const test = base.extend({
    // Provides authenticated app (POManager)
    app: async ({ page }, use) => {
        const poManager = new POManager(page);
        await use(poManager);
    },

    // Provides authenticated generic helpers
    helpers: async ({ page }, use) => {
        const helpers = new Helpers(page);
        await use(helpers);
    },
});

export { expect };
export { request } from '@playwright/test';
