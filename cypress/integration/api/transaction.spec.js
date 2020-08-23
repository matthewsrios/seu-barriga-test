/// <reference types="cypress" />

import loc from '../../support/locators';
import '../../support/accountCommands';


describe('Transaction Management', () => {
    const accountName = 'transactions test';
    let contaId = null;
    before(() => {
        cy.fixture('user').then(user => {
            cy.getToken(user[1].email, user[1].password)
        })
    })

    beforeEach(() => {
        cy.resetRest()
        cy.request({
            method: 'POST',
            url: '/contas',
            body: {
                nome: accountName
            }
        }).then(response => {
            contaId = response.body.id
        })
    })

    describe('Pending transactions', () => {
        it('Should not insert a transaction with empty fields', () => {
            cy.request({
                method: 'POST',
                url: '/transacoes',
                body: {
                    tipo: "REC",
                    data_transacao: Cypress.moment().add(1).format('DD/MM/YYYY'),
                    data_pagamento: Cypress.moment().add().format('DD/MM/YYYY'),
                    descricao: "",
                    valor: "",
                    envolvido: "",
                    conta_id: `'${contaId}'`,
                    status: false
                },
                failOnStatusCode: false
            }).as('response')

            cy.get('@response').its('status').should('be.equal', 400)
            cy.get('@response').its('body').should('have.length.at.least', 4)
        })

        it('Should insert a transaction with mandatory fields', () => {
            cy.request({
                method: 'POST',
                url: '/transacoes',
                body: {
                    tipo: "REC",
                    data_transacao: Cypress.moment().add(1).format('DD/MM/YYYY'),
                    data_pagamento: Cypress.moment().add().format('DD/MM/YYYY'),
                    descricao: 'descriptions',
                    valor: '200',
                    envolvido: 'Salary',
                    conta_id: `${contaId}`,
                    status: false
                },
            }).as('response')

            cy.get('@response').its('status').should('be.equal', 201)
            cy.get('@response').its('body.descricao').should('be.equal', 'descriptions')
            cy.get('@response').its('body.valor').should('be.equal', '200.00')
        })

        it('Should insert a negative transaction with mandatory fields', () => {
            cy.request({
                method: 'POST',
                url: '/transacoes',
                body: {
                    tipo: "DESP",
                    data_transacao: Cypress.moment().add(1).format('DD/MM/YYYY'),
                    data_pagamento: Cypress.moment().add().format('DD/MM/YYYY'),
                    descricao: 'descriptions',
                    valor: '200',
                    envolvido: 'Salary',
                    conta_id: `${contaId}`,
                    status: true
                },
            }).as('response')

            cy.get('@response').its('status').should('be.equal', 201)
            cy.get('@response').its('body.descricao').should('be.equal', 'descriptions')
            cy.get('@response').its('body.valor').should('be.equal', '-200.00')
            cy.get('@response').its('body.tipo').should('be.equal', 'DESP')
        })
    })

    describe('Remove transactions', () => {
        it('Should remove a transaction successfully', () => {
            cy.request({
                method: 'GET',
                url: '/transacoes',
                qs: {
                    description: 'Movimentacao 3, calculo saldo'
                }
            }).then(response => {
                cy.request({
                    method: 'DELETE',
                    url: `/transacoes/${response.body[0].id}`,
                }).as('response')
            })

            cy.get('@response').its('status').should('be.equal', 204)
        })
    })
})