describe("Test all the owner maintenence request features", () => {
    beforeEach(() => {
      // Log user out
      cy.viewport(1920, 1080);
      //LOg the user in using the cypress command login
      // Load login credentials from the fixture
      cy.fixture("loginCredentials").as("credentials");
  
      // Log in using the loaded credentials
      cy.login();
    });

    it("should navigate to the My Account page", () => {
        cy.visit(Cypress.env("REACT_APP_HOSTNAME")  + "/dashboard/owner/my-account/");
        cy.get('[data-testid="update-account-button"]').should("be.visible") .click();
        cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Success");
        cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Account updated successfully");
        cy.get('[data-testid="alert-modal-button"]').should("be.visible").contains("Okay").click();

        cy.get('[data-testid="change-photo"]').should("be.visible");
        cy.get('[data-testid="user-full-name"]').should("be.visible");
        cy.get('[data-testid="user-email"]').should("be.visible");
        cy.get('[data-testid="stripe-dashboard-btn"]').should("be.visible");

        //Account Information Section
        cy.get('[data-testid="manage-billing-btn"]').should("be.visible");
        cy.get('[data-testid="first-name-account-imput-label"]').should("be.visible").contains("First Name");   
        cy.get('[data-testid="first-name-account-imput"]').should("be.visible").clear();
        cy.get('[data-testid="first-name-account-imput"]').should("be.visible").type(" ");
        cy.get('[data-testid="first-name-error"]').should("be.visible").contains("Please enter a valid first name");

        cy.get('[data-testid="last-name-account-imput-label"]').should("be.visible").contains("Last Name");   
        cy.get('[data-testid="last-name-account-imput"]').should("be.visible").clear();
        cy.get('[data-testid="last-name-account-imput"]').should("be.visible").type(" ");
        cy.get('[data-testid="last-name-error"]').should("be.visible").contains("Please enter a valid last name");

     
        cy.get('[data-testid="username-account-imput-label"]').should("be.visible").contains("Username");
        cy.get('[data-testid="username-account-imput"]').should("be.visible").clear();
        cy.get('[data-testid="username-account-imput"]').should("be.visible").type(" ");
        cy.get('[data-testid="username-error"]').should("be.visible").contains("Please enter a valid username");

        cy.get('[data-testid="email-account-imput-label"]').should("be.visible").contains("Email");
        cy.get('[data-testid="email-account-imput"]').should("be.visible").clear();
        cy.get('[data-testid="email-account-imput"]').should("be.visible").type(" ");
        cy.get('[data-testid="email-error"]').should("be.visible").contains("Please enter a valid email");


        //Change Password Section
        cy.get('[data-testid="current-password-input-label"]').should("be.visible").contains("Current Password");
        cy.get('[data-testid="current-password-input"]').should("be.visible").focus();
        cy.get('[data-testid="current-password-input"]').should("be.visible").blur();
        cy.get('[data-testid="current-password-error"]').should("be.visible").contains("Please enter your current password");

        cy.get('[data-testid="new-password-input-label"]').should("be.visible").contains("New Password");
        cy.get('[data-testid="new-password-input"]').should("be.visible").focus();
        cy.get('[data-testid="new-password-input"]').should("be.visible").blur();
        cy.get('[data-testid="new-password-error"]').should("be.visible").contains("Your password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character");

        cy.get('[data-testid="repeat-password-input-label"]').should("be.visible");
        cy.get('[data-testid="repeat-password-input"]').should("be.visible").focus();
        cy.get('[data-testid="repeat-password-input"]').should("be.visible").blur();
        cy.get('[data-testid="repeat-password-error"]').should("be.visible").contains("New passwords must match");

        cy.get('[data-testid="change-password-button"]').should("be.visible")// .click();

    });

    afterEach(() => {
      cy.wait(1000);
      //REtrieve the auth object from the getAuth command
      cy.getAuth().then((auth) => {
        // Log user out witht the cypress command logout
        cy.logout(auth.token);
        //Navigate to ethe homepage
        cy.visit(Cypress.env("REACT_APP_HOSTNAME") + "/");
      });
    });
  });
  