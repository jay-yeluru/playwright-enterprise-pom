import { faker } from '@faker-js/faker';
import { getData } from '../data/index';
import config from './config';

/**
 * DataManager acts as the central hub for all test data generation.
 * It provides both complex objects (User, Article), random primitives (email, UUID),
 * and environment-specific static data.
 */
export class DataManager {
    public readonly faker = faker;

    /**
     * Access environment-specific static data.
     * Usage: data.static('auth').user_login
     */
    static(experience: string): any {
        return getData(config.testEnv, experience);
    }

    /**
     * Generate a complete user object
     */
    createUser() {
        return {
            username: faker.internet.username(),
            email: faker.internet.email().toLowerCase(),
            password: faker.internet.password({ length: 12 }),
            bio: faker.lorem.sentence(),
            image: faker.image.avatar(),
        };
    }

    /**
     * Generate a complete article object
     */
    createArticle() {
        return {
            title: `${faker.lorem.words(3)} ${faker.string.uuid().slice(0, 5)}`,
            description: faker.lorem.sentence(),
            body: faker.lorem.paragraphs(2),
            tagList: [faker.lorem.word(), faker.lorem.word()],
        };
    }

    /**
     * Generate a random comment
     */
    createComment() {
        return {
            body: faker.lorem.sentence(),
        };
    }

    // --- Primitives & Utilities ---

    email(): string {
        return faker.internet.email().toLowerCase();
    }

    password(len: number = 10): string {
        return faker.internet.password({ length: len });
    }

    uuid(): string {
        return faker.string.uuid();
    }

    number(min: number = 1, max: number = 1000): number {
        return faker.number.int({ min, max });
    }

    string(length: number = 10): string {
        return faker.string.alphanumeric(length);
    }

    sentence(): string {
        return faker.lorem.sentence();
    }

    firstName(): string {
        return faker.person.firstName();
    }

    lastName(): string {
        return faker.person.lastName();
    }
}

export const dataManager = new DataManager();
