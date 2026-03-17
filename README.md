<div align="center">

![Playwright Enterprise Hero](assets/playwright-hero.png)

# 🎭 Playwright Enterprise POM
### *Scalable, Resilient, and Assertion-Centric Automation*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.58.x-2EAD33?style=for-the-badge&logo=playwright)](https://playwright.dev/)
[![Allure 3](https://img.shields.io/badge/Allure_3-Reporting-FF69B4?style=for-the-badge&logo=allure)](https://allurereport.org/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-Automation-2088FF?style=for-the-badge&logo=github-actions)](https://github.com/features/actions)
[![Code Style](https://img.shields.io/badge/Prettier-Managed-F7B93E?style=for-the-badge&logo=prettier)](https://prettier.io/)

---

Playwright Enterprise POM is more than just a test suite—it's a production-ready engineering solution for web automation. Built on the **Conduit RealWorld Demo**, it demonstrates advanced patterns for synchronization, session management, and environment-agnostic data sourcing.

[Technical Stack](#-technical-stack) • [Architecture](#-architecture) • [Env Strategy](#-environment--data-strategy) • [Quick Start](#-installation--usage)

</div>

---

## ⚡ Technical Stack

*   **Core**: [Playwright](https://playwright.dev/) (Chromium, Firefox, WebKit)
*   **Language**: **TypeScript** (ES Modules)
*   **Reporting**: [Allure 3](https://allurereport.org/) + Playwright HTML
*   **Execution**: [tsx](https://github.com/privatenumber/tsx) (Modern TypeScript Runtime)
*   **Design Pattern**: Page Object Model (POM) + Service Object Pattern (API)
*   **Data Generation**: [@faker-js/faker](https://fakerjs.dev/)
*   **CI/CD**: GitHub Actions (Sharded Execution)

---

## 🏢 Architecture

![Enterprise Test Architecture](assets/framework-architecture.png)

### The Layering Strategy
-   **Test Layer (`tests/`)**: Focuses on "What" to test. Decoupled from selectors. **Zero `expect` logic** is used here; assertions are outsourced to the layers below.
-   **Fixture Layer (`fixtures/`)**: The logic hub. Injected managers and automatic session handling (Static & Dynamic).
-   **POM Layer (`pages/ui/`)**: The UI map. Atomic methods for single-responsibility interactions and **Self-Validating Assertions**.
-   **Service Layer (`pages/api/`)**: Centralized API validation logic. Handles status codes and payload verification.
-   **Data Layer (`data/`)**: The fuel. Separates static configuration from dynamic test data.

---

## 🌐 Environment & Data Strategy

This framework supports a sophisticated multi-environment strategy:

### 1. Environment Switching
Tests can be targeted at `stage`, `beta`, or `prod` using the `TEST_ENV` variable:
```bash
TEST_ENV=prod npm run test:desktop
```

### 2. The Data Manager Hub
The `DataManager` resolves data based on the current environment:
-   **Dynamic Data**: On-the-fly generation using Faker (e.g., random user emails).
-   **Static Data**: Environment-specific keys (e.g., authentication credentials for Stage vs Prod).

---

## 📊 Reporting & Metadata

Every run generates an **Allure 3** report enriched with system metadata. 

| Automatic Metadata | Description |
| :--- | :--- |
| **Executor** | Detects if running on `Local Machine` or `GitHub Actions`. |
| **Platform** | Captures OS (Darwin, Linux) and Node.js version. |
| **Live Context** | Injects the active `BaseURL` and `TEST_ENV` into the dashboard. |

```bash
# Generate and open updated report
npm run allure:generate && npm run allure:open
```

---

## 🚀 Installation & Usage

### Prerequisites

- **Node.js**: `v20.0.0` or higher
- **npm**: (comes with Node.js)

<details>
<summary><b>1. First-time Setup</b></summary>

```bash
# Clone and install
git clone https://github.com/jay-yeluru/playwright-enterprise-pom.git
cd playwright-enterprise-pom
npm install
npm run install:browsers

# Configure overrides
cp env/.env.example .env
```
</details>

<details>
<summary><b>2. Execution Commands (Local)</b></summary>

```bash
# Standard UI Test run
npm run test:desktop

# Targeted Runs (Tags)
npx playwright test --grep @smoke

# Environment Specific
TEST_ENV=prod npm run test:desktop

# Debug / UI Mode
npx playwright test --ui
```
</details>

<details>
<summary><b>3. Manual Test Trigger (GitHub Actions)</b></summary>

You can trigger tests manually with custom configurations via the **Actions** tab:
1.  **Select Workflow**: Choose `Manual Test Suite`.
2.  **Configure Inputs**:
    *   **Environment**: `stage`, `beta`, or `prod`.
    *   **Tag**: Choose from `@smoke`, `@api`, `@auth`, etc.
    *   **Project**: `desktop`, `mobile`, or `all`.
    *   **Advanced**: Override paths, set worker count, or use regex filters.
3.  **Run**: Click `Run workflow`. Results will be automatically pushed to the Allure Dashboard.
</details>

<details>
<summary><b>4. CI/CD & Automation</b></summary>

The GitHub Actions pipeline (`playwright.yml`) automates:
1.  **Parallel Sharding**: Splitting tests across multiple runners for speed.
2.  **Artifact Merging**: Consolidating results from all shards into one report.
3.  **GH Pages Deployment**: Automatic hosting of the latest Allure 3 dashboard.
</details>

---

## 📂 Project Blueprint

-   📂 `pages/ui/` — UI Page Objects (Locators + Self-Assertions) `.ts`.
-   📂 `pages/api/` — API Service Objects (Validation Logic) `.ts`.
-   📂 `fixtures/` — Custom Fixtures (Dependency Injection) `.ts`.
-   📂 `data/` — Env-specific TS files & Dynamic Loaders.
-   📂 `utils/` — API Clients, Config Handlers, and Helpers `.ts`.
-   📂 `tests/e2e/` — Functional E2E specs (`.spec.ts`) grouped by module.
-   📂 `tests/api/` — Service-level validation specs (`.spec.ts`).

---

<div align="center">

### Modern. Resilient. Data-Driven.

*Maintained by [Jay Yeluru](https://github.com/jay-yeluru)*

[![Follow](https://img.shields.io/github/followers/jay-yeluru?label=Follow&style=social)](https://github.com/jay-yeluru)

</div>
