require('dotenv').config();

const config = {
    baseUrl: (process.env.BASE_URL || 'https://demo.realworld.show').replace(/\/$/, ''),
    apiBaseUrl: (process.env.API_BASE_URL || 'https://api.realworld.show/api').replace(/\/$/, ''),
    testEnv: (process.env.TEST_ENV || 'stage').toLowerCase(),
    envType: (process.env.TEST_ENV || 'stage').toLowerCase() === 'prod' ? 'production' : 'staging',

    // Helper to get domain for cookies
    getDomain: (url) => url.replace('https://', '').replace('http://', '').split('/')[0],
};

module.exports = config;
