import { logout } from 'cypress/components/login';
import { register, checkRegisterValidations } from '../components/register';
import { RegisterAPI, deleteUser } from "cypress/components/API/registerAPI";
const validationsOnRegistration = Cypress.env("extraValidationsOnRegistration")


describe("Testing Registration workflow.", () => {
    before(() => {
        //Need to clear cache, otherwise i get 304 for the intercept, wait
        cy.clearBrowserCache()
        cy.clearSavedSessions();
    });

    it("Should register a randomized user 'user X', then log out.", () => {
        //Register 'User X'
        register().then((response: any) => {
            //Set data yielded from previous registration proccess
            cy.task('setGlobalData', {
                email: response.credentials.email, password: response.credentials.password, username: response.credentials.username,
                id: response.registerData.id, access: response.registerData.access
            });
            logout();
        });
    });

    if (validationsOnRegistration) {
        it("Should register a randomized user 'user Y', while checking all the validations. Log out and delete 'user Y'.", () => {
            //Register 'User Y', check validations
            checkRegisterValidations().then((response: any) => {
                logout();
                //Delete 'User Y'
                cy.log('**Delete User Y**')
                deleteUser(response.registerData.id, response.registerData.access)
            });
        });
    }

    it("Should register & delete a randomized user through API", () => {
        RegisterAPI().then((response: any) => {
            cy.log('**Delete User**')
            deleteUser(response.body.id, response.body.access)
        });
    })
});