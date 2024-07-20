import { authenticatedInstance, authenticatedMediaInstance } from "./api";

//Create a function to call the API endpoint /billing-entries/ to make a POST request to create a new tenant invite using the authenticatedInstance
export async function createBillingEntry(data) {

  try {
    const res = await authenticatedMediaInstance
      .post(`/billing-entries/`, data)
      .then((res) => {
        const response = res.data;

        return response;
      });
    return {
      message: "Tenant invite created successfully",
      status: 201,
      data: res,
    };
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to call the API endpoint /billing-entries/ to make a GET request to retrieve all tenant invites using the authenticatedInstance
export async function getBillingEntries() {
  try {
    const res = await authenticatedInstance
      .get(`/billing-entries/`)
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

//Create a function to call the API endpoint /billing-entries/ to make a GET request to retrieve one tenant invite using the authenticatedInstance
export async function getBillingEntry(billingEntryId) {
  try {
    const res = await authenticatedInstance
      .get(`/billing-entries/${billingEntryId}/`)
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {

    return error.response;
  }
}

//Create a function to call the API endpoint /billing-entries/ to make a PATCH request to update a tenant invite using the authenticatedInstance
export async function updateBillingEntry(billingEntryId, data) {
  try {
    const res = await authenticatedMediaInstance
      .patch(`/billing-entries/${billingEntryId}/`, data)
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {

    return error.response;
  }
}

//Create a function to call the API endpoint /billing-entries/ to make a DELETE request to delete a tenant invite using the authenticatedInstance
export async function deleteBillingEntry(billingEntryId) {
  try {
    const res = await authenticatedInstance
      .delete(`/billing-entries/${billingEntryId}/`)
      .then((res) => {
        if (res.status == 204) {
          return { message: res.message, status: res.status};
        }
        return { data: [] };
      });
    return { data: res.data, status: res.status };
  } catch (error) {

    return error.response;
  }
}
