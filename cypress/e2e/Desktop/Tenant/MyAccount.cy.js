describe("Test all the owner maintenence request features", () => {
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login
    // Load login credentials from the fixture
    cy.fixture("loginCredentials").as("credentials");

    // Log in using the loaded credentials
    cy.tenantLogin();
  });
  it("should navigate to the tenant my account page and test all functions", () => {
    cy.visit(Cypress.env("REACT_APP_HOSTNAME")  + "/dashboard/tenant/my-account/");
    //Check if the update account button is visible
    cy.get('[data-testid="update-account-button"]').should("be.visible") .click();

    //Check if the alert modal is visible
    cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Success");
    cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Account updated successfully");
    cy.get('[data-testid="alert-modal-button"]').should("be.visible").contains("Okay").click();

    //Check if arbitrary ui elements are visible
    cy.get('[data-testid="change-photo"]').should("be.visible");
    cy.get('[data-testid="user-full-name"]').should("be.visible");
    cy.get('[data-testid="user-email"]').should("be.visible");


    //Account Information Section
    cy.get('[data-testid="manage-billing-btn"]').should("be.visible");
    cy.get('[data-testid="first-name-input-label"]').should("be.visible").contains("First Name");   
    cy.get('[data-testid="first-name-input"]').should("be.visible").clear();
    cy.get('[data-testid="first-name-input"]').should("be.visible").type(" ");
    cy.get('[data-testid="first-name-error"]').should("be.visible").contains("Please enter a valid first name");

    cy.get('[data-testid="last-name-input-label"]').should("be.visible").contains("Last Name");   
    cy.get('[data-testid="last-name-input"]').should("be.visible").clear();
    cy.get('[data-testid="last-name-input"]').should("be.visible").type(" ");
    cy.get('[data-testid="last-name-error"]').should("be.visible").contains("Please enter a valid last name");

    
    cy.get('[data-testid="username-input-label"]').should("be.visible").contains("Username");
    cy.get('[data-testid="username-input"]').should("be.visible").clear();
    cy.get('[data-testid="username-input"]').should("be.visible").type(" ");
    cy.get('[data-testid="username-error"]').should("be.visible").contains("Please enter a valid username");

    cy.get('[data-testid="email-input-label"]').should("be.visible").contains("Email");
    cy.get('[data-testid="email-input"]').should("be.visible").clear();
    cy.get('[data-testid="email-input"]').should("be.visible").type(" ");
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

    //Click the notification-settings-tab
    cy.get('[data-testid="notification-settings-tab"]').click();

    //Test the bill created notification settings
    cy.get('[data-testid="bill_created-label"]').should("be.visible");
    cy.get('[data-testid="bill_created-description"]').should("be.visible");
    cy.get('[data-testid="bill_created-push-label"]').should("be.visible");
    cy.get('[data-testid="bill_created-push-switch"]').should("be.visible").click().click();
    cy.get('[data-testid="bill_created-email-label"]').should("be.visible");
    cy.get('[data-testid="bill_created-email-switch"]').should("be.visible").click().click();

    //Test the lease cancellation request notification settings
    cy.get('[data-testid="lease_cancellation_request_approved-label"]').should("be.visible");
    cy.get('[data-testid="lease_cancellation_request_approved-description"]').should("be.visible");
    cy.get('[data-testid="lease_cancellation_request_approved-push-label"]').should("be.visible");
    cy.get('[data-testid="lease_cancellation_request_approved-push-switch"]').should("be.visible").click().click();
    cy.get('[data-testid="lease_cancellation_request_approved-email-label"]').should("be.visible");
    cy.get('[data-testid="lease_cancellation_request_approved-email-switch"]').should("be.visible").click().click();

    //Test the lease renewal request notification settings
    cy.get('[data-testid="lease_cancellation_request_denied-label"]').should("be.visible");
    cy.get('[data-testid="lease_cancellation_request_denied-description"]').should("be.visible");
    cy.get('[data-testid="lease_cancellation_request_denied-push-label"]').should("be.visible");
    cy.get('[data-testid="lease_cancellation_request_denied-push-switch"]').should("be.visible").click().click();
    cy.get('[data-testid="lease_cancellation_request_denied-email-label"]').should("be.visible");
    cy.get('[data-testid="lease_cancellation_request_denied-email-switch"]').should("be.visible").click().click();
    
    //Test the lease renewal request notification settings
    cy.get('[data-testid="lease_renewal_request_approved-label"]').should("be.visible");
    cy.get('[data-testid="lease_renewal_request_approved-description"]').should("be.visible");
    cy.get('[data-testid="lease_renewal_request_approved-push-label"]').should("be.visible");
    cy.get('[data-testid="lease_renewal_request_approved-push-switch"]').should("be.visible").click().click();
    cy.get('[data-testid="lease_renewal_request_approved-email-label"]').should("be.visible");
    cy.get('[data-testid="lease_renewal_request_approved-email-switch"]').should("be.visible").click().click();
    
    //Test the lease renewal request notification settings
    cy.get('[data-testid="lease_renewal_request_rejected-label"]').should("be.visible");
    cy.get('[data-testid="lease_renewal_request_rejected-description"]').should("be.visible");
    cy.get('[data-testid="lease_renewal_request_rejected-push-label"]').should("be.visible");
    cy.get('[data-testid="lease_renewal_request_rejected-push-switch"]').should("be.visible").click().click();
    cy.get('[data-testid="lease_renewal_request_rejected-email-label"]').should("be.visible");
    cy.get('[data-testid="lease_renewal_request_rejected-email-switch"]').should("be.visible").click().click();
    
    //Test the lease renewal request notification settings
    cy.get('[data-testid="message_received-label"]').should("be.visible");
    cy.get('[data-testid="message_received-description"]').should("be.visible");
    cy.get('[data-testid="message_received-push-label"]').should("be.visible");
    cy.get('[data-testid="message_received-push-switch"]').should("be.visible").click().click();
    cy.get('[data-testid="message_received-email-label"]').should("be.visible");
    cy.get('[data-testid="message_received-email-switch"]').should("be.visible").click().click();
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
