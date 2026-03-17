import * as fs from 'fs';
import * as path from 'path';
import config from './config';

/**
 * Generates environment.properties for Allure Report
 * This adds the "Environment" widget to the Allure Dashboard.
 */
function generateAllureEnv() {
    const resultsDir = path.resolve(process.cwd(), 'reports/allure-results');
    const propFilePath = path.join(resultsDir, 'environment.properties');
    const xmlFilePath = path.join(resultsDir, 'environment.xml');

    if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
    }

    // Properties Format
    const envDataProp = [
        `Environment=${config.testEnv.toUpperCase()}`,
        `BaseURL=${config.baseUrl}`,
        `Environment_Type=${config.testEnv === 'prod' ? 'Production' : 'Staging'} (${config.testEnv})`,
        `Platform=${process.platform}`,
        `Node_Version=${process.version}`,
        `Executor=${process.env.GITHUB_ACTIONS ? 'GitHub Actions' : 'Local Machine'}`
    ].join('\n');

    // XML Format (Secondary Backup)
    const envDataXml = `<?xml version="1.0" encoding="UTF-8"?>
<environment>
    <parameter><key>Environment</key><value>${config.testEnv.toUpperCase()}</value></parameter>
    <parameter><key>BaseURL</key><value>${config.baseUrl}</value></parameter>
    <parameter><key>Platform</key><value>${process.platform}</value></parameter>
    <parameter><key>Executor</key><value>${process.env.GITHUB_ACTIONS ? 'GitHub Actions' : 'Local Machine'}</value></parameter>
</environment>`;

    try {
        fs.writeFileSync(propFilePath, envDataProp);
        fs.writeFileSync(xmlFilePath, envDataXml);
        console.log(`✅ Generated Allure metadata in: ${resultsDir}`);
    } catch (error) {
        console.error('❌ Failed to generate Allure environment.properties:', error);
    }
}

generateAllureEnv();
