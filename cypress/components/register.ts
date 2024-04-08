import { randomCredentials } from 'cypress/support/utils';
import { RegisterSelectors } from 'cypress/selectors/selectors';
const toasts = require("../fixtures/toasts.json");
const baseUrl = Cypress.config("baseUrl");
const credentails1 = randomCredentials();
const credentails2 = randomCredentials();

export async function register(): Promise<{ registerData: object, credentials: object }> {
    try {
        const credentials = credentails1

        cy.intercept("POST", "api/register").as("register");
        cy.visit("/register");
        cy.checkUrl(baseUrl + 'register')

        fillRegistrationForm(credentials);
        cy.isCheckBoxTicked(RegisterSelectors.checkbox_register);
        cy.get(RegisterSelectors.button_register)
            .click();

        const registerData = await waitForRegisterRequest();

        cy.checkToast(toasts.RegisterSuccess);
        cy.checkLocalStorageToken();
        cy.checkUrl(baseUrl + 'home')

        return { registerData, credentials };

    } catch (error) {
        throw error;
    }
}

export async function checkRegisterValidations(): Promise<{ registerData: object }> {

    try {
        cy.intercept("POST", "api/register").as("register");
        cy.intercept("GET", "api/faces", req => {
            //this solves the 304 issue
            delete req.headers['if-none-match']
        }).as("avatars");
        cy.visit("/register");
        cy.checkUrl(baseUrl + 'register')

        const avatarsData = await waitForAvatarsRequest();
        checkGenerateAvatar(avatarsData);

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


        const registerData = await waitForRegisterRequest();
        cy.checkLocalStorageToken();
        cy.checkUrl(baseUrl + 'home')


        return { registerData }
    }
    catch (error) {
        throw error;
    }
}


export async function waitForAvatarsRequest(): Promise<any> {
    return new Promise((resolve: any, reject) => {
        cy.wait("@avatars").then((avatarsResponse) => {
            if (avatarsResponse.response.statusCode === 200 || avatarsResponse.response.statusCode === 304) {
                resolve(avatarsResponse.response.body[0].faces);
            } else {
                reject(new Error("Failed to intercept avatars request."));
            }
        });
    });
}

async function waitForRegisterRequest(): Promise<any> {
    return new Promise((resolve: any, reject) => {
        let attempts = 0;
        const maxAttempts = 30; // Maximum number of attempts to wait for the request

        function checkRequest() {
            cy.wait("@register").then((registerResponse: any) => {
                attempts++;
                if (registerResponse.response?.statusCode === 200) {
                    const responseBody = JSON.parse(registerResponse.response.body);
                    resolve(responseBody);
                } else if (attempts >= maxAttempts) {
                    reject(new Error("Failed to intercept successful register request."));
                } else {
                    // Retry if the request did not meet the condition
                    checkRequest();
                }
            });
        }

        // Start checking for the request
        checkRequest();
    });
}

function clickReg_CheckToast(toast): void {
    cy.get(RegisterSelectors.button_register).click()
    cy.checkToast(toast)
}

function fillRegistrationForm(credentials: { email: string, username: string, password: string }): void {
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
