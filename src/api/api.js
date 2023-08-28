/**
 * API functions for the frontend
 * **/
import axios from "axios";
import { useNavigate } from "react-router";
import { BASE_API_URL } from "../constants";
import { token, authUser } from "../constants";
import { stringToBoolean } from "../helpers/utils";

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
export async function register(data) {
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
      username: res.user.username,
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
export async function register_tenant(data) {
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

///-----------------PROPERTY API FUNCTIONS---------------------------///

// create an api function to create a property
export async function createProperty(
  name,
  address,
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
          address,
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
    return { message: "Property created successfully", status: 200 };
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
    return { message: "Unit created successfully", status: 200 };
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
        return {
          response: response,
          message: "Rental app created successfully",
          status: 200,
        };
      });
    return { message: "Rental app created successfully", status: 200 };
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

//Create A function to approve a rental application
export async function approveRentalApplication(rentalAppId) {
  try {
    const res = await axios
      .post(
        `${BASE_API_URL}/rental-applications/${rentalAppId}/approve-rental-application/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          return {
            data: res.data,
            message: "Rental application approved successfully",
            status: 200,
          };
        }
        return { data: [] };
      });
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
      .post(
        `${BASE_API_URL}/rental-applications/${rentalAppId}/reject-rental-application/`,
        {
          user_id: authUser.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          return {
            data: res.data,
            message: "Rental application rejectd successfully",
            status: 200,
          };
        }
        return { data: [] };
      });
    return res;
  } catch (error) {
    console.log("Approve Rental Application Error: ", error);
    return error.response;
  }
}