describe("Test the Bills functionality", () => {
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login

    // Log in using the loaded credentials
    cy.tenantLogin();
  });

  it("Should navigate to bills page", () => {
    // Click on the Maintenance Request link
    cy.visit("/dashboard/tenant/bills");
    cy.get('[data-testid="tenant-bills-table"]').should("be.visible");
    cy.get('[data-testid="tenant-bills-table-search-input"]').should("be.visible").type("test");
    cy.get('[data-testid="tenant-bills-table-search-input"]').should("be.visible").clear();
    cy.get('[data-testid="tenant-bills-table-search-input"]').should("be.visible").type(" ");   

    cy.get('[data-testid="tenant-bills-table-result-limit-select"]').should("be.visible").select("1");
    // cy.get('[data-testid="tenant-bills-table"] tbody tr').should("have.length", 1);
    cy.get('[data-testid="tenant-bills-table-result-limit-select"]').should("be.visible").select("2");
    // cy.get('[data-testid="tenant-bills-table"] tbody tr').should("have.length", 2);
    cy.get('[data-testid="tenant-bills-table-result-limit-select"]').should("be.visible").select("3");
    // cy.get('[data-testid="tenant-bills-table"] tbody tr').should("have.length", 3);
    cy.get('[data-testid="tenant-bills-table-result-limit-select"]').should("be.visible").select("5");
    // cy.get('[data-testid="tenant-bills-table"] tbody tr').should("have.length", 5);
    cy.get('[data-testid="tenant-bills-table-result-limit-select"]').should("be.visible").select("10");
    // cy.get('[data-testid="tenant-bills-table"] tbody tr').should("have.length", 10);
    
    cy.wait(1000);
    
    cy.get('[data-testid="tenant-bills-table-row-more-button-0"]').should("be.visible").click();
    cy.get('[data-testid="tenant-bills-table-row-0-menu-option-0"]').should("be.visible").contains("Details").click();

    cy.get('[data-testid="invoice-type"]').should("be.visible");
    cy.get('[data-testid="invoice-amount-due"]').should("be.visible");
    cy.get('[data-testid="invoice-line-item-0"]').should("be.visible");
    cy.get('[data-testid="invoice-line-item-0-description"]').should("be.visible");
    cy.get('[data-testid="invoice-line-item-0-quantity"]').should("be.visible");
    cy.get('[data-testid="invoice-line-item-0-amount"]').should("be.visible");


    cy.get('[data-testid="invoice-balance-label"]').should("be.visible");
    cy.get('[data-testid="invoice-balance"]').should("be.visible");
    
    cy.get('[data-testid="invoice-amount-paid-label"]').should("be.visible");
    cy.get('[data-testid="invoice-amount-paid"]').should("be.visible");


    cy.get('[data-testid="view-details-button"]').should("be.visible");
    cy.get('[data-testid="pay-now-details"]').should("be.visible");

    cy.get('[data-testid="back-button"]').should("be.visible").click();

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
