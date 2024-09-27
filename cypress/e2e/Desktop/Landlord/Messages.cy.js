
describe("Test all the owner lease agrrements page", () => {
    beforeEach(() => {
      // Log user out
      cy.viewport(1920, 1080);
      //LOg the user in using the cypress command login
      // Load login credentials from the fixture
      cy.fixture("loginCredentials").as("credentials");
  
      // Log in using the loaded credentials
      cy.login();
    });

it("should navigate to messages and test features", () => {
    cy.visit(Cypress.env("REACT_APP_HOSTNAME")  + "/dashboard/messages/");
    
    cy.get('[data-testid="new-message-button"]').should("be.visible");
    cy.get('[data-testId="select-thread-prompt"]').should("be.visible");

    cy.get('[data-testid="search-bar"]').should("be.visible").type("Testgiorn()$*NT)G(N)(GN$");
    cy.get('[data-testid="message-threads-list"]').should("not.be.visible");
    cy.get('[data-testid="search-bar"]').should("be.visible").clear();

    cy.get('[data-testid="message-thread-0"]').should("be.visible").click();
    cy.get('[data-testid="message-threads-list"]').should("be.visible");

    cy.get('[data-testid="conversation-view"]').should("be.visible").click();
    cy.get('[data-testid="message-input"]').should("be.visible").type("Test Message");
    cy.get('[data-testid="AttachFileIcon"]').should("be.visible").click();
    cy.get('[data-testid="attachment-file-input"]').should("not.be.visible").selectFile('cypress/fixtures/test-property-image.jpg', { force: true });
    cy.get('[data-testid="send-message-button"]').should("be.visible").click();

    cy.get('[data-testid="progress-modal-title"]').should("be.visible").contains("Sending message...");

    cy.get('.message-list-item:last-child').should("be.visible").should("be.visible");
    cy.get('.message-file-attachment:last-child').should("be.visible");
    cy.get('.message-text').last().scrollIntoView().should("be.visible").contains("Test Message");
    
});

afterEach(() => {
    cy.wait(1000);
    //REtrieve the auth object from the getAuth command
    cy.getAuth().then((auth) => {
        // Log user out witht the cypress command logout
        cy.logout(auth.token);
        //Navigate to ethe homepage
        cy.visit(Cypress.env("REACT_APP_HOSTNAME")  + "/");
    }
    );
}
);
});