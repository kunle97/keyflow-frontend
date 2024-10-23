describe("Test the fucntionality of the lease templates list page", () => {
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login

    // Log in using the loaded credentials
    cy.login();
  });
  
  it("Should check if lease templates list page loads correctly", () => {
    // Log user out visit this /dashboard/logout
    cy.visit(Cypress.env("REACT_APP_HOSTNAME") + "/dashboard/owner/lease-templates");
    cy.get('[data-testid="lease-templates-table"]').should("be.visible");
    cy.get('[data-testid="lease-templates-table-title"]').should("be.visible").contains("Lease Templates");
    cy.get('[data-testid="lease-templates-table-search-input"]').should("be.visible");
    cy.get('[data-testid="ui-table-mobile-create-button"]').should("be.visible");
    cy.wait(5000);
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
