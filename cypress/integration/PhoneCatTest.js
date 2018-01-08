describe('PhoneCat Application', () => {
      beforeEach(() => {
        cy
        .visit('http://localhost:8000')
      })
      it('should redirect index.html to index.html/phones',function(){
        cy
        .visit('index.html')
        .hash()
        .should('eq','#!/phones')
      })
      it('should title be right', () => {
        cy
        .title()
        .should('eq','Google Phone Gallery')
      })
    context('View: Phone list', () => {
      beforeEach(() => {
        cy
        .ng('model','$ctrl.query').as('q')
      })
      it('should filter the phone list as a user types into the search box',() => {
        cy
        .get('ul.phones li').should('have.length',20)
        .get('@q').type('dell')
        .get('ul.phones li').should('have.length',2)
        .get('@q').clear().type('notorila')
        .get('ul.phones li').should('have.length',0)
})
      it('should control phone order via drop-down menu', () => {
        function getNames($names) {
          return $names.map(function(index, el){
            return Cypress.$(el).text()
          }).get()
        }
        cy
        .get('@q').type('tablet')
        .ng('binding', 'phone.name')
          .should(function($names){
            expect(getNames($names)).to.deep.eq [
              'Motorola XOOM™ with Wi-Fi',
              'MOTOROLA XOOM™'
            ]
          })
      })
      it('should render phone right links',() => {
        cy
         .get('@q').type('lg')
         .ng('repeater', 'phone in $ctrl.phones')
         .should('have.length',1)
         .find('a')
         .first()
         .click()
         .hash()
         .should('eq', '#!/phones/lg-axis')
      })
      it('should order alphabetical',() => {
         cy
         .ng('model', '$ctrl.orderProp')
         .select('name')
         .get('.phones')
         .children().eq(0)
         .find('p')
         .should('contain', 'Introducing Dell™ Streak 7')
      })
  })
    context('Samsung', () => {
      it('should have 5 Samsung Phones', () => {
        cy
        .get('.col-md-2')
        .find('input').type('Samsung')
        .get('.phones')
        .children().should('have.length',5)
      })
      context('Samsung Gem', () => {
        beforeEach(() => {
          cy
          .visit('http://localhost:8000/#!/phones/samsung-gem')
        })
        it('should find Samsung Gem in search', () => {
          cy
          .visit('http://localhost:8000')
          .get('.col-md-2')
          .find('input').type('Samsung Gem')
          .get('.phones')
          .first()
          .find('a')
          .contains('Samsung Gem™').click()
        })
        it('should url and hash be ok', () => {
          cy
          .url().should('eq','http://localhost:8000/#!/phones/samsung-gem')
          .hash().should('eq','#!/phones/samsung-gem')
        })
        it('should have all specs',function(){
          cy
          .get('.specs')
          .children()
          .should('have.length',10)
        })
        it('should change profile photo on click', () => {
           cy
           .get('.phone-thumbs')
           .children()
           .eq(1)
           .first()
           .click()
           .get('.phone-images')
           .children()
           .eq(1)
           .should('have.class', 'selected')

        })
      })
     })
     context('Server request', () => {
        it('should server request be right for phone links', () => {
          cy
          .request('http://localhost:8000/#!/phones/motorola-atrix-4g')
          .should((response)=>{
            expect(response.status).to.eq(200)
            expect(response.body).to.have.length(1456)
          })
        })
     })
})
