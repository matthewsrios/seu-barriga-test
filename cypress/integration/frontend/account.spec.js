/// <reference types="cypress" />

import loc from '../../support/locators';
import '../../support/accountCommands';
import buildEnv from '../../support/buildEnv'

describe('Account Management', () => {
    after(() => {
        cy.clearLocalStorage()
    })
    before(() => {
        cy.visit('barrigareact.wcaquino.me')
        cy.fixture('user').then(user => {
            cy.login(user[1].email, user[1].password)
        })
        buildEnv()
    })

    it('Should insert an account', () => {
        cy.server()
        cy.route({
            method: 'POST',
            url: '/contas',
            response: {
                id: 3,
                nome: 'Conta de teste',
                visible: true
            }
        }).as('saveConta')
        cy.route({
            method: 'GET',
            url: '/contas',
            response:
                [
                    {
                        id: 1,
                        nome: 'Carteira',
                        visivel: true,
                        usuario_id: 1000
                    },
                    {
                        id: 2,
                        nome: 'Conta',
                        visivel: true,
                        usuario_id: 11358
                    },
                    {
                        id: 2,
                        nome: 'Conta de teste',
                        visivel: true,
                        usuario_id: 11358
                    }
                ]

        }).as('accounts')
        cy.addAccount('Conta de teste')
        cy.get(loc.MSG).should('contain', 'Conta inserida com sucesso!')
        cy.xpath(loc.ACCOUNTS.FN_XP_EDIT_BTN('Conta de teste')).should('exist')
    })

    it.only('Should validate data when insert an account', () => {
        const reqStub = cy.stub()
        cy.server()
        cy.route({
            method: 'POST',
            url: '/contas',
            response: {
                id: 3,
                nome: 'Conta de teste',
                visible: true,
                // onRequest: req => {
                //     expect(req.request.body.nome).to.be.not.empty
                //     expect(req.request.headers).to.have.property('Authorization')
                // }
                //onRequest: reqStub
            }
        }).as('saveAccount')
        cy.route({
            method: 'GET',
            url: '/contas',
            response:
                [
                    {
                        id: 1,
                        nome: 'Carteira',
                        visivel: true,
                        usuario_id: 1000
                    },
                    {
                        id: 2,
                        nome: 'Conta',
                        visivel: true,
                        usuario_id: 11358
                    },
                    {
                        id: 2,
                        nome: 'Conta de teste',
                        visivel: true,
                        usuario_id: 11358
                    }
                ]

        }).as('accounts')
        cy.addAccount('Conta de teste')
        cy.get(loc.MSG).should('contain', 'Conta inserida com sucesso!')
        cy.wait('@saveAccount').its('request.body.nome').should('not.be.empty')
        // cy.wait('@saveConta').then(() => {
        //     console.log(reqStub.args)
        //     expect(reqStub.args[0][0].body.nome).not.be.empty
        //     expect(reqStub.args[0][0].request.headers).to.have.property('Authorization')
        // })
        cy.xpath(loc.ACCOUNTS.FN_XP_EDIT_BTN('Conta de teste')).should('exist')
    })

    it('Should not add an account with an existing name', () => {
        cy.server()
        cy.route({
            method: 'POST',
            url: '/contas',
            response: {
                "error":"Já existe uma conta com esse nome!"
            },
            failOnStatusCode: false,
            status: 400
        }).as('response')
        cy.addAccount('Conta')
        cy.get(loc.MSG).should('contain', 'code 400')
    })

    it('Should edit an account', () => {
        cy.server()
        cy.route({
            method: 'GET',
            url: '/contas',
            response:
                [
                    {
                        id: 1,
                        nome: 'Carteira',
                        visivel: true,
                        usuario_id: 1000
                    },
                    {
                        id: 2,
                        nome: 'Conta',
                        visivel: true,
                        usuario_id: 11358
                    }
                ]

        }).as('contas')
        cy.route({
            method: 'PUT',
            url: '/contas/**',
            response:
                [
                    {
                        id: 1,
                        nome: 'Nova Carteira',
                        visivel: true,
                        usuario_id: 1000
                    }
                ]

        }).as('updateContas')
        cy.goToAccounts()
        cy.route({
            method: 'GET',
            url: '/contas',
            response:
                [
                    {
                        id: 1,
                        nome: 'Nova Carteira',
                        visivel: true,
                        usuario_id: 1000
                    },
                    {
                        id: 2,
                        nome: 'Conta',
                        visivel: true,
                        usuario_id: 11358
                    }
                ]

        }).as('contas')
        cy.editAccount('Carteira', 'Nova Carteira')
        cy.get(loc.MSG).should('contain', 'Conta atualizada com sucesso!')
        cy.xpath(loc.ACCOUNTS.FN_XP_EDIT_BTN('Nova Carteira')).should('exist')
    })

    it('Should not edit an account with an existing name', () => {
        cy.server()
        cy.route({
            method: 'POST',
            url: '/contas',
            response: {
                error: 'Já existe uma conta com esse nome!'
            },
            status: 400
        }).as('saveAccountSameName')
        cy.addAccount('Conta')
        cy.get(loc.MSG).should('contain', 'code 400')
    })
})