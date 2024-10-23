describe("Test the functionality of the register page", () => {
    beforeEach(() => {
        // Log user out and set the viewport
        cy.viewport(1920, 1080);
        cy.visit(Cypress.env("REACT_APP_HOSTNAME") + "/dashboard/logout");
    });

    it("Check if register function works when entering incorrect password", () => {
        cy.visit(Cypress.env("REACT_APP_HOSTNAME") + "/dashboard/owner/register");

        // Fill in the registration form
        cy.get('[data-testId="first_name"]').clear();
        cy.get('[data-testId="first_name"]').focus();
        cy.get('[data-testId="first_name"]').blur();
        cy.get('[data-testId="first_name_error"]').should("be.visible").contains("Minimum length should be 3 characters");
        cy.get('[data-testId="first_name"]').type("John");

        cy.get('[data-testId="last_name"]').clear();
        cy.get('[data-testId="last_name"]').focus();
        cy.get('[data-testId="last_name"]').blur();
        cy.get('[data-testId="last_name_error"]').should("be.visible").contains("Minimum length should be 3 characters");
        cy.get('[data-testId="last_name"]').type("Doe");


        cy.get('[data-testId="email"]').clear();
        cy.get('[data-testId="email"]').focus();
        cy.get('[data-testId="email"]').blur();
        cy.get('[data-testId="email_error"]').should("be.visible").contains("This field is required");
        cy.get('[data-testid="email"]').type("invalidemail");
        // cy.get('[data-testId="email_error"]').should("be.visible").contains("Please enter a valid email address");
        // cy.get('[data-testId="email"]').clear().type("john.doe@example.com");


        // cy.get('[data-testId="username"]').type("johndoe");
    });
});
