import { createRequire } from 'module';
const cjsRequire = createRequire(import.meta.url);

export const getData = (env: string, experience: string): any => {
    try {
        const modulePath = `./${env}/${experience}.ts`;
        const dataModule = cjsRequire(modulePath);
        const result = dataModule[experience] || dataModule.default || dataModule;
        return result;
    } catch (error: any) {
        console.error(`[DataManager]: Failed to load data for ${env}/${experience}:`, error.message);
        return {};
    }
};
