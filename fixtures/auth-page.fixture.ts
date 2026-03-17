import { test as baseTest, expect, TestFixtures as BaseTestFixtures } from './page-manager.fixture';
import { UtilsManager } from '../utils/utils-manager';

export type AuthFixtures = {
    creds: { username: string; password: string };
};

export const test = baseTest.extend<AuthFixtures>({
    // Specialized credentials fixture for easier override in tests
    creds: { username: '', password: '' },

    // Overriding context fixture to provide an authenticated environment
    context: async ({ request, browser, creds }, use) => {
        // 1. Initial Login via API to get state
        const umInit = new UtilsManager(request);
        let sessionData: any = {};

        try {
            sessionData = (await umInit.authUtils.login(creds.username, creds.password)) || {};
            if (sessionData.token) {
                console.log(`[AUTH]: Successfully authenticated via API for ${creds.username}`);
            } else {
                console.warn(`[AUTH]: API Login returned no session data for ${creds.username}`);
            }
        } catch (e: any) {
            console.warn(
                `[WARN]: API Auth failed: ${e.message}. Testing as unauthenticated or with default state.`
            );
        }

        // 2. Setup Context with storageState
        const context = await browser.newContext({
            storageState: sessionData.storageState || undefined,
        });

        // 3. Environment-level setup can also happen here if needed strictly for auth
        // but base page fixture handles cookies and headers already if called

        await use(context);
        await context.close();
    },
});

export { expect };
