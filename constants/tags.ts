/**
 * Centralized Tag Registry
 * Helps in maintaining consistent tagging across the framework.
 */

const BASE_TAGS = {
    SMOKE: '@smoke',
    REGRESSION: '@regression',
    CONDUIT: '@conduit',
} as const;

export const articleTags = {
    ...BASE_TAGS,
    ARTICLE: '@article',
} as const;

export const loginTags = {
    ...BASE_TAGS,
    LOGIN: '@login',
} as const;

export const dashboardTags = {
    ...BASE_TAGS,
    DASHBOARD: '@dashboard',
    AUTH: '@auth',
} as const;

export const apiTags = {
    ...BASE_TAGS,
    API: '@api',
} as const;

export const signupTags = {
    ...BASE_TAGS,
    SIGNUP: '@signup',
} as const;

// Global access for base tags
export const SMOKE = BASE_TAGS.SMOKE;
export const REGRESSION = BASE_TAGS.REGRESSION;
export const CONDUIT = BASE_TAGS.CONDUIT;