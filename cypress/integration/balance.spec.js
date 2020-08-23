/// <reference types="cypress" />

import loc from '../support/locators';
import '../support/accountCommands';


describe('Balance test', () => {
    const accountName = 'Conta para saldo';
    before(() => {
        cy.visit('barrigareact.wcaquino.me')
        cy.fixture('user').then(user => {
            cy.login(user[1].email, user[1].password)
        })
    })

    it('Should account balance starts with 534,00', () => {
        cy.resetData()
        cy.xpath(loc.FN_XP_FIND_BALANCE(accountName)).should('contain', '534,00').should('not.contain', '-')
    })

    describe('Pending transactions, account balance must not be affected', () => {
        beforeEach(() => {
            cy.clickIfExists(loc.MSG_CLOSE, { multiple: true, force: true })
            cy.resetData()
            cy.get(loc.MENU.NEW_TRANSACTION)
        })

        it('Should insert a positive transaction successfully', () => {
            const transactionInfo = {
                isNegative: false,
                isPaid: false,
                value: '200',
                description: 'salary',
                toPerson: 'company',
                account: accountName
            }
            cy.addTransaction(transactionInfo)
            cy.get(loc.MENU.HOME).click()
            cy.xpath(loc.FN_XP_FIND_BALANCE(accountName)).should('contain', '534,00').should('not.contain', '-')
        })

        it('Should insert a negative transaction successfully', () => {
            const transactionInfo = {
                isNegative: true,
                isPaid: false,
                value: '200',
                description: 'gas',
                toPerson: 'gas station',
                account: accountName
            }
            cy.addTransaction(transactionInfo)
            cy.get(loc.MENU.HOME).click()
            cy.xpath(loc.FN_XP_FIND_BALANCE(accountName)).should('contain', '534,00').should('not.contain', '-')
        })
    })

    describe('Paid transactions, account balance must be affected', () => {
        beforeEach(() => {
            cy.clickIfExists(loc.MSG_CLOSE, { multiple: true, force: true })
            cy.resetData()
            cy.get(loc.MENU.NEW_TRANSACTION)
        })
        it('Should insert a negative transaction successfully', () => {
            const transactionInfo = {
                isNegative: false,
                isPaid: true,
                value: '1000',
                description: 'salary',
                toPerson: 'company',
                account: accountName
            }
            cy.addTransaction(transactionInfo)
            cy.get(loc.MENU.HOME).click()
            cy.xpath(loc.FN_XP_FIND_BALANCE(accountName)).should('contain', '1.534,00').should('not.contain', '-')
        })

        it('Should insert a negative transaction successfully', () => {
            const transactionInfo = {
                isNegative: true,
                isPaid: true,
                value: '534',
                description: 'gas',
                toPerson: 'gas station',
                account: accountName
            }
            cy.addTransaction(transactionInfo)
            cy.get(loc.MENU.HOME).click()
            cy.xpath(loc.FN_XP_FIND_BALANCE(accountName)).should('contain', '0,00').should('not.contain', '-')
        })

        it('Should insert a negative transaction successfully that results in a negative balance', () => {
            const transactionInfo = {
                isNegative: true,
                isPaid: true,
                value: '600',
                description: 'gas',
                toPerson: 'gas station',
                account: accountName
            }
            cy.addTransaction(transactionInfo)
            cy.get(loc.MENU.HOME).click()
            cy.xpath(loc.FN_XP_FIND_BALANCE(accountName)).should('contain', '66,00').should('contain', '-')
        })

        it('Should insert a positive transaction successfully that results in a positive account balance', () => {
            const transactionInfo = {
                isNegative: true,
                isPaid: true,
                value: '600',
                description: 'gas',
                toPerson: 'gas station',
                account: accountName
            }
            cy.addTransaction(transactionInfo)
            const secondTransactionInfo = {
                isNegative: false,
                isPaid: true,
                value: '1000',
                description: 'salary',
                toPerson: 'company',
                account: accountName
            }
            cy.addTransaction(secondTransactionInfo)
            cy.get(loc.MENU.HOME).click()
            cy.xpath(loc.FN_XP_FIND_BALANCE(accountName)).should('contain', '934,00').should('not.contain', '-')
        })
    })
})