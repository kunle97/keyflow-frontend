describe("Test the Tenant Maintenance Request flow", () => {
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login

    // Log in using the loaded credentials
    cy.tenantLogin();
  });

  it("Test the Tenant Maintenance Request flow", () => {
    // Click on the Maintenance Request link
    cy.visit("/dashboard/tenant/maintenance-requests");

    // Check if the page contains the text "Maintenance Request"
    cy.contains("Maintenance Request");

    // Click on the "Add" button for Maintenance Requests
    cy.get(".ui-table-create-button").click();

    // Check if the page contains the text "Add Maintenance Request"
    cy.get('[data-testid="maintenance-type"] > .form-control').select("Plumbing");
    cy.get('[data-testid="maintenance-description"] > .form-control').should("be.visible").type("Test Description");
    cy.get('[data-testid="create-maintenance-request-submit-button"]').should("be.visible").click();

    cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Maintenance Request");
    cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Maintenance request created successfully"); 
    cy.get('[data-testid="alert-modal-button"]').should("be.visible").contains("Okay").click();



    //View the details of the maintenance request
    cy.get('[data-testid="maintenance-requests-table-row-more-button-0"]').should("be.visible").click();
    cy.get('[data-testid="maintenance-requests-table-row-0-menu-option-0"]').should("be.visible").contains("View").click();

    cy.get('[data-testid="page-header-title"]').should("be.visible");
    cy.get('[data-testid="page-header-subtitle"]').should("be.visible");

    cy.get('[data-testid="tenant-message-section"]').should("be.visible");
    cy.get('[data-testid="tenant-message-title"]').should("be.visible");
    cy.get('[data-testid="tenant-message"]').should("be.visible");
    
    cy.get('[data-testid="event-timeline-title"]').should("be.visible");
    cy.get('[data-testid="event-timeline"]').should("be.visible");

    //Test Delete maintenence request
    cy.get('[data-testid="ui-page-header-menu-button"]').should("be.visible").click();
    cy.get('[data-testid="ui-page-header-menu-item-2"]').should("be.visible").click();
    cy.get('[data-testid="confirm-modal-confirm-button"]').should("be.visible").click();

    cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Maintenance Request Deleted");
    cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Maintenance Request has been deleted. You will be redirected to the maintenance requests page."); 
    cy.get('[data-testid="alert-modal-button"]').should("be.visible").contains("Okay").click();

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
