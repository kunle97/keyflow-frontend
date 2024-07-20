import { authenticatedInstance } from "./api";

//Using the authenticatedInstance create a function to post a new lease cancellation request using the endpoint /lease-cancellation-requests
export async function createLeaseCancellationRequest(data) {
  try {
    const response = await authenticatedInstance
      .post("/lease-cancellation-requests/", data)
      .then((res) => {

        return {
          message: "Lease cancellation request created successfully",
          status: 201,
          data: res.data,
        };
      });
    return response;
  } catch (error) {

    return { response: error.response, message: "Error", status: 400 };
  }
}

//Using the authenticatedInstance create a function to get all of the lease cancellation requests using the endpoint /lease-cancellation-requests
export async function getAllLeaseCancellationRequests() {
  try {
    const response = await authenticatedInstance
      .get("/lease-cancellation-requests/")
      .then((res) => {

        return {
          message: "Lease cancellation requests retrieved successfully",
          status: 200,
          data: res.data,
        };
      });
    return response;
  } catch (error) {

    return { response: error.response, message: "Error", status: 400 };
  }
}

//Using the authenticatedInstance create a function to get a specific lease cancellation request using the endpoint /lease-cancellation-requests/:id
export async function getLeaseCancellationRequestById(id) {
  try {
    const response = await authenticatedInstance
      .get(`/lease-cancellation-requests/${id}/`)
      .then((res) => {

        return {
          message: "Lease cancellation request retrieved successfully",
          status: 200,
          data: res.data,
        };
      });
    return response;
  } catch (error) {

    return { response: error.response, message: "Error", status: 400 };
  }
}

//Using the authenticatedInstance create a function to approve a lease cancellation request using the endpoint /lease-cancellation-requests/approve
export async function approveLeaseCancellationRequest(data) {
  try {
    const response = await authenticatedInstance
      .post("/lease-cancellation-requests/approve/", data)
      .then((res) => {

        return {
          message: "Lease cancellation request approved successfully",
          status: 204,
          data: res.data,
        };
      });
    return response;
  } catch (error) {

    return { response: error.response, message: "Error", status: 400 };
  }
}

//Using the authenticatedInstance create a function to reject a lease cancellation request using the endpoint /lease-cancellation-requests/deny
export async function denyLeaseCancellationRequest(data) {
  try {
    const response = await authenticatedInstance
      .post("/lease-cancellation-requests/deny/", data)
      .then((res) => {

        return {
          message: "Lease cancellation request rejected successfully",
          status: 204,
          data: res.data,
        };
      });
    return response;
  } catch (error) {

    return { response: error.response, message: "Error", status: 400 };
  }
}

//Using the authenticatedInstance create a function to get all of the tenants lease cancellation requests using the endpoint /lease-cancellation-requests/tenant
export async function getTenantLeaseCancellationRequests() {
  try {
    const response = await authenticatedInstance
      .get("/lease-cancellation-requests/tenant/")
      .then((res) => {

        return {
          message: "Lease cancellation requests retrieved successfully",
          status: 200,
          data: res.data.data,
        };
      });
    return response;
  } catch (error) {

    return { response: error.response, message: "Error", status: 400 };
  }
}
