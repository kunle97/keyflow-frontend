import { Copyright } from "@mui/icons-material";

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
        cy.get('[data-testid="move-in-date-input"]').should("be.visible").focus();
        cy.get('[data-testid="move-in-date-input"]').should("be.visible").blur();
        cy.get('[data-testid="move-in-date-input-error"]').should("be.visible").contains("Please enter a valid move in date");
        cy.get('[data-testid="move-in-date-input"]').should("be.visible").type("2025-12-12");
        cy.get('[data-testid="step-0-next-button"]').should("be.visible").click();
        
        //Test Current lease terms selection
        cy.get('[data-testid="current-lease-radio"]').should("be.visible").click();
        cy.get('[data-testid="current-lease-terms-label"]').should("be.visible").contains("Term");
        cy.get('[data-testid="current-lease-terms-term-value"]').should("be.visible").should("not.be.empty");
        
        cy.get('[data-testid="current-lease-terms-rent-label"]').should("be.visible").contains("Rent");
        cy.get('[data-testid="current-lease-terms-rent-value"]').should("be.visible").should("not.be.empty");

        cy.get('[data-testid="current-lease-terms-late-fee-label"]').should("be.visible").contains("Late Fee");
        cy.get('[data-testid="current-lease-terms-late-fee-value"]').should("be.visible").should("not.be.empty");

        cy.get('[data-testid="current-lease-terms-security-deposit-label"]').should("be.visible").contains("Security Deposit");
        cy.get('[data-testid="current-lease-terms-security-deposit-value"]').should("be.visible").should("not.be.empty");
        
        //Test New Lease term selection
        cy.get('[data-testid="new-lease-radio"]').should("be.visible").click();
        cy.get('[data-testid="lease-term-input"]').should("be.visible").focus();
        cy.get('[data-testid="lease-term-input"]').should("be.visible").blur();
        cy.get('[data-testid="lease-term-input-error"]').should("be.visible").contains("Please enter a valid lease term");
        cy.get('[data-testid="lease-term-input"]').should("be.visible").type("13");

        cy.get('[data-testid="rent-frequency-select"]').should("be.visible").focus();
        cy.get('[data-testid="rent-frequency-select"]').should("be.visible").blur();
        cy.get('[data-testid="rent-frequency-select-error"]').should("be.visible").contains("Please select a rent frequency");
        cy.get('[data-testid="rent-frequency-select"]').should("be.visible").select("Month(s)"); 
        
        //switch back to current lease terms
        cy.get('[data-testid="current-lease-radio"]').should("be.visible").click();
        cy.get('[data-testid="step-1-next-button"]').should("be.visible").click();
        cy.get('[data-testid="new-unit-radio"]').should("be.visible").click();
        cy.get('[data-testid="rental-unit-search-input"]').should("be.visible").type("Unit 1");
        cy.get('[data-testid="rental-unit-search-input"]').should("be.visible").clear();
        cy.get('[data-testid="unit-row-0-name"]').should("be.visible").should("not.be.empty");
        cy.get('[data-testid="unit-row-0-property-name"]').should("be.visible").should("not.be.empty");
        cy.get('[data-testid="select-unit-button-0"]').should("be.visible").click();
        
        cy.get('[data-testid="step-3-back-button"]').should("be.visible").click();
        cy.get('[data-testid="current-unit-radio"]').should("be.visible").click();
        
        cy.get('[data-testid="step-2-next-button"]').should("be.visible").click();
        cy.get('[data-testid="comments-textarea"]').should("be.visible").type("I like it here");
        
        //Navigate to confirmation step
        cy.get('[data-testid="step-3-next-button"]').should("be.visible").click();
        cy.get('[data-testid="confirmation-step-title"]').should("be.visible").contains("Submit Lease Renewal Request?");
        cy.get('[data-testid="confirmation-step-message"]').should("be.visible").contains("Are you sure you want to submit this lease renewal request? You will not be able to edit this request once it has been submitted. Below is a summary of your lease renewal request. Please review before submitting.");
        cy.get('[data-testid="step-4-back-button"]').should("be.visible");
        cy.get('[data-testid="submit-button"]').should("be.visible").click();

        // //Check for success message
        cy.get('[data-testid="alert-modal"]').should("be.visible");
        cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Lease Renewal Request Submitted");
        cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Your lease renewal request has been submitted successfully. You will be notified once your owner has responded to your request.");
        cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();
    });

    it('Should try to create another lease renewal request and fail', () => {
        cy.tenantLogin();
        cy.visit(Cypress.env("REACT_APP_HOSTNAME")  +"/dashboard/tenant/lease-renewal-requests");
        //Navigate to form
        cy.get('[data-testid="nav-menu-button"]').should("be.visible").click();
        cy.get('[data-testid="tenant-lease-agreements-dropdown-menu-item"]').should("be.visible").click();
        cy.get('[data-testid="tenant-view-lease-agreements-menu-item"]').should("be.visible").click();
        cy.get('[data-testid="lease-agreements-table-more-button-0"]').should("be.visible").click();
        cy.get('[data-testid="lease-agreements-table-0-menu-option-0"]').should("be.visible").click();
        cy.get('[data-testid="lease-renewal-button"]').should("be.visible").click();

        cy.get('[data-testid="alert-modal"]').should("be.visible");
        cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Existing Lease Renewal Request");
        cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("You already have an existing lease renewal request. You will be notified when the property manager responds.");
        cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();

    });

    it("should test lease renewal requests page on owner account", () => {
        cy.login();
        cy.visit(Cypress.env("REACT_APP_HOSTNAME")  +"/dashboard/owner/lease-renewal-requests");
        cy.get('[data-testid="lease-renewal-requests-table-more-button-0"]').should("be.visible").click();
        cy.get('[data-testid="lease-renewal-requests-table-0-menu-option-0"]').should("be.visible").click();

        //Test Lease Agreement details
        cy.get('[data-testId="current-lease-agreement-heading"]').should("be.visible").contains("Current Lease Agreement Details");

        cy.get('[data-testId="current-lease-agreement-unit-heading"]').should("be.visible").contains("Unit");
        cy.get('[data-testId="current-lease-agreement-unit-value"]').should("be.visible").should("not.be.empty");

        cy.get('[data-testid="current-lease-agreement-term-heading"]').should("be.visible").contains("Term");
        cy.get('[data-testid="current-lease-agreement-term-value"]').should("be.visible").should("not.be.empty");
        cy.get('[data-testId="current-lease-agreement-rent-frequency-value"]').should("be.visible").should("not.be.empty");

        cy.get('[data-testid="current-lease-agreement-property-heading"]').should("be.visible").contains("Property");
        cy.get('[data-testid="current-lease-agreement-property-value"]').should("be.visible").should("not.be.empty");

        cy.get('[data-testid="current-lease-agreement-rent-heading"]').should("be.visible").contains("Rent");
        cy.get('[data-testid="current-lease-agreement-rent-value"]').should("be.visible").should("not.be.empty");
            
        cy.get('[data-testid="current-lease-agreement-start-date-heading"]').should("be.visible").contains("Lease Start Date");
        cy.get('[data-testid="current-lease-agreement-start-date-value"]').should("be.visible").should("not.be.empty");
            
        cy.get('[data-testid="current-lease-agreement-end-date-heading"]').should("be.visible").contains("Lease End Date");
        cy.get('[data-testid="current-lease-agreement-end-date-value"]').should("be.visible").should("not.be.empty");
        
        //Test Lease renewal request details
        cy.get('[data-testId="lease-renewal-request-details-heading"]').should("be.visible").contains("Lease Renewal Request Details");
        
        cy.get('[data-testid="lease-renewal-request-unit-heading"]').should("be.visible").contains("Requested Unit");
        cy.get('[data-testid="lease-renewal-request-unit-value"]').should("be.visible").should("not.be.empty");

        cy.get('[data-testid="lease-renewal-request-term-heading"]').should("be.visible").contains("Requested Lease Term");
        cy.get('[data-testid="lease-renewal-request-term-value"]').should("be.visible").should("not.be.empty");
        // cy.get('[data-testId="lease-renewal-request-rent-frequency-value"]').should("be.visible").should("not.be.empty"); //TODO: FIX THIS

        cy.get('[data-testid="lease-renewal-request-desired-move-in-date-heading"]').should("be.visible").contains("Desired Move In Date");
        cy.get('[data-testid="lease-renewal-request-desired-move-in-date-value"]')

        cy.get('[data-testid="lease-renewal-request-date-submitted-heading"]').should("be.visible").contains("Date Submitted");
        cy.get('[data-testid="lease-renewal-request-date-submitted-value"]').should("be.visible").should("not.be.empty");

        cy.get('[data-testid="lease-renewal-request-additional-comments-heading"]').should("be.visible").contains("Additional Comments");

        //Tenant  Bills list
        cy.get('[data-testid="tenant-bills-list"]').should("be.visible");

        cy.get('#accept-lease-renewal-button').should("be.visible").click();
        
        //Test LEase Term mismatch
        cy.get('[data-testid="confirm-modal-title"]').should("be.visible").contains("Lease Term Mismatch");
        cy.get('[data-testid="confirm-modal-message"]').should("be.visible")  .invoke('text') // Get the text content
        .then((text) => {
          expect(text.trim().startsWith("The tenant chose a different lease term than the current lease template. Unit")).to.be.true; // Assert that it starts with the specific text
        });
        //
        cy.get('[data-testid="confirm-modal-cancel-button"]').should("be.visible");
        cy.get('[data-testid="confirm-modal-confirm-button"]').should("be.visible").click();

        //Mismatch resolved alert
        cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Success");
        cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("The unit's lease terms were successfully updated. You can now proceed to accept the lease renewal request.");
        cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();

        cy.get('[data-testid="prompt-title"]').should("be.visible").contains("Are you sure?");
        cy.get('[data-testid="prompt-message"]').should("be.visible").contains("Are you sure you want to accept this lease renewal request?");
        cy.get('[data-testId="final-accept-yes-button"]').should("be.visible");
        cy.get('[data-testId="final-accept-no-button"]').should("be.visible").click();
        cy.get('[data-testid="back-button"]').should("be.visible").click(); //Go back to the lease renewal request details

        //Reject the lease renewal request
        cy.get('#reject-lease-renewal-button').click();
        cy.get('[data-testid="confirm-modal-cancel-button"]').should("be.visible");
        cy.get('[data-testid="confirm-modal-confirm-button"]').should("be.visible").click()

        cy.get('[data-testid="alert-modal"]').should("be.visible");
        cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Success");
        cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Lease renewal request rejected.");
        cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();

        // Check url 
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
  