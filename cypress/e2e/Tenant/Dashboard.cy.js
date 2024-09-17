describe("Test the Bills functionality", () => {
    beforeEach(() => {
      // Log user out
      cy.viewport(1920, 1080);
      //LOg the user in using the cypress command login
  
      // Log in using the loaded credentials
      cy.tenantLogin();
    });
  
    it("Should navigate to bills page", () => {

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
  