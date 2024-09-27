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
    it("should navigate to the maintenence requests page", () => {
        cy.visit(Cypress.env("REACT_APP_HOSTNAME")  + "/dashboard/owner/maintenance-requests/");
        
        cy.get('[data-testid="maintenance-requests-table"]').should("be.visible");
        
        //Test the create maintenence request button and page
        cy.visit(Cypress.env("REACT_APP_HOSTNAME")  + "/dashboard/owner/create-maintenance-request/");

        cy.get('[data-testid="maintenance-unit-select"]').should("be.visible").select(1);
        cy.get('[data-testid="maintenance-type-select"]').should("be.visible").select(1);
        cy.get('[data-testid="maintenance-description-textarea"]').should("be.visible").type("Test Description");
        cy.get('[data-testid="create-maintenance-request-submit-button"]').should("be.visible").click();
    
        cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Maintenance Request");
        cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Maintenance request created successfully"); 
        cy.get('[data-testid="alert-modal-button"]').should("be.visible").contains("Okay").click();

        cy.get('[data-testid="page-header-title"]').should("be.visible");
        cy.get('[data-testid="page-header-subtitle"]').should("be.visible");
        
        //Test Change Status Button
        cy.get('[data-testid="ui-page-header-menu-button"]').should("be.visible").click();
        cy.get('[data-testid="ui-page-header-menu-item-0"]').should("be.visible").click();
        cy.get('[data-testid="ui-dialog-title"]').should("be.visible").contains("Change Status");
        cy.get('[data-testid="status-select"]').should("be.visible").select("In Progress");
        cy.get('[data-testid="change-status-button"]').should("be.visible").click();

        cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Status Updated");
        cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Maintenance Request status has been changed"); 
        cy.get('[data-testid="alert-modal-button"]').should("be.visible").contains("Okay").click();


        //Test change Priority
        cy.get('[data-testid="ui-page-header-menu-button"]').should("be.visible").click();
        cy.get('[data-testid="ui-page-header-menu-item-1"]').should("be.visible").click();

        cy.get('[data-testid="ui-dialog-title"]').should("be.visible").contains("Change Priority");
        cy.get('[data-testid="priority-select"]').should("be.visible").select("High");
        cy.get('[data-testid="change-priority-button"]').should("be.visible").click();
        
        cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Priority Updated");
        cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Maintenance Request priority has been changed"); 
        cy.get('[data-testid="alert-modal-button"]').should("be.visible").contains("Okay").click();


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
            //Navigate to ethe homepage
            cy.visit(Cypress.env("REACT_APP_HOSTNAME")  + "/");
        }
        );
    }
 );
});