describe("Test the fucntionality of the register page", () => {
    it("Check if register function works when entering incorrect password", () => {
        // Log user out visit this /dashboard/logout
        cy.visit(Cypress.env("REACT_APP_HOSTNAME")  + "/dashboard/owner/register");
    });

});
