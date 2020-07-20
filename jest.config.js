// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const common = {
  clearMocks: true,
  moduleDirectories: ['node_modules'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!(lodash-es)).+\\.js'],
};

module.exports = {
  projects: [
    {
      ...common,
      displayName: 'jsdom',
      setupFiles: ['<rootDir>/.jest/jsdom.js'],
    },

    {
      ...common,
      displayName: 'electron',
      runner: '@jest-runner/electron',
      testEnvironment: '@jest-runner/electron/environment',
      setupFiles: ['regenerator-runtime/runtime'],

      // The glob patterns Jest uses to detect test files
      testMatch: ['**/?(*.)+(test-electron).[tj]s?(x)'],
    },
  ],
};
