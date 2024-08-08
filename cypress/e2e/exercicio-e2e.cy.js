/// <reference types="cypress" />
import produtosPage from "../support/page_objects/produtos.page";
context('Exercicio - Testes End-to-end - Fluxo de pedido', () => {
  /*  Como cliente 
      Quero acessar a Loja EBAC 
      Para fazer um pedido de 4 produtos 
      Fazendo a escolha dos produtos
      Adicionando ao carrinho
      Preenchendo todas opções no checkout
      E validando minha compra ao final */
   before(() => {
      cy.fixture('perfil').then(perfil => {
         produtosPage.login(perfil)
      })

  });


  it('Deve fazer um pedido na loja Ebac Shop de ponta a ponta', () => {
      cy.visit('produtos')
      cy.fixture('products').then((productsGroup) => {
          let products = productsGroup.products
          products.forEach(product => {
                produtosPage.visitarProduto(product)
                produtosPage.adicionarProdutoCarrinho(product)
                cy.get('.woocommerce-message').should('contain', produtosPage.criarMessage(product))
          })
      })
      cy.visit('checkout')
      produtosPage.preencherFormulario()
      cy.get('.woocommerce-thankyou-order-received').should('contain', 'Obrigado. Seu pedido foi recebido.')

      produtosPage.checkDetails()
  });

});