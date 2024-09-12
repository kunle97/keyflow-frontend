describe("Test all basic functions of the sidebar", () => {
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
  it("should detect all sidebar items", () => {
    cy.visit(hostname + "/dashboard/owner/");

    cy.get('[data-testid="nav-menu-button"]').should("be.visible").click();
    cy.get('[data-testid="sidebar-desktop"]').should("be.visible");
    cy.get('[data-testid="owner-properties-menu-item"]')
      .should("be.visible")
      .click();
    cy.get('[data-testid="owner-properties-menu-item"]')
      .should("be.visible")
      .click();
    cy.get('[data-testid="owner-properties-menu-item"]');

    cy.get('[data-testid="owner-lease-agreements-menu-item"]')
      .should("be.visible")
      .click();
    cy.get('[data-testid="owner-lease-agreements-menu-item"]')
      .should("be.visible")
      .click();
    cy.get('[data-testid="owner-lease-agreements-menu-item"]');
    cy.get('[data-testid="owner-maintenance-requests-menu-item"]');
    cy.get('[data-testid="owner-maintenance-requests-menu-item"]').click();
    cy.get('[data-testid="owner-maintenance-requests-menu-item"]').click();
    cy.get('[data-testid="owner-maintenance-requests-menu-item"]');
    cy.get('[data-testid="owner-lease-cancellation-requests-menu-item"]');
    cy.get(
      '[data-testid="owner-lease-cancellation-requests-menu-item"]'
    ).click();
    cy.get(
      '[data-testid="owner-lease-cancellation-requests-menu-item"]'
    ).click();
    cy.get('[data-testid="owner-lease-cancellation-requests-menu-item"]');
    cy.get('[data-testid="owner-lease-renewal-requests-menu-item"]');
    cy.get('[data-testid="owner-lease-renewal-requests-menu-item"]').click();
    cy.get('[data-testid="owner-lease-renewal-requests-menu-item"]').click();

    cy.get('[data-testid="owner-lease-renewal-requests-menu-item"]');
  });
});
