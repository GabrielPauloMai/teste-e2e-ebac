class ProdutosPage {

/**
 * @typedef {Object} Product
 * @property {string} productName
 * @property {string} productSize
 * @property {string} productColor
 * @property {number} productQuantity
 */

/**
 *@ typedef {Object} Auth
 * @property {string} login
 * @property {string} password
 */


/**
 *@param {Auth} auth
 * @returns {void}
 */
    login(auth) {
        cy.visit('minha-conta')
        cy.login(auth.login, auth.password)
        cy.get('.page-title').should('contain', 'Minha conta')
    }


/**
 * @param {Product} product
 * @returns {void}
 * */
    visitarProduto(product) {
        cy.visit(`produtos/${product.productName.replace(/ /g, '-')}`)
    }


    /**
     *@param {Product} product
     *@returns {void}
     */
    adicionarProdutoCarrinho(product) {
        cy.get(`.button-variable-item-${product.productSize}`).click()
        cy.get(`.button-variable-item-${product.productColor}`).click()
        cy.get('.input-text').clear().type(product.productQuantity)
        cy.get('.single_add_to_cart_button').click()

    }
    /**
     * @param {Product} product
     * @returns {string}
     */
    criarMessage(product) {
        if (product.productQuantity === 1) return `“${product.productName}” foi adicionado no seu carrinho.`
        return `${product.productQuantity} × “${product.productName}” foram adicionados no seu carrinho.`
    }

    /**
     *
     */
    checkDetails(products) {

        cy.each((product) => {
            cy.get('.woocommerce-message').should('contain', this.criarMessage(product))
        })

        cy.get('.order_item').each(($el, index, $list) => {
            let productName = $el.find('.product-name').text()
            let productQuantity = $el.find('.product-quantity').text()

            expect(productName).to.be.equal(`${products[index].productName} - ${products[index].productSize} - ${products[index].productColor} x ${products[index].productQuantity} `)
            expect(productQuantity).to.be.equal(product.productQuantity)
        })
    }


    /**
     * @returns {void}
     */
    preencherFormulario(){

        let checkout= {
            firstName: 'João',
            lastName: 'Silva',
            company: 'EBAC',
            country: 'Brasil',
            address: 'Av. Paulista',
            complement: '3º andar',
            city: 'São Paulo',
            state: 'São Paulo',
            zip: '01310-100',
            phone: '11999999999'
        }


        cy.get('#billing_company').clear().type(checkout.company)
        cy.get('#select2-billing_country-container').click()
        cy.get('.select2-search__field').type(checkout.country)
        cy.get('.select2-results__option').first().click()
        cy.get('#billing_address_1').clear().type(checkout.address)

        cy.get('#billing_address_2').clear().type(checkout.complement)
        cy.get('#billing_city').clear().type(checkout.city)
        cy.get('#select2-billing_state-container').click()
        cy.get('.select2-search__field').type(checkout.state)
        cy.get('.select2-results__option').first().click()
        cy.get('#billing_postcode').clear().type(checkout.zip)
        cy.get('#billing_phone').clear().type(checkout.phone)
        cy.get('#order_comments').type('Por favor, enviar o mais rápido possível!')

        cy.get('#terms').check()

        cy.get('#place_order').click()
        cy.get('.woocommerce-thankyou-order-received').should('contain', 'Obrigado. Seu pedido foi recebido.')
        
    }
}
export default new ProdutosPage()