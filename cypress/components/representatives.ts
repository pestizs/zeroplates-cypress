import { uniqueRandomNameAndRoleGenerator, getRandomNumber, checkScrollandView } from "cypress/support/utils"
import { waitForAvatarsRequest } from "./register";
import { logout } from "./login";
const toasts = require("../fixtures/toasts.json");
const baseUrl = Cypress.config("baseUrl");

// Number of Representatives that we want to add
let numberofReps: number = Cypress.env("numberOfRepresentatives")
// If its not set in cypress.config.ts, we generate a random number
if (!numberofReps) {
    numberofReps = getRandomNumber()
}

// List of representatives, we update the array as we are adding new representatives or deleting them
let listOfReps: string[] = [];
let listOfRoles: string[] = [];

//*******Not using saved selectors, id's, data-cy attributes in this spec intentionally********

export async function representativeTest() {
    cy.intercept("GET", "api/faces", req => {
        //this solves the 304 issue
        delete req.headers['if-none-match']
    }).as("avatars");
    cy.visit(baseUrl + 'representatives');
    const avatarsData = await waitForAvatarsRequest();

    basicChecks()
    //Adding the representatives, Runs 'randomNumber' times
    addReps(avatarsData, numberofReps)
    checkScroll()
    deleteRep()
    updateRep()
    logout()
}

function basicChecks() {
    cy.get('p').contains('Please add your first representative').should('exist')
    cy.get('button').contains('Add Representative').should('exist').click()
    cy.get('button[aria-label="Close"]').should('exist').click()
    //Check if modal closed
    cy.get('button[aria-label="Close"]').should('not.exist')
    cy.get('button').contains('Add Representative').should('exist').click()
    cy.get('button').contains('Close').should('exist').click()
    //Check if modal closed
    cy.get('button').contains('Close').should('not.exist')
}

function addReps(avatarsData, numberofReps) {
    for (let i = 0; i < numberofReps; i++) {
        const RandomNameandRole = uniqueRandomNameAndRoleGenerator()
        const fullName = `${RandomNameandRole.firstname} ${RandomNameandRole.lastname}`

        cy.get('button').contains('Add Representative').should('exist').click()
        cy.get('input[placeholder="Michael Johnson"]').should('exist').type(fullName)
        cy.get('input[placeholder="Sales assistant"]').should('exist').type(RandomNameandRole.jobtitle)
        cy.get('button[form="editmodal"]').contains('Add').should('exist').click()
        cy.checkToast(toasts.RepAddedSuccess)

        //Extra check for the first and second representatives only
        if (i <= 1) {
            cy.get('.pt-2 > .bg-white').eq(i).children('img')
                .should(($img) => {
                    // Get the src attribute of the img element
                    const src = $img.attr('src');
                    // Check if the src attribute is included in the avatarsData object
                    expect(src).to.be.oneOf(Object.values(avatarsData));
                });
            cy.get('.pt-2 > .bg-white').eq(i).find('p').eq(0).invoke('text').then((text) => {
                expect(text).to.equal(`${RandomNameandRole.firstname} ${RandomNameandRole.lastname}`)
            })
            cy.get('.pt-2 > .bg-white').eq(i).find('p').eq(1).invoke('text').then((text) => {
                expect(text).to.equal(RandomNameandRole.jobtitle)
            })
        }

        //update the list of reps with the rep's name
        listOfReps.push(fullName)
        //update the list of reps with the rep's job title
        listOfRoles.push(RandomNameandRole.jobtitle)
    }
}

function checkScroll() {
    cy.get('p').contains('Copyright © ZeroPlates').scrollIntoView()
    cy.wait(500)
    cy.window().its('scrollY').should('not.equal', 0);
    cy.get('button').contains('Scroll to Top').should('exist').click();
    cy.wait(500)
    cy.window().its('scrollY').should('equal', 0);
}

function deleteRep() {
    //Check the first rep
    cy.get('.pt-2 > .bg-white').eq(0).find('p').eq(0).invoke('text').then((text) => {
        expect(text).to.equal(listOfReps[0])
    })
    //Delete the first rep
    cy.get('.pt-2 > .bg-white').eq(0).find('button').contains('Delete').should('exist').click()
    cy.get('h3').contains(`Delete Representative '${listOfReps[0]}'`).should('exist')
    cy.get('div[data-headlessui-state="open"]').find('button').contains('Delete').should('exist').click()
    cy.checkToast(toasts.RepDeletedSuccess)
    cy.wait(1000)
    // Check if the item is deleted by validating that the first rep's name is not the one we have deleted
    cy.get('.pt-2 > .bg-white').eq(0).find('p').eq(0).invoke('text').then((text) => {
        expect(text).to.not.equal(listOfReps[0])
    }).then(() => {
        // Remove the first element from the array
        listOfReps.shift();
        listOfRoles.shift();
    })
}

function updateRep() {
    cy.get('.pt-2 > .bg-white').eq(0).find('p').eq(0).invoke('text').then((text) => {
        expect(text).to.equal(listOfReps[0])
    })
    cy.get('.pt-2 > .bg-white').eq(0).find('button').contains('Update').should('exist').click().then(() => {
    })
    cy.get('input').eq(0).clear().type(`Updated name`)
    cy.get('input').eq(1).clear().type(`Updated role`)
    cy.get('button[form="editmodal"]').contains('Update').should('exist').click()
    cy.checkToast(toasts.RepUpdatedSuccess)
    cy.wait(1000)
    cy.get('.pt-2 > .bg-white').eq(0).find('p').eq(0).invoke('text').then((text) => {
        expect(text).to.equal(`Updated name`)
    }).then(() => {
        // Update the first element of the Reps array
        listOfReps[0] = `Updated name`
    })
    cy.get('.pt-2 > .bg-white').eq(0).find('p').eq(1).invoke('text').then((text) => {
        expect(text).to.equal(`Updated role`)
    }).then(() => {
        // Update the first element of the Roles array
        listOfRoles[0] = `Updated role`
    })
}

