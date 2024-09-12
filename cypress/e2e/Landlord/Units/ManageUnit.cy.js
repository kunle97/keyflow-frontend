const hostname = "http://localhost:3000";

describe("CreateUnit Component", () => {
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login

    // Log in using the loaded credentials
    cy.login();
  });
  
  it("should be able to use all features on manage unit function", () => {
    cy.visit("/dashboard/owner/units"); // Replace with the actual route where your component is rendered
    //Click the dropdown button
    cy.get('[data-testid^="rental-unit-more-button-"]').eq(7).should('be.visible').first().click();
    //Click the view button
    cy.get('[data-testid="rental-unit-7-menu-option-0"]').should('be.visible').click();
    
    // cy.visit("/dashboard/owner/units/181/69/");//Unit with additional charges
    //Click all tabs
    cy.get('[data-testid="unit-details-tab"]').should("be.visible").click();
    //Cehck for unit occupied ui prompt
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="unit-occupied-prompt"]').length > 0) {
        // If the element exists, do something
        // cy.get('[data-testid="alert-modal-button"]').click();
        cy.get('[data-testid="unit-occupied-prompt-title"]').should("be.visible").contains("Unit Occupied");
        cy.get('[data-testid="unit-occupied-prompt-message"]').should("be.visible").contains("You cannot edit the lease terms for this unit because it is occupied.");
        cy.get('[data-testid="unit-occupied-prompt-message"]').should("be.visible")
        cy.get('[data-testid="unit-occupied-prompt-body"]').then(($message) => {
          cy.wrap($message).find('[data-testid="view-tenant-button"]').should("be.visible");
        });
      }else{
        //test lease term preference rows
        cy.get('[data-testid="rent_lease_term-label"] > .MuiTypography-body1').should("be.visible").contains("Rent");
        cy.get('[data-testid="rent_lease_term-label"] > .MuiTypography-body2').should("be.visible").contains("How much you are going to charge for rent per period");
        cy.get('[data-testid="rent_lease_term-input"]').should("be.visible");

        cy.get('[data-testid="rent_collection_day_lease_term-label"] > .MuiTypography-body1').should("be.visible").contains("Rent Collection Day");
        cy.get('[data-testid="rent_collection_day_lease_term-label"] > .MuiTypography-body2').should("be.visible").contains("What day of the month rent is due");
        cy.get('[data-testid="rent_collection_day_lease_term-input"]').should("be.visible");
        
        cy.get('[data-testid="rent_frequency_lease_term-label"] > .MuiTypography-body1').should("be.visible").contains("Rent Frequency");
        cy.get('[data-testid="rent_frequency_lease_term-label"] > .MuiTypography-body2').should("be.visible").contains("How often you are going to charge rent. This can be daily, monthly, weekly, or yearly");
        cy.get('[data-testid="rent_frequency_lease_term-input"]').should("be.visible");

        cy.get('[data-testid="combine_payments_lease_term-label"] > .MuiTypography-body1').should("be.visible").contains("Combine Payments");
        cy.get('[data-testid="combine_payments_lease_term-label"] > .MuiTypography-body2').should("be.visible").contains("Choose if you would like to combine all payments into one invoice for the lease");
        cy.get('[data-testid="combine_payments_lease_term-input"]').should("be.visible");        

        cy.get('[data-testid="term_lease_term-label"] > .MuiTypography-body1').should("be.visible").contains("Term");
        cy.get('[data-testid="term_lease_term-label"] > .MuiTypography-body2').should("be.visible").contains("How long the lease is for in the selected rent frequency");
        cy.get('[data-testid="term_lease_term-input"]').should("be.visible");

        cy.get('[data-testid="late_fee_lease_term-label"] > .MuiTypography-body1').should("be.visible").contains("Late Fee");
        cy.get('[data-testid="late_fee_lease_term-label"] > .MuiTypography-body2').should("be.visible").contains("How much you will charge for late rent payments");
        cy.get('[data-testid="late_fee_lease_term-input"]').should("be.visible");

        cy.get('[data-testid="security_deposit_lease_term-label"] > .MuiTypography-body1').should("be.visible").contains("Security Deposit");
        cy.get('[data-testid="security_deposit_lease_term-label"] > .MuiTypography-body2').should("be.visible").contains("How much the tenant will pay for a security deposit. This will be returned to them at the end of the lease if all conditions are met");
        cy.get('[data-testid="security_deposit_lease_term-input"]').should("be.visible");

        cy.get('[data-testid="gas_included_lease_term-label"] > .MuiTypography-body1').should("be.visible").contains("Include Gas Bill In Rent");
        cy.get('[data-testid="gas_included_lease_term-label"] > .MuiTypography-body2').should("be.visible").contains("Indicates if gas bill is included in the rent");
        cy.get('[data-testid="gas_included_lease_term-switch"]').should("be.visible");

        cy.get('[data-testid="electricity_included_lease_term-label"] > .MuiTypography-body1').should("be.visible").contains("Include Electricity Bill In Rent");
        cy.get('[data-testid="electricity_included_lease_term-label"] > .MuiTypography-body2').should("be.visible").contains("Indicates if electricity bill is included in the rent");
        cy.get('[data-testid="electricity_included_lease_term-switch"]').should("be.visible");

        cy.get('[data-testid="water_included_lease_term-label"] > .MuiTypography-body1').should("be.visible").contains("Include Water Bill In Rent");
        cy.get('[data-testid="water_included_lease_term-label"] > .MuiTypography-body2').should("be.visible").contains("Indicates if water bill is included in the rent");
        cy.get('[data-testid="water_included_lease_term-switch"]').should("be.visible");

        cy.get('[data-testid="repairs_included_lease_term-label"] > .MuiTypography-body1').should("be.visible").contains("Include Repairs In Rent");
        cy.get('[data-testid="repairs_included_lease_term-label"] > .MuiTypography-body2').should("be.visible").contains("Indicates if repairs are included in the rent. If not, the tenant will be responsible for all repair bills");
        cy.get('[data-testid="repairs_included_lease_term-switch"]').should("be.visible");

        cy.get('[data-testid="grace_period_lease_term-label"] > .MuiTypography-body1').should("be.visible").contains("Grace Period");
        cy.get('[data-testid="grace_period_lease_term-label"] > .MuiTypography-body2').should("be.visible").contains("How many days before the first rent payment is due");
        cy.get('[data-testid="grace_period_lease_term-input"]').should("be.visible");

        cy.get('[data-testid="lease_cancellation_notice_period_lease_term-label"] > .MuiTypography-body1').should("be.visible").contains("Lease Cancellation Notice Period");
        cy.get('[data-testid="lease_cancellation_notice_period_lease_term-label"] > .MuiTypography-body2').should("be.visible").contains("How many months a tenant must wait before the end of the lease to cancel the lease");
        cy.get('[data-testid="lease_cancellation_notice_period_lease_term-input"]').should("be.visible");

        cy.get('[data-testid="lease_cancellation_fee_lease_term-label"] > .MuiTypography-body1').should("be.visible").contains("Lease Cancellation Fee");
        cy.get('[data-testid="lease_cancellation_fee_lease_term-label"] > .MuiTypography-body2').should("be.visible").contains("How much the tenant must pay to cancel the lease before the end of the lease");
        cy.get('[data-testid="lease_cancellation_fee_lease_term-input"]').should("be.visible");

        cy.get('[data-testid="lease_renewal_notice_period_lease_term-label"] > .MuiTypography-body1').should("be.visible").contains("Lease Renewal Notice Period");
        cy.get('[data-testid="lease_renewal_notice_period_lease_term-label"] > .MuiTypography-body2').should("be.visible").contains("How many months before the end of the lease the tenant must notify the owner of their intent to renew the lease");
        cy.get('[data-testid="lease_renewal_notice_period_lease_term-input"]').should("be.visible");

        cy.get('[data-testid="lease_renewal_fee_lease_term-label"] > .MuiTypography-body1').should("be.visible").contains("Lease Renewal Fee");
        cy.get('[data-testid="lease_renewal_fee_lease_term-label"] > .MuiTypography-body2').should("be.visible").contains("How much the tenant must pay to renew the lease");
        cy.get('[data-testid="lease_renewal_fee_lease_term-input"]').should("be.visible");

      }
    });
    cy.get('[data-testid="unit-additional-charges-tab"]').should("be.visible").click();
    //If no additional charges are present
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="no-additional-charges-prompt"]').length > 0) {
        // If the element exists, do something
        cy.get('[data-testid="no-additional-charges-prompt-title"]').should("be.visible").contains("No Additional Charges");
        cy.get('[data-testid="no-additional-charges-prompt-message"]').should("be.visible").contains("You have not added any additional charges to this unit. Click the button below to add additional charges.");
        cy.get('[data-testid="no-additional-charges-prompt-body"] > .MuiButtonBase-root').should("be.visible").contains("Add Additional Charges");
        cy.get('[data-testid="no-additional-charges-prompt-body"] > .MuiButtonBase-root').click();

        cy.get('[data-testid="additional-charge-0-name-input"]').should("be.visible");
        cy.get('[data-testid="additional-charge-0-name-input-label"]').should("be.visible");
        cy.get('[data-testid="additional-charge-0-amount-input"]').should("be.visible");
        cy.get('[data-testid="additional-charge-0-amount-input-label"]').should("be.visible");
        cy.get('[data-testid="additional-charge-0-frequency-select"]').should("be.visible");
        cy.get('[data-testid="additional-charge-0-frequency-select-label"]').should("be.visible");
        
        cy.get('[data-testid="additional-charge-0-add-unit-button"]').should("be.visible").click();
        cy.get('[data-testid="additional-charge-0-name-error"]').should("be.visible").contains("Please enter a valid name for the charge");
        cy.get('[data-testid="additional-charge-0-amount-error"]').should("be.visible").contains("Please enter a valid amount");
        cy.get('[data-testid="additional-charge-0-frequency-error"]').should("be.visible").contains("Please select a frequency");

        //Type into the input fields
        cy.get('[data-testid="additional-charge-0-name-input"]').type("Test Charge");
        cy.get('[data-testid="additional-charge-0-amount-input"]').type("100");
        cy.get('[data-testid="additional-charge-0-frequency-select"]').select("month");
        
        cy.get('[data-testid="additional-charge-0-add-unit-button"]').should("be.visible").click();

        cy.get('[data-testid="additional-charge-1-name-input"]').should("be.visible");
        cy.get('[data-testid="additional-charge-1-name-input-label"]').should("be.visible");
        cy.get('[data-testid="additional-charge-1-amount-input"]').should("be.visible");
        cy.get('[data-testid="additional-charge-1-amount-input-label"]').should("be.visible");
        cy.get('[data-testid="additional-charge-1-frequency-select"]').should("be.visible");
        cy.get('[data-testid="additional-charge-1-frequency-select-label"]').should("be.visible");
        
        cy.get('[data-testid="additional-charge-1-remove-unit-button"]').should("be.visible").click();
        
        cy.get('[data-testid="additional-charge-1-name-input"]').should("not.exist");
        cy.get('[data-testid="additional-charge-1-name-input-label"]').should("not.exist");
        cy.get('[data-testid="additional-charge-1-amount-input"]').should("not.exist");
        cy.get('[data-testid="additional-charge-1-amount-input-label"]').should("not.exist");
        cy.get('[data-testid="additional-charge-1-frequency-select"]').should("not.exist");
        cy.get('[data-testid="additional-charge-1-frequency-select-label"]').should("not.exist");
        
      }else{
        //If additional charges are present loop through them
        cy.get('[data-testid^="row-additional-charge-"]').each(($row, $index, $list) => {
          cy.wrap($row).find(`[data-testid^="additional-charge-${$index}-name-"]`).should("be.visible");
          cy.wrap($row).find(`[data-testid^="additional-charge-${$index}-amount-"]`).should("be.visible");
          cy.wrap($row).find(`[data-testid^="additional-charge-${$index}-frequency-"]`).should("be.visible");
          cy.wrap($row).find(`[data-testid^="additional-charge-${$index}-remove-"]`).should("be.visible");
        });
      }
    });

    cy.get('[data-testid="unit-lease-document-tab"]').should("be.visible").click();
    cy.wait(3000);
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="alert-modal-title"]').length > 0) {
        // If the element exists, do something
        cy.get('[data-testid="alert-modal-button"]').click();
      }
    });
    cy.get('[data-testid="unit-lease-template-tab"]').should("be.visible").click();
    cy.get('[data-testid="unit-media-tab"]').should("be.visible").click();
    cy.get('[data-testid="unit-rental-applications-tab"]').should("be.visible").click();
    cy.get('[data-testid="unit-preferences-tab"]').should("be.visible").click();

    //Edit modal
    cy.get('[data-testid="ui-page-header-menu-button"]').should("be.visible").click();
    cy.get('[data-testid="ui-page-header-menu-item-0"]').should("be.visible").click();
    cy.get('[data-testid="edit-unit-dialog"]').should("be.visible");
    cy.get('[data-testid="ui-dialog-title"]').should("be.visible").contains("Edit Unit");
    cy.get('[data-testid="update-unit-name-label"]').should("be.visible");
    cy.get('[data-testid="update-unit-name-input"]').should("be.visible");
    cy.get('[data-testid="update-unit-bed-label"] > strong').should("be.visible");
    cy.get('[data-testid="update-unit-bed-input"]').should("be.visible");
    cy.get('[data-testid="update-unit-baths-label"] > strong').should("be.visible");
    cy.get('[data-testid="update-unit-baths-input"]').should("be.visible");
    cy.get('[data-testid="update-unit-size-label"] > strong').should("be.visible");
    cy.get('[data-testid="update-unit-size-input"]').should("be.visible");
    cy.get('[data-testid="edit-unit-submit-button"]').should("be.visible").click();
    cy.get('[data-testid="alert-modal-title"]').should("be.visible").contains("Success");
    cy.get('[data-testid="alert-modal-message"]').should("be.visible").contains("Unit updated successfully");
    cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();



  });

  // Add more test cases as needed

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
