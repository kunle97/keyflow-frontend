describe("Test all basic functions of the property list page", () => {
  ///Crewate a preperation function that runs before each test
  beforeEach(() => {
    // Set viewport size
    cy.viewport(1920, 1080);

    // Load login credentials from the environment variables
    let email = process.env.REACT_APP_CYPRESS_TEST_USER_EMAIL;
    // Log in using the loaded credentials
    cy.login();
  });

  it("Should navigate to owner create properties", () => {
    //Create Property Page
    cy.visit(Cypress.env("REACT_APP_HOSTNAME") + "/dashboard/owner/properties/create");

    //Test Name Input
    cy.get('[data-testid="create-property-stepper"]').should("be.visible");
    cy.get('[data-testid="create-property-name-label"]').should("be.visible");
    //focus on the property name input
    cy.get('[data-testid="create-property-name-input"]').should("be.visible").clear();
    cy.get('[data-testid="create-property-name-input"]').should("be.visible").focus();
    cy.get('[data-testid="create-property-name-input"]').should("be.visible").blur();
    //FInd error message
    cy.get('[data-testid="create-property-name-error-message"]').should("be.visible").contains("This field is required");
    //Generate a random name for the property

    cy.get('[data-testid="create-property-name-input"]').should("be.visible").type("Test Property");
    
    //Test Street Input
    cy.get('[data-testid="create-property-street-label"]').should("be.visible");
    cy.get('[data-testid="create-property-street-input"]').should("be.visible");
    cy.get('[data-testid="create-property-street-input"]').should("be.visible").clear();
    cy.get('[data-testid="create-property-street-input"]').should("be.visible").focus();
    cy.get('[data-testid="create-property-street-input"]').should("be.visible").blur();
    cy.get('[data-testid="create-property-street-error-message"]').should("be.visible").contains("Enter a valid street address (e.g., 123 Main St)");
    cy.get('[data-testid="create-property-street-input"]').should("be.visible").type("123 Test Street");

    //Test City Input
    cy.get('[data-testid="create-property-city-label"]').should("be.visible");
    cy.get('[data-testid="create-property-city-input"]').should("be.visible");
    cy.get('[data-testid="create-property-city-input"]').should("be.visible").clear();
    cy.get('[data-testid="create-property-city-input"]').should("be.visible").focus();
    cy.get('[data-testid="create-property-city-input"]').should("be.visible").blur();
    cy.get('[data-testid="create-property-city-error-message"]').should("be.visible").contains("This field must be at least 3 characters long");
    cy.get('[data-testid="create-property-city-input"]').should("be.visible").type("Test City");

    //Test State Input
    cy.get('[data-testid="create-property-state-label"]').should("be.visible");
    cy.get('[data-testid="create-property-state-input"]').should("be.visible");
    cy.get('[data-testid="create-property-state-input"]').should("be.visible").focus(); 
    cy.get('[data-testid="create-property-state-input"]').should("be.visible").blur();
    cy.get('[data-testid="create-property-state-error-message"]').should("be.visible").contains("This field is required");
    //Select a state from the dropdown
    cy.get('[data-testid="create-property-state-input"]').should("be.visible").select("California");


    //Test Zipcode Input
    cy.get('[data-testid="create-property-zipcode-label"]').should(
      "be.visible"
    );
    cy.get('[data-testid="create-property-zipcode-input"]').should(
      "be.visible"
    );
    cy.get('[data-testid="create-property-zipcode-input"]').should(
      "be.visible"
    ).clear();
    cy.get('[data-testid="create-property-zipcode-input"]').should(
      "be.visible"
    ).focus();
    cy.get('[data-testid="create-property-zipcode-input"]').should(
      "be.visible"
    ).blur();
    cy.get('[data-testid="create-property-zip-code-error-message"]').should(
      "be.visible"
    ).contains("Must be in zip code format");
    cy.get('[data-testid="create-property-zipcode-input"]').should(
      "be.visible"
    ).type("12345");

    //Test Country Input
    cy.get('[data-testid="create-property-country-label"]').should(
      "be.visible"
    );
    cy.get('[data-testid="create-property-country-input"]').should(
      "be.visible"
    );
    cy.get('[data-testid="create-property-country-input"]').should(
      "be.visible"
    ).clear();
    cy.get('[data-testid="create-property-country-input"]').should(
      "be.visible"
    ).focus();
    cy.get('[data-testid="create-property-country-input"]').should(
      "be.visible"
    ).blur();
    cy.get('[data-testid="create-property-country-error-message"]').should(
      "be.visible"
    ).contains("Must be at least 3 characters long");
    cy.get('[data-testid="create-property-country-input"]').should(
      "be.visible"
    ).type("United States");
    
    cy.get('[data-testid="create-property-add-units-button"]')
      .should("be.visible")
      .click();
    cy.get('[data-testid="initial-create-unit-button"]').should("be.visible").click();
    cy.get('[data-testid="unit-row-0"]').should("be.visible");
    cy.get('[data-testid="unit-row-0-add-unit-button"]').should("be.visible").click();
    cy.get('[data-testid="unit-row-1"]').should("be.visible");
    cy.get('[data-testid="remove-unit-1-button"]').should("be.visible").click();

    cy.get('[data-testid="create-property-back-button"').should("be.visible").click();
    cy.get('[data-testid="create-property-add-units-button"]')
    .should("be.visible")
    .click();
    cy.get('[data-testid="create-property-submit-button"').should("be.visible").click();
    cy.get('[data-testid="progress-modal-title"]').should("be.visible").contains("Creating your property...");
    cy.wait(3000);
    cy.get('[data-testid="page-header-title"]').should("be.visible").contains("Test Property");
    cy.get('[data-testid="page-header-subtitle"]').should("be.visible").contains("123 Test Street Test City, CA 12345");
    //Delete the units and property
    cy.get('[data-testid="ui-page-header-menu-button"]').should("be.visible").click();
    cy.get('[data-testid="ui-page-header-menu-item-3"]').should("be.visible").click();
    cy.get('[data-testid="confirm-modal-confirm-button"]').should("be.visible").click();
    //Check for success alert
    cy.get('[data-testid="property-update-alert-modal-modal-title"]').should("be.visible").contains("Success");
    cy.get('[data-testid="property-update-alert-modal-modal-message"]').should("be.visible").contains("All units deleted");
    cy.get('[data-testid="property-update-alert-modal-modal-button"]').should("be.visible").click();
    cy.wait(3000);
    //Refresh page
    cy.reload();
    cy.get('[data-testid="ui-page-header-menu-button"]').should("be.visible").click();
    cy.get('[data-testid="ui-page-header-menu-item-4"]').should("be.visible").click();
    cy.get('[data-testid="confirm-modal-confirm-button"]').should("be.visible").click();
    //Check the url of the current page is /dashboard/owner/properties
    cy.url().should("eq", Cypress.env("REACT_APP_HOSTNAME") + "/dashboard/owner/properties");
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
