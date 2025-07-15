describe("ManageBillingEntry Component", () => {
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login

    // Log in using the loaded credentials
    cy.login("Sandra83@hotmail.com", "Password1");
    cy.visit(Cypress.env("REACT_APP_HOSTNAME")  + "/dashboard/owner/billing-entries/");
  });
    it("should render the ManageBillingEntry component for revenue", () => {
      // cy.get(".limit-select").select("50");
      //Retrieve a element that has a data ttest id that starts with billing-entries-table-revenue-row
      cy.get('[data-testid^="billing-entries-table-revenue-row"]')
        .first()
        .click();

      //Test For Revenue Billing Entry
      cy.get('[data-testid="tenant-text-display"]').should("be.visible");
      cy.get('[data-testid="type-text-display"]').should("be.visible");
      cy.get('[data-testid="due-date-text-display"]').should("be.visible");
      cy.get('[data-testid="status-select"]').should("be.visible");
      cy.get('[data-testid="description-textarea"]').should("be.visible");
    });

  it("should render the ManageBillingEntry component for an expense", () => {
      cy.get(".limit-select").select("50");
      //Retrieve a element that has a data test id that starts with billing-entries-table-expense-row
      cy.get('[data-testid^="billing-entries-table-expense-row"]')
      .first()
      .click();

      //Test For Expense Billing Entry
      cy.get('[data-testid="unit-text-display"]').should("be.visible");
      cy.get('[data-testid="type-text-display"]').should("be.visible");
      cy.get('[data-testid="due-date-text-display"]').should("be.visible");
      cy.get('[data-testid="status-select"]').should("be.visible");
      cy.get('[data-testid="description-textarea"]').should("be.visible");
    });

  it("should test attempting to update status from paid to unpaid", () => {
    //This test requires the user to have at least one paid expense billing entry
    cy.get(".limit-select").select("50");

    //Retrieve element that is paid and click on it
    cy.contains('.ui-table-mobile-title', /\bpaid\b/i).first().click();

    cy.get('[data-testid="status-select"]')
      .should("be.visible")
      .select("unpaid");
    cy.get('[data-testid="alert-modal-title"]')
      .should("be.visible")
      .contains("Cannot Mark as Unpaid");
    cy.get('[data-testid="alert-modal-message"]')
      .should("be.visible")
      .contains(
        "This billing entry has already been marked as paid. It cannot be marked as unpaid."
      );
    cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();

    //Ensure the value of the status select is paid
    cy.get('[data-testid="status-select"]')
      .should("be.visible")
      .contains("Paid");
  });
  it("should test attempting to update status from unpaid to paid", () => {
    //This test requires the user to have at least one unpaid expense billing entry
    cy.get(".limit-select").select("50");

    //Retrieve element that is unpaid and click on it
    cy.contains(".ui-table-mobile-title", /\bunpaid\b/i)
      .first()
      .click();

    // cy.get('[data-testid="status-select"]').should("be.visible").select("paid");
    // cy.get('[data-testid="confirm-modal-title"]')
    //   .should("be.visible")
    //   .contains("Mark as Paid");
    // cy.get('[data-testid="confirm-modal-message"]')
    //   .should("be.visible")
    //   .contains(
    //     "Are you sure you want to mark this billing entry as paid? The invoice will be marked as paid and finalized. This action cannot be undone."
    //   );
    // cy.get('[data-testid="confirm-modal-cancel-button"]')
    //   .should("be.visible")
    //   .click();

    //Ensure the value of the status select is unpaid
    cy.get('[data-testid="status-select"]')
      .should("be.visible")
      .contains("Unpaid");

    //Check when user clicks confirm
    cy.get('[data-testid="status-select"]').should("be.visible").select("paid");
    cy.get('[data-testid="confirm-modal-title"]')
      .should("be.visible")
      .contains("Mark as Paid");
    cy.get('[data-testid="confirm-modal-message"]')
      .should("be.visible")
      .contains(
        "Are you sure you want to mark this billing entry as paid? The invoice will be marked as paid and finalized. This action cannot be undone."
      );
    cy.get('[data-testid="confirm-modal-confirm-button"]')
      .should("be.visible")
      .click();
    cy.get('[data-testid="status-select"]')
      .should("be.visible")
      .contains("Paid");

    //TODO: Submit the form
    cy.get('[data-testid="update-billing-entry-button"]')
      .should("be.visible")
      .click();
    //Retrrieve alert title details
    cy.get('[data-testid="alert-modal-title"]')
      .should("be.visible")
      .contains("Success");
    cy.get('[data-testid="alert-modal-message"]')
      .should("be.visible")
      .contains("Billing entry updated successfully");
    cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();
  });

  //TODO: Create tests for trying to update the description  expense billing entry
  it("should test attempting to update the description of an expense billing entry", () => {
    //This test requires the user to have at least one unpaid expense billing entry
    cy.get(".limit-select").select("50");

    //Retrieve element that is unpaid and click on it
    cy.get('[data-testid^="billing-entries-table-"]').first().click();

    cy.get('[data-testid="description-textarea"]')
      .should("be.visible")
      .clear()
      .type("This is a new description");

    cy.get('[data-testid="description-textarea"]').should("be.visible").clear();

    //Check for error message
    cy.get('[data-testid="description-error-message"]')
      .should("be.visible")
      .contains("A description is required for the billing entry.");

    cy.get('[data-testid="description-textarea"]')
      .should("be.visible")
      .clear()
      .type("This is a new description");
    cy.get('[data-testid="update-billing-entry-button"]')
      .should("be.visible")
      .click();
    //Retrrieve alert title details
    cy.get('[data-testid="alert-modal-title"]')
      .should("be.visible")
      .contains("Success");
    cy.get('[data-testid="alert-modal-message"]')
      .should("be.visible")
      .contains("Billing entry updated successfully");
    cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();
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
