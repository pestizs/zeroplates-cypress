import { defineConfig } from "cypress";

export default defineConfig({
  retries: {
    runMode: 0,
    openMode: 0
  },
  viewportHeight: 768,
  viewportWidth: 1024,
  defaultCommandTimeout: 6000,
  e2e: {
    baseUrl: "http://localhost:3000/",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
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
    extraValidationsOnRegistration: true, // true || false  // If true, 
    check_different_resolutions: true,    // true || false  // If true, it checks the login workflow in different viewports..(desktop, mobile, tablet..)
    extraValidationsOnLogin: true,        // true || false  // If true, it adds extra validation checks to the login workflow
    extraValidationsOnVehCheck: true,     // true || false  //  Extra validations while checking vehicles (time consuming if numberOfRegs value is high)

    // Number of registration numbers that we want to check and save in our tests, if num. greater than the amount of reg. numbers we have in the array, then it will return the maximum
    // List of  valid registration numbers found in helperTexts.ts
    // If we pass false, then it will generate a random number between 5 and 15
    numberOfRegistrationNumbers: 10, // null || a number

    // Array that contains the registration numbers, that we want to exclude from the tests 
    // optional
    regsToExclude: ['XXX', 'L15ZSK', 'LD52UOP'],

    // Number of Representatives that we want to add in our tests
    // If we pass false, then it will generate a random number between 5 and 15
    numberOfRepresentatives: 8, // null || a number

    //default Credentials // We are using them in case the registration workflow fails in any of the tests
    defaultCredentials: {
      email: "mainuser@cytest.com",
      username: "mainuser",
      password: "Main99@",
    },
    apiUrl: "http://localhost:7000/",
  },
});
