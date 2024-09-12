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

    // Click on the "Add Maintenance Request" button
    cy.get("button").contains("Add Maintenance Request").click();

    // Check if the page contains the text "Add Maintenance Request"
    cy.contains("Add Maintenance Request");

    // Fill out the form
    cy.get("input[name='title']").type("Test Maintenance Request");
    cy.get("textarea[name='description']").type(
      "This is a test maintenance request."
    );
    cy.get("input[name='urgency']").type("High");

    // Submit the form
    cy.get("button").contains("Submit").click();

    // Check if the page contains the text "Maintenance Request submitted successfully"
    cy.contains("Maintenance Request submitted successfully");
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
