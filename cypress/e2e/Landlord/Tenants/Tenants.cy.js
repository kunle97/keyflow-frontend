describe("Test the tenants page and the tenants table", () => {
  ///Crewate a preperation function that runs before each test
  beforeEach(() => {
    // Set viewport size
    cy.viewport(1920, 1080);
    // Log in using the loaded credentials
    cy.login();
  });

  it("Should navigate to the tenants page", () => {
    cy.visit(Cypress.env("REACT_APP_HOSTNAME") + "/dashboard/owner/tenants/");
    // Check if the page contains the text "Tenants"
    cy.contains("Tenants");
    cy.get('[data-testid="tenants-table"]').should("be.visible");
    cy.get('[data-testid="tenant-row-more-button-0"]').should("be.visible").click();
    cy.get('[data-testid="tenant-row-0-menu-option-0"]').should("be.visible").click();
    cy.get('[data-testid="page-header-title"]').should("be.visible");
    cy.get('[data-testid="page-header-subtitle"]').should("be.visible");

    cy.get('[data-testid="ui-page-header-menu-button"]').should("be.visible").click();
    cy.get('[data-testid="ui-page-header-menu-item-0"]').should("be.visible");
    cy.get('[data-testid="ui-page-header-menu-item-1"]').should("be.visible");


    cy.wait(1500);
    
    //Autoswitch test
    cy.get('[data-testid="auto-pay-switch-stack"]').should("be.visible");
    cy.get('[data-testid="auto-pay-switch-label"]').should("be.visible");
    cy.get('[data-testid="auto-pay-switch"]').should("be.visible").click().click();
    
    //Check detail card on overview tab
    cy.get('[data-testid="overview-tab"]').should("be.visible").click();
    cy.get('[data-testid="tenant-property-detail-card"]').should("be.visible");
    cy.get('[data-testid="tenant-property-detail-card-title"]').should("be.visible");
    cy.get('[data-testid="tenant-property-detail-card-info"]').should("be.visible");

    cy.get('[data-testid="tenant-unit-detail-card"]').should("be.visible");
    cy.get('[data-testid="tenant-unit-detail-card-title"]').should("be.visible");
    cy.get('[data-testid="tenant-unit-detail-card-info"]').should("be.visible");
    
    cy.get('[data-testid="tenant-lease-start-detail-card"]').should("be.visible");
    cy.get('[data-testid="tenant-lease-start-detail-card-title"]').should("be.visible");
    cy.get('[data-testid="tenant-lease-start-detail-card-info"]').should("be.visible");
    
    cy.get('[data-testid="tenant-lease-end-detail-card"]').should("be.visible");
    cy.get('[data-testid="tenant-lease-end-detail-card-title"]').should("be.visible");
    cy.get('[data-testid="tenant-lease-end-detail-card-info"]').should("be.visible");
    
    cy.get('[data-testid="tenant-next-payment-detail-card"]').should("be.visible");
    cy.get('[data-testid="tenant-next-payment-detail-card-title"]').should("be.visible");
    cy.get('[data-testid="tenant-next-payment-detail-card-info"]').should("be.visible");
    
    cy.get('[data-testid="tenant-time-left-detail-card"]').should("be.visible");
    cy.get('[data-testid="tenant-time-left-detail-card-title"]').should("be.visible");
    cy.get('[data-testid="tenant-time-left-detail-card-info"]').should("be.visible");


    //Check rent calendar tab
    cy.get('[data-testid="rent-calendar-tab"]').should("be.visible").click();
    cy.get('[data-testid="rent-calendar"]').should("be.visible");

    //Check transactions tab
    cy.get('[data-testid="transactions-tab"]').should("be.visible").click();
    cy.get('[data-testid="transactions-table-result-count"]').should("be.visible").then(($resultCount) => {
        const resultText = $resultCount.text().trim();  // Get the text content and trim whitespace
        if (resultText === "()" || resultText == "(0)") {  // Check if the text is empty
            cy.get('[data-testid="transactions-table-no-results-ui-prompt"]').should("be.visible");
            cy.get('[data-testid="transactions-table"]').should("not.exist");
        } else {
            cy.get('[data-testid="transactions-table-no-results-ui-prompt"]').should("not.exist");
            cy.get('[data-testid="transactions-table"]').should("be.visible"); 
        }
    });

    //Check maintenance requests tab
    cy.get('[data-testid="maintenance-requests-tab"]').should("be.visible").click();
    cy.get('[data-testid="maintenance-requests-table-result-count"]').should("be.visible").then(($resultCount) => {
        const resultText = $resultCount.text().trim();  // Get the text content and trim whitespace
        if (resultText === "()" || resultText == "(0)") {  // Check if the text is empty
            cy.get('[data-testid="maintenance-requests-table-no-results-ui-prompt"]').should("be.visible");
            cy.get('[data-testid="maintenance-requests-table"]').should("not.exist");
        } else {
            cy.get('[data-testid="maintenance-requests-table-no-results-ui-prompt"]').should("not.exist");
            cy.get('[data-testid="maintenance-requests-table"]').should("be.visible"); 
        }
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
