/// <reference types="cypress" />

import loc from '../support/locators';
import '../support/accountCommands';

describe('Account Management', () => {
    before(() => {
        cy.visit('barrigareact.wcaquino.me')
        cy.fixture('user').then(user => {
            cy.login(user[1].email, user[1].password)
        })
    })

    beforeEach(() => {
        cy.resetData()
        cy.goToAccounts()
    })

    it('Should insert an account', () => {
        cy.fixture('user').then(user => {
            cy.addAccount(user[1].accounts[0].name)
            cy.get(loc.MSG).should('contain', 'Conta inserida com sucesso!')
        })
    })

    it('Should not add an account with empty name', () => {
        cy.get(loc.ACCOUNTS.SAVE_BTN).click()
        cy.get('.toast-message').should('contain', 'code 400')
    })

    it('Should not add an account with an existing name', () => {
        cy.addAccount('Conta mesmo nome')
        cy.get(loc.MSG).should('contain', 'code 400')
    })

    it('Should edit an account', () => {
        cy.editAccount('Conta para alterar', 'new account')
        cy.get(loc.MSG).should('contain', 'Conta atualizada com sucesso!')
    })

    it('Should not edit an account with an existing name', () => {
        cy.editAccount('Conta mesmo nome', 'Conta para saldo')
        cy.get(loc.MSG).should('contain', 'code 400')
    })
})