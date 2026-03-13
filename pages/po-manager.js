const { LoginPage } = require('./login.page');
const { DashboardPage } = require('./dashboard.page');
const { ArticlePage } = require('./article.page');
const { SignUpPage } = require('./sign-up.page');

class POManager {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.dashboardPage = new DashboardPage(page);
        this.articlePage = new ArticlePage(page);
        this.signUpPage = new SignUpPage(page);
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
}

module.exports = { POManager };
