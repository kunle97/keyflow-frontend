describe("Test the Lease Agreements functionality", () => {
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login

    // Log in using the loaded credentials
    cy.tenantLogin();
  });

    it("Should navigate to the lease agreements page", () => {  
        cy.visit(Cypress.env("REACT_APP_HOSTNAME") + "/dashboard/tenant/lease-agreements/");
        cy.get('[data-testid="lease-agreements-table"]').should("be.visible");
        cy.get('[data-testid="lease-agreements-table-search-input"]').should("be.visible").type("test");
        cy.get('[data-testid="lease-agreements-table-search-input"]').should("be.visible").clear();
        cy.get('[data-testid="lease-agreements-table-search-input"]').should("be.visible").type(" ");
        cy.wait(1000);
        //Check if table re
        cy.get('[data-testid="lease-agreements-table-result-count"]').should("be.visible").then(($resultCount) => {
        const resultText = $resultCount.text().trim();  // Get the text content and trim whitespace
        if (resultText === "()" || resultText == "(0)") {  // Check if the text is empty
            cy.get('[data-testid="lease-agreements-table-no-results-ui-prompt"]').should("be.visible");
            cy.get('[data-testid="lease-agreements-table"]').should("not.exist");
        } else {
            cy.get('[data-testid="lease-agreements-table-no-results-ui-prompt"]').should("not.exist");
            cy.get('[data-testid="lease-agreements-table"]').should("be.visible"); 
            cy.get('[data-testid="lease-agreements-table-result-limit-select"]').should("be.visible").select("1");

            // cy.get('[data-testid="lease-agreements-table"] tbody tr').should("have.length", 1);
            cy.get('[data-testid="lease-agreements-table-result-limit-select"]').should("be.visible").select("2");
            // cy.get('[data-testid="lease-agreements-table"] tbody tr').should("have.length", 2);
            cy.get('[data-testid="lease-agreements-table-result-limit-select"]').should("be.visible").select("3");
            // cy.get('[data-testid="lease-agreements-table"] tbody tr').should("have.length", 3);
            cy.get('[data-testid="lease-agreements-table-result-limit-select"]').should("be.visible").select("5");
            // cy.get('[data-testid="lease-agreements-table"] tbody tr').should("have.length", 5);
        }
        cy.get('[data-testid="lease-agreements-table-more-button-0"]').should("be.visible").click();
        cy.get('[data-testid="lease-agreements-table-0-menu-option-0"]').should("be.visible").click();
        
        cy.get('[data-testid="total-amount-paid-label"]').should("be.visible").contains("Total Amount Paid");
        cy.get('[data-testid="total-amount-paid-value"]').should("be.visible");

        cy.get('[data-testid="total-amount-due-label"]').should("be.visible").contains("Total Amount Due");
        cy.get('[data-testid="total-amount-due-value"]').should("be.visible");

        cy.get('[data-testid="unit-name-label"]').should("be.visible").contains("Unit");
        cy.get('[data-testid="unit-name-value"]').should("be.visible");

        cy.get('[data-testid="rent-label"]').should("be.visible").contains("Rent");
        cy.get('[data-testid="rent-value"]').should("be.visible");

        cy.get('[data-testid="lease-term-label"]').should("be.visible").contains("Term");
        cy.get('[data-testid="lease-term-value"]').should("be.visible");

        cy.get('[data-testid="late-fee-label"]').should("be.visible").contains("Late Fee");
        cy.get('[data-testid="late-fee-value"]').should("be.visible");

        cy.get('[data-testid="security-deposit-label"]').should("be.visible").contains("Security Deposit");
        cy.get('[data-testid="security-deposit-value"]').should("be.visible");

        cy.get('[data-testid="gas-included-label"]').should("be.visible").contains("Gas Included");
        cy.get('[data-testid="gas-included-value"]').should("be.visible");

        cy.get('[data-testid="electric-included-label"]').should("be.visible").contains("Electric Included");
        cy.get('[data-testid="electric-included-value"]').should("be.visible");

        cy.get('[data-testid="water-included-label"]').should("be.visible").contains("Water Included");
        cy.get('[data-testid="water-included-value"]').should("be.visible");

        cy.get('[data-testid="lease-cancellation-fee-label"]').should("be.visible").contains("Lease Cancellation Fee");
        cy.get('[data-testid="lease-cancellation-fee-value"]').should("be.visible");
        
        cy.get('[data-testid="lease-cancellation-notice-period-label"]').should("be.visible").contains("Lease Cancellation Notice period");
        cy.get('[data-testid="lease-cancellation-notice-period-value"]').should("be.visible")
        
        cy.get('[data-testid="lease-renewal-fee-label"]').should("be.visible").contains("Lease Renewal Fee");
        cy.get('[data-testid="lease-renewal-fee-value"]').should("be.visible");

        cy.get('[data-testid="lease-renewal-notice-period-label"]').should("be.visible").contains("Lease Renewal Notice Period");
        cy.get('[data-testid="lease-renewal-notice-period-value"]').should("be.visible")

        cy.get('[data-testid="lease-start-date-label"]').should("be.visible").contains("Lease Start Date");
        cy.get('[data-testid="lease-start-date-value"]').should("be.visible");

        cy.get('[data-testid="lease-end-date-label"]').should("be.visible").contains("Lease End Date");
        cy.get('[data-testid="lease-end-date-value"]').should("be.visible");

        //Check Request CAncellation button
        cy.get('[data-testId="lease-cancellation-button"]').should("be.visible").click();
        cy.get('[data-testid="ui-dialog-close-button"]').should("be.visible").click();
        
        //Check Request Renewal button
        cy.get('[data-testid="lease-renewal-button"]').should("be.visible").click();
        cy.get('[data-testid="ui-dialog-close-button"]').should("be.visible").click();
        });
    });
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
