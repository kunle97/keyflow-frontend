
describe("Test the Notifications functionality for Tenants", () => {
    beforeEach(() => {
      // Log user out
      cy.viewport(1920, 1080);
      //Log the user in using the cypress command login
  
      // Log in using the loaded credentials
      cy.tenantLogin();
    });

    it("Should navigate to notifications", () => {
        cy.visit("/dashboard/notifications");
        cy.get("[data-testid='bell-icon']").click();
        cy.get("#content > div > div.container > nav > div > ul > li.nav-item.dropdown.no-arrow.mx-1.notification-topbar-icon > div > div").should("be.visible");
        cy.get('.dropdown-header').should("be.visible");
        cy.get(':nth-child(2) > .small').should("be.visible");
        cy.get('p').should("be.visible");
        cy.get('.dropdown-menu > .text-center').should("be.visible");
        cy.get('.bg-primary').should("be.visible");
        cy.get('[data-testid="notifications-table-result-count"]').should("be.visible");
        cy.get('[data-testid="notifications-table-result-count"]').should("be.visible");
        cy.get('h3').should("be.visible");
        cy.get('[data-testid="notifications-table-search-input"]').should("be.visible");
        cy.get('#header > :nth-child(1) > :nth-child(2) > :nth-child(2)').should("be.visible");
        cy.get('[data-testid="notifications-table-result-limit-select"]').should("be.visible");
        cy.get('#header > :nth-child(1) > :nth-child(2) > :nth-child(4)').should("be.visible");
        cy.get('#header > :nth-child(1) > :nth-child(2)').should("be.visible");
        cy.get('thead > tr > :nth-child(1)').should("be.visible");
        cy.get('thead > tr > :nth-child(2)').should("be.visible");
        cy.get('thead > tr > :nth-child(2)').should("be.visible");
        cy.get('thead > tr > :nth-child(4)').should("be.visible");
        cy.get('thead > tr > :nth-child(5)').should("be.visible");
        cy.get('tr > :nth-child(1) > .MuiButtonBase-root').should("be.visible");
        cy.get(':nth-child(2) > .MuiButtonBase-root').should("be.visible");
        cy.get(':nth-child(3) > .MuiButtonBase-root').should("be.visible");
        cy.get(':nth-child(4) > .MuiButtonBase-root').should("be.visible");
        cy.get('[data-testid="notifications-table-row-table-row-0-column-title"]').should("be.visible");
        cy.get('[data-testid="notifications-table-row-table-row-0-column-message"]').should("be.visible");
        cy.get('[data-testid="notifications-table-row-table-row-0-column-is_read"]').should("be.visible");
        cy.get('[data-testid="notifications-table-row-table-row-0-column-timestamp"]').should("be.visible");
        cy.get('[data-testid="notifications-table-row-table-row-0-column-timestamp"] > span').should("be.visible");
        cy.get('[data-testid="notifications-table-row-more-button-0"]').should("be.visible");
        cy.get('.ui-table-more-button').should("be.visible");
        cy.get('[data-testid="notifications-table-row-table-row-0"] > :nth-child(5)').should("be.visible");
        cy.get('[style="width: 100%; overflow-x: auto; padding: 0px 15px;"]').should("be.visible");
        
        


    })
    afterEach(() => {
        cy.wait(1000);
        //REtrieve the auth object from the getAuth command
        cy.getAuth().then((auth) => {
          // Log user out witht the cypress command logout
          cy.logout(auth.token);
          //Navigate to the homepage
          cy.visit(Cypress.env("REACT_APP_HOSTNAME") + "/");
        });
      });
    });
    