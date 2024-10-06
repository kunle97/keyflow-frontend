describe("Test all the owner lease agrrements page", () => {
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login
    // Load login credentials from the fixture
    cy.fixture("loginCredentials").as("credentials");

    // Log in using the loaded credentials
    cy.login();
  });

  it("should navigate to lease agreements and test features", () => {
    cy.visit(Cypress.env("REACT_APP_HOSTNAME") + "/dashboard/owner/lease-agreements/");
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
          //Calculate the number of <tr> elements in the table
          // cy.get('[data-testid="lease-agreements-table"] tbody tr').should("have.length", 1);
          cy.get('[data-testid="lease-agreements-table-result-limit-select"]').should("be.visible").select("2");
          // cy.get('[data-testid="lease-agreements-table"] tbody tr').should("have.length", 2);
          cy.get('[data-testid="lease-agreements-table-result-limit-select"]').should("be.visible").select("3");
          // cy.get('[data-testid="lease-agreements-table"] tbody tr').should("have.length", 3);
          cy.get('[data-testid="lease-agreements-table-result-limit-select"]').should("be.visible").select("5");
          // cy.get('[data-testid="lease-agreements-table"] tbody tr').should("have.length", 5);
      }
      cy.get('[data-testid="lease-agreements-table-row-more-button-0"]').should("be.visible").click();
      cy.get('[data-testid="lease-agreements-table-row-0-menu-option-0"]').should("be.visible").click();
    
      cy.get('[data-testid="property-detail-card"]').should("be.visible");
      cy.get('[data-testid="property-detail-card-title"]').should("be.visible");
      cy.get('[data-testid="property-detail-card-info"]').should("be.visible");

      cy.get('[data-testid="rent-detail-card"]').should("be.visible");
      cy.get('[data-testid="rent-detail-card-info"]').should("be.visible");
      cy.get('[data-testid="rent-detail-card-title"]').should("be.visible");

      cy.get('[data-testid="status-detail-card"]').should("be.visible");
      cy.get('[data-testid="status-detail-card-title"]').should("be.visible");
      cy.get('[data-testid="status-detail-card-info"]').should("be.visible");

      cy.get('[data-testid="unit-detail-card"]').should("be.visible");
      cy.get('[data-testid="unit-detail-card-title"]').should("be.visible");
      cy.get('[data-testid="unit-detail-card-info"]').should("be.visible");

      cy.get('[data-testid="sign-date-detail-card"]').should("be.visible");
      cy.get('[data-testid="sign-date-detail-card-title"]').should("be.visible");
      cy.get('[data-testid="sign-date-detail-card-info"]').should("be.visible");

      cy.get('[data-testid="lease-end-detail-card"]').should("be.visible");
      cy.get('[data-testid="lease-end-detail-card-title"]').should("be.visible");
      cy.get('[data-testid="lease-end-detail-card-info"]').should("be.visible");

      cy.get('[data-testid="lease-term-detail-card"]').should("be.visible");
      cy.get('[data-testid="lease-term-detail-card-title"]').should("be.visible");
      cy.get('[data-testid="lease-term-detail-card-info"]').should("be.visible");

      cy.get('[data-testId="auto-pay-enabled-label"]').should("be.visible");
      cy.get('[data-testId="auto-pay-enabled-value"]').should("be.visible");

      cy.get('[data-testId="rent-due-label"]').should("be.visible");
      cy.get('[data-testId="rent-due-value"]').should("be.visible");
      cy.get('[data-testId="download-document-button"]').should("be.visible").click();
      cy.get('[data-testid="lease-agreement-calendar-card"]').should("be.visible");

  });


    
  });

  afterEach(() => {
    cy.wait(1000);
    //REtrieve the auth object from the getAuth command
    cy.getAuth().then((auth) => {
      // Log user out witht the cypress command logout
      cy.logout(auth.token);
      //Navigate to ethe homepage
      cy.visit(Cypress.env("REACT_APP_HOSTNAME") + "/");
    });
  });
});
