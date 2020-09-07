/// <reference types="cypress" />

describe('General tests', () => {
    before(() => {
        cy.visit('barrigareact.wcaquino.me')
        cy.fixture('user').then(user => {
            cy.login(user[1].email, user[1].password)
        })
        cy.resetData()
    })
    it.only('Should test the responsiveness', () => {
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.visible')
        cy.viewport(500, 700)
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.not.visible')
        cy.viewport('iphone-5')
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.not.visible')
        cy.viewport('ipad-2')
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.visible')
    })
})