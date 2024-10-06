describe("Test all basic functions of the sidebar", () => {
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

  it("Navigate to all menu items", () => {
    cy.visit(Cypress.env("REACT_APP_HOSTNAME") + "/dashboard/owner/");

    cy.fixture("ownerMenuItems.json").then(({ ownerMenuItems }) => {
      // Open sidebar
      cy.get('[data-testid="nav-menu-button"]').should("be.visible").click();
      cy.get('[data-testid="sidebar-desktop"]').should("be.visible");

      ownerMenuItems.forEach((menuItem, index) => {
        // Ensure unique data-testid for menu items
        cy.get(`[data-testid="${menuItem.dataTestId}"]`)
          .first() // Ensure single element is clicked
          .should("be.visible")
          .click();

        if (menuItem.subMenuItems) {
          // Ensure the parent menu is opened
          cy.get(`[data-testid="${menuItem.dataTestId}"]`).then(($menuItem) => {
            if (!$menuItem.hasClass("expanded")) {
              cy.get(`[data-testid="${menuItem.dataTestId}"]`).click({
                force: true,
                multiple: true,
              });
            }
          });

          // Iterate through sub-menu items
          menuItem.subMenuItems.forEach((subMenuItem) => {
            cy.get(`[data-testid="${subMenuItem.dataTestId}"]`).click({
              force: true,
              multiple: true,
            });
          });
        }

        // Close the sidebar after each menu item navigation
        cy.get('[data-testid="nav-menu-button"]').should("be.visible").click();
      });
    });
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
