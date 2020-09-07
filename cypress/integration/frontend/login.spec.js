/// <reference types="cypress" />

import loc from '../../support/locators';
import buildEnv from '../../support/buildEnv'

describe('Login', () => {
    beforeEach(() => {
        cy.clearLocalStorage()
        buildEnv()
        cy.visit('barrigareact.wcaquino.me')
    })

    it('Should login', () => {
        cy.fixture('user').then(user => {
            cy.login(user[1].email, user[1].password)
            cy.get(loc.MSG).should('contain',  'Bem vindo, Usuario falso!')
            cy.xpath(loc.FN_XP_FIND_BALANCE('Carteira')).should('contain', '1.500,00')
        })
    })

    it('Should not login', () => {
        cy.server()
        cy.route({
            method: 'POST',
            url: '/signin',
            response: {
                "error": "Problemas com o login do usuário"
            },
            status: 400
        }).as('signin')
        cy.login('teste@teste.com', 'teste@teste.com')
        cy.get(loc.MSG).should('contain', 'code 400')
    })
})