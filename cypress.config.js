const { defineConfig } = require("cypress");
require("dotenv").config();
module.exports = defineConfig({
  env: {
    REACT_APP_HOSTNAME: process.env.REACT_APP_HOSTNAME,
    REACT_APP_API_HOSTNAME: process.env.REACT_APP_API_HOSTNAME,
    REACT_APP_CYPRESS_TEST_USER_EMAIL: process.env.REACT_APP_CYPRESS_TEST_USER_EMAIL,
    REACT_APP_CYPRESS_TEST_USER_PASSWORD: process.env.REACT_APP_CYPRESS_TEST_USER_PASSWORD,
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      config.env = {
        ...process.env,
        ...config.env,
      };
      return config;
    },
    baseUrl: "http://localhost:3000",
    watchForFileChanges: false,
    experimentalRunAllSpecs:true,
  },
});
