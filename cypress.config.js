import { defineConfig } from "cypress";
import credidentials from "./cypress.env.json";

const whichEnv = credidentials.dev;

const main_url = whichEnv.main_url;
const apiUrl = whichEnv.api_url;
const default_password = credidentials.users_data.default_password;

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
      DEFAULT_PASSWORD: default_password,
    },
    setupNodeEvents(on, config) {
      // test
    },
  },
});
