/// <reference types="cypress" />

import loc from '../../support/locators';
import '../../support/accountCommands';
import buildEnv from '../../support/buildEnv';

const transactionAssertion = (description, value, isNegative) => {
    cy.get(loc.MSG).should('contain', 'Movimentação inserida com sucesso!')
    cy.xpath(loc.TRANSACTIONS.FN_XP_FIND_TRANSACTION(description, value, isNegative)).should('exist')
}
describe('Transaction Management', () => {
    const accountName = 'Conta para movimentacoes';
    before(() => {
        cy.visit('barrigareact.wcaquino.me')
        cy.fixture('user').then(user => {
            cy.login(user[1].email, user[1].password)
        })
        buildEnv()
    })

    beforeEach(() => {
        cy.clickIfExists(loc.MSG_CLOSE, { multiple: true, force: true })
        cy.resetData()
    })

    describe('Pending transactions', () => {
        const isPaid = false;
        it('Should not insert a transaction with empty fields', () => {
            cy.server()
            cy.route({
                url: '/transacoes',
                method: 'POST',
                status: 400,
                response: {
                    id: 224220,
                    descricao: "",
                    envolvido: "",
                    observacao: null,
                    tipo: "REC",
                    data_transacao: "2020-08-30T03:00:00.000Z",
                    data_pagamento: "2020-08-30T03:00:00.000Z",
                    valor: "",
                    status: false,
                    conta_id: null,
                    usuario_id: 11358,
                    transferencia_id: null,
                    parcelamento_id: null
                }
            })
            cy.addTransaction({
                isNegative: false,
                isPaid,
                value: '',
                description: '',
                senderOrReceiver: '',
                account: ''
            })
            cy.get(loc.MSG).should('contain', 'code 400')
        })

        it('Should insert a transaction with mandatory fields', () => {
            const transactionInfo = {
                isNegative: false,
                isPaid,
                value: 200,
                description: 'new money',
                senderOrReceiver: 'XV Restaurant',
                account: accountName,
            }
            cy.server()
            cy.route({
                url: '/transacoes',
                method: 'POST',
                status: 200,
                response: {
                    id: 99909,
                    descricao: transactionInfo.description,
                    envolvido: transactionInfo.senderOrReceiver,
                    observacao: null,
                    tipo: "REC",
                    data_transacao: "2020-08-30T03:00:00.000Z",
                    data_pagamento: "2020-08-30T03:00:00.000Z",
                    valor: transactionInfo.value,
                    status: transactionInfo.isPaid,
                    conta_id: 1,
                    usuario_id: 11358,
                    transferencia_id: 99909,
                    parcelamento_id: null
                }
            })
            cy.route({
                method: 'GET',
                url: '/extrato/**',
                status: 200,
                response: [
                    {
                        "conta": "Conta para movimentacoes",
                        "id": 222216,
                        "descricao": "Movimentacao para exclusao",
                        "envolvido": "AAA",
                        "observacao": null,
                        "tipo": "DESP",
                        "data_transacao": "2020-08-23T03:00:00.000Z",
                        "data_pagamento": "2020-08-23T03:00:00.000Z",
                        "valor": "-1500.00",
                        "status": true,
                        "conta_id": 247693,
                        "usuario_id": 11358,
                        "transferencia_id": null,
                        "parcelamento_id": null
                    },
                    {
                        "conta": "Conta com movimentacao",
                        "id": 222217,
                        "descricao": "Movimentacao de conta",
                        "envolvido": "BBB",
                        "observacao": null,
                        "tipo": "DESP",
                        "data_transacao": "2020-08-23T03:00:00.000Z",
                        "data_pagamento": "2020-08-23T03:00:00.000Z",
                        "valor": "-1500.00",
                        "status": true,
                        "conta_id": 247694,
                        "usuario_id": 11358,
                        "transferencia_id": null,
                        "parcelamento_id": null
                    },
                    {
                        "conta": "Conta para saldo",
                        "id": 222218,
                        "descricao": "Movimentacao 1, calculo saldo",
                        "envolvido": "CCC",
                        "observacao": null,
                        "tipo": "REC",
                        "data_transacao": "2020-08-23T03:00:00.000Z",
                        "data_pagamento": "2020-08-23T03:00:00.000Z",
                        "valor": "3500.00",
                        "status": false,
                        "conta_id": 247695,
                        "usuario_id": 11358,
                        "transferencia_id": null,
                        "parcelamento_id": null
                    },
                    {
                        "conta": "Conta para saldo",
                        "id": 222219,
                        "descricao": "Movimentacao 2, calculo saldo",
                        "envolvido": "DDD",
                        "observacao": null,
                        "tipo": "DESP",
                        "data_transacao": "2020-08-23T03:00:00.000Z",
                        "data_pagamento": "2020-08-23T03:00:00.000Z",
                        "valor": "-1000.00",
                        "status": true,
                        "conta_id": 247695,
                        "usuario_id": 11358,
                        "transferencia_id": null,
                        "parcelamento_id": null
                    },
                    {
                        "conta": "Conta para saldo",
                        "id": 222220,
                        "descricao": "Movimentacao 3, calculo saldo",
                        "envolvido": "EEE",
                        "observacao": null,
                        "tipo": "REC",
                        "data_transacao": "2020-08-23T03:00:00.000Z",
                        "data_pagamento": "2020-08-23T03:00:00.000Z",
                        "valor": "1534.00",
                        "status": true,
                        "conta_id": 247695,
                        "usuario_id": 11358,
                        "transferencia_id": null,
                        "parcelamento_id": null
                    },
                    {
                        "conta": "Conta para extrato",
                        "id": 222221,
                        "descricao": "Movimentacao para extrato",
                        "envolvido": "FFF",
                        "observacao": null,
                        "tipo": "DESP",
                        "data_transacao": "2020-08-23T03:00:00.000Z",
                        "data_pagamento": "2020-08-23T03:00:00.000Z",
                        "valor": "-220.00",
                        "status": true,
                        "conta_id": 247696,
                        "usuario_id": 11358,
                        "transferencia_id": null,
                        "parcelamento_id": null
                    },
                    {
                        "conta": "Conta para saldo",
                        "id": 222222,
                        "descricao": "descriptions",
                        "envolvido": "Salary",
                        "observacao": null,
                        "tipo": "DESP",
                        "data_transacao": "2020-08-23T03:00:00.000Z",
                        "data_pagamento": "2020-08-23T03:00:00.000Z",
                        "valor": "-600.00",
                        "status": true,
                        "conta_id": 247695,
                        "usuario_id": 11358,
                        "transferencia_id": null,
                        "parcelamento_id": null
                    },
                    {
                        "conta": "Conta para saldo",
                        "id": 222223,
                        "descricao": "descriptions",
                        "envolvido": "Salary",
                        "observacao": null,
                        "tipo": "REC",
                        "data_transacao": "2020-08-23T03:00:00.000Z",
                        "data_pagamento": "2020-08-23T03:00:00.000Z",
                        "valor": "1000.00",
                        "status": true,
                        "conta_id": 247695,
                        "usuario_id": 11358,
                        "transferencia_id": null,
                        "parcelamento_id": null
                    },
                    {
                        "conta": transactionInfo.account,
                        "id": 99888,
                        "descricao": transactionInfo.description,
                        "envolvido": transactionInfo.senderOrReceiver,
                        "observacao": null,
                        "tipo": transactionInfo.isNegative ? 'DESP' : 'REC',
                        "data_transacao": "2020-08-23T03:00:00.000Z",
                        "data_pagamento": "2020-08-23T03:00:00.000Z",
                        "valor": `${transactionInfo.isNegative ? '-' : ''}${transactionInfo.value}`,
                        "status": transactionInfo.isPaid,
                        "conta_id": 1,
                        "usuario_id": 11358,
                        "transferencia_id": null,
                        "parcelamento_id": null
                    }
                ]
            }).as('getTransactionsAfterSaving')
            cy.addTransaction(transactionInfo)
            transactionAssertion(transactionInfo.description, transactionInfo.value, transactionInfo.isNegative)
        })

        it('Should insert a negative transaction with mandatory fields', () => {
            const transactionInfo = {
                isNegative: true,
                isPaid,
                value: 200,
                description: 'new money',
                senderOrReceiver: 'XV Restaurant',
                account: accountName,
            }
            cy.server()
            cy.route({
                url: '/transacoes',
                method: 'POST',
                status: 200,
                response: {
                    id: 99909,
                    descricao: transactionInfo.description,
                    envolvido: transactionInfo.senderOrReceiver,
                    observacao: null,
                    tipo: "REC",
                    data_transacao: "2020-08-30T03:00:00.000Z",
                    data_pagamento: "2020-08-30T03:00:00.000Z",
                    valor: transactionInfo.value,
                    status: transactionInfo.isPaid,
                    conta_id: 1,
                    usuario_id: 11358,
                    transferencia_id: 99909,
                    parcelamento_id: null
                }
            })
            cy.route({
                method: 'GET',
                url: '/extrato/**',
                status: 200,
                response: [
                    {
                        "conta": "Conta para movimentacoes",
                        "id": 222216,
                        "descricao": "Movimentacao para exclusao",
                        "envolvido": "AAA",
                        "observacao": null,
                        "tipo": "DESP",
                        "data_transacao": "2020-08-23T03:00:00.000Z",
                        "data_pagamento": "2020-08-23T03:00:00.000Z",
                        "valor": "-1500.00",
                        "status": true,
                        "conta_id": 247693,
                        "usuario_id": 11358,
                        "transferencia_id": null,
                        "parcelamento_id": null
                    },
                    {
                        "conta": "Conta com movimentacao",
                        "id": 222217,
                        "descricao": "Movimentacao de conta",
                        "envolvido": "BBB",
                        "observacao": null,
                        "tipo": "DESP",
                        "data_transacao": "2020-08-23T03:00:00.000Z",
                        "data_pagamento": "2020-08-23T03:00:00.000Z",
                        "valor": "-1500.00",
                        "status": true,
                        "conta_id": 247694,
                        "usuario_id": 11358,
                        "transferencia_id": null,
                        "parcelamento_id": null
                    },
                    {
                        "conta": "Conta para saldo",
                        "id": 222218,
                        "descricao": "Movimentacao 1, calculo saldo",
                        "envolvido": "CCC",
                        "observacao": null,
                        "tipo": "REC",
                        "data_transacao": "2020-08-23T03:00:00.000Z",
                        "data_pagamento": "2020-08-23T03:00:00.000Z",
                        "valor": "3500.00",
                        "status": false,
                        "conta_id": 247695,
                        "usuario_id": 11358,
                        "transferencia_id": null,
                        "parcelamento_id": null
                    },
                    {
                        "conta": "Conta para saldo",
                        "id": 222219,
                        "descricao": "Movimentacao 2, calculo saldo",
                        "envolvido": "DDD",
                        "observacao": null,
                        "tipo": "DESP",
                        "data_transacao": "2020-08-23T03:00:00.000Z",
                        "data_pagamento": "2020-08-23T03:00:00.000Z",
                        "valor": "-1000.00",
                        "status": true,
                        "conta_id": 247695,
                        "usuario_id": 11358,
                        "transferencia_id": null,
                        "parcelamento_id": null
                    },
                    {
                        "conta": "Conta para saldo",
                        "id": 222220,
                        "descricao": "Movimentacao 3, calculo saldo",
                        "envolvido": "EEE",
                        "observacao": null,
                        "tipo": "REC",
                        "data_transacao": "2020-08-23T03:00:00.000Z",
                        "data_pagamento": "2020-08-23T03:00:00.000Z",
                        "valor": "1534.00",
                        "status": true,
                        "conta_id": 247695,
                        "usuario_id": 11358,
                        "transferencia_id": null,
                        "parcelamento_id": null
                    },
                    {
                        "conta": "Conta para extrato",
                        "id": 222221,
                        "descricao": "Movimentacao para extrato",
                        "envolvido": "FFF",
                        "observacao": null,
                        "tipo": "DESP",
                        "data_transacao": "2020-08-23T03:00:00.000Z",
                        "data_pagamento": "2020-08-23T03:00:00.000Z",
                        "valor": "-220.00",
                        "status": true,
                        "conta_id": 247696,
                        "usuario_id": 11358,
                        "transferencia_id": null,
                        "parcelamento_id": null
                    },
                    {
                        "conta": "Conta para saldo",
                        "id": 222222,
                        "descricao": "descriptions",
                        "envolvido": "Salary",
                        "observacao": null,
                        "tipo": "DESP",
                        "data_transacao": "2020-08-23T03:00:00.000Z",
                        "data_pagamento": "2020-08-23T03:00:00.000Z",
                        "valor": "-600.00",
                        "status": true,
                        "conta_id": 247695,
                        "usuario_id": 11358,
                        "transferencia_id": null,
                        "parcelamento_id": null
                    },
                    {
                        "conta": "Conta para saldo",
                        "id": 222223,
                        "descricao": "descriptions",
                        "envolvido": "Salary",
                        "observacao": null,
                        "tipo": "REC",
                        "data_transacao": "2020-08-23T03:00:00.000Z",
                        "data_pagamento": "2020-08-23T03:00:00.000Z",
                        "valor": "1000.00",
                        "status": true,
                        "conta_id": 247695,
                        "usuario_id": 11358,
                        "transferencia_id": null,
                        "parcelamento_id": null
                    },
                    {
                        "conta": transactionInfo.account,
                        "id": 99889,
                        "descricao": transactionInfo.description,
                        "envolvido": transactionInfo.senderOrReceiver,
                        "observacao": null,
                        "tipo": transactionInfo.isNegative ? 'DESP' : 'REC',
                        "data_transacao": "2020-08-23T03:00:00.000Z",
                        "data_pagamento": "2020-08-23T03:00:00.000Z",
                        "valor": `${transactionInfo.isNegative ? '-' : ''}${transactionInfo.value}`,
                        "status": transactionInfo.isPaid,
                        "conta_id": 1,
                        "usuario_id": 11358,
                        "transferencia_id": null,
                        "parcelamento_id": null
                    }
                ]
            }).as('getTransactionsAfterSaving')
            cy.addTransaction(transactionInfo)
            transactionAssertion(transactionInfo.description, transactionInfo.value, transactionInfo.isNegative)
        })
    })

    it('Should remove a transaction successfully', () => {
        const description = 'Movimentacao 3, calculo saldo';
        cy.get(loc.MENU.TRANSACTIONS).click()
        cy.server()
        cy.route({
            method: 'DELETE',
            url: '/transacoes/**',
            status: 204,
            response: {}
        }).as('deleteTransaction')
        cy.route({
            method: 'GET',
            url: '/extrato/**',
            status: 200,
            response: 'fx:transactionsAfterDelete'
        }).as('getTransactions')
        cy.xpath(loc.TRANSACTIONS.FN_XP_FIND_REMOVE_TRANSACTION(description)).click()
        cy.get(loc.MSG).should('contain', 'Movimentação removida com sucesso!')
        cy.xpath(loc.TRANSACTIONS.FN_XP_FIND_REMOVE_TRANSACTION(description)).should('not.exist')
    })

    it('Color test', () => {
        cy.server()
        cy.route({
            method: 'GET',
            url: '/extrato/**',
            status: 200,
            response: 'fx:transactionsByColors'
        }).as('getTransactions')
        cy.get(loc.MENU.TRANSACTIONS).click()
        cy.xpath(loc.TRANSACTIONS.FN_XP_FIND_BY_DESCRIPTION('Movimentacao para exclusao')).should('have.class', 'despesaPaga')
        cy.xpath(loc.TRANSACTIONS.FN_XP_FIND_BY_DESCRIPTION('Movimentacao de conta')).should('have.class', 'despesaPendente')
        cy.xpath(loc.TRANSACTIONS.FN_XP_FIND_BY_DESCRIPTION('Movimentacao 1, calculo saldo')).should('have.class', 'receitaPaga')
        cy.xpath(loc.TRANSACTIONS.FN_XP_FIND_BY_DESCRIPTION('Movimentacao 2, calculo saldo')).should('have.class', 'receitaPendente')
    })
})