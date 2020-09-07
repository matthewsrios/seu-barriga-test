/// <reference types="cypress" />

import loc from '../../support/locators';
import '../../support/accountCommands';


const transactionAssertion = (description, value, isNegative) => {
    cy.get(loc.MSG).should('contain', 'Movimentação inserida com sucesso!')
    cy.xpath(loc.TRANSACTIONS.FN_XP_FIND_TRANSACTION(description, value, isNegative)).should('exist')
}
describe('Transaction Management', () => {
    const accountName = 'transactions test';
    before(() => {
        cy.visit('barrigareact.wcaquino.me')
        cy.fixture('user').then(user => {
            cy.login(user[1].email, user[1].password)
        })
    })

    beforeEach(() => {
        cy.clickIfExists(loc.MSG_CLOSE, { multiple: true, force: true })
        cy.resetData()
        cy.addAccount(accountName)
    })

    describe('Pending transactions', () => {
        const isPaid = false;
        it('Should not insert a transaction with empty fields', () => {
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
            cy.addTransaction(transactionInfo)
            transactionAssertion(transactionInfo.description, transactionInfo.value, transactionInfo.isNegative)
        })
    })

    describe('Remove transactions', () => {
        it('Should remove a transaction successfully', () => {
            const description = 'Movimentacao 3, calculo saldo';
            cy.get(loc.MENU.TRANSACTIONS).click()
            cy.xpath(loc.TRANSACTIONS.FN_XP_FIND_REMOVE_TRANSACTION(description)).click()
            cy.get(loc.MSG).should('contain', 'Movimentação removida com sucesso!')
            cy.xpath(loc.TRANSACTIONS.FN_XP_FIND_REMOVE_TRANSACTION(description)).should('not.exist')
        })
    })
})