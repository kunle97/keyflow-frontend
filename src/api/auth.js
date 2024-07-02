import axios from "axios";
import { authenticatedInstance, unauthenticatedInstance } from "./api";
import { authUser } from "../constants";
import { clearLocalStorage } from "../helpers/utils";

const API_HOST = process.env.REACT_APP_API_HOSTNAME;
///-----------------AUTH API FUNCTIONS---------------------------///
//Create a function to retrieve a user's stripe subscriptions using the nedn poiint api/users/{id}/subscription
export async function getUserStripeSubscriptions() {
  try {
    const res = await authenticatedInstance
      .get(`/owners/${authUser.owner_id}/subscriptions/ `, {})
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.error("Get User Stripe Subscriptions Error: ", error);
    return error.response;
  }
}
export async function login(data) {
  clearLocalStorage();
  try {
    const res = await unauthenticatedInstance
      .post(`/auth/login/`, { 
        email: data.email, 
        password: data.password,
        remember_me: data.remember_me
      })
      .then((res) => {
        const response = res.data;
        console.log("axios login response ", response);
        return response;
      });

    if (res.statusCode === 200 && data.email !== "" && data.password !== "") {
      //Set authUser and isLoggedIn in context
      localStorage.setItem("accessToken", res.token);
      localStorage.setItem(
        "accessTokenExpirationDate",
        res.token_expiration_date
      );
      //Save auth user in local storage
      let userData = {
        id: res.user.id,
        first_name: res.user.first_name,
        last_name: res.user.last_name,
        username: res.user.username,
        email: res.user.email,
        account_type: res.user.account_type,
        stripe_account_id: res.user.stripe_account_id,
        isAuthenticated: res.isAuthenticated,
        is_active: res.user.is_active,
        accessToken: res.token,
        owner_id: res.owner_id,
        susbcription_plan: {},
      };
      if (res.user.account_type === "owner") {
        userData.owner_id = res.owner_id;
        localStorage.setItem("ownerData", JSON.stringify(res.owner));
      } else if(res.user.account_type === "tenant") {
        userData.tenant_id = res.tenant_id;
        localStorage.setItem("tenantData", JSON.stringify(res.tenant));
      }
      localStorage.setItem("authUser", JSON.stringify(userData));
      //Check for response code before storing data in context
      const redirect_url =
        res.user.account_type === "owner"
          ? "/dashboard/owner"
          : "/dashboard/tenant";

      console.log(userData);
      console.log("res. ", res);
      return {
        userData: userData,
        message: res.message,
        token: res.token,
        redirect_url: redirect_url,
      };
    } else {
      return res.message;
    }
  } catch (error) {
    console.log("Login Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}
// create an api function to logout
export async function logout() {
  let message = "";
  let status = 0;
  try {
    const res = await authenticatedInstance
      .post(`/auth/logout/`)
      .then((res) => {
        const response = res.data;
        console.log("axios logout response ", response);
        if (response.status === 200) {
          //redirect to login page on Login.jsx
          clearLocalStorage();
          message = response.message;
          status = response.status;
        } else {
          return { message: "Logout failed" };
        }
      });

    return { message: message, status: status };
  } catch (error) {
    return error;
  }
}
// create an api function to register a owner
export async function registerOwner(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`/owners/register/`, data)
      .then((res) => {
        const response = res.data;
        console.log("axios register response ", response);
        return response;
      });

    //Stripe Account link example:"https://connect.stripe.com/setup/e/acct_1NhHAgEC6FRVgr2l/fgLinlMm0Xio"
    localStorage.setItem("stripe_onoboarding_link", res.onboarding_link.url);

    return {
      message: res.message,
      stripe_onboarding_link: res.onboarding_link,
      status: 200,
    };
  } catch (error) {
    console.log("Register Error: ", error);
    return error;
  }
}

// create an api function to register a tenant
export async function registerTenant(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`/tenants/register/`, data)
      .then((res) => {
        const response = res.data;
        console.log("axios register response ", response);
        return response;
      });

    return { message: res.message, status: 200 };
  } catch (error) {
    console.log("Register Error: ", error);
    return error;
  }
}

//Create a function to activate a user account using the endpoint /auth/activate-account/
export async function activateAccount(token) {
  try {
    const res = await unauthenticatedInstance
      .post(`/auth/activate-account/`, { activation_token: token })
      .then((res) => {
        const response = res.data;
        console.log("axios activate account response ", response);
        return response;
      });
    return res;
  } catch (error) {
    console.log("Activate Account Error: ", error);
    return error;
  }
}

//Create a funtion to create a plaid link token that will be used in the Playid Link component
export async function createPlaidLinkToken(user_id) {
  try {
    const res = await authenticatedInstance
      .post(`/plaid/create-link-token/`, { user_id: user_id })
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Create Plaid Link Token Error: ", error);
    return error.response;
  }
}

//Create a function to retrieve a stripe subscripion
export async function getStripeSubscription(subscription_id) {
  try {
    const res = await authenticatedInstance
      .post(`/stripe/retrieve-subscription/`, {
        subscription_id: subscription_id,
        user_id: authUser.id,
      })

      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Get Stripe Subscription Error: ", error);
    return error.response;
  }
}
//Create a function to retrieve a users data
export async function getUserData(user_id) {
  //TODO: Delete this functiuon. To be replaced with the getOwnerTenant function in owners.js
  try {
    const res = await authenticatedInstance
      .post(`/users/${authUser.id}/tenant/`, {
        tenant_id: user_id,
        owner_id: authUser.id,
      })
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Get User Data Error: ", error);
    return error.response;
  }
}
//Create a function to update a users data
export async function updateUserData(data) {
  try {
    const res = await authenticatedInstance
      .patch(`/users/${authUser.id}/`, data)
      .then((res) => {
        console.log(res);
        return res;
      });
    return res;
  } catch (error) {
    console.log("Update User Data Error: ", error);
    return error.response;
  }
}

//Create a function that checks to see if an email already exists in the database using the endpoint /auth/user-email-check/
export async function checkEmail(email) {
  try {
    const res = await unauthenticatedInstance
      .post(`/auth/user-email-check/`, { email: email })
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Check Email Error: ", error);
    return error.response;
  }
}

//Create a function that checks to see if a username already exists in the database using the endpoint /auth/user-email-check/
export async function checkUsername(username) {
  try {
    const res = await unauthenticatedInstance
      .post(`/auth/user-username-check/`, { username: username })
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Check Username Error: ", error);
    return error.response;
  }
}
