/**
 * Centralized Tag Registry
 * Helps in maintaining consistent tagging across the framework.
 */

const BASE_TAGS = {
    SMOKE: '@smoke',
    REGRESSION: '@regression',
    CONDUIT: '@conduit',
};

const articleTags = {
    ...BASE_TAGS,
    ARTICLE: '@article',
};

const loginTags = {
    ...BASE_TAGS,
    LOGIN: '@login',
};

const dashboardTags = {
    ...BASE_TAGS,
    DASHBOARD: '@dashboard',
    AUTH: '@auth',
};

const apiTags = {
    ...BASE_TAGS,
    API: '@api',
};

const signupTags = {
    ...BASE_TAGS,
    SIGNUP: '@signup',
};

module.exports = {
    articleTags,
    loginTags,
    dashboardTags,
    apiTags,
    signupTags,
    // Global access for base tags
    ...BASE_TAGS
};