describe('Blog app', function() {
    it('login fails with wrong password', function(){ //removed it.only
        cy.get('#username').type('mluukkai')
        cy.get('#password').type('wrong')
        cy.get('#login').click()

    cy.contains('Wrong credentials')
    cy.get('.error').should('contain', 'Wrong credentials')
    })
    beforeEach(function(){
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            name: 'surani555',
            username: 'surani555',
            password: 'surani555'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.visit('http://localhost:3000')
    })
    it('front page can be opened', function() {
      cy.contains('Blogs')
      cy.contains('Login')
    })

    it('login form can be opened', function (){
        cy.get('input:first').type('surani555')
        cy.get('input:last').type('surani555')
        cy.get('#login').click()
        cy.contains('surani555 logged in')
    })

    describe('when logged in', function(){

        beforeEach(function(){
            cy.get('input:first').type('surani555')
            cy.get('input:last').type('surani555')
            cy.get('#login').click()
        })
        it('a new blog can be created', function(){
            cy.contains('create new blog').click()
            cy.get('#title').type('i like to party')
            cy.get('#author').type('surani555')
            cy.get('#url').type('http://meow.net')
            cy.get('#submitButton').click()
            cy.contains('i like to party')
        })

        describe('and a blog exists', function(){
            beforeEach(function(){
                cy.contains('create new blog').click()
                cy.get('#title').type('i like to party')
                cy.get('#author').type('surani555')
                cy.get('#url').type('http://meow.net')
                cy.get('#submitButton').click()
            })
            it('blogs can be expanded and liked', function(){
                cy.contains('i like to party')
                  .contains('show')
                  .click()
                  cy.get('#meow').click()
            })
            it('blogs are ordered by likes', function(){
                cy.contains('create new blog').click()
                cy.get('#title').type('i like to party2')
                cy.get('#author').type('surani555')
                cy.get('#url').type('http://meow.net')
                cy.get('#likes').type(2)
                cy.get('#submitButton').click()
                cy.contains('create new blog').click()
                cy.get('#title').type('i like to party3')
                cy.get('#author').type('surani555')
                cy.get('#url').type('http://meow.net')
                cy.get('#likes').type(3)
                cy.get('#submitButton').click()
                cy.get('.blogs').eq(0).should('contain', 'i like to party3')
            })
            it('blogs can be deleted', function(){
                cy.contains('i like to party')
                  .contains('show')
                  .click()
                cy.get('#gone').click()
            })
        })
    })
})
