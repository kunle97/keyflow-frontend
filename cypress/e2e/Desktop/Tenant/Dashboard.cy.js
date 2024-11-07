describe("Test the Dashboard functionality", () => {
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login

    // Log in using the loaded credentials
    cy.tenantLogin();
  });

  it("Should navigate to dashboard", () => {
    cy.visit("/dashboard/tenant/");
    cy.get(".tenant-dashboard-container").should("be.visible");
    cy.get(".d-sm-flex > .text-black").should("be.visible");
    cy.get(".MuiCardContent-root").should("be.visible");
    cy.get(".css-17goekv-MuiTypography-root > span").should("be.visible");
    cy.get(".MuiCardContent-root > .MuiStack-root").should("be.visible");
    cy.get(".MuiCardContent-root > .MuiStack-root").should("be.visible");

    //check if autopay is clickable and visible
    cy.get('[data-testid="auto-pay-switch"').should("be.visible").click();
    cy.get('[data-testid="confirm-modal-cancel-button"]')
      .should("be.visible")
      .click();

    //maintance request box
    cy.get(".maintenance-request-card > .card > .card-body").should(
      "be.visible"
    );
    cy.get(".css-1csbfby-JoyStack-root > .MuiStack-root > div").should(
      "be.visible"
    );
    cy.get("b").should("be.visible");
    cy.get(".card-text").should("be.visible");

    // Check if the 'no-results' prompt exists and is visible
    cy.get("body").then(($body) => {
      if (
        $body.find('[data-testid="ui-table-mini-no-results-prompt"]').length
      ) {
        // If the 'no-results' prompt exists, assert it is visible
        cy.get('[data-testid="ui-table-mini-no-results-prompt"]').should(
          "be.visible"
        );
      } else {
        // If the 'no-results' prompt does not exist, check for the maintenance request table
        cy.get('[data-testid="maintenance-request-table"]').should(
          "be.visible"
        );
        cy.get('[data-testid="maintenance-request-table-row-0-type"]').should(
          "be.visible"
        );
        cy.get('[data-testid="maintenance-request-table-row-0-status"]').should(
          "be.visible"
        );
        cy.get(
          '[data-testid="maintenance-request-table-row-0-created_at"]'
        ).should("be.visible");
      }
    });

    //calendar
    cy.get(".col-lg-7 > .card > .card-body").should("be.visible");
    cy.get(".fc").should("be.visible");
    cy.get("#fc-dom-1").should("be.visible");
    cy.get(".fc-header-toolbar").should("be.visible");
    //Today Button (today button is disabled)
    cy.get(".fc-today-button").should("be.visible");
    cy.get(".fc-today-button").should("be.disabled");
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
