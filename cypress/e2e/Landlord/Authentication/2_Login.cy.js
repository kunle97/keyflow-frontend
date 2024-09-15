const hostname = "http://localhost:3000";
describe("Test all functions on the login page", () => {
  it("Check if login function works when entering incorrect password", () => {
    // Log user out visit this /dashboard/logout
    cy.visit(hostname + "/dashboard/owner/login");
    cy.get('[data-testid="keyflow-black-logo"]').should("be.visible");
    //Get login button with data test id og login-button
    cy.get('[data-testid="login-button"]').should("be.visible");
    //Get password input with data test id of password-input
    cy.get('[data-testid="password-input"]').should("be.visible");
    //Get email input with data test id of email-input
    // cy.get('[data-testid="email-input"]').should('be.visible')

    //Clear the password input
    cy.get('[data-testid="password-input"]').clear();
    //Type password into password input
    cy.get('[data-testid="password-input"]').type("wrongpassword");
    //Submit the form
    cy.get('[data-testid="login-button"]').click();

    
    
    
    //Check if the error message is displayed by getting the element with data test id of error-modal
    cy.get('[data-testid="error-modal-modal-modal-title"]').should("be.visible").contains("Login Failed");
    cy.get('[data-testid="error-modal-modal-message"]').contains("Invalid email or password.");
    cy.get("#modal-modal-button").should("be.visible");cy.get('[data-testid="error-modal-modal-message"]')
    //Click the close button
    cy.get("#modal-modal-button").click();
  });
  it("check if login function works when entering correct password", () => {
    // Log user out visit this /dashboard/logout
    cy.visit(hostname + "/dashboard/logout");
    cy.visit(hostname + "/dashboard/owner/login");
    cy.get('[data-testid="keyflow-black-logo"]').should("be.visible");
    //Get login button with data test id og login-button
    cy.get('[data-testid="login-button"]').should("be.visible");
    //Get password input with data test id of password-input
    cy.get('[data-testid="password-input"]').should("be.visible");
    //Get email input with data test id of email-input
    // cy.get('[data-testid="email-input"]').should('be.visible')

    //Clear the password input
    cy.get('[data-testid="password-input"]').clear();
    //Type password into password input
    cy.get('[data-testid="password-input"]').type("Password1");
    //Submit the form
    cy.get('[data-testid="login-button"]').click();
    
    
    //Check if the error message is displayed by getting the element with data test id of error-modal
    cy.get("#modal-modal-title").contains("Login Successful!");
    cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();
    cy.visit(hostname + "/dashboard/logout");
  });
});
