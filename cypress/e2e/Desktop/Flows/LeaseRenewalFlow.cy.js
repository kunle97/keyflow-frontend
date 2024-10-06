describe("Test Lease renewal flow between owner and tenant", () => {
    ///Crewate a preperation function that runs before each test
    beforeEach(() => {
      // Log user out
      cy.viewport(1920, 1080);
      //Log the user out using the cypress command logout
        cy.logout();
    });

    it("should create a lease renewal request for tenant", () => {
        cy.tenantLogin();
        cy.visit(Cypress.env("REACT_APP_HOSTNAME")  +"/dashboard/tenant/lease-renewal-requests");
        //Navigate to form
        cy.get('[data-testid="nav-menu-button"]').should("be.visible").click();
        cy.get('[data-testid="tenant-lease-agreements-dropdown-menu-item"]').should("be.visible").click();
        cy.get('[data-testid="tenant-view-lease-agreements-menu-item"]').should("be.visible").click();
        cy.get('[data-testid="lease-agreements-table-more-button-0"]').should("be.visible").click();
        cy.get('[data-testid="lease-agreements-table-0-menu-option-0"]').should("be.visible").click();
        cy.get('[data-testid="lease-renewal-button"]').should("be.visible").click();
        cy.get('[data-testid="lease-renewal-request-dialog-continue-button"]').should("be.visible").click();

        //Fill in the form
        cy.get('[data-testid="reason-select"]').should("be.visible").focus();
        cy.get('[data-testid="reason-select"]').should("be.visible").blur();
        cy.get('[data-testid="reason-select-error"]').should("be.visible").contains("Please select a reason for the renewal");
        cy.get('[data-testid="reason-select"]').should("be.visible").select("I am moving to a new place");
        
        cy.get('[data-testid="move-out-date-input"]').should("be.visible").focus();
        cy.get('[data-testid="move-out-date-input"]').should("be.visible").blur();
        cy.get('[data-testid="move-out-date-input-error"]').should("be.visible").contains("Please select a move out date");
        cy.get('[data-testid="move-out-date-input"]').should("be.visible").type("2022-12-12");

        cy.get('[data-testid="comments-textarea"]').should("be.visible").focus();
        cy.get('[data-testid="comments-textarea"]').should("be.visible").blur();
        cy.get('[data-testid="comments-textarea-error"]').should("be.visible").contains("Please enter a breif comment on your reason for renewal");
        cy.get('[data-testid="comments-textarea"]').should("be.visible").type("I am moving to a new place");
        
        cy.get('[data-testid="lease-renewal-form-submit-button"]').should("be.visible").click();

        //Check for success message
        cy.get('[data-testid="alert-modal"]').should("be.visible");
        cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Lease Renewal Request Created");
        cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Your lease renewal request has been created. You will be notified when the property manager responds.");
        cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();
    });

    it('Should try to create another lease renewal request and fail', () => {
        cy.tenantLogin();
        cy.visit(Cypress.env("REACT_APP_HOSTNAME")  +"/dashboard/tenant/");

        //Navigate to form
        cy.get('[data-testid="nav-menu-button"]').should("be.visible").click();
        cy.get('[data-testid="tenant-lease-agreements-dropdown-menu-item"]').should("be.visible").click();
        cy.get('[data-testid="tenant-view-lease-agreements-menu-item"]').should("be.visible").click();
        cy.get('[data-testid="lease-agreements-table-more-button-0"]').should("be.visible").click();
        cy.get('[data-testid="lease-agreements-table-0-menu-option-0"]').should("be.visible").click();
        cy.get('[data-testid="lease-renewal-button"]').should("be.visible").click();
        cy.get('[data-testid="lease-renewal-request-dialog-continue-button"]').should("be.visible").click();

         
        //Fill in the form
        cy.get('[data-testid="reason-select"]').should("be.visible").focus();
        cy.get('[data-testid="reason-select"]').should("be.visible").blur();
        cy.get('[data-testid="reason-select-error"]').should("be.visible").contains("Please select a reason for the renewal");
        cy.get('[data-testid="reason-select"]').should("be.visible").select("I am moving to a new place");
        
        cy.get('[data-testid="move-out-date-input"]').should("be.visible").focus();
        cy.get('[data-testid="move-out-date-input"]').should("be.visible").blur();
        cy.get('[data-testid="move-out-date-input-error"]').should("be.visible").contains("Please select a move out date");
        cy.get('[data-testid="move-out-date-input"]').should("be.visible").type("2022-12-12");

        cy.get('[data-testid="comments-textarea"]').should("be.visible").focus();
        cy.get('[data-testid="comments-textarea"]').should("be.visible").blur();
        cy.get('[data-testid="comments-textarea-error"]').should("be.visible").contains("Please enter a breif comment on your reason for renewal");
        cy.get('[data-testid="comments-textarea"]').should("be.visible").type("I am moving to a new place");
        
        cy.get('[data-testid="lease-renewal-form-submit-button"]').should("be.visible").click();

        cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Error");
        cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Error creating lease renewal request: You already have an active lease renewal request.");
        cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();
    });

    it("should test lease renewal requests page on owner account", () => {
        cy.login();
        cy.visit(Cypress.env("REACT_APP_HOSTNAME")  +"/dashboard/owner/lease-renewal-requests");
        cy.get('[data-testid="lease-renewal-requests-table-more-button-0"]').should("be.visible").click();
        cy.get('[data-testid="lease-renewal-requests-table-0-menu-option-0"]').should("be.visible").click();

        cy.get('[data-testid="lease-renewal-request-reason-heading"]').should("be.visible").contains("Reason");
        cy.get('[data-testid="lease-renewal-request-reason-value"]').should("be.visible").should("not.be.empty");

        cy.get('[data-testid="lease-renewal-request-status-heading"]').should("be.visible").contains("Status");
        cy.get('[data-testid="lease-renewal-request-status-value"]').should("be.visible").should("not.be.empty");

        cy.get('[data-testid="lease-renewal-request-date-requested-heading"]').should("be.visible").contains("Date Requested");
        cy.get('[data-testid="lease-renewal-request-date-requested-value"]').should("be.visible").should("not.be.empty");
        
        cy.get('[data-testId="lease-renewal-request-date-submitted-heading"]').should("be.visible").contains("Date Submitted");
        cy.get('[data-testId="lease-renewal-request-date-submitted-value"]').should("be.visible").should("not.be.empty");

        cy.get('[data-testid="lease-renewal-request-comments-heading"]').should("be.visible").contains("Additional Comments"); 
        cy.get('[data-testid="lease-renewal-request-comments-value"]').should("be.visible").should("not.be.empty");

        cy.get('[data-testid="current-lease-agreement-details-property-heading"]').should("be.visible").contains("Property");
        cy.get('[data-testid="current-lease-agreement-details-property-value"]').should("be.visible").should("not.be.empty");

        cy.get('[data-testid="current-lease-agreement-details-unit-heading"]').should("be.visible").contains("Unit");
        cy.get('[data-testid="current-lease-agreement-details-unit-value"]').should("be.visible").should("not.be.empty");

        cy.get('[data-testid="current-lease-agreement-details-rent-heading"]').should("be.visible").contains("Rent");
        cy.get('[data-testid="current-lease-agreement-details-rent-value"]').should("be.visible").should("not.be.empty");

        cy.get('[data-testid="current-lease-agreement-details-term-heading"]').should("be.visible").contains("Term");
        cy.get('[data-testid="current-lease-agreement-details-term-value"]').should("be.visible").should("not.be.empty");

        cy.get('[data-testid="current-lease-agreement-details-lease-canellation-fee-heading"]').should("be.visible").contains("Lease Renewal Fee");
        cy.get('[data-testid="current-lease-agreement-details-lease-canellation-fee-value"]').should("be.visible").should("not.be.empty");

        cy.get('[data-testid="accept-lease-renewal-button"]').should("be.visible").click();
        cy.get('[data-testid="confirm-modal-cancel-button"]').should("be.visible").click();

        //Reject the lease renewal request
        cy.get('[data-testid="reject-lease-renewal-button"]').should("be.visible").click()
        cy.get('[data-testid="confirm-modal-confirm-button"]').should("be.visible").click()

        cy.get('[data-testid="alert-modal"]').should("be.visible");
        cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Success");
        cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Lease renewal request rejected.");
        cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();

        //Check url 
        cy.url().should("eq", Cypress.env("REACT_APP_HOSTNAME")  +"/dashboard/owner/lease-renewal-requests/");
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
  