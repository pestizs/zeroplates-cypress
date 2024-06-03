import { LoginSelectors, RegisterSelectors, GlobalSelectors, NavItemSelectors } from 'cypress/selectors/selectors';
import { checkNavBar } from 'cypress/support/utils';

const toasts = require("../fixtures/toasts.json")
const baseUrl: string = Cypress.config("baseUrl")

/**
 * Login function
 *
 * @param {String} email   
 * @param {String} password  
 * @param {optional} resolution  //optional "DESKTOP / MOBILE"
 */
export function login(email: string, password: string, resolution?: any): void {
    cy.intercept("POST", "api/token").as("login");
    cy.visit("/login");
    cy.getInput_Type_Check(LoginSelectors.input_email, email)
    cy.getInput_Type_Check(LoginSelectors.input_password, password)
    cy.isCheckBoxTicked(LoginSelectors.checkbox_login)
    cy.get(LoginSelectors.button_login)
        .click()
    cy.wait("@login").then((res) => {
        expect(res.response.statusCode).to.equal(200);
    });

    cy.checkToast(toasts.LoginSuccess)
    cy.checkLocalStorageToken();
    cy.checkUrl(baseUrl + 'home')
    checkNavBar(resolution)
}
export function loginValidations(email: string, password: string, resolution?: any) {
    cy.intercept("POST", "api/token").as("login");
    cy.visit("/login");
    cy.get(LoginSelectors.button_registerPage).should('exist').click()
    cy.checkUrl(baseUrl + 'register')
    cy.get(RegisterSelectors.button_backToLogin).should('exist').click()
    cy.checkUrl(baseUrl + 'login')
    clickLogin_CheckToast(toasts.MissingEmail)
    cy.getInput_Type_Check(LoginSelectors.input_email, "fakeEmail")
    //clickLogin_CheckToast(toasts.MissingPassword) //For some reason it cant find this toast message.. I have tried to put it stratight into the spec file, and also use without commands or functions..
    cy.getInput_Type_Check(LoginSelectors.input_password, 'abc')
    clickLogin_CheckToast(toasts.ShortPassword)
    cy.getInput_Type_Check(LoginSelectors.input_password, 'aaaaaa')
    clickLogin_CheckToast(toasts.PasswordUpperCase)
    cy.getInput_Type_Check(LoginSelectors.input_password, 'aaaaaaA')
    clickLogin_CheckToast(toasts.PasswordNumber)
    cy.getInput_Type_Check(LoginSelectors.input_password, 'aaaaaaA1')
    clickLogin_CheckToast(toasts.PasswordSymbol)
    cy.getInput_Type_Check(LoginSelectors.input_password, 'aaaaaaA1@')
    clickLogin_CheckToast(toasts.InvalidCredentials)
    cy.getInput_Type_Check(LoginSelectors.input_email, email)
    cy.getInput_Type_Check(LoginSelectors.input_password, password)
    cy.isCheckBoxTicked(LoginSelectors.checkbox_login)
    cy.get(LoginSelectors.button_login)
        .click()

    waitForLoginRequest().then((res) => {
        expect(res.statusCode).to.equal(200);
    });

    cy.checkToast(toasts.LoginSuccess)
    cy.checkLocalStorageToken();
    cy.checkUrl(baseUrl + 'home')
    checkNavBar(resolution)
}

/**
 * Logout function
 *
 * @param {optional} resolution  //optional "DESKTOP / MOBILE"
 */
export function logout(resolution?: any): void {
    if (resolution === 'MOBILE') {
        cy.get(NavItemSelectors.menu_mobile).click();
        cy.get(NavItemSelectors.logout_panelitem).should('exist').click()
    }
    else {
        cy.get(NavItemSelectors.button_logout).click()
    }
    cy.get(GlobalSelectors.button_confirm).should('exist').click()
    cy.checkToast(toasts.LogoutSuccess)
    cy.checkUrl(baseUrl + 'login')
}

export function clickLogin_CheckToast(toast): void {
    cy.get(LoginSelectors.button_login).click()
    cy.checkToast(toast)
}

function waitForLoginRequest(): Cypress.Chainable {
    let attempts = 0;
    const maxAttempts = 20; // Maximum number of attempts to wait for the request

    function checkRequest() {
        return cy.wait("@login").then((interception) => {
            attempts++;
            if (interception.response.statusCode === 200) {
                const responseBody = interception.response;
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