/// <reference types="cypress" />
import ProdutosPage from "../support/page_objects/produtos.page";
context('Exercicio - Testes End-to-end - Fluxo de pedido', () => {
  before(() => {
    cy.fixture('perfil').then(userProfile => {
      ProdutosPage.performLogin(userProfile)
    })
  });

  it('Deve fazer um pedido na loja Ebac Shop de ponta a ponta', () => {
    const checkoutData = ProdutosPage.generateCheckoutData()
    let productsAdded = []
    cy.visit('produtos')
    cy.fixture('products').then((productData) => {
      productData.products.forEach(item => {
        ProdutosPage.visitProductPage(item)
        productsAdded.push(ProdutosPage.addToCart(item))
        cy.get('.woocommerce-message').should('contain', ProdutosPage.createAddToCartMessage(item))
      })
    })
    cy.visit('checkout')
    ProdutosPage.fillCheckoutForm(checkoutData)
    cy.get('.woocommerce-thankyou-order-received').should('contain', 'Obrigado. Seu pedido foi recebido.')

    cy.fixture('products').then((products) => {
      products.products.forEach(product => {
        productsAdded.push(product)
      })
    })

    ProdutosPage.verifyOrderDetails(productsAdded)
    ProdutosPage.verifyCheckoutData(checkoutData)
  });
});
