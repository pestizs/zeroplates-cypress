# Cypress E2E Testing Project

This repository contains end-to-end (E2E) tests for my own web-application: Zeroplates, using Cypress.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Running Tests](#running-tests)
- [Configuration](#configuration)
- [Reporting](#reporting)

## Installation

To get started with this Cypress project, clone the repository and install the necessary dependencies.  
1. `git clone https://github.com/pestizs/zeroplates-cypress.git` 
2. Open the folder in a code editor (VsCode)  
3. In the terminal `npm install`  

## Usage

Before running the tests, please visit `https://zeroplates.vercel.app/register` in your browser.  
Note that the backend is hosted on a free instance, which may spin down due to inactivity, potentially causing delays of up to 50 seconds for requests.  
Once it is active again, you can start running the tests.

## Running Tests

To open the Cypress Test Runner in **interactive mode**, use the following command:  
(note: if you run tests in interactive mode, it won't generate test reports after the run)  
`npx cypress open` (then choose your preferred browser)  
click 'Run all specs' (to run all the tests continuously)  
![run all specs](https://github.com/pestizs/zeroplates-cypress/assets/89751059/1e7fdc78-6cdd-42b3-b7de-e2d42fba2313)  
  
To run the tests in **Headless mode**, use the following command: 
(note: if you run tests in headless mode, it will generate test reports after the run)  
`npx cypress run --browser chrome` (It will run all the tests in Chrome, headless mode)

## Configuration

Cypress configuration options can be found in the cypress.config.ts file. This file allows you to customize various settings, including the base URL of your application, viewport size, and test retries.  
**Environment Variables:** ('env:')  
The Cypress tests can be configured using environment variables defined in the `cypress.config.ts` file. These variables allow you to customize the behavior of the tests.  
![image](https://github.com/pestizs/zeroplates-cypress/assets/89751059/79f94270-5a39-4b39-851c-8a80be03671a)


## Reporting

After each headless run, cypress generates a test report which can be found in your cypress folder.  
Optionally, you can enable or disable screenshots and videos in configurations.  
![cypress artifacts](https://github.com/pestizs/zeroplates-cypress/assets/89751059/1ab8cfe9-6dc8-4d9c-870d-4e644179e5c0)
