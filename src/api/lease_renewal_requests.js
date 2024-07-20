import { authenticatedInstance } from "./api";
//Using the authenticatedInstance create a function to post a new lease renewal request using the endpoint /lease-renewal-requests
export async function createLeaseRenewalRequest(data) {
  try {
    const response = await authenticatedInstance
      .post("/lease-renewal-requests/", data)
      .then((res) => {

        return {
          message: "Lease renewal request created successfully",
          status: 201,
          data: res.data,
        };
      });
    return response;
  } catch (error) {

    return { response: error.response, message: "Error", status: 400 };
  }
}
//Using the authenticatedInstance create a function to get all of the lease renewal requests using the endpoint /lease-renewal-requests
export async function getAllLeaseRenewalRequests() {
  try {
    const response = await authenticatedInstance
      .get("/lease-renewal-requests/")
      .then((res) => {

        return {
          message: "Lease renewal requests retrieved successfully",
          status: 200,
          data: res.data,
        };
      });
    return response;
  } catch (error) {

    return { response: error.response, message: "Error", status: 400 };
  }
}

//Using the authenticatedInstance create a function to get a specific lease renewal request using the endpoint /lease-renewal-requests/:id
export async function getLeaseRenewalRequestById(id) {
  try {
    const response = await authenticatedInstance
      .get(`/lease-renewal-requests/${id}/`)
      .then((res) => {

        return {
          message: "Lease renewal request retrieved successfully",
          status: 200,
          data: res.data,
        };
      });
    return response;
  } catch (error) {

    return { response: error.response, message: "Error", status: 400 };
  }
}
//Using the authenticatedInstance create a function to approve a lease renewal request using the endpoint /lease-renewal-requests/approve
export async function approveLeaseRenewalRequest(data) {
  try {
    const response = await authenticatedInstance
      .post("/lease-renewal-requests/approve/", data)
      .then((res) => {

        return {
          message: "Lease renewal request approved successfully",
          status: 204,
          data: res.data,
        };
      });
    return response;
  } catch (error) {

    return { response: error.response, message: "Error", status: 400 };
  }
}
//Using the authenticatedInstance create a function to reject a lease renewal request using the endpoint /lease-renewal-requests/deny
export async function rejectLeaseRenewalRequest(data) {
  try {
    const response = await authenticatedInstance
      .post("/lease-renewal-requests/deny/", data)
      .then((res) => {

        return {
          message: "Lease renewal request rejected successfully",
          status: 204,
          data: res.data,
        };
      });
    return response;
  } catch (error) {

    return { response: error.response, message: "Error", status: 400 };
  }
}

//Using the authenticatedInstance create a function to get all of the tenants lease renewal requests using the endpoint /lease-renewal-requests/tenant
export async function getTenantLeaseRenewalRequests() {
  try {
    const response = await authenticatedInstance
      .get("/lease-renewal-requests/tenant/")
      .then((res) => {

        return {
          message: "Lease renewal requests retrieved successfully",
          status: 200,
          data: res.data.data,
        };
      });
    return response;
  } catch (error) {

    return { response: error.response, message: "Error", status: 400 };
  }
}

//Create a function to update a lease renewal request using the endpoint /lease-renewal-requests/:id
export async function updateLeaseRenewalRequest(id, data) {
  try {
    const response = await authenticatedInstance
      .patch(`/lease-renewal-requests/${id}/`, data)
      .then((res) => {

        return {
          message: "Lease renewal request updated successfully",
          status: 204,
          data: res.data,
        };
      });
    return response;
  } catch (error) {

    return { response: error.response, message: "Error", status: 400 };
  }
}

//Create a function (signLeaseAgreementRenewal) to sign a lease renewal request using the endpoint /lease-renewal-requests/sign
export async function signLeaseAgreementRenewal(data) {
  try {
    const response = await authenticatedInstance
      .post("/lease-renewal-requests/sign/", data)
      .then((res) => {

        return {
          message: "Lease renewal request signed successfully",
          status: 204,
          data: res.data,
        };
      });
    return response;
  } catch (error) {

    return { response: error.response, message: "Error", status: 400 };
  }
}
