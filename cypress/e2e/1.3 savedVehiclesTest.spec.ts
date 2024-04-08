import { v4 as uuidv4 } from 'uuid';
const randomId = uuidv4();
import { deleteUser } from "cypress/components/API/registerAPI";
import { login, logout } from 'cypress/components/login';
import { determineGlobalData, logSessionDetails, setLocalStrorage } from 'cypress/support/utils';
import { LoginAPI } from 'cypress/components/API/loginAPI';
import { checkSavedVehicles } from 'cypress/components/savedVehicles';
const baseUrl = Cypress.config("baseUrl");
const defaultCredentials = Cypress.env("defaultCredentials")

let LoginUserResponse;
let savedRegNums;
let globalData;

describe("Testing the Saved Vehicles Page.", () => {

    before(() => {
        cy.clearSavedSessions();
        cy.clearBrowserCache();
        cy.task('getSavedRegNums').then((response: string[]) => {
            savedRegNums = response;
        });
        cy.task('getGlobalData').then((response: any) => {
            //If the response is undefined, null, or an empty object, globalData is assigned defaultCredentials
            globalData = determineGlobalData(response, defaultCredentials);
        });
    });

    beforeEach('Should log in and create session', () => {
        cy.session(`Session id: ${randomId}`, () => {
            //Log in and create session with the credentials that we have registered in vehicleCheckTest spec
            LoginAPI(globalData.email, globalData.password, { failOnStatusCode: false })
                .then((response) => {
                    LoginUserResponse = response.body
                    if (response.status !== 200) {
                        //If not successfull, we log in with default credentials
                        login(defaultCredentials.email, defaultCredentials.password);
                        logSessionDetails(defaultCredentials);
                    } else {
                        setLocalStrorage(LoginUserResponse)
                    }
                })
        }, { cacheAcrossSpecs: false, })
        //Intercept here before visit, as visit triggers the request
        cy.intercept("GET", "api/users/me").as("me")
        cy.visit(baseUrl + 'savedvehicles');
    })

    it("Should successfully check filtering, pagination, details of vehicles, and delete saved vehicle. Finally log out.", () => {
        //Check wheather we are logged in with default user.(in other words: was LoginAPI successfull?)
        if (LoginUserResponse.username !== defaultCredentials.username) {
            checkSavedVehicles(savedRegNums)
            logout()
        } else {
            //TODO: if we log in with 'mainuser'
            checkSavedVehicles(savedRegNums)
        }
    })

    after("Should Delete the User, if one was created with session.", () => {
        cy.task('clearSavedRegNums');
        cy.task('clearGlobalData');
        if (LoginUserResponse.username !== defaultCredentials.username) {
            cy.log('**Delete User**')
            deleteUser(LoginUserResponse.id, LoginUserResponse.access)
        }
    });
})

