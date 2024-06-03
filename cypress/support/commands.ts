// @ts-check
///<reference path="../global.d.ts" />
import { GlobalSelectors } from './../selectors/selectors';

Cypress.Commands.add('getByIdAndCheckText', (selector, text) => {
  cy.get(selector).should('exist').and('have.text', text)
});

Cypress.Commands.add('checkTextContains', (selector, text) => {
  cy.get(selector).should(($element) => {
    text.forEach(text => {
      expect($element.text()).to.contain(text);
    });
  });
});

Cypress.Commands.add('checkTooltip', (elementSelector, tooltipSelector, tooltipText, timeout) => {
  cy.get(elementSelector)
    .should('exist')
    .realHover({ pointer: "mouse" })
    .wait(200)
    .get(tooltipSelector, { timeout: timeout })
    .should('have.text', tooltipText)
});

Cypress.Commands.add("clearBrowserCache", () => {
  Cypress.automation('remote:debugger:protocol', {
    command: 'Network.clearBrowserCache'
  })
});

Cypress.Commands.add("clearSavedSessions", () => {
  Cypress.session.clearAllSavedSessions();
});

Cypress.Commands.add("checkToast", (text) => {
  cy.get(GlobalSelectors.toast).should("have.text", text).and("be.visible").click()
});

Cypress.Commands.add("checkLocalStorageToken", () => {
  cy.window().its('localStorage').then((localStorage) => {
    expect(localStorage).to.have.property('access');
  });
});

Cypress.Commands.add("isCheckBoxTicked", (checkboxSelector) => {
  cy.get(checkboxSelector)
    .click();
  cy.get('svg[data-testid="CheckBoxIcon"]')
    .should('exist')
})

Cypress.Commands.add("getInput_Type_Check", (selector, value) => {
  cy.get(selector)
    .clear()
    .type(value)
    .should("have.value", value)
})
Cypress.Commands.add("getInputByDataCy_Type_Check", (selector, value) => {
  cy.getByDataCy(selector)
    .clear()
    .type(value)
    .should("have.value", value)
})

Cypress.Commands.add("getByDataCy", (data) => {
  return cy.get(`[data-cy=${data}]`);
});

Cypress.Commands.add("checkUrl", (url) => {
  cy.url().should('eq', url);
});

Cypress.Commands.add("customRequest", (method, url, headers, body, options = {}) => {
  cy.request({
    method: method,
    url: url,
    headers: headers,
    body: body,
    ...options // Spread any additional options provided
  })
});
