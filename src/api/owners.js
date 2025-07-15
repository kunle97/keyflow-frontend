import { authenticatedInstance } from "./api";
import { authUser } from "../constants";
//A function to get an owner's preferences using the endpoint api/owners/{id}/preferences
export async function getOwnerPreferences() {
  try {
    const res = await authenticatedInstance
      .get(`/owners/${authUser.owner_id}/preferences/`)
      .then((res) => {

        return res.data;
      });
    return res;
  } catch (error) {

    return error.response;
  }
}

//Create a function to retrieve an owner's plan data using a GET request to the endpoint api/owners/{id}/subscription-plan-data
export async function getOwnerSubscriptionPlanData() {
  try {
    const res = await authenticatedInstance
      .get(`/owners/${authUser.owner_id}/subscription-plan-data/`)
      .then((res) => {

        return res.data;
      });
    return res;
  } catch (error) {

    return error.response;
  }
}

//Create a function to retrieve an owner's usage stats using the endpoint api/owners/{id}/usage-stats
export async function getOwnerUsageStats() {
  try {
    const res = await authenticatedInstance
      .get(`/owners/${authUser.owner_id}/usage-stats/`)
      .then((res) => {

        return res.data;
      });
    return res;
  } catch (error) {

    return error.response;
  }
}

//Create a function to update an owner's preferences using a POST request the endpoint api/owners/{id}/update-preferences
export async function updateOwnerPreferences(data) {
  try {
    const res = await authenticatedInstance
      .post(`/owners/${authUser.owner_id}/update-preferences/`, data)
      .then((res) => {

        return res;
      });
    return res;
  } catch (error) {

    return error.response;
  }
}


//Retrieve the owner's stripe account link by sending a GET request to the endpoint api/owners/{id}/stripe-account-link
export async function getStripeAccountLink() {
  try {
    const res = await authenticatedInstance
      .get(`/owners/${authUser.owner_id}/stripe-account-link/`)
      .then((res) => {

        return res.data;
      });
    return res;
  } catch (error) {

    return error.response;
  }
}

//Retrieve the owner's stripe account link by sending a GET request to the endpoint api/owners/{id}/stripe-account-link
export async function getStripeOnboardingAccountLink() {
  try {
    const res = await authenticatedInstance
      .get(`/owners/${authUser.owner_id}/stripe-onboarding-account-link/`)
      .then((res) => {

        return res.data;
      });
    return res;
  } catch (error) {

    return error.response;
  }
}

//Retrieve the owner's stripe account requirements by sending a GET request to the endpoint api/owners/{id}/stripe-account-requirements
export async function getStripeAccountRequirements() {
  try {
    const res = await authenticatedInstance
      .get(`/owners/${authUser.owner_id}/stripe-account-requirements/`)
      .then((res) => {

        return res.data;
      });
    return res;
  } catch (error) {

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

        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function that retrieves a specific owner tenant using the endpoint /users/{owner_id}/tenant/
export async function getOwnerTenant(tenantId) {
  try {
    const res = await authenticatedInstance
      .get(`/tenants/${tenantId}/`)
      .then((res) => {

        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function called getTenantUnit that retrieves a specific tenant unit using the endpoint /tenants/{tenant_id}/unit/
export async function getTenantUnit(tenantId) {
  try {
    const res = await authenticatedInstance
      .get(`/tenants/${tenantId}/unit/`)
      .then((res) => {

        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
  }
}