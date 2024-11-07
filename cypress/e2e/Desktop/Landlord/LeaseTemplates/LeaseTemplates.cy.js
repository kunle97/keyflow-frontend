describe("Test the fucntionality of the lease templates list page", () => {
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login

    // Log in using the loaded credentials
    cy.login();
  });
  
  // it("Should check if lease templates list page loads correctly", () => {
  //   // Log user out visit this /dashboard/logout
  //   cy.visit(Cypress.env("REACT_APP_HOSTNAME") + "/dashboard/owner/lease-templates");
  //   cy.get('[data-testid="lease-templates-table"]').should("be.visible");
  //   cy.get('[data-testid="lease-templates-table-title"]').should("be.visible").contains("Lease Templates");
  //   cy.get('[data-testid="lease-templates-table-search-input"]').should("be.visible");
  //   cy.get('[data-testid="ui-table-mobile-create-button"]').should("be.visible");
  //   cy.wait(5000);
  // });
  
  it("Should check the manage lease template page", () => {
    cy.visit(Cypress.env("REACT_APP_HOSTNAME") + "/dashboard/owner/lease-templates");
    cy.get('[data-testid="lease-templates-more-button-0"]').click();
    cy.get('[data-testid="lease-templates-0-menu-option-0"]').should("be.visible").click();

    cy.get('[data-testid="rent-input-label"]').should("be.visible").contains("Rent");
    cy.get('[data-testid="rent-input"]').should("be.visible");

    cy.get('[data-testid="rent-frequency-select-label"]').should("be.visible").contains("Rent Frequency");
    cy.get('[data-testid="rent-frequency-select"]').should("be.visible");
    

    cy.get('[data-testid="term-input-label"]').should("be.visible").contains("Term");
    cy.get('[data-testid="term-input"]').should("be.visible");

    cy.get('[data-testid="late-fee-input-label"]').should("be.visible").contains("Late Fee");
    cy.get('[data-testid="late-fee-input"]').should("be.visible");

    cy.get('[data-testid="security-deposit-input-label"]').should("be.visible").contains("Security Deposit");
    cy.get('[data-testid="security-deposit-input"]').should("be.visible");

    cy.get('[data-testid="gas-included-select-label"]').should("be.visible").contains("Gas Included");
    cy.get('[data-testid="gas-included-select"]').should("be.visible");

    cy.get('[data-testid="water-included-select-label"]').should("be.visible").contains("Water Included");
    cy.get('[data-testid="water-included-select"]').should("be.visible");

    cy.get('[data-testid="electric-included-select-label"]').should("be.visible").contains("Electric Included");
    cy.get('[data-testid="electric-included-select"]').should("be.visible");

    cy.get('[data-testid="repairs-included-select-label"]').should("be.visible").contains("Repairs Included");
    cy.get('[data-testid="repairs-included-select"]').should("be.visible");

    cy.get('[data-testid="grace-period-input-label"]').should("be.visible").contains("Grace Period");
    cy.get('[data-testid="grace-period-input"]').should("be.visible");

    cy.get('[data-testid="lease-cancellation-notice-period-input-label"]').should("be.visible").contains("Lease Cancellation Notice Period");
    cy.get('[data-testid="lease-cancellation-notice-period-input"]').should("be.visible");

    cy.get('[data-testid="lease-cancellation-fee-input-label"]').should("be.visible").contains("Lease Cancellation Fee");
    cy.get('[data-testid="lease-cancellation-fee-input"]').should("be.visible");

    cy.get('[data-testid="lease-renewal-notice-period-input-label"]').should("be.visible").contains("Lease Renewal Notice Period");
    cy.get('[data-testid="lease-renewal-notice-period-input"]').should("be.visible");

    cy.get('[data-testid="lease-renewal-fee-input-label"]').should("be.visible").contains("Lease Renewal Fee");
    cy.get('[data-testid="lease-renewal-fee-input"]').should("be.visible");

    //Switch to additional charges tab
    cy.get('[data-testid="additional-charges-tab"]').should("be.visible").click();
    cy.get('[data-testid="units-assigned-tab"]').should("be.visible").click();
    cy.get('[data-testid="edit-document-tab"]').should("be.visible").click();
    cy.wait(3000);
    cy.get('[data-testid="details-tab"]').should("be.visible").click();
    
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
