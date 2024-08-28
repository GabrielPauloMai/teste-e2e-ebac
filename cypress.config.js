const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'e4e2kx',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://lojaebac.ebaconline.art.br/",
    video: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    screenshotOnRunFailure: true,
  },
});
