/// <reference types="cypress" />

import '../../support/accountCommands';


describe('Balance test', () => {
    const accountName = 'Conta para saldo';
    let contaId = null;
    before(() => {
        cy.fixture('user').then(user => {
            cy.getToken(user[1].email, user[1].password)
        })
    })

    beforeEach(() => {
        cy.resetRest()
        cy.request({
            method: 'GET',
            url: '/contas',
            qs: {
                nome: accountName
            }
        }).then(response => {
            contaId = response.body[0].id
        })
    })

    it('Should account balance starts with 534,00', () => {
        cy.request({
            method: 'GET',
            url: '/saldo'
        }).as('response')

        cy.get('@response').its('status').should('be.equal', 200)
        cy.get('@response').its('body').then(accounts => {
            return accounts.some(account => {
                return account.conta === 'Conta para saldo' && account.saldo === '534.00'
            })
        }).should('be.equal', true)
    })

    describe('Pending transactions, account balance must not be affected', () => {
        it('Should insert a positive transaction successfully', () => {
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
            })

            cy.request({
                method: 'GET',
                url: '/saldo'
            }).as('response')

            cy.get('@response').its('status').should('be.equal', 200)
            cy.get('@response').its('body').then(accounts => {
                return accounts.some(account => {
                    return account.conta === 'Conta para saldo' && account.saldo === '534.00'
                })
            }).should('be.equal', true)
        })

        it('Should insert a negative transaction successfully', () => {
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
                    status: false
                },
            })
            cy.request({
                method: 'GET',
                url: '/saldo'
            }).as('response')

            cy.get('@response').its('status').should('be.equal', 200)
            cy.get('@response').its('body').then(accounts => {
                return accounts.some(account => {
                    return account.conta === 'Conta para saldo' && account.saldo === '534.00'
                })
            }).should('be.equal', true)
        })
    })

    describe('Paid transactions, account balance must be affected', () => {
        it('Should insert a positive transaction successfully', () => {
            cy.request({
                method: 'POST',
                url: '/transacoes',
                body: {
                    tipo: "REC",
                    data_transacao: Cypress.moment().add(1).format('DD/MM/YYYY'),
                    data_pagamento: Cypress.moment().add().format('DD/MM/YYYY'),
                    descricao: 'descriptions',
                    valor: '1000',
                    envolvido: 'Salary',
                    conta_id: `${contaId}`,
                    status: true
                },
            })
            cy.request({
                method: 'GET',
                url: '/saldo'
            }).as('response')

            cy.get('@response').its('status').should('be.equal', 200)
            cy.get('@response').its('body').then(accounts => {
                return accounts.some(account => {
                    return account.conta === 'Conta para saldo' && account.saldo === '1534.00'
                })
            }).should('be.equal', true)
        })

        it('Should insert a negative transaction successfully', () => {
            cy.request({
                method: 'POST',
                url: '/transacoes',
                body: {
                    tipo: "DESP",
                    data_transacao: Cypress.moment().add(1).format('DD/MM/YYYY'),
                    data_pagamento: Cypress.moment().add().format('DD/MM/YYYY'),
                    descricao: 'descriptions',
                    valor: '534',
                    envolvido: 'Salary',
                    conta_id: `${contaId}`,
                    status: true
                },
            })
            cy.request({
                method: 'GET',
                url: '/saldo'
            }).as('response')

            cy.get('@response').its('status').should('be.equal', 200)
            cy.get('@response').its('body').then(accounts => {
                return accounts.some(account => {
                    return account.conta === 'Conta para saldo' && account.saldo === '0.00'
                })
            }).should('be.equal', true)
        })

        it('Should insert a negative transaction successfully that results in a negative balance', () => {
            cy.request({
                method: 'POST',
                url: '/transacoes',
                body: {
                    tipo: "DESP",
                    data_transacao: Cypress.moment().add(1).format('DD/MM/YYYY'),
                    data_pagamento: Cypress.moment().add().format('DD/MM/YYYY'),
                    descricao: 'descriptions',
                    valor: '600',
                    envolvido: 'Salary',
                    conta_id: `${contaId}`,
                    status: true
                },
            })
            cy.request({
                method: 'GET',
                url: '/saldo'
            }).as('response')

            cy.get('@response').its('status').should('be.equal', 200)
            cy.get('@response').its('body').then(accounts => {
                return accounts.some(account => {
                    return account.conta === 'Conta para saldo' && account.saldo === '-66.00'
                })
            }).should('be.equal', true)
        })

        it('Should insert a positive transaction successfully that results in a positive account balance', () => {

            cy.request({
                method: 'POST',
                url: '/transacoes',
                body: {
                    tipo: "DESP",
                    data_transacao: Cypress.moment().add(1).format('DD/MM/YYYY'),
                    data_pagamento: Cypress.moment().add().format('DD/MM/YYYY'),
                    descricao: 'descriptions',
                    valor: '600',
                    envolvido: 'Salary',
                    conta_id: `${contaId}`,
                    status: true
                },
            })
            cy.request({
                method: 'POST',
                url: '/transacoes',
                body: {
                    tipo: "REC",
                    data_transacao: Cypress.moment().add(1).format('DD/MM/YYYY'),
                    data_pagamento: Cypress.moment().add().format('DD/MM/YYYY'),
                    descricao: 'descriptions',
                    valor: '1000',
                    envolvido: 'Salary',
                    conta_id: `${contaId}`,
                    status: true
                },
            })
            cy.request({
                method: 'GET',
                url: '/saldo'
            }).as('response')

            cy.get('@response').its('status').should('be.equal', 200)
            cy.get('@response').its('body').then(accounts => {
                console.log(accounts)
                return accounts.some(account => {
                    return account.conta === 'Conta para saldo' && account.saldo === '934.00'
                })
            }).should('be.equal', true)
        })
    })
})