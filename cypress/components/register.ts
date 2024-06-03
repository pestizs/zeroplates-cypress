import { randomCredentials } from 'cypress/support/utils';
import { RegisterSelectors } from 'cypress/selectors/selectors';
import { deleteUser } from './API/registerAPI';
const toasts = require("../fixtures/toasts.json")
const baseUrl = Cypress.config("baseUrl");
const credentails1 = randomCredentials();
const credentails2 = randomCredentials();

export function register() {
    const credentials = credentails1

    cy.intercept("POST", "api/register").as("register");
    cy.visit("/register");
    cy.checkUrl(baseUrl + 'register')

    fillRegistrationForm(credentials);
    cy.isCheckBoxTicked(RegisterSelectors.checkbox_register);
    cy.get(RegisterSelectors.button_register)
        .click();

    waitForRegisterRequest().then((response) => {
        //Set data yielded from previous registration proccess
        cy.task('setGlobalData', {
            email: credentials.email, password: credentials.password, username: credentials.username,
            id: response.id, access: response.access
        });
    })

    cy.checkToast(toasts.RegisterSuccess);
    cy.checkLocalStorageToken();
    cy.checkUrl(baseUrl + 'home')
}

export function checkRegisterValidations() {
    cy.intercept("POST", "api/register").as("register");
    cy.intercept("GET", "api/faces", req => {
        //this solves the 304 issue
        delete req.headers['if-none-match']
    }).as("avatars");
    cy.visit("/register");
    cy.checkUrl(baseUrl + 'register')

    waitForAvatarsRequest().then((response) => {
        checkGenerateAvatar(response);
    })

    clickReg_CheckToast(toasts.MissingEmail)
    cy.getInput_Type_Check(RegisterSelectors.input_email, 'abc')
    clickReg_CheckToast(toasts.InvalidEmail)
    cy.getInput_Type_Check(RegisterSelectors.input_email, credentails1.email)
    clickReg_CheckToast(toasts.MissingUsername)
    cy.getInput_Type_Check(RegisterSelectors.input_username, 'abc')
    clickReg_CheckToast(toasts.MissingPassword)
    cy.getInput_Type_Check(RegisterSelectors.input_password, 'abc')
    clickReg_CheckToast(toasts.MissingRepeatPassword)
    cy.getInput_Type_Check(RegisterSelectors.input_repeatPassword, 'abc')
    clickReg_CheckToast(toasts.MissingCheckbox)
    cy.isCheckBoxTicked(RegisterSelectors.checkbox_register)
    clickReg_CheckToast(toasts.ShortUsername)
    cy.getInput_Type_Check(RegisterSelectors.input_username, credentails1.username)
    clickReg_CheckToast(toasts.ShortPassword)
    cy.getInput_Type_Check(RegisterSelectors.input_password, 'aaaaaa')
    clickReg_CheckToast(toasts.PasswordsDontMatch)
    cy.getInput_Type_Check(RegisterSelectors.input_repeatPassword, 'aaaaaa')
    clickReg_CheckToast(toasts.PasswordUpperCase)
    cy.getInput_Type_Check(RegisterSelectors.input_password, 'aaaaaaA')
    cy.getInput_Type_Check(RegisterSelectors.input_repeatPassword, 'aaaaaaA')
    clickReg_CheckToast(toasts.PasswordNumber)
    cy.getInput_Type_Check(RegisterSelectors.input_password, 'aaaaaaA1')
    cy.getInput_Type_Check(RegisterSelectors.input_repeatPassword, 'aaaaaaA1')
    clickReg_CheckToast(toasts.PasswordSymbol)
    cy.getInput_Type_Check(RegisterSelectors.input_password, credentails2.password)
    cy.getInput_Type_Check(RegisterSelectors.input_repeatPassword, credentails2.password)
    clickReg_CheckToast(toasts.EmailExists)
    cy.getInput_Type_Check(RegisterSelectors.input_email, credentails2.email)
    clickReg_CheckToast(toasts.UsernameExists)
    cy.getInput_Type_Check(RegisterSelectors.input_username, credentails2.username)
    clickReg_CheckToast(toasts.RegisterSuccess)


    waitForRegisterRequest().then((response) => {
        cy.log('**Delete User Y**')
        deleteUser(response.id, response.access)
    })

    cy.checkLocalStorageToken();
    cy.checkUrl(baseUrl + 'home')
}


export function waitForAvatarsRequest(): Cypress.Chainable {
    return cy.wait("@avatars").then((interception) => {
        const responseBody = interception.response.body[0].faces
        return responseBody;
    });
}

export function waitForRegisterRequest(): Cypress.Chainable {
    let attempts = 0;
    const maxAttempts = 30; // Maximum number of attempts to wait for the request

    function checkRequest() {
        return cy.wait("@register")
            .then((interception) => {
                attempts++;
                if (interception.response.statusCode === 200) {
                    const responseBody = JSON.parse(interception.response.body);
                    return responseBody;
                } else if (attempts >= maxAttempts) {
                    throw new Error("Failed to intercept successful Register request.");
                } else {
                    // Retry if the request did not meet the condition
                    return checkRequest();
                }
            });
    }

    return checkRequest();
}

function clickReg_CheckToast(toast): void {
    cy.get(RegisterSelectors.button_register).click()
    cy.checkToast(toast)
}

export function fillRegistrationForm(credentials: { email: string, username: string, password: string }): void {
    cy.getInput_Type_Check(RegisterSelectors.input_email, credentials.email)
    cy.getInput_Type_Check(RegisterSelectors.input_username, credentials.username)
    cy.getInput_Type_Check(RegisterSelectors.input_password, credentials.password)
    cy.getInput_Type_Check(RegisterSelectors.input_repeatPassword, credentials.password)
}

/**
* Clicks on the Generate Avatar button, then checks the generated avatar.
*/
function checkGenerateAvatar(avatarsData: any): void {
    cy.get(RegisterSelectors.button_generateAvatar)
        .click();
    cy.get(RegisterSelectors.img_avatar)
        .should(($img) => {
            // Get the src attribute of the img element
            const src = $img.attr('src');
            // Check if the src attribute is included in the avatarsData object
            expect(src).to.be.oneOf(Object.values(avatarsData));
        });
}
