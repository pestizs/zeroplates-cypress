const apiUrl = Cypress.env("apiUrl")
const method = 'POST';
const url = apiUrl + 'api/token';
const header = { 'Content-Type': 'application/json' }

export function LoginAPI(email: string, password: string, options?: any): Cypress.Chainable {
    return cy.customRequest(method, url, header, { email: email, password: password }, options)
}