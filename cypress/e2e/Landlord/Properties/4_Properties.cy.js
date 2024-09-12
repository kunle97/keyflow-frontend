describe("Test all basic functions of the property list page", () => {
  ///Crewate a preperation function that runs before each test
  beforeEach(() => {
    // Set viewport size
    cy.viewport(1920, 1080);
    // Log in using the loaded credentials
    cy.login();
  });
  
  it("Should navigate to owner properties", () => {
    cy.visit(Cypress.env("REACT_APP_HOSTNAME")  + "/dashboard/owner/properties/");
    //Click the dropdown button
    cy.get('[data-testid^="property-more-button-"]').should('be.visible').first().click();
    //Click the view button
    cy.get('[data-testid="property-0-menu-option-0"]').should('be.visible').click();
    
    //Verify Visibilty of the property details
    cy.get('[data-testId="property-unit-count"]').should("be.visible");
    cy.get('[data-testId="property-bed-count"]').should("be.visible");
    cy.get('[data-testId="property-bath-count"]').should("be.visible");
    cy.get('[ data-testId="property-size"]').should("be.visible");

    ///Verify the visibility of the units
    cy.get('[data-testid="property-units-tab"]').should("be.visible").click();
    cy.get('[data-testid^="rental-unit-"]').first().click();
    // cy.go("back");

    //Verify visibilty of media gallery
    cy.get('[data-testid="property-media-tab"]').should("be.visible").click();

    //Test File Upload
    cy.get('[data-testid="file-manager-upload-media-button"]').should("be.visible").click();
    // cy.get('[data-testid="file-dropzone"]').should("be.visible").click();
    cy.get('input[type="file"]').selectFile('cypress/fixtures/test-property-image.jpg', { force: true });
    cy.get('[data-testid="dropzone-upload-file-button"]').should("be.visible").click();
    cy.wait(2500);
    cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("File Upload");
    cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("File uploaded successfully"); 
    cy.get('[data-testid="alert-modal-button"]').should("be.visible").contains("Okay").click();
    cy.wait(2000);
    cy.get('[data-testid="property-media-tab"]').should("be.visible").click();

    //Test file component
    cy.get('[data-testid="property-media-0"]').should("be.visible").trigger("mouseover")
    .get('[data-testid="property-media-0"]').first().children('.image-overlay').should("be.visible")
    .get('[data-testId="file-name"]').should("be.visible")
    .get('[data-testId="delete-file-icon"]').should("be.visible").click();
    cy.get('[data-testid="confirm-modal-title"]').should("be.visible").contains("Delete File");
    cy.get('[data-testid="confirm-modal-message"]').should('be.visible').contains("Are you sure you want to delete this file?");
    cy.get('[data-testid="confirm-modal-confirm-button"]').should('be.visible');
    cy.get('[data-testid="confirm-modal-cancel-button"]').should('be.visible').click()
    cy.get('[data-testid="confirm-modal-title"]').should('not.exist');

    //Test Delete file operation
    cy.get('[data-testid="property-media-0"]').should("be.visible").trigger("mouseover")
    .get('[data-testid="property-media-0"]').first().children('.image-overlay').should("be.visible")
    .get('[data-testId="file-name"]').should("be.visible")
    .get('[data-testId="delete-file-icon"]').should("be.visible").click();
    cy.get('[data-testid="confirm-modal-confirm-button"]').should('be.visible').click();

    cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("File Delete");
    cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("File deleted successfully"); 
    cy.get('[data-testid="alert-modal-button"]').should("be.visible").contains("Okay").click();
    cy.wait(2000);
    cy.get('[data-testid="property-media-tab"]').should("be.visible").click();
    //Verify visibilty of preferences tab
    cy.get('[data-testid="property-preference-tab"]')
      .should("be.visible")
      .click();

    //Verify visibility of edit dialog 
    
    cy.get('[data-testid="ui-page-header-menu-button"]').should("be.visible").click();
    cy.get('[data-testid="ui-page-header-menu-item-0"]').should("be.visible").click();
    
    cy.get('[data-testid="ui-dialog-close-button"]').should("be.visible").click();
    
    
    cy.get('[data-testid="ui-page-header-menu-button"]').should("be.visible").click();
    cy.get('[data-testid="ui-page-header-menu-item-0"]').should("be.visible").click();
    cy.get('[data-testid="property-detail-edit-dialog"]').should("be.visible");
    cy.get('[data-testid="ui-dialog-title"]').should("be.visible");

    cy.get('[data-testid="update-property-name-label"]').should("be.visible");
    cy.get('[data-testid="update-property-name-input"]').should("be.visible");

    cy.get('[data-testid="update-property-street-label"]').should("be.visible");
    cy.get('[data-testid="update-property-street-input"]').should("be.visible");

    cy.get('[data-testid="update-property-city-label"]').should("be.visible");
    cy.get('[data-testid="update-property-city-input"]').should("be.visible");

    cy.get('[data-testid="update-property-state-label"]').should("be.visible");
    cy.get('[data-testid="update-property-state-input"]').should("be.visible");

    cy.get('[data-testid="update-property-zip_code-label"]').should("be.visible");
    cy.get('[data-testid="update-property-zip_code-input"]').should("be.visible");

    cy.get('[data-testid="update-property-country-label"]').should("be.visible");
    cy.get('[data-testid="update-property-country-input"]').should("be.visible");

    cy.get('[data-testid="update-property-save-button"]').should("be.visible").click();

    cy.get('[data-testid="alert-modal-title"]').should('be.visible').contains('Success')
    cy.get('[data-testid="alert-modal-message"]').should('be.visible').contains('Property updated')
    cy.get('[data-testid="alert-modal-button"]').should('be.visible').contains('Ok').click()

    // //Verify visibility of portfolio dialog
    cy.get('[data-testid="ui-page-header-menu-button"]').should("be.visible").click();
    cy.get('[data-testid="ui-page-header-menu-item-2"]').should("be.visible").click();
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
      cy.visit(Cypress.env("REACT_APP_HOSTNAME")  + "/");
    });
  });
});
