// This test requires:
// -  the test owner to have at least 1 lease template and
// -  that all properties has NO lease template attached to them

import { faker } from "@faker-js/faker";

describe("Test the Dashboard functionality", () => {
  const unitName = `unit-${Math.random().toString(36).substring(2, 10)}`;
  let createRentalApplicationLink = "";
  let rentalApplicationDetailLink = "";
  let leaseAgreementSignLink = "";
  let registrationLink = "";
  console.log("Unit name" + unitName);
  const testData = [
    {
      name: unitName,
      beds: faker.number.int({ min: 4, max: 10 }),
      baths: faker.number.int({ min: 4, max: 6 }),
      size: faker.number.int({ min: 500, max: 1500 }),
    },
  ];
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login
  });

  it("Should navigate to dashboard and create a new unit ", () => {
    cy.login();

    //Create the unit
    cy.visit("/dashboard/owner/units/create");
    // //Click the add unit button 5 times using a loop
    cy.get('[data-testid^="unit-row-"]').each(($row, index) => {
      // Check if index is within the bounds of testData array
      if (index < testData.length) {
        // Add test data to each row
        cy.get(`[data-testid="unit-row-${index}-name-input"]`).clear();
        cy.get(`[data-testid="unit-row-${index}-name-input"]`).type(
          testData[index].name
        );
        cy.get(`[data-testid="unit-row-${index}-beds-input"]`).clear();
        cy.get(`[data-testid="unit-row-${index}-beds-input"]`).type(
          testData[index].beds
        );
        cy.get(`[data-testid="unit-row-${index}-baths-input"]`).clear();
        cy.get(`[data-testid="unit-row-${index}-baths-input"]`).type(
          testData[index].baths
        );
        cy.get(`[data-testid="unit-row-${index}-size-input"]`).clear();
        cy.get(`[data-testid="unit-row-${index}-size-input"]`).type(
          testData[index].size
        );
      } else {
        // Handle the case where index is out of bounds
        cy.log(`Index ${index} is out of bounds for testData array.`);
      }
    });

    //Select the first property in the in the select form element
    cy.get('[data-testid="create-unit-property-select"] option')
      .eq(2)
      .then((option) => {
        cy.get('[data-testid="create-unit-property-select"]').select(
          option.val()
        );
      });

    // Submit the form
    cy.get('[data-testid="create-unit-submit-button"]').click();
    cy.wait(1000);

    //Find the new Unit
    cy.visit("/dashboard/owner/units");
    cy.get('[data-testId="units-table"]').should("be.visible");

    //find and select the new unit in the table
    cy.get('[data-testid="units-table-search-input"]').type(unitName);
    cy.log("Unit Name: " + unitName);
    // cy.get('[data-testid="units-table-row-0-name"]').should("be.visible").contains(testData[0].name);
    cy.get('[data-testid="rental-unit-more-button-0"]')
      .should("be.visible")
      .click();
    cy.get('[data-testid="rental-unit-0-menu-option-0"]')
      .should("be.visible")
      .click();

    cy.wait(1000);

    //Change lease template for the unit
    cy.get('[data-testid="unit-lease-template-tab"]')
      .should("be.visible")
      .click();
    cy.get('[data-testid="prompt-body"] > .MuiButtonBase-root')
      .should("be.visible")
      .click();
    cy.get('[data-testid="select-lease-template-button-0"]')
      .should("be.visible")
      .click();

    //Get rental application link

    cy.get('[data-testid="ui-page-header-menu-button"]')
      .should("be.visible")
      .click();
    cy.get('[data-testid="ui-page-header-menu-item-2"]')
      .should("be.visible")
      .click();
    cy.get('[data-testid="rental-application-link-input"]')
      .should("be.visible")
      .then(($input) => {
        createRentalApplicationLink = $input.val();
      });
  });
  it("Should Create a rental Application using the createRentalApplicationLink", () => {
    //Navigate to the rental application link
    cy.visit(createRentalApplicationLink);
    cy.get('[data-testid="next-button"]').should("be.visible").click();
    cy.get('[data-testid="next-button"]').should("be.visible").click();
    cy.get('[data-testid="next-button"]').should("be.visible").click();
    cy.get('[data-testid="next-button"]').should("be.visible").click();
    cy.get('[data-testid="submit-button"]').should("be.visible").click();

    cy.get('[data-testid="alert-modal-title"]')
      .should("be.visible")
      .contains("Application Submitted");
    //Retrieve ttext from cy.get('[data-testid="alert-modal-message"]')
    cy.get('[data-testid="alert-modal-message"]').then(($message) => {
      const message = $message.text().trim();
      //Check if the message contains the rental application detail link
      rentalApplicationDetailLink = message.split(" ").pop();
    });
  });
  it("Should successfully approve rental application", () => {
    cy.login();
    //navigate to the rental applications page
    cy.visit(rentalApplicationDetailLink);
    cy.get('[data-testid="ui-page-header-menu-button"]')
      .should("be.visible")
      .click();
    cy.get('[data-testid="ui-page-header-menu-item-0"]')
      .should("be.visible")
      .click();

    //Handle Confirm Modal
    cy.get('[data-testid="confirm-modal-title"]')
      .should("be.visible")
      .contains("Are you sure you want to accept this application?");
    cy.get('[data-testid="confirm-modal-message"]')
      .should("be.visible")
      .contains(
        "Accepting this application will will send a lease agreement to the applicant and this application will be archived. The remaining applications will be deleted. Do you wish to continue?"
      );
    cy.get('[data-testid="confirm-modal-cancel-button"]').should("be.visible");
    cy.get('[data-testid="confirm-modal-confirm-button"]')
      .should("be.visible")
      .click();

    //Handle Alert Modal
    cy.get('[data-testid="alert-modal-title"]')
      .should("be.visible")
      .contains("Rental Application Approved");
    cy.get('[data-testid="alert-modal-message"]')
      .should("be.visible")
      .then(($message) => {
        const message = $message.text().trim();
        leaseAgreementSignLink = message.split(" ").pop();
      });
    cy.get('[data-testid="alert-modal-button"]').should("be.visible").click();
  });
  it("Should load lease agreement document", () => {
    cy.visit(leaseAgreementSignLink);
    let signingLink = "";
    cy.get("[data-testid='signing-link']").then(($link) => {
        signingLink = $link.text();
    });
    cy.get('[data-testid="signing-iframe"]').should('be.visible');
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



