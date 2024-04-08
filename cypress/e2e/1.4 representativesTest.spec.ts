import { v4 as uuidv4 } from 'uuid';
const randomId = uuidv4();
const toasts = require("../fixtures/toasts.json")
import { RegisterAPI, deleteUser } from "cypress/components/API/registerAPI";
import { login, logout } from 'cypress/components/login';
import { logSessionDetails, setLocalStrorage } from 'cypress/support/utils';
import { representativeTest } from 'cypress/components/representatives';
const defaultCredentials = Cypress.env("defaultCredentials")

let userDetails;


describe("Testing the Representatives Page.", () => {

    before(() => {
        cy.clearSavedSessions();
        cy.clearBrowserCache();
    });

    beforeEach('Should register and create session, if it fails should log in with default User and save session.', () => {
        cy.session(`Session id: ${randomId}`, () => {
            RegisterAPI({ failOnStatusCode: false })
                .then((response) => {
                    userDetails = response.body
                    if (response.status !== 200) {
                        login(defaultCredentials.email, defaultCredentials.password);
                        logSessionDetails(defaultCredentials);
                        userDetails = false
                    } else {
                        setLocalStrorage(userDetails)
                    }
                })
        }, { cacheAcrossSpecs: false, })
    })

    it("Should add, delete and update representatives, with validations. Finally log out.", () => {
        representativeTest()
    });

    after("Should Delete the User, if one was created with session.", () => {
        //We conditionally skip deleting the user, if registration has failed
        if (userDetails) {
            cy.log('**Delete User**')
            deleteUser(userDetails.id, userDetails.access)
        }
        else return
    });
})


