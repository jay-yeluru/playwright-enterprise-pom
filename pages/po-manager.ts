import { Page } from '@playwright/test';
import { LoginPage } from './ui/login.page';
import { DashboardPage } from './ui/dashboard.page';
import { ArticlePage } from './ui/article.page';
import { SignUpPage } from './ui/sign-up.page';
import { ConduitApiPage } from './api/conduit.api';

export class POManager {
    public readonly page: Page;
    public readonly loginPage: LoginPage;
    public readonly dashboardPage: DashboardPage;
    public readonly articlePage: ArticlePage;
    public readonly signUpPage: SignUpPage;
    public readonly conduitApi: ConduitApiPage;

    constructor(page: Page) {
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
