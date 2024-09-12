describe("Test all the portfolios feature", () => {
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login
    // Load login credentials from the fixture
    cy.fixture("loginCredentials").as("credentials");

    // Log in using the loaded credentials
    cy.login();
  });
  it("should navigate to the portfolios page", () => {
    cy.visit(Cypress.env("REACT_APP_HOSTNAME")  + "/dashboard/owner/portfolios/");
      
    cy.get('[data-testid="portfolios-table"]').should("be.visible");
    cy.get('.ui-table-create-button').should("be.visible").click();
    cy.get('[data-testid="create-portfolio-title"]').should("be.visible");
    cy.get('[data-testid="create-portfolio-form"]').should("be.visible");
    cy.get('[data-testid="create-portfolio-submit-button"]').should("be.visible").click();


    cy.get('[data-testid="create-portfolio-name-input-error"]').should("be.visible").contains("This field is required");
    cy.get('[data-testid="create-portfolio-description-textarea-error"]').should("be.visible").contains("Please enter a valid description for the portfolio");
    cy.get('[data-testid="create-portfolio-name-input-label"]').should("be.visible");
    cy.get('[data-testid="create-portfolio-name-input"]').should("be.visible").type("Test Portfolio");
    cy.get('[data-testid="create-portfolio-description-textarea"]').should("be.visible").type("This is a test portfolio");

    cy.get('[data-testid="create-portfolio-description-textarea-label"]').should("be.visible");
    cy.get('[data-testid="create-portfolio-submit-button"]').should("be.visible").click();

    //Handle Alert Modal MEssages
    cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Success");
    cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Portfolio created successfully");
    cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();
    //Check if the modal returns to correct page
    cy.get('[data-testid="portfolio-properties-table-no-results-ui-prompt"]').should("be.visible");
    // cy.get('[data-testid="portfolio-properties-table"]').should("be.visible")f;

    // Check if the portfolio name and description are visible
    cy.get('[data-testid="page-header-title"]').should("be.visible");
    cy.get('[data-testid="page-header-subtitle"]').should("be.visible");

    //Click on the edit button
    cy.get('[data-testid="ui-page-header-menu-button"]')
      .should("be.visible")
      .click();
    cy.get('[data-testid="ui-page-header-menu-item-0"]')
      .should("be.visible")
      .click();
    // cy.get('[data-testid="edit-portfolio-button"]').should("be.visible").click();
    cy.get('[data-testid="edit-portfolio-dialog"]').should("be.visible");
    cy.get('[data-testid="edit-portfolio-name-input-label"]').should(
      "be.visible"
    );
    cy.get('[data-testid="edit-portfolio-name-input"]').should("be.visible");
    cy.get('[data-testid="edit-portfolio-description-textarea-label"]').should(
      "be.visible"
    );
    cy.get('[data-testid="edit-portfolio-description-textarea"]').should(
      "be.visible"
    );
    cy.get('[data-testid="edit-portfolio-submit-button"]')
      .should("be.visible")
      .click();

    // //Handle Alert Modal MEssages
    cy.get('[data-testid="alert-modal-title"]')
      .should("be.visible")
      .contains("Success");
    cy.get('[data-testid="alert-modal-message"]')
      .should("be.visible")
      .contains("Portfolio updated successfully");
    cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();
    

    //Add a property from the page header dropdown
    cy.get('[data-testid="ui-page-header-menu-button"]')
      .should("be.visible")
      .click();
    cy.get('[data-testid="ui-page-header-menu-item-2"]').click();
    cy.get('[data-testid="add-properties-dialog"]').should("be.visible");
    cy.get('[data-testid="rental-property-0-checkbox"]').should("be.visible").click();
    cy.get('[data-testid="add-properties-dialog-save-button"]').should("be.visible").click();

    //Handle Alert Modal MEssages
    cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Success");
    cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Properties updated in portfolio successfully");
    cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();
    //Refresh the page
    cy.reload();
    //Check if the portfolio properties table is visible
    cy.get('[data-testid="portfolio-properties-table"]').should("be.visible").click();

    //Navigate to preferences tab
    cy.get('[data-testid="preferences-tab"]').should("be.visible").click();

    cy.get('[data-testid="accept_rental_applications-portfolio-preference"] > .MuiStack-root').should("be.visible");
    cy.get('[data-testid="accept_rental_applications-portfolio-preference-label"]').should("be.visible").contains("Accept Rental Applications");
    cy.get('[data-testid="accept_rental_applications-portfolio-preference-description"]').should("be.visible").contains("Indicates if the owner is accepting rental applications for this portfolio");
    cy.get('[data-testid="accept_rental_applications-portfolio-preference-switch"]').should("be.visible").click().click();
    

    cy.get('[data-testid="accept_lease_renewals-portfolio-preference"] > .MuiStack-root').should("be.visible");
    cy.get('[data-testid="accept_lease_renewals-portfolio-preference"] > .MuiStack-root > .MuiListItemText-root > .MuiTypography-body1').should("be.visible").contains("Accept Lease Renewals");
    cy.get('[data-testid="accept_lease_renewals-portfolio-preference"] > .MuiStack-root > .MuiListItemText-root > .MuiTypography-body2').should("be.visible").contains("Indicates if the owner is accepting lease renewals for this portfolio");
    cy.get('[data-testid="accept_lease_renewals-portfolio-preference-switch"]').should("be.visible").click().click();

    cy.get('[data-testid="accept_lease_cancellations-portfolio-preference"] > .MuiStack-root').should("be.visible");
    cy.get('[data-testid="accept_lease_cancellations-portfolio-preference"] > .MuiStack-root > .MuiListItemText-root > .MuiTypography-body1').should("be.visible").contains("Accept Lease Cancellations");
    cy.get('[data-testid="accept_lease_cancellations-portfolio-preference"] > .MuiStack-root > .MuiListItemText-root > .MuiTypography-body2').should("be.visible").contains("Indicates if the owner is accepting lease cancellations for this portfolio");
    cy.get('[data-testid="accept_lease_cancellations-portfolio-preference-switch"]').should("be.visible").click().click();

    cy.get('[data-testid="allow_lease_auto_renewal-portfolio-preference"] > .MuiStack-root').should("be.visible");
    cy.get('[data-testid="allow_lease_auto_renewal-portfolio-preference"] > .MuiStack-root > .MuiListItemText-root > .MuiTypography-body1').should("be.visible").contains("Allow Lease Auto Renewal");
    cy.get('[data-testid="allow_lease_auto_renewal-portfolio-preference"] > .MuiStack-root > .MuiListItemText-root > .MuiTypography-body2').should("be.visible").contains("Indicates if the owner is allowing tenants in subsequent units to enable auto renewal of their lease");
    cy.get('[data-testid="allow_lease_auto_renewal-portfolio-preference-switch"]').should("be.visible").click().click();

    //Tesst the delete portfolio feature
    cy.get('[data-testid="ui-page-header-menu-button"]')
      .should("be.visible")
      .click();
    cy.get('[data-testid="ui-page-header-menu-item-3"]')
      .should("be.visible")
      .click();
    cy.get('[data-testid="confirm-modal-title"]').should("be.visible").contains("Delete Portfolio");
    cy.get('[data-testid="confirm-modal-message"]').should("be.visible").contains("Are you sure you want to delete this portfolio?");
    cy.get('[data-testid="confirm-modal-confirm-button"]').should("be.visible").click();

    cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Portfolio Deleted");
    cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();



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
