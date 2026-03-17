import { dataManager, DataManager } from './data-manager';
import { step } from 'allure-js-commons';
import { Page, Locator } from '@playwright/test';

/**
 * Helpers class (Base Class) for all Page Objects.
 * Contains data generation, network utilities, and safe UI interactions.
 */
export class Helpers {
    public page: Page;
    public elements: {
        pageSpinner: Locator;
        buttonSpinner: Locator;
    };
    public data: DataManager;

    constructor(page: Page) {
        this.page = page;

        this.elements = {
            pageSpinner: this.page.locator('.spinner'),
            buttonSpinner: this.page.locator('button.spinner'),
        };

        // Unified Data Access (Enterprise Pattern)
        this.data = dataManager;
    }

    /**
     * Navigate to a specific path
     */
    async goto(path: string = '/') {
        await step(`Navigate to: ${path}`, async () => {
            await this.page.goto(path, { waitUntil: 'load' });
        });
    }

    /**
     * Safe click that waits for element to be visible
     */
    async safeClick(locator: Locator, label: string = 'element') {
        await step(`Clicking ${label}`, async () => {
            await locator.waitFor({ state: 'visible' });
            await locator.click();
        });
    }

    /**
     * Safe fill that clears the input first
     */
    async safeFill(locator: Locator, value: string, label: string = 'element') {
        await step(`Filling ${label} with value`, async () => {
            await locator.waitFor({ state: 'visible' });
            await locator.clear();
            await locator.fill(value);
        });
    }

    /**
     * Wait for a specific API response
     */
    async waitForResponse(endpoint: string, method: string = 'POST', status: number = 200, timeout: number = 5000) {
        return await step(
            `Wait for ${method} response from ${endpoint} (Status: ${status})`,
            async () => {
                try {
                    return await this.page.waitForResponse(
                        (res) =>
                            res.url().includes(endpoint) &&
                            res.request().method() === method &&
                            res.status() === status,
                        { timeout }
                    );
                } catch (error) {
                    throw new Error(
                        `CRITICAL: Response from ${endpoint} [${method}] with status ${status} was not received within ${timeout}ms.`,
                        { cause: error }
                    );
                }
            }
        );
    }

    /**
     * Handle reCaptcha checkbox
     */
    async clickCaptchaCheckbox(captchaLocator: Locator) {
        await step('Handle reCaptcha interaction', async () => {
            await captchaLocator.waitFor({ state: 'visible' });
            await captchaLocator.click();

            const isChecked = await captchaLocator.isChecked();
            if (!isChecked) {
                throw new Error('FAILED: Captcha checkbox was clicked but is not checked.');
            }
        });
    }

    /**
     * Select option from a dropdown
     */
    async selectOption(dropdownLocator: Locator, option: string | string[] | { value?: string, label?: string, index?: number }) {
        await step(`Select "${option}" from dropdown`, async () => {
            await dropdownLocator.waitFor({ state: 'visible' });
            try {
                await dropdownLocator.selectOption(option);
            } catch (error) {
                throw new Error(`FAILED: Option "${option}" not found in the dropdown.`, {
                    cause: error,
                });
            }
        });
    }

    async isElementVisible(locator: Locator): Promise<boolean> {
        try {
            return await locator.isVisible();
        } catch (_e) {
            return false;
        }
    }

    async waitForUrl(urlOrRegex: string | RegExp, options?: { timeout?: number, waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' }) {
        await this.page.waitForURL(urlOrRegex, options);
    }
}
