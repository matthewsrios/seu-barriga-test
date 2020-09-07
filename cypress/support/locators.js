const locators = {
    REGISTER: {
        NAME: '.form-group:nth-child(1) > .form-control',
        EMAIL: '.form-control:nth-child(2)',
        PASSWORD: '.form-group:nth-child(3) > .form-control',
        REGISTER_BTN: '.btn'
    },
    LOGIN: {
        USER: '[data-test=email]',
        PASSWORD: '[data-test=passwd]',
        BTN_LOGIN: '.btn'
    },
    MENU: {
        SETTINGS: '[data-test=menu-settings]',
        ACCOUNTS: '.dropdown-item:nth-child(1)',
        TRANSACTIONS: '[data-test=menu-extrato] > .fas',
        NEW_TRANSACTION: '[data-test=menu-movimentacao] > .fas',
        HOME: '.fa-home',
        RESET: '[href="/reset"]'
    },
    ACCOUNTS: {
        NAME: '[data-test=nome]',
        FN_XP_EDIT_BTN: account => `//td[contains(., '${account}')]/following-sibling::td/i[contains(@class, 'fa-edit')]`,
        SAVE_BTN: '.btn',
        DELETE_BTN: '.fa-trash-alt',
        ACCOUNT_HEAD: 'thead > tr > :nth-child(1)'
    },
    LOGIN: {
        EMAIL: '[data-test=email]',
        PASSWORD: '[data-test=passwd]',
        SUBMIT_BTN: '.btn'
    },
    TRANSACTIONS: {
        DELETE_BTN: '.fa-trash-alt',
        SAVE_BTN: '.btn-primary',
        VALUE: '[data-test=valor]',
        SENDER_OR_RECEIVER: '[data-test=envolvido]',
        STATUS: '[data-test=status]',
        ACCOUNT: '[data-test=conta]',
        DESCRIPTION: '[data-test=descricao]',
        NEGATIVE_BTN: '.fa-thumbs-down',
        FN_XP_FIND_TRANSACTION: (description, value, isNegative) => {
            if (isNegative)
                return `//span[contains(., '${description}')]/following-sibling::small[contains(., '${value}') and contains(., '-')]`

            return `//span[contains(., '${description}')]/following-sibling::small[contains(., '${value}')]`
        },
        FN_XP_FIND_REMOVE_TRANSACTION: description => `//span[contains(., '${description}')]/../../..//i[contains(@class, 'fa-trash-alt')]`,
        FN_XP_FIND_BY_DESCRIPTION: description => `//span[contains(., '${description}')]/../../../..`
    },
    MSG: '.toast-message',
    MSG_CLOSE: '.toast-close-button',
    FN_XP_FIND_BALANCE: account => `//td[contains(., '${account}')]/../td[2]`
}

export default locators;