class ProdutosPage {

    /**
     * @typedef {Object} Product
     * @property {string} productName
     * @property {string} productSize
     * @property {string} productColor
     * @property {number} productQuantity
     */
  
    /**
     * @typedef {Object} UserAuth
     * @property {string} login
     * @property {string} password
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
     * @returns {void}
     */
    addToCart(product) {
      cy.get(`.button-variable-item-${product.productSize}`).click()
      cy.get(`.button-variable-item-${product.productColor}`).click()
      cy.get('.input-text').clear().type(product.productQuantity)
      cy.get('.single_add_to_cart_button').click()
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
     * @returns {void}
     */
    fillCheckoutForm() {
      const checkoutData = {
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
      cy.get('#order_comments').type('Por favor, enviar o mais rápido possível!')
      cy.get('#terms').check()
      cy.get('#place_order').click()
      cy.get('.woocommerce-thankyou-order-received').should('contain', 'Obrigado. Seu pedido foi recebido.')
    }
  
    /**
     * @returns {void}
     */
    verifyOrderDetails() {
      cy.fixture('products').then((productData) => {
        productData.products.forEach((product, index) => {
          cy.get('.order_item').eq(index).within(() => {
            cy.get('.product-name').should('contain', `${product.productName} - ${product.productSize} - ${product.productColor}`)
            cy.get('.product-quantity').should('contain', product.productQuantity)
          })
        })
      })
    }
  }
  
  export default new ProdutosPage()
  