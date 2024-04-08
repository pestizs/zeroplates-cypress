import { v4 as uuidv4 } from 'uuid';
const randomId = uuidv4();
import { RegisterAPI, deleteUser } from "cypress/components/API/registerAPI";
import { login } from 'cypress/components/login';
import { logSessionDetails, setLocalStrorage } from 'cypress/support/utils';
import { profileTests } from 'cypress/components/profile';
const defaultCredentials = Cypress.env("defaultCredentials")

let userDetails;


describe("Testing the Profile Page.", () => {

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
                        userDetails = defaultCredentials
                    } else {
                        setLocalStrorage(userDetails)
                    }
                })
        }, { cacheAcrossSpecs: false, })
    })

    it("Should succcessfully check the profile page. Finally log out.", () => {
        profileTests(userDetails)
    });

    after("Should Delete the User, if one was created with session.", () => {
        if (userDetails.username !== 'mainuser') {
            cy.log('**Delete User**')
            deleteUser(userDetails.id, userDetails.access)
        }
        else return
    });
})


