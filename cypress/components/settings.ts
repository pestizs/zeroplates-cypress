import { logout } from "./login";
import { NavItemSelectors, SettingsSelectors } from "cypress/selectors/selectors";
const baseUrl = Cypress.config("baseUrl");
const toasts = require("../fixtures/toasts.json");


export function settingsTests() {
    cy.visit(baseUrl + 'settings');
    cy.checkUrl(baseUrl + 'settings')

    cy.get('h2').should('have.text', 'Settings')
    cy.get(SettingsSelectors.group_notifications).find('button').should('have.attr', 'aria-checked', 'false').click().then(() => {
        cy.checkToast(toasts.SettingsUpdated)
        cy.get(SettingsSelectors.group_notifications)
            .find('button')
            .should('have.attr', 'aria-checked', 'true');
    })
    cy.get(SettingsSelectors.group_darkMode).find('button').should('have.attr', 'aria-checked', 'false').click().then(() => {
        cy.checkToast(toasts.SettingsUpdated)
        cy.get(SettingsSelectors.group_darkMode)
            .find('button')
            .should('have.attr', 'aria-checked', 'true');
    })

    cy.get('div.bg-black').should('exist')

    cy.get(SettingsSelectors.button_navigateToProfile).click()
    cy.checkUrl(baseUrl + 'profile')
    cy.get('div.bg-black').should('exist')

    cy.get(NavItemSelectors.vehicleCheck_navitem).click()
    cy.checkUrl(baseUrl + 'vehicles')
    cy.get('div.bg-black').should('exist')
}