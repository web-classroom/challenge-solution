/// <reference types="cypress" />
import './mock-server'

Cypress.Commands.add('submitAnswers', () => {
  cy.intercept('POST', '/verify').as('submitAnswers');
  cy.get('button').contains('Check results').click();
  cy.wait('@submitAnswers');
});

Cypress.Commands.add('typeAnswers', (values) => {
  cy.get('.grid-item input').each(($item, index) => {
    const value = values[index];
    if (value != null) {
      cy.wrap($item).type(value);
    }
  });
});

Cypress.Commands.add('typeValidAnswers', (count) => {
  cy.readFile('images.json').then((solutions) => {
    cy.get('.grid-item').each(($item, index) => {
      if (count != null && index + 1 > count) {
        return;
      }
      const id = $item.attr('data-image-id');
      const answer = solutions.find((s) => s.id === id);
      cy.wrap($item).find('input').type(answer.title);
    });
  });
});

Cypress.Commands.add('getAttr', (selector, attribute) => {
  return cy.get(selector).then(($logos) => {
    return [...$logos].map((node) => node.getAttribute(attribute));
  });
});
