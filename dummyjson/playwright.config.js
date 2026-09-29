const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  timeout: 30000,
  use: {
    baseURL: 'https://dummyjson.com',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
  reporter: [['list']],
});