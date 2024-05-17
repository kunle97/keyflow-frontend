import { faker } from "@faker-js/faker";
const hostname = "http://localhost:3000";
describe("CreatePortfolio Component", () => {
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login

    // Log in using the loaded credentials
    cy.login("Sandra83@hotmail.com", "Password1");
  });
  it("should render the CreatePortfolio component", () => {
    cy.visit(hostname + "/dashboard/owner/portfolios/");
    //Create Portfolio Page
    cy.get('[data-testid="ui-table-mobile-create-button"]').should("be.visible").click();
    cy.get('[data-testid="create-portfolio-title"]').should("be.visible");
    cy.get('[data-testid="create-portfolio-form"]').should("be.visible");
    cy.get('[data-testid="create-portfolio-name-label"]').should("be.visible");
    cy.get('[data-testid="create-portfolio-name-input"]').should("be.visible").type(faker.lorem.word());
    cy.get('[data-testid="create-portfolio-description-label"]').should("be.visible");
    cy.get('[data-testid="create-portfolio-description-textarea"]').should("be.visible").type(faker.lorem.paragraph());
    cy.get('[data-testid="create-portfolio-submit-button"]').should("be.visible").click();

    //Handle Alert Modal MEssages
    cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Success");
    cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Portfolio created successfully");
    cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();
    //Check if the modal returns to correct page
    cy.get('[data-testid="ui-table-mobile-title"]').should("be.visible").contains("Portfolios");
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
