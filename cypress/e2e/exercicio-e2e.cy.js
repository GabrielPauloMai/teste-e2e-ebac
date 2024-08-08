/// <reference types="cypress" />
import ProdutosPage from "../support/page_objects/produtos.page";
context('Exercicio - Testes End-to-end - Fluxo de pedido', () => {
  /*  Como cliente 
      Quero acessar a Loja EBAC 
      Para fazer um pedido de 4 produtos 
      Fazendo a escolha dos produtos
      Adicionando ao carrinho
      Preenchendo todas opções no checkout
      E validando minha compra ao final */
  before(() => {
    cy.fixture('perfil').then(userProfile => {
      ProdutosPage.performLogin(userProfile)
    })
  });

  it('Deve fazer um pedido na loja Ebac Shop de ponta a ponta', () => {
    cy.visit('produtos')
    cy.fixture('products').then((productData) => {
      productData.products.forEach(item => {
        ProdutosPage.visitProductPage(item)
        ProdutosPage.addToCart(item)
        cy.get('.woocommerce-message').should('contain', ProdutosPage.createAddToCartMessage(item))
      })
    })
    cy.visit('checkout')
    ProdutosPage.fillCheckoutForm()
    cy.get('.woocommerce-thankyou-order-received').should('contain', 'Obrigado. Seu pedido foi recebido.')
    ProdutosPage.verifyOrderDetails()
  });
});
