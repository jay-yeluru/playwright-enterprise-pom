const { faker } = require('@faker-js/faker');
const { getData } = require('../data/index');
const config = require('./config');

/**
 * DataManager acts as the central hub for all test data generation.
 * It provides both complex objects (User, Article), random primitives (email, UUID),
 * and environment-specific static data.
 */
class DataManager {
    constructor() {
        // Primitives / Generators
        this.faker = faker;
    }

    /**
     * Access environment-specific static data.
     * Usage: data.static('login').user_login
     */
    static(experience) {
        return getData(experience, config.testEnv);
    }

    // --- Complex Objects (Dynamic) ---
    // ... rest of the file ...

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

    email() {
        return faker.internet.email().toLowerCase();
    }

    password(len = 10) {
        return faker.internet.password({ length: len });
    }

    uuid() {
        return faker.string.uuid();
    }

    number(min = 1, max = 1000) {
        return faker.number.int({ min, max });
    }

    string(length = 10) {
        return faker.string.alphanumeric(length);
    }

    sentence() {
        return faker.lorem.sentence();
    }

    firstName() {
        return faker.person.firstName();
    }

    lastName() {
        return faker.person.lastName();
    }
}

module.exports = { dataManager: new DataManager() };
