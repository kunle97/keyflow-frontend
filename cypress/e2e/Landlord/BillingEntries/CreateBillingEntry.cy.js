const hostname = "http://localhost:3000";


/*
* Test requiresd the logged in user to have   at lease one tenant and rental unit
*
*/
describe("CreateBillingEntry Component", () => {
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login

    // Log in using the loaded credentials
    cy.login("Sandra83@hotmail.com", "Password1");
    cy.visit(hostname + "/dashboard/owner/billing-entries/create");
    cy.get('[data-testid="create-billing-entry-page-title"]').should("be.visible").contains("Create Billing Entry");
});
it("should render the CreateBillingEntry component", () => {
    
    //Check for form elements on Create BillingEntry Page
    cy.get('[data-testid="type-select"]').should("be.visible").select('revenue');
    cy.get('[data-testid="amount-input"]').should("be.visible");
    cy.get('[data-testid="tenant-select"]').should("be.visible");
    cy.get('[data-testid="status-select"]').should("be.visible");
    cy.get('[data-testid="collection-method-select"]').should("be.visible");
    cy.get('[data-testid="due-date-input"]').should("be.visible");
    cy.get('[data-testid="description-input"]').should("be.visible");
    
    //TODO: Check for change in form ewlements when type is changed to expense
    cy.get('[data-testid="type-select"]').should("be.visible").select('expense');
    cy.get('[data-testid="rental-unit-select"]').should("be.visible");
    cy.get('[data-testid="tenant-select"]').should("not.exist");
    cy.get('[data-testid="collection-method-select"]').should("not.exist");
    cy.get('[data-testid="due-date-input"]').should("be.visible");
  });
  it("should test form validation on CreateBillingEntry Page", () => {
    //Handle Alert Modal MEssages when clicking submit without filling in form
    cy.get('[data-testid="create-billing-entry-submit-button"]').should("be.visible").click();
    cy.get('[data-testid="create-billing-entry-alert-modal"]').should("be.visible");
    cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Error Submitting Form");
    cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Please fix the form errors before submitting.");
    cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();
    cy.reload();
    
    //Test the error message visibility when typing in forms for a revenue billing entry
    cy.get('[data-testid="amount-input"]').should("be.visible").type('100');
    cy.get('[data-testid="amount-error-message"]').should("be.visible").contains("Amount cannot be blank and must be a decimal number with two decimal places");
    cy.get('[data-testid="amount-input"]').should("be.visible").type('.00');
    cy.get('[data-testid="amount-error-message"]').should("not.exist");
    
    cy.get('[data-testid="type-select"]').should("be.visible").select('revenue');
    cy.get('[data-testid="type-select"]').should("be.visible").select('');
    cy.get('[data-testid="type-error-message"]').should("be.visible").contains("Please specify the type of billing entry.");
    cy.get('[data-testid="type-select"]').should("be.visible").select('revenue');
    cy.get('[data-testid="type-error-message"]').should("not.exist");

    cy.get('[data-testid="status-select"]').should("be.visible").select('unpaid');
    cy.get('[data-testid="status-select"]').should("be.visible").select('');
    cy.get('[data-testid="status-error-message"]').should("be.visible").contains("Please specify the status of the billing entry.");
    cy.get('[data-testid="status-select"]').should("be.visible").select('unpaid');
    cy.get('[data-testid="status-error-message"]').should("not.exist");

    cy.get('[data-testid="collection-method-select"]').should("be.visible").select('send_invoice');
    cy.get('[data-testid="collection-method-select"]').should("be.visible").select('');
    cy.get('[data-testid="collection-method-error-message"]').should("be.visible").contains("Please specify the collection method for the invoice of this billing entry.");
    cy.get('[data-testid="collection-method-select"]').should("be.visible").select('send_invoice');
    cy.get('[data-testid="collection-method-error-message"]').should("not.exist");
    
    cy.get('[data-testid="due-date-input"]').should("be.visible").type('2022-12-12');
    cy.get('[data-testid="due-date-error-message"]').should("not.exist");
    cy.get('[data-testid="due-date-input"]').should("be.visible").clear();
    cy.get('[data-testid="due-date-error-message"]').should("be.visible").contains("A due date is required for the billing entry.");
    cy.get('[data-testid="due-date-input"]').should("be.visible").type('2022-12-12');
    cy.get('[data-testid="due-date-error-message"]').should("not.exist");

    cy.get('[data-testid="description-input"]').should("be.visible").type('.');
    cy.get('[data-testid="description-input"]').clear();
    cy.get('[data-testid="description-error-message"]').should("be.visible").contains("A description is required for the billing entry.");
    cy.get('[data-testid="description-input"]').should("be.visible").type('This is a description');
    cy.get('[data-testid="description-error-message"]').should("not.exist");

  });

    it("should test form validation for an expense billing entry", () => {
        cy.get('[data-testid="create-billing-entry-submit-button"]').should("be.visible").click();
    //Handle Alert Modal MEssages when clicking submit without filling in form
    cy.get('[data-testid="create-billing-entry-alert-modal"]').should("be.visible");
    cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();
    cy.get('[data-testid="create-billing-entry-submit-button"]').should("be.visible").click();
    cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Error Submitting Form");
    cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Please fix the form errors before submitting.");
    cy.reload();
    
    cy.get('[data-testid="type-select"]').should("be.visible").select('expense');
    //Test the error message visibility when typing in forms for an expense billing entry
    cy.get('[data-testid="amount-input"]').should("be.visible").type('100');
    cy.get('[data-testid="amount-error-message"]').should("be.visible").contains("Amount cannot be blank and must be a decimal number with two decimal places");
    cy.get('[data-testid="amount-input"]').should("be.visible").type('.00');
    cy.get('[data-testid="amount-error-message"]').should("not.exist");
    
    cy.get('[data-testid="type-select"]').should("be.visible").select('expense');
    cy.get('[data-testid="type-select"]').should("be.visible").select('');
    cy.get('[data-testid="type-error-message"]').should("be.visible").contains("Please specify the type of billing entry.");
    cy.get('[data-testid="type-select"]').should("be.visible").select('expense');
    cy.get('[data-testid="type-error-message"]').should("not.exist");

    cy.get('[data-testid="status-select"]').should("be.visible").select('unpaid');
    cy.get('[data-testid="status-select"]').should("be.visible").select('');
    cy.get('[data-testid="status-error-message"]').should("be.visible").contains("Please specify the status of the billing entry.");
    cy.get('[data-testid="status-select"]').should("be.visible").select('unpaid');
    cy.get('[data-testid="status-error-message"]').should("not.exist");

    cy.get('[data-testid="collection-method-error-message"]').should("not.exist");

    cy.get('[data-testid="due-date-input"]').should("be.visible").type('2022-12-12');
    cy.get('[data-testid="due-date-error-message"]').should("not.exist");
    cy.get('[data-testid="due-date-input"]').should("be.visible").clear();
    cy.get('[data-testid="due-date-error-message"]').should("be.visible").contains("A transaction date is required for the billing entry.");
    cy.get('[data-testid="due-date-input"]').should("be.visible").type('2022-12-12');
    cy.get('[data-testid="due-date-error-message"]').should("not.exist");

    cy.get('[data-testid="description-input"]').should("be.visible").type('.');
    cy.get('[data-testid="description-input"]').clear();
    cy.get('[data-testid="description-error-message"]').should("be.visible").contains("A description is required for the billing entry.");
    cy.get('[data-testid="description-input"]').should("be.visible").type('This is a description');
    cy.get('[data-testid="description-error-message"]').should("not.exist");
    });

    it('should enter valid details and submit the form for revenue type', () => {
        cy.get('[data-testid="type-select"]').should("be.visible").select('revenue');
        cy.get('[data-testid="amount-input"]').should("be.visible").type('100.00');
        cy.get('[data-testid="tenant-select"]').should("be.visible").click();
        cy.get('[data-testid="select-tenant-button-0').should("be.visible").first().click();
        cy.get('[data-testid="status-select"]').should("be.visible").select('unpaid');
        cy.get('[data-testid="collection-method-select"]').should("be.visible").select('send_invoice');
        cy.get('[data-testid="due-date-input"]').should("be.visible").type('2024-12-12');
        cy.get('[data-testid="description-input"]').should("be.visible").type('This is a description');
        cy.get('[data-testid="create-billing-entry-submit-button"]').should("be.visible").click();
        cy.wait(3000);
        //Handle Alert Modal MEssages
        cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Success");
        cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Billing entry created successfully");
        cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();
        //Check if the modal returns to correct page
        cy.get('[data-testid="ui-table-mobile-title"]').should("be.visible").contains("Billing Entries");
    });

    it('should enter valid details and submit the form for expense type', () => {
        cy.get('[data-testid="type-select"]').should("be.visible").select('expense');
        cy.get('[data-testid="amount-input"]').should("be.visible").type('100.00');
        cy.get('[data-testid="rental-unit-select"]').should("be.visible").click();
        cy.get('[data-testid="select-unit-button-0').should("be.visible").first().click();
        cy.get('[data-testid="status-select"]').should("be.visible").select('unpaid');
        cy.get('[data-testid="due-date-input"]').should("be.visible").type('2024-12-12');
        cy.get('[data-testid="description-input"]').should("be.visible").type('This is a description');
        cy.get('[data-testid="create-billing-entry-submit-button"]').should("be.visible").click();
        cy.wait(3000);
        //Handle Alert Modal MEssages
        cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Success");
        cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Billing entry created successfully");
        cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();
        //Check if the modal returns to correct page
        cy.get('[data-testid="ui-table-mobile-title"]').should("be.visible").contains("Billing Entries");
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
