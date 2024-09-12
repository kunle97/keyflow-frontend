const hostname = "http://localhost:3000";

describe("Test all functions on the owner Dasboard", () => {
  ///Crewate a preperation function that runs before each test
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login
    // Load login credentials from the fixture
    cy.fixture("loginCredentials").as("credentials");

    

    // Log in using the loaded credentials
    cy.login("Ignacio62@yahoo.com", "Password1");
    
  });
  //   it("Navigate to dashboard", () => {
  //     cy.visit(hostname + "/dashboard/owner/");

  //   });

  it("should detect all cards on the dashboard", () => {
    cy.visit(hostname + "/dashboard/owner/");
    cy.get('[data-testid="dashboard-line-chart-card"]').should("be.visible");
    cy.get('[data-testId="ui-line-chart"]').should("be.visible");

    cy.get('[data-testid="dashboard-line-chart-card"]').should("be.visible");
    // cy.get('[data-testid="dashboard-transactions-card-no-data"]').should("be.visible");
    cy.get('[data-testid="dashboard-transactions-card"]').should("be.visible");
    cy.get('[data-testid="dashboard-pie-chart-card"]').should("be.visible");
    cy.get(
      '[data-testid="dashboard-lease-agreements-card-list-desktop"]'
    ).should("be.visible");
    cy.get(
      '[data-testid="dashboard-lease-agreements-card-list-mobile"]'
    ).should("be.visible");
    cy.get(
      '[data-testid="dashboard-revenue-by-property-pie-chart-card"]'
    ).should("be.visible");
    cy.get(
      '[data-testid="dashboard-maintenance-requests-table-card-desktop"]'
    ).should("be.visible");
    cy.get(
      '[data-testid="dashboard-maintenance-requests-card-list-mobile"]'
    ).should("be.visible");
    cy.get(
      '[data-testid="dashboard-lease-cancellation-requests-table-card-desktop"]'
    ).should("be.visible");
    cy.get(
      '[data-testid="dashboard-lease-cancellation-requests-card-mobile"]'
    ).should("be.visible");
    cy.get(
      '[data-testid="dashboard-lease-cancellation-requests-pie-chart-card"]'
    ).should("be.visible");
    cy.get(
      '[data-testid="dashboard-lease-renewal-requests-table-card-desktop"]'
    ).should("be.visible");
    cy.get(
      '[data-testid="dashboard-lease-renewal-requests-card-mobile"]'
    ).should("be.visible");
    cy.get(
      '[data-testid="dashboard-lease-renewal-requests-pie-chart-card"]'
    ).should("be.visible");
  });

  it("Navigate to all menu items", () => {
    cy.visit(hostname + "/dashboard/owner/");

    // Load menu items from fixture
    cy.fixture("ownerMenuItems.json").then(({ ownerMenuItems }) => {
      // Test Sidebar
      cy.get('[data-testid="nav-menu-button"]').should("be.visible").click();
      cy.get('[data-testid="sidebar-desktop"]').should("be.visible");

      // Iterate through ownerMenuItems
      ownerMenuItems.forEach((menuItem) => {
        // Click on the menu item
        cy.get(`[data-testid="${menuItem.dataTestId}"]`)
          .should("be.visible")
          .click();

        // Check if it has sub-menu items
        if (menuItem.subMenuItems) {
          // Iterate through sub-menu items
          menuItem.subMenuItems.forEach((subMenuItem) => {
            // Forcefully click on sub-menu item without visibility check
            cy.get(`[data-testid="${subMenuItem.dataTestId}"]`).click({
              force: true,
            });
          });

          // Forcefully click on the parent menu item again to reveal the menu
          cy.get(`[data-testid="${menuItem.dataTestId}"]`).click({
            force: true,
          });
        }

        // Click on the navigation menu button to collapse the menu
        cy.get('[data-testid="nav-menu-button"]').should("be.visible").click();
      });
    });
  });

  it("Should test search bar", () => {
    cy.visit(hostname + "/dashboard/owner/");
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
      cy.visit(hostname + "/");
    });
  });
});
