import fakerBr from 'faker-br';
class ProdutosPage {

    /**
     * @typedef {Object} Product
     * @property {string} productName
     * @property {string} productSize
     * @property {string} productColor
     * @property {number} productQuantity
     * @property {float} productPrice
     */

    /**
     * @typedef {Object} UserAuth
     * @property {string} login
     * @property {string} password
     */

    /**
     * @typedef {Object} CheckoutData
     * @property {string} company
     * @property {string} country
     * @property {string} address
     * @property {string} complement
     * @property {string} city
     * @property {string} state
     * @property {string} zip
     * @property {string} phone
     * @property {string} orderComments
     */


    /**
     * @param {UserAuth} userAuth
     * @returns {void}
     */
    performLogin(userAuth) {
        cy.visit('minha-conta')
        cy.login(userAuth.login, userAuth.password)
        cy.get('.page-title').should('contain', 'Minha conta')
    }

    /**
     * @param {Product} product
     * @returns {void}
     */
    visitProductPage(product) {
        cy.visit(`produtos/${product.productName.replace(/ /g, '-')}`)
    }

    /**
     * @param {Product} product
     * @returns {Product}
     */
    addToCart(product) {
        cy.get(`.button-variable-item-${product.productSize}`).click()
        cy.get(`.button-variable-item-${product.productColor}`).click()
        cy.get('.input-text').clear().type(product.productQuantity)
        cy.get('.price').first().invoke('text').then((text) => {
            product.productPrice = parseFloat(text.replace('R$', ''))
        })
        cy.get('.single_add_to_cart_button').click()

        return product
    }

    /**
     * @param {Product} product
     * @returns {string}
     */
    createAddToCartMessage(product) {
        if (product.productQuantity === 1) {
            return `“${product.productName}” foi adicionado no seu carrinho.`
        }
        return `${product.productQuantity} × “${product.productName}” foram adicionados no seu carrinho.`
    }

    /**
     * @param {CheckoutData} checkoutData
     * @returns {void}
     */
    fillCheckoutForm(checkoutData) {
        cy.get('#billing_company').clear().type(checkoutData.company)
        cy.get('#select2-billing_country-container').click()
        cy.get('.select2-search__field').type(checkoutData.country)
        cy.get('.select2-results__option').first().click()
        cy.get('#billing_address_1').clear().type(checkoutData.address)
        cy.get('#billing_address_2').clear().type(checkoutData.complement)
        cy.get('#billing_city').clear().type(checkoutData.city)
        cy.get('#select2-billing_state-container').click()
        cy.get('.select2-search__field').type(checkoutData.state)
        cy.get('.select2-results__option').first().click()
        cy.get('#billing_postcode').clear().type(checkoutData.zip)
        cy.get('#billing_phone').clear().type(checkoutData.phone)
        cy.get('#order_comments').type(checkoutData.orderComments)
        cy.get('#terms').check()
        cy.get('#place_order').click()
        cy.get('.woocommerce-thankyou-order-received').should('contain', 'Obrigado. Seu pedido foi recebido.')
    }

    /**
     * @param {Product[]} products
     * @returns {void}
     */
    verifyOrderDetails(products) {
        cy.get('.order_item').as('orderItems').each(($el, index) => {
            cy.get('@orderItems').eq(index).within(() => {
                cy.get('.product-name').then((text) => {
                    let product = this.splitLine(text)
                    let productDataItem = products[index]
                    expect(product.productName).to.equal(productDataItem.productName)
                    expect(product.productSize).to.equal(productDataItem.productSize)
                    expect(product.productColor).to.equal(productDataItem.productColor)
                    expect(product.productQuantity).to.equal(productDataItem.productQuantity)
                })
                cy.get('.woocommerce-Price-amount > bdi').then((value) => {
                    let productPrice = parseFloat(value.text().replace('R$', ''))
                    let productDataItem = products[index]
                    expect(productPrice).to.equal(productDataItem.productPrice * productDataItem.productQuantity)
                })
            })
        })
    }


    /**
     *@param {checkoutData} checkoutData
     * @returns {void}
     */
    verifyCheckoutData(checkoutData){
        cy.get('address').invoke('html').then((text) => {
            let infosClient = text.split('<br>')

            expect(infosClient[1]).to.contain(checkoutData.company)
            expect(infosClient[2]).to.contain(checkoutData.address)
            expect(infosClient[3]).to.contain(checkoutData.complement)
            expect(infosClient[4]).to.contain(checkoutData.city)
            expect(infosClient[5]).to.contain(checkoutData.state)
            expect(infosClient[6]).to.contain(checkoutData.zip)

        })
    }


    /**
     * @param {string} line
     * @returns {Product}
     */
    splitLine(line) {
        let productDescription = line.find('a').text()
        return {
            productName: productDescription.split(' - ')[0],
            productSize: productDescription.split(' - ')[1].split(',')[0],
            productColor: productDescription.split(',')[1].trim(),
            productQuantity: parseInt(line.find('.product-quantity').text().split('×')[1].trim())
        }
    }


    /**
     *
     * @returns {CheckoutData}
     */
    generateCheckoutData() {
        return {
            company: fakerBr.company.companyName(),
            country: 'Brasil',
            state: fakerBr.address.state(),
            zip: fakerBr.address.zipCode(),
            address: fakerBr.address.streetName(),
            complement: fakerBr.address.secondaryAddress(),
            city: fakerBr.address.city(),
            phone: fakerBr.phone.phoneNumber(),
            orderComments: fakerBr.lorem.sentence()
        }
    }
}
export default new ProdutosPage()
