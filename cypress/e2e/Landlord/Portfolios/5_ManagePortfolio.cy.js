const hostname = "http://localhost:3000";

describe("ManagePortfolio Component", () => {
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login
    // Load login credentials from the fixture
    cy.fixture("loginCredentials").as("credentials");

    // Log in using the loaded credentials
    cy.login("Sandra83@hotmail.com", "Password1");
  });
  it("should render the ManagePortfolio component", () => {
    cy.visit(hostname + "/dashboard/landlord/portfolios/");
    //Click on a portfolio that has a data-testid that starts with portfolio-
    cy.get('[data-testid^="portfolio-"]').first().click();

    // Check if the portfolio name and description are visible
    cy.get('[data-testid="portfolio-name"]').should("be.visible");
    cy.get('[data-testid="portfolio-description"]').should("be.visible");
    
    //Click on the edit button
    cy.get('[data-testid="edit-portfolio-button"]').should("be.visible").click();
    cy.get('[data-testid="edit-portfolio-dialog"]').should("be.visible");
    cy.get('[data-testid="edit-portfolio-name-label"]').should("be.visible");
    cy.get('[data-testid="edit-portfolio-name-input"]').should("be.visible");
    cy.get('[data-testid="edit-portfolio-description-label"]').should("be.visible");
    cy.get('[data-testid="edit-portfolio-description-textarea"]').should("be.visible");
    cy.get('[data-testid="edit-portfolio-submit-button"]').should("be.visible").click();
    //Handle Alert Modal MEssages
    cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Success");
    cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Portfolio updated successfully");
    cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();
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
