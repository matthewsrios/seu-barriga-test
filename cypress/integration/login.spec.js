/// <reference types="cypress" />

import loc from '../support/locators'

describe('Login', () => {
    beforeEach(() => {
        cy.visit('barrigareact.wcaquino.me')
    })

    xit('Should register user', () => {
        cy.fixture('user').then(user => {
            cy.get(loc.REGISTER.NAME).type(user[1].name)
            cy.get(loc.REGISTER.EMAIL).type(user[1].email)
            cy.get(loc.REGISTER.PASSWORD).type(user[1].password)
            cy.get(loc.REGISTER.REGISTER_BTN).click()
    
            cy.get(loc.MSG).should('contain', 'Usuário adicionado com sucesso')
        })
    })

    it('Should login', () => {
        cy.fixture('user').then(user => {
            cy.login(user[1].email, user[1].password)
            cy.get(loc.MSG).should('contain', `Bem vindo, ${user[1].name}!`)
        })
    })

    it('Should not login', () => {
        cy.fixture('user').then(user => {
            cy.login(user[2].email, user[2].password)
            cy.get(loc.MSG).should('not.contain', `Bem vindo, ${user[2].name}!`)
        })
    })
})