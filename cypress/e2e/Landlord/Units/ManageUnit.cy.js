const hostname = "http://localhost:3000";

describe("CreateUnit Component", () => {
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login

    // Log in using the loaded credentials
    cy.login("Sandra83@hotmail.com", "Password1");
    cy.visit("/dashboard/landlord/properties"); // Replace with the actual route where your component is rendered
    cy.visit(hostname + "/dashboard/landlord/properties/");
    cy.get('[data-testid="nav-menu-button"]').should("be.visible").click();
    cy.get('[data-testid="sidebar-desktop"]').should("be.visible");
    cy.get('[data-testid="landlord-properties-dropdown-menu-item"]')
      .should("be.visible")
      .click();
    cy.get('[data-testid="landlord-properties-menu-item"]')
      .should("be.visible")
      .click();
    cy.get('[data-testid^="property-"]').first().click();
    cy.get('[data-testid="property-units-tab"]').should("be.visible").click();
  });

  it("should be able to use all features on manage unit function", () => {

    ///Click on th UNit
    cy.get('[data-testid^="rental-unit-"]').first().click();
    // cy.get('[data-testid="loading-unit-ui-progress-prompt"]').should("be.visible");

    //Click all tabs
    cy.get('[data-testid="unit-details-tab"]').should("be.visible").click();
    // cy.get('[data-testid="rental-application-link-input"]').should("be.visible").click();
    cy.get('[data-testid="unit-details-beds"]').should("be.visible").click();
    cy.get('[data-testid="unit-details-baths"]').should("be.visible").click();

    //Edit modal
    cy.get('[data-testid="edit-unit-button"]').should("be.visible").click();
    cy.get('[data-testid="edit-unit-dialog"]').should("be.visible").click();
    cy.get('[data-testid="ui-dialog-title"]').should("be.visible").contains("Edit Unit");
    cy.get('[data-testid="edit-unit-name-label"]').should("be.visible");
    cy.get('[data-testid="edit-unit-name-input"]').should("be.visible");
    cy.get('[data-testid="edit-unit-beds-label"]').should("be.visible");
    cy.get('[data-testid="edit-unit-beds-input"]').should("be.visible");
    cy.get('[data-testid="edit-unit-baths-label"]').should("be.visible");
    cy.get('[data-testid="edit-unit-baths-input"]').should("be.visible");
    cy.get('[data-testid="edit-unit-submit-button"]').should("be.visible");
    cy.get('[data-testid="ui-dialog-close-button"]').should("be.visible").click();
    //TODO: TEst the  edit feature
    cy.get('[data-testid="unit-tenants-tab"]').should("be.visible").click();
    cy.get('[data-testid="unit-lease-template-tab"]').should("be.visible").click();
    cy.get('[data-testid="unit-media-tab"]').should("be.visible").click();
    cy.get('[data-testid="unit-rental-applications-tab"]').should("be.visible").click();


  });

  // Add more test cases as needed

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
