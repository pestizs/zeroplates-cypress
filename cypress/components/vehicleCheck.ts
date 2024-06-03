import { GlobalSelectors, VehicleCheckSelectors } from "cypress/selectors/selectors";
import { getRandomRegistrationNumbers, getRandomNumber } from "cypress/support/utils";
import { tooltips } from "cypress/support/helperTexts/helperTexts";
const toasts = require("../fixtures/toasts.json");
const extraValidations = Cypress.env("extraValidationsOnVehCheck")

//Number of registration numbers that we want to check
let numberOfRegNums = Cypress.env("numberOfRegistrationNumbers")
//If its not set in cypress.config.ts, we generate a random number
if (!numberOfRegNums) {
    numberOfRegNums = getRandomNumber()
}

//Array that contains the registration numbers, that we want to exclude
const regsToExclude = Cypress.env("regsToExclude")

let selectedNumbers: string[] = getRandomRegistrationNumbers(numberOfRegNums, regsToExclude);
let savedVehicles: string[] = [];

export function checkandSaveVehicles() {
    cy.intercept("POST", "api/vehicle-enquiry/v1/vehicles").as("dvla")
    //runs until there are any vehicles left in selectedNumbers
    function saveVehicle() {
        if (selectedNumbers.length === 0) {
            cy.log(`**List of Saved vehicles: ${savedVehicles}**`);
            return; // Exit the recursion if there are no more vehicles
        }

        cy.getInput_Type_Check(VehicleCheckSelectors.input_search, selectedNumbers[0]);
        cy.get(VehicleCheckSelectors.button_search).click();

        waitForDVLARequest().then((res) => {
            if (res.error) {
                cy.checkToast(toasts.InvalidRegNum);
                // Remove the first element from selectedNumbers
                selectedNumbers.shift();
                saveVehicle(); // Retry with the next vehicle
            } else {
                cy.task('setSavedRegNums', [selectedNumbers[0]]);
                cy.checkToast(toasts.SearchSuccess);
                cy.get(GlobalSelectors.hearIcon_empty).should('exist').click();
                cy.checkToast(toasts.VehicleSaved);
                cy.checkTooltip(GlobalSelectors.hearIcon_full, GlobalSelectors.tooltip_heart, tooltips.fullHearIcon, 500);
                if (extraValidations) checkVehicleDetails(res, VehicleCheckSelectors);
                cy.log(`**Saved vehicle: ${res.registrationNumber}**`);
                // Push the registration number to an array, so we can log them out later.
                savedVehicles.push(selectedNumbers[0]);
                // Remove the first element from selectedNumbers
                selectedNumbers.shift();
                saveVehicle(); // Continue with the next vehicle
            }
        });
    }
    saveVehicle(); // Start the recursion
}

export function checkEmptyVehCheckPage() {
    cy.get(VehicleCheckSelectors.input_search).should('exist').and('be.empty').type('FAKE123');
    cy.get(VehicleCheckSelectors.button_search).should('exist').click();
    cy.checkToast(toasts.InvalidRegNum);
    cy.get(GlobalSelectors.tooltip_heart).should('not.be.visible')

    cy.checkTooltip(GlobalSelectors.hearIcon_empty, GlobalSelectors.tooltip_heart, tooltips.emptyHeeartIcon, 500)

    cy.get(VehicleCheckSelectors.label_RegNum).should('exist').and('be.visible').and('have.text', 'Type in your registration number')
    cy.get(VehicleCheckSelectors.span_RegNum).should('exist').and('be.visible').and('have.text', 'REG  NUM')
    cy.get(VehicleCheckSelectors.label_Tax).should('exist').and('be.visible')
    cy.get(VehicleCheckSelectors.value_Tax).should('not.have.value');
    cy.get(VehicleCheckSelectors.label_Mot).should('exist').and('be.visible')
    cy.get(VehicleCheckSelectors.label_Make).should('exist').and('be.visible')
    cy.get(VehicleCheckSelectors.label_DateOfReg).should('exist').and('be.visible')
    cy.get(VehicleCheckSelectors.label_YearOfMan).should('exist').and('be.visible')
    cy.get(VehicleCheckSelectors.label_Cylinder).should('exist').and('be.visible')
    cy.get(VehicleCheckSelectors.label_Co2).should('exist').and('be.visible')
    cy.get(VehicleCheckSelectors.label_Fuel).should('exist').and('be.visible')
    cy.get(VehicleCheckSelectors.label_Euro).should('exist').and('be.visible')
    cy.get(VehicleCheckSelectors.label_RDE).should('exist').and('be.visible')
    cy.get(VehicleCheckSelectors.label_Export).should('exist').and('be.visible')
    cy.get(VehicleCheckSelectors.label_VehStatus).should('exist').and('be.visible')
    cy.get(VehicleCheckSelectors.label_VehColor).should('exist').and('be.visible')
    cy.get(VehicleCheckSelectors.label_TypeApproval).should('exist').and('be.visible')
    cy.get(VehicleCheckSelectors.label_Wheelplan).should('exist').and('be.visible')
    cy.get(VehicleCheckSelectors.label_RevWeight).should('exist').and('be.visible')
    cy.get(VehicleCheckSelectors.label_V5C).should('exist').and('be.visible')

    cy.get(VehicleCheckSelectors.label_TaxDue).should('not.exist');
    cy.get(VehicleCheckSelectors.label_MotExpired).should('not.exist');
    cy.get(VehicleCheckSelectors.label_MotExpires).should('not.exist');
}

function waitForDVLARequest(): Cypress.Chainable {
    let attempts = 0;
    const maxAttempts = 30; // Maximum number of attempts to wait for the request

    function checkRequest() {
        return cy.wait("@dvla").then((interception) => {
            attempts++;
            if (interception.response.statusCode === 200 || interception.response.statusCode === 500) {
                const responseBody = interception.response.body;
                return responseBody;
            } else if (attempts >= maxAttempts) {
                throw new Error("Failed to intercept successful DVLA request.");
            } else {
                // Retry if the request did not meet the condition
                return checkRequest();
            }
        });
    }
    return checkRequest();
}

export function checkVehicleDetails(vehicleDetails: any, VehicleCheckSelectors) {
    cy.get(VehicleCheckSelectors.span_RegNum).invoke('text').then((text) => {
        // Remove spaces from the text
        const textWithoutSpaces = text.replace(/\s+/g, '');
        expect(textWithoutSpaces).to.equal(vehicleDetails.registrationNumber);
    })

    cy.get(VehicleCheckSelectors.value_Tax).contains(vehicleDetails.taxStatus)

    if (vehicleDetails.taxDueDate) {
        cy.get(VehicleCheckSelectors.label_TaxDue).should('exist').and('be.visible');
        cy.getByIdAndCheckText(VehicleCheckSelectors.value_TaxDue, vehicleDetails.taxDueDate)
    } else {
        cy.get(VehicleCheckSelectors.label_TaxDue).should('not.exist')
        cy.get(VehicleCheckSelectors.value_TaxDue).should('not.exist')
    }

    if (vehicleDetails.motStatus === "Not valid") {
        cy.get(VehicleCheckSelectors.value_Mot).contains(vehicleDetails.motStatus)
        cy.get(VehicleCheckSelectors.label_MotExpired).should('exist')
        cy.get(VehicleCheckSelectors.value_MotExpired).contains(vehicleDetails.motExpiryDate)
    } else {
        cy.get(VehicleCheckSelectors.value_Mot).contains("Valid")
        cy.get(VehicleCheckSelectors.label_MotExpires).should('exist')
        checkValueConditionally(VehicleCheckSelectors.value_MotExpires, vehicleDetails.motExpiryDate, "No details held by DVLA")
    }

    if (vehicleDetails.make) {
        cy.getByIdAndCheckText(VehicleCheckSelectors.value_Make, vehicleDetails.make)
    }

    if (vehicleDetails.monthOfFirstRegistration) {
        cy.getByIdAndCheckText(VehicleCheckSelectors.value_DateOfReg, vehicleDetails.monthOfFirstRegistration)
    }

    if (vehicleDetails.yearOfManufacture) {
        cy.getByIdAndCheckText(VehicleCheckSelectors.value_YearOfMan, vehicleDetails.yearOfManufacture)
    }

    checkValueConditionally(VehicleCheckSelectors.value_Cylinder, vehicleDetails.engineCapacity, 'Not Available', " cc")
    checkValueConditionally(VehicleCheckSelectors.value_Co2, vehicleDetails.co2Emissions, 'Not Available', " g/km")

    if (vehicleDetails.fuelType) {
        cy.getByIdAndCheckText(VehicleCheckSelectors.value_Fuel, vehicleDetails.fuelType)
    }

    checkValueConditionally(VehicleCheckSelectors.value_Euro, vehicleDetails.euroStatus, 'Not Available')
    checkValueConditionally(VehicleCheckSelectors.value_RDE, vehicleDetails.realDrivingEmissions, 'Not Available')

    if (vehicleDetails.markedForExport) {
        cy.getByIdAndCheckText(VehicleCheckSelectors.value_Export, 'Yes')
    } else {
        cy.getByIdAndCheckText(VehicleCheckSelectors.value_Export, 'No')
    }

    if (vehicleDetails.taxStatus) {
        cy.getByIdAndCheckText(VehicleCheckSelectors.value_VehStatus, vehicleDetails.taxStatus)
    }
    if (vehicleDetails.colour) {
        cy.getByIdAndCheckText(VehicleCheckSelectors.value_VehColor, vehicleDetails.colour)
    }

    checkValueConditionally(VehicleCheckSelectors.value_TypeApproval, vehicleDetails.typeApproval, 'Not Available')

    if (vehicleDetails.wheelplan) {
        cy.getByIdAndCheckText(VehicleCheckSelectors.value_Wheelplan, vehicleDetails.wheelplan)
    }

    checkValueConditionally(VehicleCheckSelectors.value_RevWeight, vehicleDetails.revenueWeight, 'Not Available', " kg")

    if (vehicleDetails.dateOfLastV5CIssued) {
        cy.getByIdAndCheckText(VehicleCheckSelectors.value_V5C, vehicleDetails.dateOfLastV5CIssued)
    }
    if (vehicleDetails.artEndDate) {
        cy.getByIdAndCheckText(VehicleCheckSelectors.value_AdditionalRates, vehicleDetails.artEndDate)
    }
}

function checkValueConditionally(selector: string, detail: any, textIfNotAvailable: string, valueExtension: string = '') {
    if (detail) {
        //If valueExtension provided, adds it to detail, otherwise empty ''
        cy.getByIdAndCheckText(selector, detail + valueExtension);
    } else {
        cy.getByIdAndCheckText(selector, textIfNotAvailable);
    }
}

