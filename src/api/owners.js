import { authenticatedInstance } from "./api";
import { authUser } from "../constants";
//A function to get an owner's preferences using the endpoint api/owners/{id}/preferences
export async function getOwnerPreferences() {
  try {
    const res = await authenticatedInstance
      .get(`/owners/${authUser.owner_id}/preferences/`)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Get Owner Preferences Error: ", error);
    return error.response;
  }
}

//Create a function to update an owner's preferences using a POST request the endpoint api/owners/{id}/update-preferences
export async function updateOwnerPreferences(data) {
  try {
    const res = await authenticatedInstance
      .post(`/owners/${authUser.owner_id}/update-preferences/`, data)
      .then((res) => {
        console.log(res);
        return res;
      });
    return res;
  } catch (error) {
    console.log("Update Owner Preferences Error: ", error);
    return error.response;
  }
}


//Retrieve the owner's stripe account link by sending a GET request to the endpoint api/owners/{id}/stripe-account-link
export async function getStripeAccountLink() {
  try {
    const res = await authenticatedInstance
      .get(`/owners/${authUser.owner_id}/stripe-account-link/`)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Get Stripe Account Link Error: ", error);
    return error.response;
  }
}

//Retrieve the owner's stripe account link by sending a GET request to the endpoint api/owners/{id}/stripe-account-link
export async function getStripeOnboardingAccountLink() {
  try {
    const res = await authenticatedInstance
      .get(`/owners/${authUser.owner_id}/stripe-onboarding-account-link/`)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Get Stripe Account Link Error: ", error);
    return error.response;
  }
}

//Retrieve the owner's stripe account requirements by sending a GET request to the endpoint api/owners/{id}/stripe-account-requirements
export async function getStripeAccountRequirements() {
  try {
    const res = await authenticatedInstance
      .get(`/owners/${authUser.owner_id}/stripe-account-requirements/`)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Get Stripe Account Requirements Error: ", error);
    return error.response;
  }
}


//-----------------LANDLORD API FUNCTIONS---------------------------///
//Create a function that retrieves owners tenants using the endpoint /users/{owner_id}/owner-tenants/
export async function getOwnerTenants() {
  try {
    const res = await authenticatedInstance
      .get(`/tenants/`)
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Owner Tenants Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function that retrieves a specific owner tenant using the endpoint /users/{owner_id}/tenant/
export async function getOwnerTenant(tenantId) {
  try {
    const res = await authenticatedInstance
      .get(`/tenants/${tenantId}/`)
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Owner Tenant Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function called getTenantUnit that retrieves a specific tenant unit using the endpoint /tenants/{tenant_id}/unit/
export async function getTenantUnit(tenantId) {
  try {
    const res = await authenticatedInstance
      .get(`/tenants/${tenantId}/unit/`)
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Tenant Unit Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}