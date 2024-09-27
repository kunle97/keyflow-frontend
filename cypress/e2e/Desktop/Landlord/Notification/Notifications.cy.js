describe("Test all the owner maintenence request features", () => {
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login
    // Load login credentials from the fixture
    cy.fixture("loginCredentials").as("credentials");

    // Log in using the loaded credentials
    cy.login();
  });

  it('Should navigate to the notification page and test', () => {

    cy.visit(Cypress.env("REACT_APP_HOSTNAME") + "/dashboard/notifications/");
    cy.get('[data-testid="notifications-table"]').should("be.visible");
    cy.get('[data-testid="notifications-table-search-input"]').should("be.visible").type("test");
    cy.get('[data-testid="notifications-table-search-input"]').should("be.visible").clear();
    cy.get('[data-testid="notifications-table-search-input"]').should("be.visible").type(" ");
    cy.wait(1000);
    //Check if table re
    cy.get('[data-testid="notifications-table-result-count"]').should("be.visible").then(($resultCount) => {
      const resultText = $resultCount.text().trim();  // Get the text content and trim whitespace
      if (resultText === "()" || resultText == "(0)") {  // Check if the text is empty
          cy.get('[data-testid="notifications-table-no-results-ui-prompt"]').should("be.visible");
          cy.get('[data-testid="notifications-table"]').should("not.exist");
      } else {
          cy.get('[data-testid="notifications-table-no-results-ui-prompt"]').should("not.exist");
          cy.get('[data-testid="notifications-table"]').should("be.visible"); 
          cy.get('[data-testid="notifications-table-result-limit-select"]').should("be.visible").select("1");
          //Calculate the number of <tr> elements in the table
          // cy.get('[data-testid="notifications-table"] tbody tr').should("have.length", 1);
          cy.get('[data-testid="notifications-table-result-limit-select"]').should("be.visible").select("2");
          // cy.get('[data-testid="notifications-table"] tbody tr').should("have.length", 2);
          cy.get('[data-testid="notifications-table-result-limit-select"]').should("be.visible").select("3");
          // cy.get('[data-testid="notifications-table"] tbody tr').should("have.length", 3);
          cy.get('[data-testid="notifications-table-result-limit-select"]').should("be.visible").select("5");
          // cy.get('[data-testid="notifications-table"] tbody tr').should("have.length", 5);
          cy.get('[data-testid="notifications-table-result-limit-select"]').should("be.visible").select("10");
          // cy.get('[data-testid="notifications-table"] tbody tr').should("have.length", 10);
      }
      cy.get('[data-testid="notifications-table-row-more-button-0"]').should("be.visible").click();
    //   cy.get('[data-testid="notifications-table-row-0-menu-option-0"]').should("be.visible").click();
    cy.get('[data-testid^="notifications-table-row-0-menu-option-"]').should("be.visible").contains("Details");
    cy.get('[data-testid^="notifications-table-row-0-menu-option-"]').should("be.visible").contains("View Resource");

    //CHeck if mark as read is visible
    cy.get('[data-testid="notifications-table-row-table-row-0-column-is_read"]').should("be.visible").then(($el) => {
        if ($el.text().includes("No")) {
            cy.get('[data-testid^="notifications-table-row-0-menu-option-"]').should("be.visible").contains("Mark as Read");
        } else {
            cy.get('[data-testid^="notifications-table-row-0-menu-option-"]').should("be.visible").should("not.contain", "Mark as Read");
        }
    });
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
