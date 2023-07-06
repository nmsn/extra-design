/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  preset: "ts-jest",
  transform: {
    ".ts|tsx": "ts-jest",
  },
  verbose: true,
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost",
  },
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
  collectCoverage: true,
  // setupFilesAfterEnv: ["@testing-library/jest-dom/"],
};
