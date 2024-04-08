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
  //.should('be.visible') //FLAKY, Sometimes it is not recognising visibility: visible
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

/* Cypress.Commands.add("clickAndSelect", { prevSubject: "element" }, (subject, option) => {
  // Clear existing value if present
  cy.get(subject).then(($subject) => {
    if ($subject.find(".clear-button").length > 0) {
      cy.wrap($subject).find(".clear-button").click();
    }
  });

  // Open dropdown and select option
  cy.get(subject)
    .find(".mat-select-arrow-wrapper")
    .click()
  cy.contains(".mat-option-text", new RegExp("^ " + Cypress._.escapeRegExp(option) + " $"), { timeout: Cypress.config("timeout") }).click();

  // Verify selected option
  cy.get(subject).find(".mat-select-value").should("have.text", option);

  // Return the subject for further chaining
  return cy.wrap(subject);
}); */

//REFACTORED
/* Cypress.Commands.add("clickAndSelect", { prevSubject: "element" }, (subject, option) => {
  // Clear existing value if present
  cy.get(subject).then(($subject) => {
    if ($subject.find(".clear-button").length > 0) {
      cy.wrap($subject).find(".clear-button").click();
    }
  });

  // Open dropdown and select option
  cy.get(subject)
    .find(".mat-select-arrow-wrapper")
    .click()
    .get(".mat-option-text")
    .contains(new RegExp("^ " + Cypress._.escapeRegExp(option) + " $"), { timeout: Cypress.config("timeout") })
    .click();

  // Verify selected option
  cy.get(subject).find(".mat-select-value").should("have.text", option);

  // Return the subject for further chaining
  return cy.wrap(subject);
}); */

