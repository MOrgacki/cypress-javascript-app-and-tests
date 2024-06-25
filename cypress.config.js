const { defineConfig } = require("cypress");
const credidentials = require("./cypress.env.json");

const whichEnv = credidentials.dev;

const main_url = whichEnv.main_url;
const apiUrl = whichEnv.api_url;

module.exports = defineConfig({
  e2e: {
    baseUrl: `${main_url}`,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 160000,
    video: false,
    store_artifacts: true,
    specPattern: "cypress/integration/**/*.spec.js",
    env: {
      API_BASE_URL: `${apiUrl}`,
    },
    setupNodeEvents(on, config) {
      // test
    },
  },
});
