import * as dotenv from 'dotenv';
dotenv.config();

interface Config {
    baseUrl: string;
    apiBaseUrl: string;
    testEnv: string;
    getDomain: (url: string) => string;
}

const config: Config = {
    baseUrl: (process.env.BASE_URL || 'https://demo.realworld.show').replace(/\/$/, ''),
    apiBaseUrl: (process.env.API_BASE_URL || 'https://api.realworld.show/api').replace(/\/$/, ''),
    testEnv: (process.env.TEST_ENV || 'stage').toLowerCase(),

    // Helper to get domain for cookies
    getDomain: (url: string) => url.replace('https://', '').replace('http://', '').split('/')[0],
};

export default config;
