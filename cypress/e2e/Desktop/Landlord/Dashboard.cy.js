

describe("Test all functions on the owner Dasboard", () => {
  ///Crewate a preperation function that runs before each test
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login
    // Load login credentials from the fixture
    cy.fixture("loginCredentials").as("credentials");

    // Log in using the loaded credentials
    cy.login();
    
  });


  it("should detect all cards on the dashboard", () => {
    cy.visit(Cypress.env("REACT_APP_HOSTNAME")  +"/dashboard/owner/");
    cy.get('[data-testid="dashboard-line-chart-card"]').should("be.visible");
    cy.get('[data-testId="ui-line-chart"]').should("be.visible");

    cy.get('[data-testid="dashboard-line-chart-card"]').should("be.visible");

    //CHeck if the dashboard-transactions-card-no-data" is visible if not visible then check if the dashboard-transactions-card is visible
    cy.get('[data-testid="dashboard-transactions-card-no-data"]').then(($noDataCard) => {
      if ($noDataCard.is(':visible')) {
        // If the 'dashboard-transactions-card-no-data' is visible, assert its visibility
        cy.wrap($noDataCard).should('be.visible');
      } else {
        // If 'dashboard-transactions-card-no-data' is not visible, check for 'dashboard-transactions-card'
        cy.get('[data-testid="dashboard-transactions-card"]').should('be.visible');
      }
    });
    
    cy.get('[data-testid="dashboard-pie-chart-card"]').should("be.visible");
    cy.get(
      '[data-testid="dashboard-lease-agreements-card-list-desktop"]'
    ).should("be.visible");
    // cy.get(
    //   '[data-testid="dashboard-lease-agreements-card-list-mobile"]'
    // ).should("be.visible");
    cy.get(
      '[data-testid="dashboard-revenue-by-property-pie-chart-card"]'
    ).should("be.visible");
    cy.get(
      '[data-testid="dashboard-maintenance-requests-table-card-desktop"]'
    ).should("be.visible");
    // cy.get(
    //   '[data-testid="dashboard-maintenance-requests-card-list-mobile"]'
    // ).should("be.visible");
    cy.get(
      '[data-testid="dashboard-lease-cancellation-requests-table-card-desktop"]'
    ).should("be.visible");
    // cy.get(
    //   '[data-testid="dashboard-lease-cancellation-requests-card-mobile"]'
    // ).should("be.visible");
    cy.get(
      '[data-testid="dashboard-lease-cancellation-requests-pie-chart-card"]'
    ).should("be.visible");
    cy.get(
      '[data-testid="dashboard-lease-renewal-requests-table-card-desktop"]'
    ).should("be.visible");
    // cy.get(
    //   '[data-testid="dashboard-lease-renewal-requests-card-mobile"]'
    // ).should("be.visible");
    cy.get(
      '[data-testid="dashboard-lease-renewal-requests-pie-chart-card"]'
    ).should("be.visible");
  });


  it("Should test search bar", () => {
    cy.visit(Cypress.env("REACT_APP_HOSTNAME")  + "/dashboard/owner/");
    cy.get('[data-testid="search-bar-desktop"]').should("be.visible");
    cy.get('[data-testid="search-bar-submit-button"]').should("be.visible");
    cy.get('[data-testid="search-bar-desktop"]').clear();
    cy.get('[data-testid="search-bar-desktop"]').type("London");
    cy.get('[data-testId="close-search-dialog"]').should("be.visible").click();
    //Click the submit button
    cy.get('[data-testid="search-bar-submit-button"]').click();
    //Type london into the search bar using the data-testId="search-dialog-input"
    cy.get('[data-testId="search-dialog-input"]').type(" ");
    cy.get('[data-testId="all-search-tab"]').should("be.visible").click();
    cy.wait(500);
    cy.get('[data-testId="pages-search-tab"]').should("be.visible").click();
    cy.wait(500);
    cy.get('[data-testId="properties-search-tab"]')
      .should("be.visible")
      .click();
    cy.wait(500);
    cy.get('[data-testId="units-search-tab"]').should("be.visible").click();
    cy.wait(500);
    cy.get('[data-testId="maintenance-request-search-tab"]')
      .should("be.visible")
      .click();
    cy.wait(500);
    cy.get('[data-testId="rental-application-search-tab"]')
      .should("be.visible")
      .click();
    cy.wait(500);
    cy.get('[data-testId="transactions-search-tab"]')
      .should("be.visible")
      .click();
    cy.wait(500);
    cy.get('[data-testId="tenants-search-tab"]').should("be.visible").click();
    cy.wait(500);
    cy.get('[data-testId="close-search-dialog"]').should("be.visible").click();
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
