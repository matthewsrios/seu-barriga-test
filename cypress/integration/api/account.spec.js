/// <reference types="cypress" />

import loc from '../../support/locators';
import '../../support/accountCommands';

describe('Account Management', () => {
    before(() => {
        cy.fixture('user').then(user => {
            cy.getToken(user[1].email, user[1].password)
        })
    })

    beforeEach(() => {
        cy.resetRest()
    })

    it('Should insert an account', () => {
        cy.fixture('user').then(user => {
            cy.request({
                method: 'POST',
                url: '/contas',
                body: {
                    nome: user[1].accounts[0].name
                }
            }).as('response')
        })

        cy.get('@response').its('status').should('be.equal', 201)
        cy.get('@response').its('body.id').should('exist')
    })

    it('Should not add an account with empty name', () => {
        cy.request({
            method: 'POST',
            url: '/contas',
            body: {
                nome: ''
            },
            failOnStatusCode: false
        }).as('response')

        cy.get('@response').its('status').should('be.equal', 400)
        cy.get('@response').its('body').then(messages => {
            return messages.some(message => {
                return message.msg === 'Nome é um campo obrigatório'
            })
        }).should('be.true')
    })

    it('Should not add an account with an existing name', () => {
        cy.request({
            method: 'POST',
            url: '/contas',
            body: {
                nome: 'Conta mesmo nome'
            },
            failOnStatusCode: false
        }).as('response')

        cy.get('@response').its('status').should('be.equal', 400)
        cy.get('@response').its('body.error').should('be.equal', 'Já existe uma conta com esse nome!')
    })

    it('Should edit an account', () => {
        cy.request({
            method: 'GET',
            url: '/contas',
            qs: {
                nome: 'Conta para alterar'
            },
        }).then(response => {
            cy.request({
                method: 'PUT',
                url: `/contas/${response.body[0].id}`,
                body:{
                    nome: 'new account name'
                }
            }).as('response')
        })

        cy.get('@response').its('status').should('be.equal', 200)
        cy.get('@response').its('body.nome').should('be.equal', 'new account name')
    })

    it('Should not edit an account with an existing name', () => {
        cy.request({
            method: 'GET',
            url: '/contas',
            qs: {
                nome: 'Conta para alterar'
            },
        }).then(response => {
            cy.request({
                method: 'PUT',
                url: `/contas/${response.body[0].id}`,
                body:{
                    nome: 'Conta para saldo'
                },
                failOnStatusCode: false
            }).as('response')
        })

        cy.get('@response').its('status').should('be.equal', 400)
        cy.get('@response').its('body.error').should('be.equal', 'Já existe uma conta com esse nome!')
    })
})