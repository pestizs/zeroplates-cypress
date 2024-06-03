# Cypress E2E Testing Project

This repository contains end-to-end (E2E) tests for my own web-application: Zeroplates, using Cypress.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Running Tests](#running-tests)
- [Custom Commands](#custom-commands)
- [Configuration](#configuration)
- [Reporting](#reporting)

## Installation

To get started with this Cypress project, clone the repository and install the necessary dependencies.  
  
git clone https://github.com/pestizs/zeroplates-cypress.git  
npm install  

## Usage

Before running the tests, please visit https://zeroplates.vercel.app/register in your browser.  
Note that the backend is hosted on a free instance, which may spin down due to inactivity, potentially causing delays of up to 50 seconds for requests.  
Once it is active again, you can start running the tests.

## Running Tests

To open the Cypress Test Runner in interactive mode, use the following command:  
npx cypress open (then choose your preferred browser)  
click 'Run all specs' (to run all the tests continuously)  
![run all specs](https://github.com/pestizs/zeroplates-cypress/assets/89751059/1e7fdc78-6cdd-42b3-b7de-e2d42fba2313)  

