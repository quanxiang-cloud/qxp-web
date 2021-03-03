describe('密码登录', () => {
  beforeEach(function() {
    cy.visit('http://newtitan.localhost/login/password')
  }) 

  it('输入不合法的用户名', function() {
    cy.get('input[name="username"]').type("wrong").blur()
    cy.get('.username-hints').contains("请输入有效的邮箱或手机号")
    cy.get('.btn-login').should('have.class', 'disabled')
  })

  it('输入不合法的密码', function() {
    cy.get('input[name="password"]').type('12345').blur()
    cy.get('.password-hints').contains('密码至少为6位')
    cy.get('.btn-login').should('have.class', 'disabled')
  })

  it('输入正确的用户名密码', function () {
    cy.get('input[name="username"]').type("admin@yunify.com")
    cy.get('input[name="password"]').type("123456").blur()
    cy.get('.btn-login').should('not.have.class', 'disabled').click()
    cy.url().should('eq', 'http://newtitan.localhost/')
  })

  it('退出登录', function () {
    cy.get('input[name="username"]').type("admin@yunify.com")
    cy.get('input[name="password"]').type("123456").blur()
    cy.get('.btn-login').should('not.have.class', 'disabled').click()
    cy.url().should('eq', 'http://newtitan.localhost/')
    cy.get('button[type="submit"]').click()
    cy.url().should('eq', 'http://newtitan.localhost/login/password')
  })
})
