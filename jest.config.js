/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^app/(.*)$': '<rootDir>/app/$1', // Map your custom paths for Jest
  },
};
