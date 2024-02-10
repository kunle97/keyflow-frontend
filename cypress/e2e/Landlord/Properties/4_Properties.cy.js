const hostname = "http://localhost:3000";

describe("Test all basic functions of the property", () => {
  ///Crewate a preperation function that runs before each test
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login
    // Load login credentials from the fixture
    cy.fixture("loginCredentials").as("credentials");

    // Log in using the loaded credentials
    cy.login("Sandra83@hotmail.com", "Password1");
  });
  it("Should navigate to landlord properties", () => {
    cy.visit(hostname + "/dashboard/landlord/properties/"); 
    cy.get('[data-testid="nav-menu-button"]').should("be.visible").click();
    cy.get('[data-testid="sidebar-desktop"]').should("be.visible");
    cy.get('[data-testid="landlord-properties-dropdown-menu-item"]')
    .should("be.visible")
    .click();
    cy.get('[data-testid="landlord-properties-menu-item"]')
    .should("be.visible")
    .click();
    
    //Create Property Page
    cy.get('[data-testid="ui-table-mobile-create-button"]').should("be.visible").click();
    cy.get('[data-testid="create-property-stepper"]').should("be.visible");
    cy.get('[data-testid="create-property-name-label"]').should("be.visible");
    cy.get('[data-testid="create-property-name-input"]').should("be.visible");
    cy.get('[data-testid="create-property-street-label"]').should("be.visible");
    cy.get('[data-testid="create-property-street-input"]').should("be.visible");
    cy.get('[data-testid="create-property-city-label"]').should("be.visible");
    cy.get('[data-testid="create-property-city-input"]').should("be.visible");
    cy.get('[data-testid="create-property-state-label"]').should("be.visible");
    cy.get('[data-testid="create-property-state-input"]').should("be.visible");
    cy.get('[data-testid="create-property-zip-code-label"]').should("be.visible");
    cy.get('[data-testid="create-property-zip-code-input"]').should("be.visible");
    cy.get('[data-testid="create-property-country-label"]').should("be.visible");
    cy.get('[data-testid="create-property-country-input"]').should("be.visible");
    cy.get('[data-testid="create-property-next-button"]').should("be.visible").click();
    cy.get('[data-testid="create-property-back-button"').should("be.visible");
    cy.get('[data-testid="create-property-submit-button"').should("be.visible");


    //Click on a property that has a data-testid that starts with property-
    cy.visit(hostname + "/dashboard/landlord/properties/");
    cy.get('[data-testid^="property-"]').first().click();
    
    //Verify Visibilty of the property details
    cy.get('[data-testId="property-unit-count"]').should("be.visible");
    cy.get('[data-testId="property-bed-count"]').should("be.visible");
    cy.get('[data-testId="property-bath-count"]').should("be.visible");
    cy.get('[ data-testId="property-size"]').should("be.visible");

    ///Verify the visibility of the units
    cy.get('[data-testid="property-units-tab"]').should("be.visible").click();
    cy.get('[data-testid^="rental-unit-"]').first().click();
    cy.go("back");

    //Verify visibilty of media gallery
    cy.get('[data-testid="property-media-tab"]').should("be.visible").click();
    cy.get('[data-testid="property-media-0"]')
    .should("be.visible")
    .trigger("mouseover")
    .get('[data-testid="property-media-0"]').first().children('.image-overlay').should("be.visible")
    .get('[data-testId="file-name"]').should("be.visible")
    .get('[data-testId="delete-file-icon"]').should("be.visible").click();
    
    //Check if the Delete Modal is visible
    cy.get('[data-testid="confirm-modal-title"]').should("be.visible").contains("Delete File");
    cy.get('[data-testid="confirm-modal-message"]').should('be.visible').contains("Are you sure you want to delete this file?");
    cy.get('[data-testid="confirm-modal-confirm-button"]').should('be.visible');
    cy.get('[data-testid="confirm-modal-cancel-button"]').should('be.visible').click()
    cy.get('[data-testid="confirm-modal-title"]').should('not.exist');

    //Verify visibilty of preferences tab
    cy.get('[data-testid="property-preference-tab"]')
      .should("be.visible")
      .click();

    //Verify visibility of edit dialog 
    cy.get('[data-testid="property-edit-button"]').should("be.visible").click();
    cy.get('[data-testid="ui-dialog-close-button"]').should("be.visible").click();
    cy.get('[data-testid="property-edit-button"]').should("be.visible").click();
    cy.get('[data-testid="property-detail-edit-dialog"]').should("be.visible");
    cy.get('[data-testid="ui-dialog-title"]').should("be.visible");

    cy.get('[data-testid="property-edit-dialog-name-label"]').should("be.visible");
    cy.get('[data-testid="property-edit-dialog-name-input"]').should("be.visible");

    cy.get('[data-testid="property-edit-dialog-street-label"]').should("be.visible");
    cy.get('[data-testid="property-edit-dialog-street-input"]').should("be.visible");

    cy.get('[data-testid="property-edit-dialog-city-label"]').should("be.visible");
    cy.get('[data-testid="property-edit-dialog-city-input"]').should("be.visible");

    cy.get('[data-testid="property-edit-dialog-state-label"]').should("be.visible");
    cy.get('[data-testid="property-edit-dialog-state-input"]').should("be.visible");

    cy.get('[data-testid="property-edit-dialog-zip-code-label"]').should("be.visible");
    cy.get('[data-testid="property-edit-dialog-zip-code-input"]').should("be.visible");

    cy.get('[data-testid="property-edit-dialog-country-label"]').should("be.visible");
    cy.get('[data-testid="property-edit-dialog-country-input"]').should("be.visible");

    cy.get('[data-testid="property-edit-dialog-save-button"]').should("be.visible").click();

    cy.get('[data-testid="alert-modal-title"]').should('be.visible').contains('Success')
    cy.get('[data-testid="alert-modal-message"]').should('be.visible').contains('Property updated')
    cy.get('[data-testid="alert-modal-button"]').should('be.visible').contains('Ok').click()

    //Verify visibility of portfolio dialog
    cy.get('[data-testid="property-change-portfolio-button"]').should("be.visible").click();
    cy.get('[data-testid="property-select-portfolio-dialog"]').should("be.visible");
    cy.get('[data-testid="ui-dialog-title"]').should("be.visible");
    cy.get('[data-testid="ui-dialog-close-button"]').should("be.visible").click();

  }); 

  afterEach(() => {
    cy.wait(1000);
    //REtrieve the auth object from the getAuth command
    cy.getAuth().then((auth) => {
      // Log user out witht the cypress command logout
      cy.logout(auth.token);
      //Navigate to the homepage
      cy.visit(hostname + "/");
    });
  });
});
