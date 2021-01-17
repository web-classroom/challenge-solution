/// <reference types="cypress" />

const { expect } = require('chai');

describe('Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display a grid of partial logos', () => {
    cy.get('.grid-item').each(($item) => {
      cy.wrap($item).should('have.attr', 'data-image-id');
      cy.wrap($item)
        .find('img')
        .should('have.attr', 'src')
        .and('match', /images\/partial/)
        .and('contain', $item.attr('data-image-id'));
    });
  });

  it('should display 8 random logos', () => {
    cy.getAttr('.grid-item img', 'src')
      .should('have.length', 8)
      .then((logos) => {
        expect(logos.length).to.equal(new Set(logos).size, 'logos should not be duplicated');

        cy.reload();
        cy.getAttr('.grid-item img', 'src').then((newLogos) => {
          expect(newLogos).not.have.all.members(
            logos,
            'logos should be different on each page reload',
          );
        });
      });
  });

  it('should have an input field inside each grid item', () => {
    cy.get('.grid-item').each($item => {
      cy.wrap($item).find('input').should('have.length', 1)
    })
  });

  it('should contain a "Check results" button', () => {
    cy.get('button').contains('Check results');
  });

  it('should send answers when "Check results" is clicked', () => {
    const answers = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    cy.getAttr('.grid-item', 'data-image-id').then((ids) => {
      cy.typeAnswers(answers);
      cy.submitAnswers().then(({ request }) => {
        expect(request.body).to.be.an('object');
        expect(request.body).to.have.all.keys(ids);
        expect(Object.values(request.body)).to.have.all.members(answers);
      });
    });
  });
});

describe('Server', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should verify answers and return solutions', () => {
    const answers = {
      'angular-icon': 'Angular',
      'ember-tomster': 'Ember',
      'nodejs-icon': 'Oops',
      'socket.io': '',
    };

    const expected = [
      { id: 'angular-icon', title: 'Angular', valid: true },
      { id: 'ember-tomster', title: 'Ember', valid: true },
      { id: 'nodejs-icon', title: 'Nodejs', valid: false },
      { id: 'socket.io', title: 'Socket.io', valid: false },
    ];

    cy.request('POST', '/verify', answers).then((response) => {
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.deep.members(expected);
    });
  });

  it('should ignore special chars and casing when verifying answers', () => {
    const answers = {
      'angular-icon': 'angular',
      'ember-tomster': 'EMBER',
      'nodejs-icon': 'node.js',
      'socket.io': 'socket io',
    };

    const expected = [
      { id: 'angular-icon', title: 'Angular', valid: true },
      { id: 'ember-tomster', title: 'Ember', valid: true },
      { id: 'nodejs-icon', title: 'Nodejs', valid: true },
      { id: 'socket.io', title: 'Socket.io', valid: true },
    ];

    cy.request('POST', '/verify', answers).then((response) => {
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.deep.members(expected);
    });
  });
});

describe('After submitting answers', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.mockServer();
  });

  it('should display the number of points', () => {
    cy.typeValidAnswers(5);
    cy.submitAnswers();
    cy.contains('5/8 points');
  });

  it('should add the solution in each input', () => {
    cy.submitAnswers().then(({ response }) => {
      const solutions = new Map(response.body.map((s) => [s.id, s.title]));
      cy.get('.grid-item').each(($item) => {
        const id = $item.attr('data-image-id');
        cy.wrap($item).find('input').should('have.value', solutions.get(id));
      });
    });
  });

  it('should set inputs text color to green for valid answers and red for invalid answers', () => {
    const RED = 'rgb(248, 113, 113)';
    const GREEN = 'rgb(52, 211, 153)';

    cy.submitAnswers();
    cy.get('.grid-item input').as('inputs');
    cy.get('@inputs').each(($input) => cy.wrap($input).should('have.css', 'color', RED));

    cy.reload();
    cy.typeValidAnswers();
    cy.submitAnswers();
    cy.get('@inputs').each(($input) => cy.wrap($input).should('have.css', 'color', GREEN));
  });

  it('should reveal the logos', () => {
    cy.submitAnswers();
    cy.get('.grid-item').each(($item) => {
      cy.wrap($item)
        .find('img')
        .should('have.attr', 'src')
        .and('match', /images\/full/)
        .and('contain', $item.attr('data-image-id'));
    });
  });
});
