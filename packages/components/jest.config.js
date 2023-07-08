const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");

module.exports = {
  preset: "ts-jest",
  transform: {
    ".ts|tsx": "ts-jest",
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  verbose: true,
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost",
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  collectCoverage: true,
  setupFilesAfterEnv: ["@testing-library/jest-dom/"],
};
