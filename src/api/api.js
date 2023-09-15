/**
 * API functions for the frontend
 * **/
import axios from "axios";
import { useNavigate } from "react-router";
import { BASE_API_URL } from "../constants";
import { token, authUser } from "../constants";
import { createApprovalHash, stringToBoolean } from "../helpers/utils";

///-----------------AUTH API FUNCTIONS---------------------------///
export async function login(email, password) {
  try {
    const res = await axios
      .post(`${BASE_API_URL}/auth/login/`, { email, password })
      .then((res) => {
        const response = res.data;
        console.log("axios login response ", response);
        return response;
      });

    if (res.statusCode === 200 && email !== "" && password !== "") {
      localStorage.setItem("accessToken", res.token);

      //Check for response code before storing data in context
      const userData = {
        id: res.user.id,
        first_name: res.user.first_name,
        last_name: res.user.last_name,
        username: res.user.username,
        email: res.user.email,
        account_type: res.user.account_type,
        stripe_account_id: res.user.stripe_account_id,
        isAuthenticated: res.isAuthenticated,
        accessToken: res.token,
      };

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
    const res = await axios
      .post(
        `${BASE_API_URL}/auth/logout/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${accessToken}`,
          },
        }
      )
      .then((res) => {
        const response = res.data;
        console.log("axios logout response ", response);
        if (response.status === 200) {
          //redirect to login page on Login.jsx
          localStorage.removeItem("accessToken");
          localStorage.removeItem("authUser");
          localStorage.removeItem("stripe_onoboarding_link");
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
    const res = await axios
      .post(`${BASE_API_URL}/auth/register/`, data)
      .then((res) => {
        const response = res.data;
        console.log("axios register response ", response);
        return response;
      });
    localStorage.setItem("accessToken", res.token);

    //Check for response code before storing data in context
    const userData = {
      id: res.user.id,
      first_name: res.user.first_name,
      last_name: res.user.last_name,
      email: res.user.email,
      account_type: res.user.account_type,
      stripe_account_id: res.user.stripe_account_id,
      isAuthenticated: res.isAuthenticated,
      accessToken: res.token,
    };

    //Stripe Account link example:"https://connect.stripe.com/setup/e/acct_1NhHAgEC6FRVgr2l/fgLinlMm0Xio"
    localStorage.setItem("stripe_onoboarding_link", res.onboarding_link.url);

    return {
      userData: userData,
      message: res.message,
      token: res.token,
      stripe_onboarding_link: res.onboarding_link,
    };
  } catch (error) {
    console.log("Register Error: ", error);
    return error;
  }
}

// create an api function to register a tenant
export async function registerTenant(data) {
  try {
    const res = await axios
      .post(`${BASE_API_URL}/auth/tenant/register/`, data)
      .then((res) => {
        const response = res.data;
        console.log("axios register response ", response);
        return response;
      });
    localStorage.setItem("accessToken", res.token);

    //Check for response code before storing data in context
    const userData = {
      id: res.user.id,
      first_name: res.user.first_name,
      last_name: res.user.last_name,
      username: res.user.username,
      email: res.user.email,
      account_type: res.user.account_type,
      isAuthenticated: res.isAuthenticated,
      accessToken: res.token,
    };

    return { userData: userData, message: res.message, token: res.token };
  } catch (error) {
    console.log("Register Error: ", error);
    return error;
  }
}

//Create a funtion to create a plaid link token that will be used in the Playid Link component
export async function createPlaidLinkToken(user_id) {
  try {
    const res = await axios
      .post(
        `${BASE_API_URL}/plaid/create-link-token/`,
        { user_id: user_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`, //Keep comented when testing
          },
        }
      )
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
    const res = await axios
      .post(
        `${BASE_API_URL}/stripe/add-payment-method/`,
        {
          user_id: data.user_id,
          payment_method_id: data.payment_method_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      )
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
    const res = await axios

      .post(
        `${BASE_API_URL}/stripe/list-payment-methods/`,
        {
          user_id: user_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      )
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

//Create a function to retrieve a users data
export async function getUserData(user_id) {
  try {
    const res = await axios
      .get(
        `${BASE_API_URL}/users/${authUser.id}/tenant/`,
        { tenant_id: user_id, landlord_id: authUser.id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      )
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
    const res = await axios
      .patch(`${BASE_API_URL}/users/${authUser.id}/`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
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
    const res = await axios
      .post(
        `${BASE_API_URL}/properties/`,
        {
          name,
          user: authUser.id,
          street,
          city,
          state,
          zip_code,
          country,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authUser.accessToken}`,
          },
        }
      )
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
    const res = await axios
      .get(`${BASE_API_URL}/users/${authUser.id}/properties/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
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
    console.log("Get Properties Error: ", error);
    return error.response.data;
  }
}

//Create function to retrieve one specific property
export async function getProperty(propertyId) {
  try {
    const res = await axios
      .get(`${BASE_API_URL}/properties/${propertyId}/`, {
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
    console.log("Get Properties Error: ", error);
    return error.response.data;
  }
}

//Create a function that retrieves a unit by its id without the use of an authorization token
export async function getPropertyUnauthenticated(propertyId) {
  try {
    const res = await axios
      .post(
        `${BASE_API_URL}/retrieve-property/`,
        { property_id: propertyId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
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
    const res = await axios
      .patch(`${BASE_API_URL}/properties/${propertyId}/`, data, {
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
    console.log("Get Properties Error: ", error);
    return error.response.data;
  }
}

//create function to delete a property
export async function deleteProperty(propertyId) {
  try {
    const res = await axios
      .delete(`${BASE_API_URL}/properties/${propertyId}/`, {
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
    console.log("Get Properties Error: ", error);
    return error.response.data;
  }
}

//--------------TENANT API FUNCTION -----------------///

//Create a function that makes a payment for a tenant using the endpoint /tenant/make-payment/
export async function makePayment(data) {
  try {
    const res = await axios
      .post(`${BASE_API_URL}/tenants/${authUser.id}/make-payment/`, data, {
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
    console.log("Make Payment Error: ", error);
    return error.response;
  }
}
// Create a function to get all necessary data for the tenant dashboard  using the endpoint /retrieve-tenant-dashboard-data/
export async function getTenantDashboardData() {
  try {
    const res = await axios
      .post(
        `${BASE_API_URL}/retrieve-tenant-dashboard-data/`,
        { user_id: authUser.id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      )
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
    const res = await axios
      .post(
        `${BASE_API_URL}/units/`,
        {
          name: data.name,
          rental_property: data.rental_property,
          beds: data.beds,
          baths: data.baths,
          rent: data.rent,
          user: authUser.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authUser.accessToken}`,
          },
        }
      )
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
    const res = await axios
      .get(`${BASE_API_URL}/properties/${propertyId}/units/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
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
    console.log("Get Units Error: ", error);
    return error.response.data;
  }
}

//Create function to retrieve one specific unit
export async function getUnit(unitId) {
  try {
    const res = await axios
      .get(`${BASE_API_URL}/units/${unitId}/`, {
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
    console.log("Get Unit Error: ", error);
    return error.response;
  }
}

//Create a function that retrieves a unit by its id without the use of an authorization token
export async function getUnitUnauthenticated(unitId) {
  try {
    const res = await axios
      .post(
        `${BASE_API_URL}/retrieve-unit/`,
        { unit_id: unitId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
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
    const res = await axios
      .post(
        `${BASE_API_URL}/retrieve-lease-term-unit/`,
        { unit_id: unitId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
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
    const res = await axios
      .patch(`${BASE_API_URL}/units/${unitId}/`, data, {
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
    console.log("Update Unit Error: ", error);
    return error.response.data;
  }
}

//Create function to delete a unit
export async function deleteUnit(propertyId, unitId) {
  try {
    const res = await axios
      .delete(
        `${BASE_API_URL}/units/${unitId}/`,
        { rental_property: propertyId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      )
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
    const res = await axios
      .post(
        `${BASE_API_URL}/rental-applications/`,
        {
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
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
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
    const res = await axios
      .get(`${BASE_API_URL}/units/${unitId}/rental-applications/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
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
    console.log("Get Rental Applications Error: ", error);
    return error.response.data;
  }
}

//Create a function to get all rental ids for logged in user
export async function getRentalApplicationsByUser() {
  try {
    const res = await axios
      .get(`${BASE_API_URL}/users/${authUser.id}/rental-applications/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
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
    console.log("Get Rental Applications Error: ", error);
    return error.response;
  }
}

//Create a function to get one specific rental application by its id
export async function getRentalApplicationById(rentalAppId) {
  try {
    const res = await axios
      .get(`${BASE_API_URL}/rental-applications/${rentalAppId}/`, {
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
    console.log("Get Rental Application Error: ", error);
    return error.response;
  }
}
//Retreives Approval Hash. Used to populate form data when tenant registers for the first time
export async function getRentalApplicationByApprovalHash(approval_hash) {
  try {
    const res = await axios
      .post(
        `${BASE_API_URL}/auth/tenant/register/retrieve-rental-application/`,
        { approval_hash: approval_hash },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
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
    const res = await axios
      .patch(
        `${BASE_API_URL}/rental-applications/${rentalAppId}/`,
        {
          is_approved: true,
          approval_hash: createApprovalHash(64),
          is_archived: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      )
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
    const res = await axios
      .delete(
        `${BASE_API_URL}/rental-applications/${rentalAppId}/`,
        // {
        //   is_approved: false,
        //   user_id: authUser.id,
        //   approval_hash: "",
        // },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      )
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
    const res = await axios
      .delete(
        `${BASE_API_URL}/rental-applications/${rentalAppId}/delete-remaining-rental-applications/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
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
    const res = await axios
      .post(
        `${BASE_API_URL}/lease-agreements/`,
        // {
        //   rental_application: data.rental_application,
        //   rental_unit: data.rental_unit,
        //   user: authUser.id,
        //   approval_hash: data.approval_hash,
        //   lease_term: data.lease_term,
        // },
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      )
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
    const res = await axios
      .patch(`${BASE_API_URL}/lease-agreements/${leaseAgreementId}/`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
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

//Create a funtion that retrieves a lease agreement by its id
// export async function getLeaseAgreementById(data) {
//   try {
//     const res = await axios
//       .post(`${BASE_API_URL}/retrieve-lease-agreement/`, data, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//         },
//       })
//       .then((res) => {
//         if (res.status == 200) {
//           return { data: res.data };
//         }
//         return { data: [] };
//       });
//     return res.data;
//   } catch (error) {
//     console.log("Get Lease Agreement Error: ", error);
//     return error.response;
//   }
// }

//Create a function to retrieve one specific lease term by its id
export async function getLeaseAgreementByIdAndApprovalHash(data) {
  try {
    const res = await axios
      .post(`${BASE_API_URL}/retrieve-lease-agreement-approval/`, data, {
        headers: {
          "Content-Type": "application/json",
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
    console.log("Error Retrieving LEase Term: ", error);
    return error.response;
  }
}

///------------LEASE TERM API FUNCTIONS-----------------///
//Create a function that creates a lease term
export async function createLeaseTerm(data) {
  try {
    const res = await axios
      .post(
        `${BASE_API_URL}/create-lease-term/`,
        {
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
          lease_cancellation_notice_period:
            data.lease_cancellation_notice_period,
          lease_cancellation_fee: parseFloat(data.lease_cancellation_fee),
          grace_period: parseInt(data.grace_period),
          is_active: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      )
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
    const res = await axios
      .get(`${BASE_API_URL}/users/${authUser.id}/lease-terms/`, {
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
    const res = await axios
      .post(`${BASE_API_URL}/retrieve-lease-term-and-approval/`, data, {
        headers: {
          "Content-Type": "application/json",
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
    console.log("Error Retrieving LEase Term: ", error);
    return error.response;
  }
}

//Create a function to retrieve one specific lease term by its id
export async function getLeaseTermById(data) {
  try {
    const res = await axios
      .post(`${BASE_API_URL}/retrieve-lease-term/`, data, {
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
    console.log("Error Retrieving LEase Term: ", error);
    return error.response;
  }
}

//Create a function that updates a lease term
export async function updateLeaseTerm(leaseTermId, data) {
  try {
    const res = await axios
      .patch(`${BASE_API_URL}/lease-terms/${leaseTermId}/`, data, {
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

//Create a function to sign lease agreement
export async function signLeaseAgreement(data) {
  try {
    const res = await axios
      .post(`${BASE_API_URL}/sign-lease-agreement/`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
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
    const res = await axios
      .post(`${BASE_API_URL}/auth/tenant/register/verify/`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
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
    const res = await axios
      .get(`${BASE_API_URL}/users/${authUser.id}/transactions/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
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
    const res = await axios
      .get(`${BASE_API_URL}/users/${authUser.id}/tenant-transactions/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
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
    const res = await axios
      .get(`${BASE_API_URL}/transactions/${transactionId}/`, {
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
    const res = await axios.post(
      `${BASE_API_URL}/maintenance-requests/`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
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
    const res = await axios
      .get(`${BASE_API_URL}/units/${unitId}/maintenance-requests/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
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
    console.log("Get Maintenance Requests Error: ", error);
    return error.response.data;
  }
}

//Create a function to list all maintenance requests for a specific tenant user
export async function getMaintenanceRequestsByUser() {
  try {
    const res = await axios
      .get(
        `${BASE_API_URL}/users/${authUser.id}/tenant-maintenance-requests/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      )
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
    const res = await axios
      .get(
        `${BASE_API_URL}/users/${authUser.id}/landlord-maintenance-requests/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      )
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
    const res = await axios
      .get(`${BASE_API_URL}/maintenance-requests/${maintenanceRequestId}/`, {
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
    return res;
  } catch (error) {
    console.log("Get Maintenance Request Error: ", error);
    return error.response.data;
  }
}

//Create a function to mark a maintenance request as resolved
export async function markMaintenanceRequestAsResolved(maintenanceRequestId) {
  try {
    const res = await axios
      .patch(
        `${BASE_API_URL}/maintenance-requests/${maintenanceRequestId}/`,
        { is_resolved: true, is_archived: true },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      )
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
    const res = await axios
      .patch(
        `${BASE_API_URL}/maintenance-requests/${maintenanceRequestId}/`,
        { is_resolved: false, is_archived: false },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Mark Maintenance Request As Resolved Error: ", error);
    return error.response.data;
  }
}
//--------------MANAGE SUBSCRIPTION  API FUNCTIONS-----------------///
//Create a function to turn off auto pay on a subscription from endpoint /manage-lease/turn-off-auto-pay/
export async function turnOffAutoPay() {
  try {
    const res = await axios
      .post(
        `${BASE_API_URL}/manage-lease/turn-off-autopay/`,
        { user_id: authUser.id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      )
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
    const res = await axios
      .post(
        `${BASE_API_URL}/manage-lease/turn-on-autopay/`,
        { user_id: authUser.id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Turn On Auto Pay Error: ", error);
    return error.response.data;
  }
}