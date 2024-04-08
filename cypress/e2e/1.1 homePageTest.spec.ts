import { v4 as uuidv4 } from 'uuid';
const randomId = uuidv4();
const toasts = require("../fixtures/toasts.json")
import { RegisterAPI, deleteUser } from "cypress/components/API/registerAPI";
import { login, logout } from 'cypress/components/login';
import { logSessionDetails, setLocalStrorage } from 'cypress/support/utils';
import { checkFooter, checkIfServicesNavigate_andPagesAreEmpty, checkSocials, checkTeam, checkContactUs } from 'cypress/components/homepage';
const baseUrl = Cypress.config("baseUrl");
const defaultCredentials = Cypress.env("defaultCredentials")

let userDetails;


describe("Testing the Home Page.", () => {

    before(() => {
        cy.clearSavedSessions();
        cy.clearBrowserCache();
    });

    beforeEach('Should register and create session, if it fails should log in with default User and save session.', () => {
        //Creates a session with a random id, that we can you for all the tests in this spec.
        //Save/Restore browser Cookies, LocalStorage, and SessionStorage data
        //** Unfortunately we can not encapsulate the logic of either session or RegisterApi more than this,
        //Because cypress commands do not support catch
        cy.session(`Session id: ${randomId}`, () => {
            //We add failOnStatusCode: false, so we can catch on fail.
            RegisterAPI({ failOnStatusCode: false })
                .then((response) => {
                    userDetails = response.body
                    if (response.status !== 200) {
                        // If registration fails, we log in with the default credentials set in cypress.config
                        login(defaultCredentials.email, defaultCredentials.password);
                        logSessionDetails(defaultCredentials);
                        //We set this so we know registration has failed
                        userDetails = false
                    } else {
                        //Set localstorage with token & user details, need to do this because we are using api to register
                        setLocalStrorage(userDetails)
                    }
                })
        }, { cacheAcrossSpecs: false, })
        cy.visit(baseUrl + 'home');
    })

    it("Should successfully check 'Services' section.", () => {
        //Also checks if saved vehicles and representatives are empty.
        checkIfServicesNavigate_andPagesAreEmpty()
    });

    it("Should successfully check 'Our Team' section.", () => {
        checkTeam()
        checkSocials()
    });
    it("Should successfully check 'Contact Us' section.", () => {
        checkContactUs()
        cy.checkToast(toasts.MessageSent)
    });
    it("Should successfully check the footer and finally log out.", () => {
        checkFooter()
        logout()
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


