const hostname = "http://localhost:3000";

describe("ManageBillingEntry Component", () => {
    beforeEach(() => {
        // Log user out
        cy.viewport(1920, 1080);
        //LOg the user in using the cypress command login
    
        // Log in using the loaded credentials
        cy.login("Sandra83@hotmail.com", "Password1");
    }
    );
    it("should render the ManageBillingEntry component", () => {
        cy.visit(hostname + "/dashboard/owner/billing-entries/");
        cy.get('[data-testid="ui-table-mobile-title"]').should("be.visible").contains("Billing Entries");
    }
    );
    afterEach(() => {
        cy.wait(1000);
        //REtrieve the auth object from the getAuth command
        cy.getAuth().then((auth) => {
            // Log user out witht the cypress command logout
            cy.logout(auth.token);
            //Navigate to the homepage
            cy.visit(hostname + "/");
        }
        );
    }
    );
}
);