// jest.config.js
export default {
    testEnvironment: 'jsdom', // Set the test environment to jsdom
    setupFilesAfterEnv: ['@testing-library/jest-dom'], // Include jest-dom for extended assertions
    transform: {
        '^.+\\.jsx?$': 'babel-jest', // Handle .js and .jsx files using babel-jest
    },
    moduleFileExtensions: ['js', 'jsx'],
    collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/**/*.d.ts'],
};