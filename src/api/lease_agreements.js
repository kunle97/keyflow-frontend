import { authenticatedInstance, unauthenticatedInstance } from "./api";
//-------------------LEASE AGREEMENT API FUNCTIONS------------------------///
//Create a function that retrieves all lease agreements
export async function getAllLeaseAgreements() {
  //TODO: Depricate this function and replace with getLeaseAgreementsByTenant
  try {
    const res = await authenticatedInstance
      .get(`/lease-agreements/`)
      .then((res) => {
        const response = res.data;

        return response;
      });
    return {
      message: "Lease agreements retrieved successfully",
      status: 200,
      response: res,
    };
  } catch (error) {
    return { response: error.response, message: "Error", status: 400 };
  }
}

//Create a function that retrieves a lease agreement by its id
export async function getLeaseAgreementById(leaseAgreementId) {
  try {
    const res = await authenticatedInstance
      .get(`/lease-agreements/${leaseAgreementId}/`)
      .then((res) => {
        const response = res.data;

        return response;
      });
    return {
      message: "Lease agreement retrieved successfully",
      status: 200,
      data: res,
    };
  } catch (error) {
    return { response: error.response, message: "Error", status: 400 };
  }
}

//Create a function that creates a lease agreement
export async function createLeaseAgreement(data) {
  try {
    const res = await authenticatedInstance
      .post(`/lease-agreements/`, data)
      .then((res) => {
        const response = res.data;

        return response;
      });
    return {
      message: "Lease agreement created successfully",
      status: 200,
      response: res,
    };
  } catch (error) {
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
    return { response: error.response, message: "Error", status: 400 };
  }
}

//Create a function to retrieve one specific lease term by its id
export async function getLeaseAgreementByIdAndApprovalHash(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`/retrieve-lease-agreement-approval/`, data)
      .then((res) => {
        if (res.status === 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {
    return error.response;
  }
}
//Create a function to sign lease agreement
export async function signLeaseAgreement(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`/sign-lease-agreement/`, data)
      .then((res) => {
        return res.data;
      });
    return res;
  } catch (error) {
    return error.response;
  }
}

//Create a function to retrieve all of the tenant's lease agreements. function takes a paramenter temnant_id which is the id of the tenant and the endpoint is /lease-agreements/get-lease-agreements-by-tenant/ and the query param should be tenant_id
export async function getLeaseAgreementsByTenant(tenant_id) {
  try {
    const res = await authenticatedInstance
      .get(`/tenants/${tenant_id}/lease-agreements/`)
      .then((res) => {
        const response = res;

        return response;
      });
    return res;
  } catch (error) {
    return { response: error.response, message: "Error", status: 400 };
  }
}

//Create a function to retrieve a lease agreement by its lease_renewal_request_id using the endpoint /lease-agreements/get-lease-agreement-by-lease-renewal-request/
export async function getLeaseAgreementByLeaseRenewalRequestId( //TODO: Depricate this function and replace with getLeaseAgreementsByTenant
  lease_renewal_request_id
) {
  try {
    const res = await authenticatedInstance
      .get(`/lease-agreements/get-lease-agreement-by-lease-renewal-request/`, {
        params: { lease_renewal_request_id },
      })
      .then((res) => {
        const response = res.data;
        return response;
      });
    return res;
  } catch (error) {
    return { response: error.response, message: "Error", status: 400 };
  }
}

//Create a function that  cancells a lease agreement by its id
export async function cancelLeaseAgreement(leaseAgreementId) {
  try {
    const res = await authenticatedInstance
      .post(`/lease-agreements/cancel-lease-agreement/`, {
        lease_agreement_id: leaseAgreementId,
      })
      .then((res) => {
        const response = res.data;

        return response;
      });
    return {
      message: "Lease agreement cancelled successfully",
      status: 200,
      response: res,
    };
  } catch (error) {
    return { response: error.response, message: "Error", status: 400 };
  }
}
