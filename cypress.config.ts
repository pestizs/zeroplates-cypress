import { defineConfig } from "cypress";

export default defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  video: true,
  reporterOptions: {
    charts: true,
    reportPageTitle: 'TestReport',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    debug: true
  },
  retries: {
    runMode: 0,
    openMode: 0
  },
  viewportHeight: 768,
  viewportWidth: 1024,
  defaultCommandTimeout: 12000,
  e2e: {
    //baseUrl: "http://localhost:3000/", //local version
    baseUrl: "https://zeroplates.vercel.app/", //deployed version
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      let globalData = {};
      let savedRegNums = [];
      on('task', {
        setGlobalData: (data) => {
          globalData = { ...globalData, ...data }; // Merge the new data with existing globalData
          return null;
        },
        getGlobalData: () => {
          return globalData;
        },
        clearGlobalData: () => {
          globalData = {}; // Clear globalData
          return null;
        },
        //----
        setSavedRegNums: (data) => {
          savedRegNums = [...savedRegNums, ...data];
          return null;
        },
        getSavedRegNums: () => {
          return savedRegNums;
        },
        clearSavedRegNums: () => {
          savedRegNums = [];
          return null;
        },
      });
    },
  },
  env: {
    extraValidationsOnRegistration: true, // true || false  // If true, it adds extra validation checks to the registration workflow
    check_different_resolutions: true,    // true || false  // If true, it checks the login workflow in different viewports..(desktop, mobile, tablet..)
    extraValidationsOnLogin: true,        // true || false  // If true, it adds extra validation checks to the login workflow
    extraValidationsOnVehCheck: true,     // true || false  // If true, it adds extra validations while checking vehicles (time consuming if 'numberOfRegistrationNumbers' value is high)

    // Number of registration numbers that we want to check and save in our tests, if num. greater than the amount of reg. numbers we have in the array, then it will return the maximum
    // List of  valid registration numbers found in helperTexts.ts
    // If we pass null, then it will generate a random number between 5 and 15
    numberOfRegistrationNumbers: 16, // null || a number

    // Array that contains the registration numbers, that we want to exclude from the tests 
    // optional
    regsToExclude: ['XXREGXX', 'L15ZSK', 'LD52UOP'],

    // Number of Representatives that we want to add in our tests
    // If we pass null, then it will generate a random number between 5 and 15
    numberOfRepresentatives: 7, // null || a number

    //default Credentials // We are using them in case the registration workflow fails in any of the tests
    defaultCredentials: {
      email: "mainuser@cytest.com",
      username: "mainuser",
      password: "Main99@",
    },
    //apiUrl: "http://localhost:7000/", //local version
    apiUrl: "https://zeroplates-be.onrender.com/", //deployed version
  },
});
