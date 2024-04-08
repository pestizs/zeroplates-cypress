import { HomePageSelectors, NavItemSelectors, RepresentativesSelectors, SavedVehiclesSelectors, VehicleCheckSelectors } from "cypress/selectors/selectors";
import { errorMsg, elementTexts } from "../support/helperTexts/helperTexts";
const baseUrl = Cypress.config("baseUrl");

export function checkIfServicesNavigate_andPagesAreEmpty() {
    cy.get(HomePageSelectors.pic_vehicleCheck).should('exist').click();
    cy.wait(300)
    cy.checkUrl(baseUrl + 'vehicles');
    cy.get(VehicleCheckSelectors.label_RegNum).should('exist');
    cy.visit(baseUrl + 'home');
    cy.wait(300)

    cy.get(HomePageSelectors.pic_savedVehicles).should('exist').click();
    cy.wait(300)
    cy.checkUrl(baseUrl + 'savedvehicles');
    cy.getByDataCy(SavedVehiclesSelectors.noVehAdded).should('exist')
    cy.getByDataCy(SavedVehiclesSelectors.button_goToVehCheck).should('exist').and('have.text', elementTexts.button_goToVehicleCheck).click()
    cy.checkUrl(baseUrl + 'vehicles');
    cy.wait(300)
    cy.visit(baseUrl + 'home');
    cy.wait(300)

    cy.get(HomePageSelectors.pic_representatives).should('exist').click();
    cy.wait(300)
    cy.checkUrl(baseUrl + 'representatives');
    cy.getByDataCy(RepresentativesSelectors.emptyReps).should('exist')
    cy.visit(baseUrl + 'home');
    cy.wait(300)

    cy.get(NavItemSelectors.avatar_navitem).should('exist').click()
    cy.get(NavItemSelectors.avatar_menuitem_profile).should('exist').and('be.visible').click()
    cy.checkUrl(baseUrl + 'profile')
    cy.wait(300)

    cy.get(NavItemSelectors.avatar_navitem).should('exist').click()
    cy.get(NavItemSelectors.avatar_menuitem_settings).should('exist').and('be.visible').click()
    cy.checkUrl(baseUrl + 'settings')
    cy.wait(300)

    cy.visit(baseUrl + 'home');
    cy.wait(300)
}

export function checkTeam() {
    //Selects the first element, and Scopes all subsequent cy commands to within this element
    cy.get(HomePageSelectors.teamMembers).should('have.length', 3).first().should('exist').within(() => {
        cy.get('img').should('exist').and('have.attr', 'src').and('not.be.empty');
        cy.contains('Nicolas Pesti').should('exist');
    });
}

export function checkSocials() {
    //Checks if there are 3 of the selected element, then Selects the first element
    cy.get(HomePageSelectors.socials_twitter).should('have.length', 3).first().should('exist').click();
    cy.checkUrl(baseUrl + 'home#twitter');
    //Checks if there are 3 of the selected element, then Selects the second element
    cy.get(HomePageSelectors.socials_facebook).should('have.length', 3).eq(1).should('exist').click();
    cy.checkUrl(baseUrl + 'home#facebook');
    //Checks if there are 3 of the selected element, then Selects the second element
    cy.get(HomePageSelectors.socials_linkedin).should('have.length', 3).eq(2).should('exist').click();
    cy.checkUrl(baseUrl + 'home#linkedin');
}

export function checkContactUs() {
    cy.get(HomePageSelectors.section_contact).should('exist').within(() => {
        cy.contains('Contact Us').should('exist');
        cy.get(HomePageSelectors.button_sendMessage).should('exist').click()
        cy.checkTextContains('p.help-block.text-danger', Object.values(errorMsg));
        cy.get(HomePageSelectors.input_name).type('My Name')
        cy.get(HomePageSelectors.button_sendMessage).click()
        cy.checkTextContains('p.help-block.text-danger', [errorMsg.email, errorMsg.phone, errorMsg.message]);
        cy.get(HomePageSelectors.input_email).type('mainUser@cypress.com')
        cy.get(HomePageSelectors.button_sendMessage).click()
        cy.checkTextContains('p.help-block.text-danger', [errorMsg.phone, errorMsg.message]);
        cy.get(HomePageSelectors.input_phone).type('06729858511')
        cy.get(HomePageSelectors.button_sendMessage).click()
        cy.checkTextContains('p.help-block.text-danger', [errorMsg.message]);
        cy.get(HomePageSelectors.textarea_message).type('This is my message. Hello World !!!')
        cy.get(HomePageSelectors.button_sendMessage).click()
        cy.get(HomePageSelectors.input_name).should('exist').and('be.empty')
    });

}

export function checkFooter() {
    cy.get(HomePageSelectors.footer_copyright).should('exist').and('have.text', 'Copyright © ZeroPlates');
    cy.get(HomePageSelectors.footer_contact).should('exist').click();
    cy.checkUrl(baseUrl + 'home#contactus');
    cy.get(HomePageSelectors.footer_terms).should('exist').click();
    cy.checkUrl(baseUrl + 'home#termsofuse');
    cy.get(HomePageSelectors.footer_privacy).should('exist').click();
    cy.checkUrl(baseUrl + 'home#privacypolicy');
}