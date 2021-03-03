describe('验证码登录', function() {
  beforeEach(function() {
    cy.visit('http://newtitan.localhost/login/captcha')
  })

  it('输入不合法的用户名', function() {
    cy.get('input[name="username"]').type('wrong').blur()
    cy.get('.username-hints').contains('请输入有效的邮箱或手机号')
    cy.get('.btn-login').should('have.class', 'disabled')
  })

  it('输入不合法的验证码', function() {
    cy.get('input[name="captcha"]').type('12345').blur() 
    cy.get('.captcha-hints').contains('验证码至少为6位')
    cy.get('.btn-login').should('have.class', 'disabled')
  })

  it('输入正确的用户名验证码', function() {
    cy.get('input[name="username"]').type('admin@yunify.com')
    const date = new Date()
    cy.get('input[name="captcha"]').type(`${`${date.getMonth() + 1}`.padStart(2, '0')}${`${date.getDay()}`.padStart(2, '0')}${`${date.getHours()}`.padStart(2, '0')}`).blur()
    cy.get('.btn-login').should('not.have.class', 'disabled').click()
    cy.url().should('eq', 'http://newtitan.localhost/')
  })

  it('退出登录', function() {
    cy.get('input[name="username"]').type('admin@yunify.com')
    const date = new Date()
    cy.get('input[name="captcha"]').type(`${`${date.getMonth() + 1}`.padStart(2, '0')}${`${date.getDay()}`.padStart(2, '0')}${`${date.getHours()}`.padStart(2, '0')}`).blur()
    cy.get('.btn-login').should('not.have.class', 'disabled').click()
    cy.url().should('eq', 'http://newtitan.localhost/')
    cy.get('button[type="submit"]').click()
    cy.url().should('eq', 'http://newtitan.localhost/login/password')
  })
})
