import { randomCredentials } from "cypress/support/utils";

const apiUrl = Cypress.env("apiUrl")
const credentials = randomCredentials()
const method = 'POST';
const url = apiUrl + 'api/register';
const header = { 'Content-Type': 'application/json' }
const body = {
    email: credentials.email,
    username: credentials.username,
    password: credentials.password,
    avatar: "https://images.pexels.com/photos/9622531/pexels-photo-9622531.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
}

/**
 * Register a User through Api and return the response
 * @param options We can add other options to the request // OPTIONAL
 */
export function RegisterAPI(options?: any): Cypress.Chainable {
    return cy.customRequest(method, url, header, body, options)
}
/**
 * Delete a User through Api
 */
export function deleteUser(id: string, access: string): void {
    const headerExtended = {
        ...header,
        'Authorization': access
    }
    cy.request({
        method: 'DELETE',
        url: apiUrl + 'api/user/' + id,
        headers: headerExtended,
    }).then((response) => {
        expect(response.status).to.equal(200);
    });

}