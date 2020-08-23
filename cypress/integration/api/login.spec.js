/// <reference types="cypress" />

import loc from '../../support/locators';

describe('Login', () => {

    it('Should login', () => {
        cy.fixture('user').then(user => {
            cy.getToken(user[1].email, user[1].password)
                .then(token => console.log('Token: ' + token))
        })
    })

    it('Should not login', () => {
        cy.fixture('user').then(user => {
            cy.request({
                url: 'https://barrigarest.wcaquino.me/signin',
                method: 'POST',
                body: {
                    email: user[2].email,
                    redirecionar: false,
                    senha: user[2].password
                },
                failOnStatusCode: false
            }).its('body.error').should('be.not.empty')
                .then(error => expect(error).to.contains('Problemas com o login do usuário'))
        })
    })
})