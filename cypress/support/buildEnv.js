const buildEnv = () => {
    cy.server()
    cy.route({
        method: 'POST',
        url: '/signin',
        response: {
            id: 1000,
            nome: 'Usuario falso',
            token: 'Uma string muito grande que nao deveria passar mas vai'
        }
    }).as('signin')
    cy.route({
        method: 'GET',
        url: '/saldo',
        response: [
            {
                conta_id: 9090,
                conta: 'Carteira',
                saldo: '1500.00'
            },
            {
                conta_id: 9900,
                conta: 'Conta',
                saldo: '1000000.00'
            },
        ]
    }).as('balance')
    cy.route({
        method: 'GET',
        url: '/contas',
        response:
            [
                {
                    id: 1,
                    nome: 'Carteira',
                    visivel: true,
                    usuario_id: 11358
                },
                {
                    id: 2,
                    nome: 'Conta',
                    visivel: true,
                    usuario_id: 11358
                }
            ]

    }).as('accounts')

    cy.route({
        method: 'GET',
        url: '/extrato/**',
        status: 200,
        response: 'fx:fullTransactions'
    }).as('getTransactions')
}

export default buildEnv;