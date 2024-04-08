import { v4 as uuidv4 } from 'uuid';
const randomId = uuidv4();
import { RegisterAPI, deleteUser } from "cypress/components/API/registerAPI";
import { login, logout } from 'cypress/components/login';
import { checkScrollandView, logSessionDetails, setLocalStrorage } from 'cypress/support/utils';
import { checkEmptyVehCheckPage, checkandSaveVehicles } from 'cypress/components/vehicleCheck';
const baseUrl = Cypress.config("baseUrl");
const defaultCredentials = Cypress.env("defaultCredentials")

let userResponseBody;
let userRequestBody;


describe("Testing the Vehicle Check Page.", () => {

    before(() => {
        cy.clearSavedSessions();
        cy.clearBrowserCache()
        cy.task('clearSavedRegNums');
        cy.task('clearGlobalData');
    });

    beforeEach('Should register and create session, if it fails should log in with default User and save session.', () => {
        cy.session(`Session id: ${randomId}`, () => {
            RegisterAPI({ failOnStatusCode: false })
                .then((response) => {

                    userRequestBody = JSON.parse(response.requestBody);
                    userResponseBody = response.body

                    if (response.status !== 200) {

                        login(defaultCredentials.email, defaultCredentials.password);
                        logSessionDetails(defaultCredentials);
                        userResponseBody = false

                    } else {
                        setLocalStrorage(userResponseBody)
                        // We save the user details in node, so we can login with these credentials in savedVehiclesTest
                        // We have to log in to the same user account to check the vehicles that we have saved during these tests
                        cy.task('setGlobalData', {
                            email: userRequestBody.email, password: userRequestBody.password, username: userRequestBody.username,
                            id: userResponseBody.id, access: userResponseBody.access
                        });
                    }
                })
        }, { cacheAcrossSpecs: false, })
        cy.visit(baseUrl + 'vehicles');
    })

    it("Should succesfully check vehicles page. ", () => {
        checkScrollandView('vehicles')
        checkEmptyVehCheckPage()
    });

    it("Should successfully save vehicles and check their details. Finally log out.", /* { retries: { runMode: 1, openMode: 1, } }, */() => {
        checkandSaveVehicles()
        logout()
    });
})