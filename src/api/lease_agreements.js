import { authUser } from "../constants";
import { authenticatedInstance, unauthenticatedInstance } from "./api";
//-------------------LEASE AGREEMENT API FUNCTIONS------------------------///
//Create a function that retrieves all lease agreements
export async function   getAllLeaseAgreements() {
  try {
    const res = await authenticatedInstance
      .get(`/lease-agreements/`)
      .then((res) => {
        const response = res.data;
        console.log("axios get lease agreements response ", response);
        return response;
      });
    return {
      message: "Lease agreements retrieved successfully",
      status: 200,
      response: res,
    };
  } catch (error) {
    console.log("Get Lease Agreements Error: ", error);
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
        console.log("axios get lease agreement by id response ", response);
        return response;
      });
    return {
      message: "Lease agreement retrieved successfully",
      status: 200,
      data: res,
    };
  } catch (error) {
    console.log("Get Lease Agreement By Id Error: ", error);
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
