// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import loc from '../support/locators';

Cypress.Commands.add('login', (email, password) => {
    cy.get(loc.LOGIN.EMAIL).type(email)
    cy.get(loc.LOGIN.PASSWORD).type(password)
    cy.get(loc.LOGIN.SUBMIT_BTN).click()
})

Cypress.Commands.add('addTransaction', data => {
    cy.get(loc.MENU.NEW_TRANSACTION).click()
    cy.get(loc.TRANSACTIONS.DESCRIPTION).should('exist')
    if (data.isNegative)
        cy.get(loc.TRANSACTIONS.NEGATIVE_BTN).click()

    if (data.isPaid)
        cy.get(loc.TRANSACTIONS.STATUS).click()

    if (data.description !== '')
        cy.get(loc.TRANSACTIONS.DESCRIPTION).type(data.description)

    if (data.value !== '')
        cy.get(loc.TRANSACTIONS.VALUE).type(data.value)

    if (data.toPerson !== '')
        cy.get(loc.TRANSACTIONS.TO_PERSON).type(data.toPerson)

    if (data.account !== '')
        cy.get(loc.TRANSACTIONS.ACCOUNT).select(data.account)

    cy.get(loc.TRANSACTIONS.SAVE_BTN).click()
    cy.clickIfExists(loc.MSG_CLOSE, {multiple: true, force: true})
})

Cypress.Commands.add('resetData', () => {
    cy.get(loc.MENU.SETTINGS).click()
    cy.get(loc.MENU.RESET).click()
    cy.clickIfExists(loc.MSG_CLOSE, {multiple: true, force: true})
})

Cypress.Commands.add('clickIfExists', (selector, options) => {
    cy.get('body').then((body) => {
        if (body.find(selector).length > 0) {
            cy.get(selector).click(options)
        }
    });
})