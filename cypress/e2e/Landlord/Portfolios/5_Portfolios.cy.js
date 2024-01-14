
const hostname = "http://localhost:3000";
describe("Test all the portfolios feature", () => {
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login
    // Load login credentials from the fixture
    cy.fixture("loginCredentials").as("credentials");

    // Log in using the loaded credentials
    cy.login("Sandra83@hotmail.com", "Password1");
  });
  it("should navigate to the portfolios page", () => {
    cy.visit(hostname + "/dashboard/landlord/portfolios/");
    cy.get('[data-testid="nav-menu-button"]').should("be.visible").click();
    cy.get('[data-testid="sidebar-desktop"]').should("be.visible");
    cy.get('[data-testid="landlord-properties-dropdown-menu-item"]')
      .should("be.visible")
      .click();
    cy.get('[data-testid="landlord-portfolios-menu-item"]')
      .should("be.visible")
      .click();
    

    //Click on a portfolio that has a data-testid that starts with portfolio-
    cy.get('[data-testid^="portfolio-"]').first().click();


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
