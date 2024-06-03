import { waitForAvatarsRequest } from "./register";
import { logout } from "./login";
import { ProfileSelectors } from "cypress/selectors/selectors";
const toasts = require("../fixtures/toasts.json");
const baseUrl = Cypress.config("baseUrl");

let avatar: string;

export function profileTests(userDetails) {
    cy.intercept("GET", "api/faces", req => {
        //this solves the 304 issue
        delete req.headers['if-none-match']
    }).as("avatars");
    cy.visit(baseUrl + 'profile');
    cy.checkUrl(baseUrl + 'profile')

    cy.get(ProfileSelectors.avatar_profilePage_container).find('img').should(($img) => {
        avatar = $img.attr('src');
    });
    cy.get('img[alt="avatar img"]').eq(0).should(($img) => {
        expect($img.attr('src')).to.equal(avatar)
    })

    cy.get(ProfileSelectors.label_firstName).should('exist')
    cy.get(ProfileSelectors.label_lastName).should('exist')
    cy.get(ProfileSelectors.label_email).should('exist')
    cy.get(ProfileSelectors.label_username).should('exist')
    cy.get(ProfileSelectors.label_phoneNum).should('exist')
    cy.get(ProfileSelectors.label_company).should('exist')
    cy.get(ProfileSelectors.label_aboutme).should('exist')
    cy.get(ProfileSelectors.input_email)
        .should('have.attr', 'placeholder', userDetails.email)
        .should('be.disabled')

    get_type_Save_CheckToast(ProfileSelectors.input_firstName, 'a', toasts.FirstNameShort)
    get_type_Save_CheckToast(ProfileSelectors.input_firstName, '', toasts.FirstNameEmpty)
    cy.get(ProfileSelectors.input_firstName).type('MyFirstName')
    cy.get(ProfileSelectors.input_lastName).type('MyLastName')
    get_type_Save_CheckToast(ProfileSelectors.input_username, '', toasts.UsernameEmpty)
    get_type_Save_CheckToast(ProfileSelectors.input_username, 'user', toasts.UsernameShort)
    cy.get(ProfileSelectors.input_username).type('123')
    get_type_Save_CheckToast(ProfileSelectors.input_phoneNum, 'aaa', toasts.PhoneNumNumber)
    get_type_Save_CheckToast(ProfileSelectors.input_phoneNum, '07426845966', toasts.DetailsUpdated)

    cy.getInput_Type_Check(ProfileSelectors.input_company, 'MyCompany')
    cy.getInput_Type_Check(ProfileSelectors.input_aboutme, 'This is my About me.')
    cy.get(ProfileSelectors.button_changeAvatar).click()

    waitForAvatarsRequest().then((avatarsData) => {
        cy.get(ProfileSelectors.avatar_profilePage_container).find('img').should(($img) => {
            avatar = $img.attr('src');
            expect(avatar).to.be.oneOf(Object.values(avatarsData));
        });
    })

    cy.get(ProfileSelectors.button_save).click()
    cy.checkToast(toasts.DetailsUpdated)

    cy.get('img[alt="avatar img"]').eq(0).should(($img) => {
        expect($img.attr('src')).to.equal(avatar)
    })

    cy.get(ProfileSelectors.button_navigateToSettings).click()
    cy.checkUrl(baseUrl + 'settings')

    logout()
}

function get_type_Save_CheckToast(inputSel, text, toast) {
    if (text === '') {
        //if we pass empty string we clear the input
        cy.get(inputSel).clear()
        cy.get(ProfileSelectors.button_save).click()
        cy.checkToast(toast)
    } else {
        cy.getInput_Type_Check(inputSel, text)
        cy.get(ProfileSelectors.button_save).click()
        cy.checkToast(toast)
    }
}