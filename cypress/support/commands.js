Cypress.Commands.add('login', (username, password) => {
    cy.get('#username').type(username)
    cy.get('#password').type(password, {log: false})
    cy.get('.woocommerce-form > .button').click()
  });
  