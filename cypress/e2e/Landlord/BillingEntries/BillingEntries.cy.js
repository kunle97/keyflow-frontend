

describe("ManageBillingEntry Component", () => {
    beforeEach(() => {
        // Log user out
        cy.viewport(1920, 1080);
        //LOg the user in using the cypress command login
    
        // Log in using the loaded credentials
        cy.login();
    }
    );
    it("should render the ManageBillingEntry component", () => {
        cy.visit(Cypress.env("REACT_APP_HOSTNAME") + "/dashboard/owner/billing-entries/");
        cy.wait(1500);
        cy.get('[data-testid="billing-entries-table-result-count"]').should("be.visible").then(($resultCount) => {
            const resultText = $resultCount.text().trim();  // Get the text content and trim whitespace
            if (resultText === "()" || resultText == "(0)") {  // Check if the text is empty
                cy.get('[data-testid="billing-entries-table-no-results-ui-prompt"]').should("be.visible");
                cy.get('[data-testid="billing-entries-table"]').should("not.exist");
            } else {
                cy.get('[data-testid="billing-entries-table-no-results-ui-prompt"]').should("not.exist");
                cy.get('[data-testid="billing-entries-table"]').should("be.visible"); 
            }

            //Create New Billing Entry
            cy.get('.ui-table-create-button').click();
            
            cy.get('[data-testid="amount-input-label"]').should("be.visible").contains("Amount");
            cy.get('[data-testid="amount-input"]').should("be.visible").focus().blur();
            cy.get('[data-testid="amount-error-message"]').should("be.visible").contains("Amount cannot be blank and must be a decimal number with two decimal places");
            cy.get('[data-testid="amount-input"]').should("be.visible").type("100");
            cy.get('[data-testid="amount-error-message"]').should("not.exist");

            cy.get('[data-testid="type-select-label"]').should("be.visible").contains("Type");
            cy.get('[data-testid="type-select"]').should("be.visible").focus().blur();
            cy.get('[data-testid="type-error-message"]').should("be.visible").contains("Please specify the type of billing entry.");
            cy.get('[data-testid="type-select"]').select("General Revenue (Revenue)");
            cy.get('[data-testid="type-select"]').select("Security Deposit (Revenue)");
            cy.get('[data-testid="type-select"]').select("Rent Payment (Revenue)");
            cy.get('[data-testid="type-select"]').select("Late Fee (Revenue)");
            cy.get('[data-testid="type-select"]').select("Pet Fee (Revenue)");
            cy.get('[data-testid="type-select"]').select("Lease Renewal Fee (Revenue)");
            cy.get('[data-testid="type-select"]').select("Lease Cancellation Fee (Revenue)");
            cy.get('[data-testid="type-select"]').select("Maintenance Fee (Revenue)");
            cy.get('[data-testid="tenant-select-label"]').should("be.visible").contains("Tenant");
            cy.get('[data-testid="tenant-select"]').should("be.visible").click();
            cy.get('[data-testid="tenant-search-input"]').should("be.visible").type("Sandra");
            cy.get('[data-testid="tenant-search-input"]').should("be.visible").type(" ");
            cy.get('[data-testid="select-tenant-button-0"]').should("be.visible").click();
            cy.get('[data-testid="type-select"]').select("General Expense (Expense)");
            cy.get('[data-testid="type-select"]').select("Vendor Payment (Expense)");
            cy.get('[data-testid="rental-unit-select-label"]').should("be.visible").contains("Rental Unit");
            cy.get('[data-testid="rental-unit-select"]').should("be.visible").click();
            cy.get('[data-testid="rental-unit-search-input"]').should("be.visible").type("5B");
            cy.get('[data-testid="rental-unit-search-input"]').should("be.visible").clear();
            cy.get('[data-testid="rental-unit-search-input"]').should("be.visible").type(" ");

            cy.get('[data-testid="select-unit-button-0"]').should("be.visible").click();
            cy.get('[data-testid="type-error-message"]').should("not.exist");
            
            cy.get('[data-testid="status-select-label"]').should("be.visible").contains("Status");
            cy.get('[data-testid="status-select"]').should("be.visible").focus().blur();
            cy.get('[data-testid="status-error-message"]').should("be.visible").contains("Please specify the status of the billing entry.");
            cy.get('[data-testid="status-select"]').select("Unpaid");
            cy.get('[data-testid="due-date-input-label"]').should("be.visible").contains("Due Date");
            cy.get('[data-testid="due-date-input"]').should("be.visible").focus().blur();
            cy.get('[data-testid="due-date-error-message"]').should("be.visible").contains("A due date is required for the billing entry.");
            cy.get('[data-testid="due-date-input"]').should("be.visible").type("2021-08-01");
            
            
            cy.get('[data-testid="status-select"]').select("Paid");
            cy.get('[data-testid="due-date-input-label"]').should("be.visible").contains("Transaction Date");
            cy.get('[data-testid="due-date-input"]').should("be.visible").clear();
            cy.get('[data-testid="due-date-input"]').should("be.visible").focus().blur();
            cy.get('[data-testid="due-date-error-message"]').should("be.visible").contains("A transaction date is required for the billing entry.");
            cy.get('[data-testid="due-date-input"]').should("be.visible").type("2021-08-01");
            
            cy.get('[data-testid="description-input-label"]').should("be.visible").contains("Description");
            cy.get('[data-testid="description-input"]').should("be.visible").focus().blur();
            cy.get('[data-testid="description-error-message"]').should("be.visible").contains("A description is required for the billing entry.");
            cy.get('[data-testid="description-input"]').should("be.visible").type("This is a test for the description");
            cy.get('[data-testid="description-error-message"]').should("not.exist");

            
            //Click submit button
            cy.get('[data-testid="create-billing-entry-submit-button"]').should("be.visible").click();

            cy.wait(1500)

            //Handle The alert modal
            cy.get('[data-testid="create-billing-entry-alert-modal"]').should("be.visible");
            cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Success");
            cy.get('[data-testid="create-billing-entry-alert-modal-modal-message"]').should("be.visible").contains("Billing entry created successfully");
            cy.get('[data-testid="create-billing-entry-alert-modal-modal-button"]').should("be.visible").click();

            //Manage Billing Entry
            cy.get('[data-testid="amount-text-display"]').should("be.visible");
            cy.get('[data-testid="type-text-display"]').should("be.visible");
            cy.get('[data-testid="due-date-text-display"]').should("be.visible");
            cy.get('[data-testid="status-select"]').should("be.visible");
            cy.get('[data-testid="description-textarea"]').should("be.visible");

            //Update Billing Entry
            cy.get('[data-testid="update-billing-entry-button"]').should("be.visible").click();
            cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Success");   
            cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Billing entry updated successfully");
            cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();
            
            cy.get('[data-testid="ui-page-header-menu-button"]').should("be.visible").click();
            cy.get('[data-testid="ui-page-header-menu-item-0"]').should("be.visible").click();
            cy.get('[data-testid="confirm-modal-confirm-button"]').should("be.visible").click();

            //Check that the page is on the billing entries page /dashboard/owner/billing-entries/
        });
        
        //using an if statement Check if the no results prompt is visible
        

    }
    );
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
}
);