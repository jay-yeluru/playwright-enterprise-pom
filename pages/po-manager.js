const { LoginPage } = require('./ui/login.page');
const { DashboardPage } = require('./ui/dashboard.page');
const { ArticlePage } = require('./ui/article.page');
const { SignUpPage } = require('./ui/sign-up.page');
const { ConduitApiPage } = require('./api/conduit.api');

class POManager {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // UI Pages
        this.loginPage = new LoginPage(page);
        this.dashboardPage = new DashboardPage(page);
        this.articlePage = new ArticlePage(page);
        this.signUpPage = new SignUpPage(page);

        // API Pages (Service Objects)
        // We use the request context associated with the page
        this.conduitApi = new ConduitApiPage(page.request);
    }

    getLoginPage() {
        return this.loginPage;
    }

    getDashboardPage() {
        return this.dashboardPage;
    }

    getArticlePage() {
        return this.articlePage;
    }

    getSignUpPage() {
        return this.signUpPage;
    }

    getConduitApi() {
        return this.conduitApi;
    }
}

module.exports = { POManager };
