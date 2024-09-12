import { faker } from "@faker-js/faker";
const hostname = "http://localhost:3000";

describe("CreateUnit Component", () => {
  beforeEach(() => {
    // Log user out
    cy.viewport(1920, 1080);
    //LOg the user in using the cypress command login

    // Log in using the loaded credentials
    cy.login();
    cy.visit("/dashboard/owner/units/create"); // Replace with the actual route where your component is rendered
  });

  it("should successfully create a unit", () => {
    // Add your test data
    const testData = [
      {
        name: faker.string.alpha() + "" + faker.finance.accountNumber(1),
        beds: faker.number.int({ min: 4, max: 10 }),
        baths: faker.number.int({ min: 4, max: 6 }),
        size: faker.number.int({ min: 500, max: 1500 }),
      },
      {
        name: faker.string.alpha() + "" + faker.finance.accountNumber(1),
        beds: faker.number.int({ min: 4, max: 10 }),
        baths: faker.number.int({ min: 4, max: 6 }),
        size: faker.number.int({ min: 500, max: 1500 }),
      },
      {
        name: faker.string.alpha() + "" + faker.finance.accountNumber(1),
        beds: faker.number.int({ min: 4, max: 10 }),
        baths: faker.number.int({ min: 4, max: 6 }),
        size: faker.number.int({ min: 500, max: 1500 }),
      },
      {
        name: faker.string.alpha() + "" + faker.finance.accountNumber(1),
        beds: faker.number.int({ min: 4, max: 10 }),
        baths: faker.number.int({ min: 4, max: 6 }),
        size: faker.number.int({ min: 500, max: 1500 }),
      },
    ];

    //Select the first property in the in the select form element
    cy.get('[data-testid="create-unit-property-select"] option')
      .eq(2)
      .then((option) => {
        cy.get('[data-testid="create-unit-property-select"]').select(
          option.val()
        );
      });

    //Click the add unit button 5 times using a loop
    for (let i = 0; i < testData.length; i++) {
      cy.get(`[data-testid="unit-row-${i}-add-unit-button"]`)
        .should("be.visible")
        .click();
      cy.wait(400);
    }

    // Add interactions for each unit row
    cy.get('[data-testid^="unit-row-"]').each(($row, index) => {
      // Check if index is within the bounds of testData array
      if (index < testData.length) {
        // Add test data to each row
        cy.get(`[data-testid="unit-row-${index}-name-input"]`).type(
          testData[index].name
        );
        cy.get(`[data-testid="unit-row-${index}-beds-input"]`).type(
          testData[index].beds
        );
        cy.get(`[data-testid="unit-row-${index}-baths-input"]`).type(
          testData[index].baths
        );
        cy.get(`[data-testid="unit-row-${index}-size-input"]`).type(
          testData[index].size
        );
      } else {
        // Handle the case where index is out of bounds
        cy.log(`Index ${index} is out of bounds for testData array.`);
      }
    });

    // Submit the form
    cy.get('[data-testid="create-unit-submit-button"]').click();
    
    //Check for Progress modal
    cy.get('[data-testid="progress-modal-title"]').should("be.visible").contains("Creating Units...");
    cy.get('[data-testid="progress-modal-loading-icon"]').should("be.visible");

    //GEt value from property select
    cy.get('[data-testid="create-unit-property-select"]')
      .invoke("val")
      .then((val) => {
        cy.url().should("include", "/dashboard/owner/properties/" + val); // Replace with the expected success page route
      });
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
