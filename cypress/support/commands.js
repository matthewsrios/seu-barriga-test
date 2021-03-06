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
        cy.clickIfExists(loc.TRANSACTIONS.STATUS, {force: true})

    if (data.description !== '')
        cy.get(loc.TRANSACTIONS.DESCRIPTION).type(data.description)

    if (data.value !== '')
        cy.get(loc.TRANSACTIONS.VALUE).type(data.value)

    if (data.senderOrReceiver !== '')
        cy.get(loc.TRANSACTIONS.SENDER_OR_RECEIVER).type(data.senderOrReceiver)

    if (data.account !== '')
        cy.get(loc.TRANSACTIONS.ACCOUNT).select(data.account)

    cy.get(loc.TRANSACTIONS.SAVE_BTN).click()
})

Cypress.Commands.add('resetData', () => {
    cy.get(loc.MENU.SETTINGS).click()
    cy.get(loc.MENU.RESET).click()
    cy.clickIfExists(loc.MSG_CLOSE, { multiple: true, force: true })
})

Cypress.Commands.add('clickIfExists', (selector, options) => {
    cy.get('body').then((body) => {
        if (body.find(selector).length > 0) {
            cy.get(selector).click(options)
        }
    });
})

Cypress.Commands.add('getToken', (email, password) => {
    cy.request({
        url: '/signin',
        method: 'POST',
        body: {
            email: email,
            redirecionar: false,
            senha: password
        }
    }).its('body.token').should('not.be.empty')
        .then(token => {
            Cypress.env('token', token)
        })
})

Cypress.Commands.add('resetRest', () => {
    cy.request({
        method: 'GET',
        url: '/reset'
    })
})

Cypress.Commands.overwrite('request', (originalFn, ...options) => {
    if (options.length === 1) {
        if (Cypress.env('token')) {
            options[0].headers = {
                'Authorization': `JWT ${Cypress.env('token')}`
            }
        }
    }

    return originalFn(...options);
})