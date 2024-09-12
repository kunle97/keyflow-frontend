describe("Test all basic functions of the transactions list and detail page", () => {
    ///Crewate a preperation function that runs before each test
    beforeEach(() => {
      // Set viewport size
      cy.viewport(1920, 1080);
      // Log in using the loaded credentials
      cy.login();
    });

    it("Should navigate to the owner transactions page", () => {
        cy.visit(Cypress.env("REACT_APP_HOSTNAME")  + "/dashboard/owner/transactions/");
        cy.get('[data-testid="stripe-dashboard-button"]').should("be.visible");
        // cy.get('[data-testid="stripe-dashboard-button"]').should("be.visible").click();
        // cy.go("back");

        cy.get('[data-testid="transactions-table"]').should("be.visible");
        cy.get('[data-testid="transactions-table-search-input"]').should("be.visible").type("test");
        cy.get('[data-testid="transactions-table-search-input"]').should("be.visible").clear();
        cy.get('[data-testid="transactions-table-search-input"]').should("be.visible").type(" ");
        cy.wait(1000);
        //Check if table results are displayed

        cy.get('[data-testid="transactions-table-row-more-button-0"]').should("be.visible").click();
        cy.get('[data-testid="transactions-table-row-0-menu-option-0"]').should("be.visible").click();

        cy.get('[data-testid="transaction-detail-card"]').should("be.visible");
        cy.get('[data-testid="transaction-detail-card-title"]').should("be.visible");

        cy.get('[data-testid="amount-label"]').should("be.visible");
        cy.get('[data-testid="amount-value"]').should("be.visible");
        

        cy.get('[data-testid="type-label"]').should("be.visible");
        cy.get('[data-testid="type-value"]').should("be.visible");

        cy.get('[data-testid="amount-label"]').should("be.visible");
        cy.get('[data-testid="amount-value"]').should("be.visible");

        cy.get('[data-testid="date-label"]').should("be.visible");
        cy.get('[data-testid="date-value"]').should("be.visible");

        cy.get('[data-testid="description-label"]').should("be.visible");
        cy.get('[data-testid="description-value"]').should("be.visible");

        cy.get('[data-testid="view-billing-entry-link"]').should("be.visible").click();
    });


    afterEach(() => {
      cy.wait(1000);
      //REtrieve the auth object from the getAuth command
      cy.getAuth().then((auth) => {
        // Log user out witht the cypress command logout
        cy.logout(auth.token);
        //Navigate to the homepage
        cy.visit(Cypress.env("REACT_APP_HOSTNAME")  + "/");
      });
    });
  });
  