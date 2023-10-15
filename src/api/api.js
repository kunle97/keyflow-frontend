/**
 * API functions for the frontend
 * **/
import axios from "axios";
import { token, authUser, subscriptionPlan } from "../constants";
import {
  convertMaintenanceRequestStatus,
  makeId,
  stringToBoolean,
} from "../helpers/utils";
const API_HOST = process.env.REACT_APP_API_HOSTNAME;

export const authenticatedInstance = axios.create({
  baseURL: API_HOST,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  },
});
export const unauthenticatedInstance = axios.create({
  baseURL: API_HOST,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

//Create a function to retrieve all the emails of all landlords using the endpoint /landlords-emails/
export async function getLandlordsEmails() {
  try {
    const res = await unauthenticatedInstance
      .get(`/landlords-emails/`)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.error("Get Landlords Emails Error: ", error);
    return error.response;
  }
}

///-----------------AUTH API FUNCTIONS---------------------------///
//Create a function to retrieve a user's stripe subscriptions using the nedn poiint api/users/{id}/subscription
export async function getUserStripeSubscriptions(user_id, token) {
  try {
    const res = await axios
      .get(`${API_HOST}/users/${user_id}/landlord-subscriptions/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
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
export async function login(email, password) {
  try {
    const res = await unauthenticatedInstance
      .post(`/auth/login/`, { email, password })
      .then((res) => {
        const response = res.data;
        console.log("axios login response ", response);
        return response;
      });

    if (res.statusCode === 200 && email !== "" && password !== "") {
      //Set authUser and isLoggedIn in context
      localStorage.setItem("accessToken", res.token);
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
        susbcription_plan: {},
      };
      getUserStripeSubscriptions(res.user.id, res.token)
        .then((res) => {
          console.log(res.subscriptions.plan);
          userData.susbcription_plan = res.subscriptions.plan;
          localStorage.setItem(
            "subscriptionPlan",
            JSON.stringify(res.subscriptions)
          );
        })
        .catch((error) => {
          console.log("Error Retrieveing user subscription plan", error);
        });
      localStorage.setItem("authUser", JSON.stringify(userData));
      //Check for response code before storing data in context
      const redirect_url =
        res.user.account_type === "landlord"
          ? "/dashboard/landlord"
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
    return error.response.data;
  }
}
// create an api function to logout
export async function logout(accessToken) {
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
          localStorage.removeItem("accessToken");
          localStorage.removeItem("authUser");
          localStorage.removeItem("stripe_onoboarding_link");
          localStorage.removeItem("subscriptionPlan");
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
// create an api function to register a landlord
export async function registerLandlord(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`/auth/register/`, data)
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

//Create a function to retrieve subscription plan prices for landlord registration
export async function getSubscriptionPlanPrices() {
  try {
    const res = await unauthenticatedInstance
      .post(`/retrieve-landlord-subscription-prices/`)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.error("Get Subscription Plan Prices Error: ", error);
    return error.response;
  }
}
//Create a function to change a user's subscription plan using the endpoint /users/{user_id}/change-subscription-plan/
export async function changeSubscriptionPlan(data) {
  try {
    const res = await authenticatedInstance
      .post(`/users/${authUser.id}/change-subscription-plan/`, data)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.error("Change Subscription Plan Error: ", error);
    return error.response;
  }
}
// create an api function to register a tenant
export async function registerTenant(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`/auth/tenant/register/`, data)
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

//Create a function to add a payment method to a users stripe account
export async function addStripePaymentMethod(data) {
  try {
    const res = await authenticatedInstance
      .post(`/stripe/add-payment-method/`, {
        user_id: data.user_id,
        payment_method_id: data.payment_method_id,
      })
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Add Payment Method Error: ", error);
    return error.response;
  }
}

//Create a function to list styripe payment methods using the endpoint /stripe/list-payment-methods/
export async function listStripePaymentMethods(user_id) {
  try {
    const res = await authenticatedInstance
      .post(`/stripe/list-payment-methods/`, {
        user_id: user_id,
      })
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("List Payment Methods Error: ", error);
    return error.response;
  }
}
//Create a function to delete a stripe payment method using the endpoint /stripe/delete-payment-method/
export async function deleteStripePaymentMethod(data) {
  try {
    const res = await authenticatedInstance
      .post(`/stripe/delete-payment-method/`, {
        user_id: authUser.id,
        payment_method_id: data.payment_method_id,
      })
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Delete Payment Method Error: ", error);
    return error.response;
  }
}

//Create A function to set payment method as default using the endpoint /stripe/set-default-payment-method/
export async function setDefaultPaymentMethod(data) {
  try {
    const res = await authenticatedInstance
      .post(`/stripe/set-default-payment-method/`, data)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Set Default Payment Method Error: ", error);
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
  try {
    const res = await authenticatedInstance
      .post(`/users/${authUser.id}/tenant/`, {
        tenant_id: user_id,
        landlord_id: authUser.id,
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
//Create a function to change a user's password using enpoint /users/{user_id}/change-password/
export async function changePassword(data) {
  try {
    const res = await authenticatedInstance
      .post(`/users/${authUser.id}/change-password/`, {
        old_password: data.old_password,
        new_password: data.new_password,
      })
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Change Password Error: ", error);
    return error.response;
  }
}

//Create a function to send a password reset email using the endpoint /password-reset/
export async function sendPasswordResetEmail(data) {
  try {
    const res = await authenticatedInstance
      .post(`/password-reset/create-reset-token/`, {
        email: data.email,
        token: data.token,
      })
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Reset Password Error: ", error);
    return error.response;
  }
}
//Create a function to reset a users password using the endpoint /password-reset/validate-token/
export async function resetPassword(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`${API_HOST}/password-reset/reset-password/`, {
        email: data.email,
        token: data.token,
        new_password: data.new_password,
      })
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Reset Password Error: ", error);
    return error.response;
  }
}
//Create a post funciton to validate a password reset token using the endpoint /password-reset/validate-token/
export async function validatePasswordResetToken(token) {
  try {
    const res = await unauthenticatedInstance
      .post(`/password-reset/validate-token/`, {
        token: token,
      })
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Validate Password Reset Token Error: ", error);
    return error.response;
  }
}

//-----------------NOTIFICATION API FUNCTIONS---------------------------///
//Create a function to get all notifications for a specific user using the endpoint /users/{user_id}/notifications/
export async function getNotifications() {
  try {
    const res = await authenticatedInstance
      .get(`/users/${authUser.id}/notifications/`)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Get Notifications Error: ", error);
    return error.response;
  }
}
//Create a function to retrierve specific notification using the endpoint /notifications/{notification_id}/
export async function getNotification(notification_id) {
  try {
    const res = await authenticatedInstance
      .get(`/notifications/${notification_id}/`)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Get Notification Error: ", error);
    return error.response;
  }
}
//Create a function to label the notification as read by updatting the is_read field to true using the endpoint /notifications/{notification_id}/ ysing patch
export async function markNotificationAsRead(notification_id) {
  try {
    const res = await authenticatedInstance
      .patch(`/notifications/${notification_id}/`, { is_read: true })
      .then((res) => {
        console.log(res);
        return res;
      });
    return res;
  } catch (error) {
    console.log("Mark Notification As Read Error: ", error);
    return error.response;
  }
}
//-----------------LANDLORD API FUNCTIONS---------------------------///
//Create a function that retrieves landlords tenants using the endpoint /users/{landlord_id}/landlord-tenants/
export async function getLandlordTenants() {
  try {
    const res = await authenticatedInstance
      .get(`/users/${authUser.id}/tenants/`, {
        landlord_id: authUser.id,
      })
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Landlord Tenants Error: ", error);
    return error.response.data;
  }
}

//Create a function that retrieves a specific landlord tenant using the endpoint /users/{landlord_id}/tenant/
export async function getLandlordTenant(tenantId) {
  try {
    const res = await authenticatedInstance
      .post(`/landlord-tenant-detail/`, {
        tenant_id: tenantId,
        landlord_id: authUser.id,
      })
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Landlord Tenant Error: ", error);
    return error.response.data;
  }
}

//-----------------PROPERTY API FUNCTIONS---------------------------///

// create an api function to create a property
export async function createProperty(
  name,
  street,
  city,
  state,
  zip_code,
  country
) {
  try {
    const res = await authenticatedInstance
      .post(`/properties/`, {
        name,
        user: authUser.id,
        street,
        city,
        state,
        zip_code,
        country,
      })
      .then((res) => {
        const response = res.data;
        console.log("axios create property response ", response);
        return response;
      });
    return { message: "Property created successfully", status: 200, res: res };
  } catch (error) {
    console.log("Create Property Error: ", error);
    return error.response.data;
  }
}

//Create function to get all properties for this user
export async function getProperties() {
  try {
    const res = await authenticatedInstance
      .get(`/users/${authUser.id}/properties/`)
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Properties Error: ", error);
    return error.response.data;
  }
}

//Create a function tor retrieve property filters
export async function getPropertyFilters() {
  try {
    const res = await authenticatedInstance
      .get(`/properties/filters/`)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Get Property Filters Error: ", error);
    return error.response.data;
  }
}

//Create a funtion to get all units for a specific landlord using the endpoint /users/{landlord_id}/units/
export async function getLandlordUnits() {
  try {
    const res = await authenticatedInstance
      .get(`/users/${authUser.id}/units/`)
      .then((res) => {
        console.log(res);

        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });

    return res;
  } catch (error) {
    console.log("Get Landlord Units Error: ", error);
    return error.response.data;
  }
}

//Create function to retrieve one specific property
export async function getProperty(propertyId) {
  try {
    const res = await authenticatedInstance
      .get(`/properties/${propertyId}/`)
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {
    console.log("Get Properties Error: ", error);
    return error.response.data;
  }
}

//Create a function that retrieves a unit by its id without the use of an authorization token
export async function getPropertyUnauthenticated(propertyId) {
  try {
    const res = await unauthenticatedInstance
      .post(`/retrieve-property/`, { property_id: propertyId })
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Proprty Error: ", error);
    return error.response.data;
  }
}

//create function to update a property with patch method
export async function updateProperty(propertyId, data) {
  try {
    const res = await authenticatedInstance
      .patch(`/properties/${propertyId}/`, data)
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {
    console.log("Get Properties Error: ", error);
    return error.response.data;
  }
}

//create function to delete a property
export async function deleteProperty(propertyId) {
  try {
    // const res = await axios
    const res = await authenticatedInstance
      .delete(`/properties/${propertyId}/`)
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {
    console.log("Get Properties Error: ", error);
    return error.response.data;
  }
}

//--------------TENANT API FUNCTION -----------------///

//Create a function that makes a payment for a tenant using the endpoint /tenant/make-payment/
export async function makePayment(data) {
  try {
    const res = await authenticatedInstance
      .post(`/tenants/${authUser.id}/make-payment/`, data)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Make Payment Error: ", error);
    return error.response;
  }
}
// Create a function to get all necessary data for the tenant dashboard  using the endpoint /retrieve-tenant-dashboard-data/
export async function getTenantDashboardData() {
  try {
    const res = await authenticatedInstance
      .post(`/retrieve-tenant-dashboard-data/`, { user_id: authUser.id })
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Get Tenant Dashboard Data Error: ", error);
    return error.response;
  }
}

///-----------------UNIT API FUNCTIONS---------------------------///
//create a function to create a unit
export async function createUnit(data) {
  console.log("create unit data: ", data);
  try {
    const res = await authenticatedInstance
      .post(`${API_HOST}/units/`, data)
      .then((res) => {
        const response = res.data;
        console.log("axios create unit response ", response);
        return response;
      });
    return { message: "Unit created successfully", status: 200, res: res };
  } catch (error) {
    console.log("Create Unit Error: ", error);
    return error.response.data;
  }
}

//Create function to get all units for the specific property
export async function getUnits(propertyId) {
  try {
    const res = await authenticatedInstance
      .get(`/properties/${propertyId}/units/`)
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Units Error: ", error);
    return error.response.data;
  }
}

//Create function to retrieve one specific unit
export async function getUnit(unitId) {
  try {
    const res = await authenticatedInstance
      .get(`/units/${unitId}/`)
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {
    console.log("Get Unit Error: ", error);
    return error.response;
  }
}

//Create a function that retrieves a unit by its id without the use of an authorization token
export async function getUnitUnauthenticated(unitId) {
  try {
    const res = await unauthenticatedInstance
      .post(`/retrieve-unit/`, { unit_id: unitId })
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Units Error: ", error);
    return error.response.data;
  }
}

//Create function to retrieve one lease term from one specific
export async function getLeaseTermByUnitId(unitId) {
  try {
    const res = await unauthenticatedInstance
      .post(`/retrieve-lease-term-unit/`, { unit_id: unitId })
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {
    console.log("Get Unit Error: ", error);
    return error.response;
  }
}

//Create function to update a unit with patch method
export async function updateUnit(unitId, data) {
  try {
    const res = await authenticatedInstance
      .patch(`/units/${unitId}/`, data)
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {
    console.log("Update Unit Error: ", error);
    return error.response.data;
  }
}

//Create function to delete a unit
export async function deleteUnit(data) {
  try {
    const res = await authenticatedInstance
      .delete(`/units/${data.unit_id}/`, {
        data: {
          product_id: data.product_id,
          subscription_id: data.subscription_id,
          rental_property: data.rental_property,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {
    console.log("Delete Unit Error: ", error);
    return error.response.data;
  }
}

//----------------RENTAL APPLICATION API FUNCTIONS------------------------///

//Create a function to create a rental application
export async function createRentalApplication(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`${API_HOST}/rental-applications/`, {
        unit: data.unit_id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        date_of_birth: data.date_of_birth,
        phone_number: data.phone,
        desired_move_in_date: data.desired_move_in_date,
        other_occupants: data.other_occupants,
        pets: stringToBoolean(data.pets),
        vehicles: stringToBoolean(data.vehicles),
        convicted: stringToBoolean(data.crime),
        bankrupcy_filed: stringToBoolean(data.bankrupcy),
        evicted: stringToBoolean(data.evicted),
        employment_history: JSON.stringify(data.employment_history),
        residential_history: JSON.stringify(data.residential_history),
        landlord: data.landlord_id,
        comments: data.comments,
      })
      .then((res) => {
        const response = res.data;
        console.log("axios create rental app response ", response);
        return response;
      });
    return {
      message: "Rental app created successfully",
      status: 200,
      res: res,
    };
  } catch (error) {
    console.log("Create Rental App Error: ", error);
    return { response: error.response, message: "Error", status: 400 };
  }
}

//Create a function to get all rental applications for a specific unit
export async function getRentalApplications(unitId) {
  try {
    const res = await authenticatedInstance
      .get(`${API_HOST}/units/${unitId}/rental-applications/`)
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Rental Applications Error: ", error);
    return error.response.data;
  }
}

//Create a function to get all rental ids for logged in user
export async function getRentalApplicationsByUser() {
  try {
    const res = await authenticatedInstance
      .get(`/users/${authUser.id}/rental-applications/`)
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Rental Applications Error: ", error);
    return error.response;
  }
}

//Create a function to get one specific rental application by its id
export async function getRentalApplicationById(rentalAppId) {
  try {
    const res = await authenticatedInstance
      .get(`/rental-applications/${rentalAppId}/`)
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {
    console.log("Get Rental Application Error: ", error);
    return error.response;
  }
}
//Retreives Approval Hash. Used to populate form data when tenant registers for the first time
export async function getRentalApplicationByApprovalHash(approval_hash) {
  try {
    const res = await unauthenticatedInstance
      .post(`/auth/tenant/register/retrieve-rental-application/`, {
        approval_hash: approval_hash,
      })
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {
    console.log("Get Rental Application Error: ", error);
    return error.response;
  }
}

//Create A function to approve a rental application
export async function approveRentalApplication(rentalAppId) {
  try {
    const res = await authenticatedInstance
      .patch(`/rental-applications/${rentalAppId}/`, {
        is_approved: true,
        approval_hash: makeId(64),
        is_archived: true,
      })
      .then((res) => {
        console.log(res);
        return res.data;
      });
    console.log("Rental Application Approved", res);
    return res;
  } catch (error) {
    console.log("Approve Rental Application Error: ", error);
    return error.response;
  }
}

//Create A function to reject a rental application
export async function rejectRentalApplication(rentalAppId) {
  try {
    const res = await authenticatedInstance
      .delete(`/rental-applications/${rentalAppId}/`)
      .then((res) => {
        return {
          data: res.data,
          message: "Rental application rejected.",
          status: 200,
        };
      });
    return res;
  } catch (error) {
    console.log("Approve Rental Application Error: ", error);
    return error.response;
  }
}

//Create a function to delete all other rental applications other than the one that was approved
export async function deleteOtherRentalApplications(rentalAppId) {
  try {
    const res = await authenticatedInstance
      .delete(
        `/rental-applications/${rentalAppId}/delete-remaining-rental-applications/`
      )
      .then((res) => {
        return {
          data: res.data,
          message: "Remaining Rental applications deleted.",
          status: 200,
        };
      });
    return res;
  } catch (error) {
    console.log("Approve Rental Application Error: ", error);
    return error.response;
  }
}

//-------------------LEASE AGREEMENT API FUNCTIONS------------------------///
//Create a function that creates a lease agreement
export async function createLeaseAgreement(data) {
  try {
    const res = await authenticatedInstance
      .post(`${API_HOST}/lease-agreements/`, data)
      .then((res) => {
        const response = res.data;
        console.log("axios create lease agreement response ", response);
        return response;
      });
    return {
      message: "Lease agreement created successfully",
      status: 200,
      response: res,
    };
  } catch (error) {
    console.log("Create Lease Agreement Error: ", error);
    return { response: error.response, message: "Error", status: 400 };
  }
}

//Create an API function to update a lease agreement
export async function updateLeaseAgreement(leaseAgreementId, data) {
  try {
    const res = await authenticatedInstance
      .patch(`/lease-agreements/${leaseAgreementId}/`, data)
      .then((res) => {
        const response = res.data;
        console.log("axios update lease agreement response ", response);
        return {
          response: response,
          message: "Lease agreement updated successfully",
          status: 200,
        };
      });
    return {
      message: "Lease agreement updated successfully",
      status: 200,
      res: res,
    };
  } catch (error) {
    console.log("Update Lease Agreement Error: ", error);
    return { response: error.response, message: "Error", status: 400 };
  }
}

//Create a function to retrieve one specific lease term by its id
export async function getLeaseAgreementByIdAndApprovalHash(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`/retrieve-lease-agreement-approval/`, data)
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {
    console.log("Error Retrieving LEase Term: ", error);
    return error.response;
  }
}

///------------LEASE TERM API FUNCTIONS-----------------///
//Create a function that creates a lease term
export async function createLeaseTerm(data) {
  try {
    const res = await authenticatedInstance
      .post(`/create-lease-term/`, {
        user_id: authUser.id,
        rent: parseFloat(data.rent),
        term: data.term,
        description: "_",
        security_deposit: data.security_deposit,
        late_fee: data.late_fee,
        gas_included: stringToBoolean(data.gas_included),
        water_included: stringToBoolean(data.water_included),
        electric_included: stringToBoolean(data.electric_included),
        repairs_included: stringToBoolean(data.repairs_included),
        lease_cancellation_notice_period: data.lease_cancellation_notice_period,
        lease_cancellation_fee: parseFloat(data.lease_cancellation_fee),
        grace_period: parseInt(data.grace_period),
        is_active: true,
      })
      .then((res) => {
        const response = res.data;
        console.log("axios create lease term response ", response);
        return response;
      });
    return {
      message: "Lease term created successfully",
      status: 200,
      res: res,
    };
  } catch (error) {
    console.log("Create Lease Term Error: ", error);
    return { response: error.response, message: "Error", status: 400 };
  }
}

//Create a function that gets all lease terms for a specific user
export async function getLeaseTermsByUser() {
  try {
    const res = await authenticatedInstance
      .get(`/users/${authUser.id}/lease-terms/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        // console.log(res);
        return res;
      });
    return res;
  } catch (error) {
    console.log("Get Lease Terms Error: ", error);
    return error.response.data;
  }
}

//Create a function to retrieve one specific lease term by its id
export async function getLeaseTermByIdAndApprovalHash(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`/retrieve-lease-term-and-approval/`, data)
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {
    console.log("Error Retrieving LEase Term: ", error);
    return error.response;
  }
}

//Create a function to retrieve one specific lease term by its id
export async function getLeaseTermById(data) {
  try {
    const res = await authenticatedInstance
      .post(`/retrieve-lease-term/`, data)
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {
    console.log("Error Retrieving LEase Term: ", error);
    return error.response;
  }
}

//Create a function that updates a lease term
export async function updateLeaseTerm(leaseTermId, data) {
  try {
    const res = await authenticatedInstance
      .patch(`${API_HOST}/lease-terms/${leaseTermId}/`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {
    console.log("Update Lease Term Error: ", error);
    return error.response.data;
  }
}
//Create a function tpo delete a lease term
export async function deleteLeaseTerm(leaseTermId) {
  try {
    const res = await authenticatedInstance
      .post(`/delete-lease-term/`, {
        lease_term_id: leaseTermId,
        user_id: authUser.id,
      })
      .then((res) => {
        return {
          data: res.data,
          message: "Lease term deleted.",
          status: 200,
        };
      });
    return res;
  } catch (error) {
    console.log("Delete Lease Term Error: ", error);
    return error.response.data;
  }
}

//Create a function to sign lease agreement
export async function signLeaseAgreement(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`/sign-lease-agreement/`, data)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Sign Lease Agreement Error: ", error);
    return error.response;
  }
}

//Create a function to verify the tenant registration via the approval hash and lease agreement id
export async function verifyTenantRegistrationCredentials(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`/auth/tenant/register/verify/`, data)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Sign Lease Agreement Error: ", error);
    return error.response;
  }
}

//---------TRANSACTION API FUNCTIONS-----------------///
//Create A function to get all transactions for a specific user using the endpoint /users/{authUser.id}/transactions/
export async function getTransactionsByUser() {
  try {
    const res = await authenticatedInstance
      .get(`/users/${authUser.id}/transactions/`)
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Get Transactions Error: ", error);
    return error.response;
  }
}

//Create A function to get all transactions for a specific user using the endpoint /users/{authUser.id}/tenant-transactions/
export async function getTenantTransactionsByUser() {
  try {
    const res = await authenticatedInstance
      .get(`/users/${authUser.id}/tenant-transactions/`)
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Get Transactions Error: ", error);
    return error.response;
  }
}

//Create a funtion to retrieve a transaction by its id
export async function getTransactionById(transactionId) {
  try {
    const res = await authenticatedInstance
      .get(`/transactions/${transactionId}/`)
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res;
  } catch (error) {
    console.log("Get Transaction Error: ", error);
    return error.response;
  }
}

//--------------------MAINTENANCE REQUEST API FUNCTIONS----------------------///
//Create a function to create a maintenance request
export async function createMaintenanceRequest(data) {
  try {
    const res = await authenticatedInstance.post(
      `/maintenance-requests/`,
      data
    );

    return {
      message: "Maintenance request created successfully",
      status: 201,
      data: res,
    };
  } catch (error) {
    console.log("Create Maintenance Request Error: ", error);
    return {
      response: error.response,
      message:
        "There was an error creating your maintenance request. Please Try again.",
      status: 400,
    };
  }
}
//Create a function to list all maintenance requests for a specific unit
export async function getMaintenanceRequests(unitId) {
  try {
    const res = await authenticatedInstance
      .get(`/units/${unitId}/maintenance-requests/`)
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Maintenance Requests Error: ", error);
    return error.response.data;
  }
}

//Create a function to list all maintenance requests for a specific tenant user
export async function getMaintenanceRequestsByUser() {
  try {
    const res = await authenticatedInstance
      .get(`/users/${authUser.id}/tenant-maintenance-requests/`)
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Get Maintenance Requests Error: ", error);
    return error.response.data;
  }
}

//Create a function to list all maintenance requests for a specific landlord user
export async function getMaintenanceRequestsByLandlord() {
  try {
    const res = await authenticatedInstance
      .get(`/users/${authUser.id}/landlord-maintenance-requests/`)
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Get Maintenance Requests Error: ", error);
    return error.response.data;
  }
}

//Create a function to get maintenance request by its id
export async function getMaintenanceRequestById(maintenanceRequestId) {
  try {
    const res = await authenticatedInstance
      .get(`/maintenance-requests/${maintenanceRequestId}/`)
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res;
  } catch (error) {
    console.log("Get Maintenance Request Error: ", error);
    return error.response.data;
  }
}

//Create a function to mark a maintenance request as resolved
export async function markMaintenanceRequestAsResolved(maintenanceRequestId) {
  try {
    const res = await authenticatedInstance
      .patch(`/maintenance-requests/${maintenanceRequestId}/`, {
        is_resolved: true,
        is_archived: true,
      })
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Mark Maintenance Request As Resolved Error: ", error);
    return error.response.data;
  }
}

//Create a function to mark a maintenance request as unresolved and unarchive it
export async function markMaintenanceRequestAsUnresolved(maintenanceRequestId) {
  try {
    const res = await authenticatedInstance
      .patch(`/maintenance-requests/${maintenanceRequestId}/`, {
        is_resolved: false,
        is_archived: false,
      })
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Mark Maintenance Request As Resolved Error: ", error);
    return error.response.data;
  }
}

//Create a function to change the status of a maintenance request
export async function changeMaintenanceRequestStatus(
  maintenanceRequestId,
  data
) {
  try {
    const res = await authenticatedInstance
      .patch(`/maintenance-requests/${maintenanceRequestId}/`, data)
      .then((res) => {
        //Create a notification using the authenticatedInstance.post() method and  endpoint  /notifications/ and the . THe parameters are user (The tenant that made the request), title, and message (notifiying the status change)
        const notification = authenticatedInstance
          .post(`/notifications/`, {
            user: res.data.tenant,
            title: "Maintenance Request Status Change",
            type: "maintenance_request_status_change",
            message: `Your maintenance request has been set to ${convertMaintenanceRequestStatus(
              data.status
            )}`,
          })
          .then((res) => {
            return res;
          });

        return res;
      });
    return res;
  } catch (error) {
    console.log("Change Maintenance Request Status Error: ", error);
    return error.response.data;
  }
}

//Create a function to delete a maintenance request
export async function deleteMaintenanceRequest(maintenanceRequestId) {
  try {
    const res = await authenticatedInstance
      .delete(`/maintenance-requests/${maintenanceRequestId}/`)
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Delete Maintenance Request Error: ", error);
    return error.response.data;
  }
}

//--------------MANAGE SUBSCRIPTION  API FUNCTIONS-----------------///
//Create a function to turn off auto pay on a subscription from endpoint /manage-lease/turn-off-auto-pay/
export async function turnOffAutoPay() {
  try {
    const res = await authenticatedInstance
      .post(`${API_HOST}/manage-lease/turn-off-autopay/`, {
        user_id: authUser.id,
      })
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Turn Off Auto Pay Error: ", error);
    return error.response.data;
  }
}
//Create a function to turn on auto pay on a subscription from endpoint /manage-lease/turn-on-auto-pay/
export async function turnOnAutoPay() {
  try {
    const res = await authenticatedInstance
      .post(`/manage-lease/turn-on-autopay/`, { user_id: authUser.id })
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Turn On Auto Pay Error: ", error);
    return error.response.data;
  }
}

//Create a function to get the next payment date for a subscription from endpoint /manage-lease/next-payment-date/
export async function getNextPaymentDate() {
  try {
    const res = await authenticatedInstance
      .post(`/manage-lease/next-payment-date/`, { user_id: authUser.id })
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Get Next Payment Date Error: ", error);
    return error.response.data;
  }
}

//Create a function to get all payment date for a subscription from endpoint /manage-lease/payment-dates/
export async function getPaymentDates() {
  try {
    const res = await authenticatedInstance
      .post(`/manage-lease/payment-dates/`, { user_id: authUser.id })
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Get Payment Dates Error: ", error);
    return error.response.data;
  }
}

//-------------------MANAGE PAYMENT METHOD API FUNCTIONS----------------------///
//Create a function to create a payment method
