import loc from './locators';

Cypress.Commands.add('goToAccounts', () => {
    cy.get(loc.MENU.SETTINGS).click()
    cy.get(loc.MENU.ACCOUNTS).click()
})

Cypress.Commands.add('addAccount', accountName => {
    cy.goToAccounts();
    cy.get(loc.ACCOUNTS.NAME).type(accountName)
    cy.get(loc.ACCOUNTS.SAVE_BTN).click()
    cy.clickIfExists(loc.MSG_CLOSE, { multiple: true, force: true })
})

Cypress.Commands.add('editAccount', (accountName, newAccountName) => {
    cy.get(loc.ACCOUNTS.ACCOUNT_HEAD).should('exist')
    cy.xpath(loc.ACCOUNTS.FN_XP_EDIT_BTN(accountName)).click()
    cy.get(loc.ACCOUNTS.NAME).clear()
    cy.get(loc.ACCOUNTS.NAME).type(newAccountName)
    cy.get(loc.ACCOUNTS.SAVE_BTN).click()
})

