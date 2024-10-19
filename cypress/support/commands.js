// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-iframe';
// commands.js
Cypress.Commands.add("login", () => {
  const API_HOST = Cypress.env("REACT_APP_API_HOSTNAME");
  console.log(`API_HOST: ${API_HOST}`); // Log the API_HOST value

  cy.request({
    method: "POST",
    url: `${API_HOST}/auth/login/`,
    body: {
      email: Cypress.env("REACT_APP_CYPRESS_TEST_USER_EMAIL"),
      password: Cypress.env("REACT_APP_CYPRESS_TEST_USER_PASSWORD"),
    },
    headers: { "Content-Type": "application/json" },
  }).then((response) => {
    if (response.status === 200) {
      const userData = {
        id: response.body.user.id,
        account_type: response.body.user.account_type,
        first_name: response.body.user.first_name,
        last_name: response.body.user.last_name,
        username: response.body.user.username,
        email: response.body.user.email,
        is_active: response.body.user.is_active,
        stripe_account_id: response.body.user.stripe_account_id,
        isAuthenticated: response.body.isAuthenticated,
        accessToken: response.body.token,
      };
      if (response.body.user.account_type === "owner") {
        userData.owner_id = response.body.owner_id;
      } else {
        userData.tenant_id = response.body.tenant_id;
      }
      // Store data in Cypress Local Storage
      localStorage.setItem("authUser", JSON.stringify(userData));
      localStorage.setItem("accessToken", response.body.token);
      localStorage.setItem(
        "accessTokenExpirationDate",
        response.body.token_expiration_date
      );

      // Return relevant data for the test
      return {
        userData,
        message: response.body.message,
        token: response.body.token,
        redirect_url:
          response.body.user.account_type === "owner"
            ? "/dashboard/owner"
            : "/dashboard/tenant",
      };
    } else {
      return response.body.message;
    }
  });
});

//

Cypress.Commands.add("tenantLogin", () => {
  const API_HOST = Cypress.env("REACT_APP_API_HOSTNAME");
  console.log(`API_HOST: ${API_HOST}`); // Log the API_HOST value

  cy.request({
    method: "POST",
    url: `${API_HOST}/auth/login/`,
    body: {
      email: Cypress.env("REACT_APP_CYPRESS_TEST_TENANT_USER_EMAIL"),
      password: Cypress.env("REACT_APP_CYPRESS_TEST_TENANT_USER_PASSWORD"),
    },
    headers: { "Content-Type": "application/json" },
  }).then((response) => {
    console.log("Tenat Response", response);
    if (response.status === 200) {
      const userData = {
        id: response.body.user.id,
        account_type: response.body.user.account_type,
        first_name: response.body.user.first_name,
        last_name: response.body.user.last_name,
        username: response.body.user.username,
        email: response.body.user.email,
        is_active: response.body.user.is_active,
        stripe_account_id: response.body.user.stripe_account_id,
        isAuthenticated: response.body.isAuthenticated,
        accessToken: response.body.token,
      };
      if (response.body.user.account_type === "owner") {
        userData.owner_id = response.body.owner_id;
      } else {
        userData.tenant_id = response.body.tenant_id;
      }
      // Store data in Cypress Local Storage
      localStorage.setItem("authUser", JSON.stringify(userData));
      localStorage.setItem("accessToken", response.body.token);
      localStorage.setItem(
        "accessTokenExpirationDate",
        response.body.token_expiration_date
      );

      // Return relevant data for the test
      return {
        userData,
        message: response.body.message,
        token: response.body.token,
        redirect_url:
          response.body.user.account_type === "owner"
            ? "/dashboard/owner"
            : "/dashboard/tenant",
      };
    } else {
      return response.body.message;
    }
  });
});

// Create a command to log out the user
Cypress.Commands.add("logout", (token) => {
  const API_HOST = Cypress.env("REACT_APP_API_HOSTNAME");

  // Use cy.wrap to ensure asynchronous code is executed before proceeding
  return cy.wrap(null, { log: false }).then(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      return cy
        .request({
          method: "POST",
          url: `${API_HOST}/auth/logout/`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        })
        .then((response) => {});
    } else {
      // Handle the case where accessToken is null

      return "No accessToken found for logout";
    }
  });
});

// Createa a command to retrieve the auth token and auth user from local storage
Cypress.Commands.add("getAuth", () => {
  const auth = {
    token: localStorage.getItem("accessToken"),
    user: JSON.parse(localStorage.getItem("authUser")),
  };

  return auth;
});

// Create a command to set the auth token and auth user in local storage
Cypress.Commands.add("setAuth", (token, user) => {
  localStorage.setItem("accessToken", token);
  localStorage.setItem("authUser", JSON.stringify(user));
});

// Create a command to clear the auth token and auth user from local storage
Cypress.Commands.add("clearAuth", () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("authUser");
});

// Create a command that gets an element by data-test attribute
Cypress.Commands.add('getBySelLike', (selector, ...args) => {
  return cy.get(`[data-test*=${selector}]`, ...args)
})