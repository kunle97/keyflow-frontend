import { authenticatedInstance, authenticatedMediaInstance, unauthenticatedInstance } from "./api";

//Create a function to call the API endpoint /staff-invites/ to make a POST request to create a new staff invite using the authenticatedInstance
export async function createStaffInvite(data) {
  console.log("create unit data: ", data);
  try {
    const res = await authenticatedMediaInstance
      .post(`/staff-invites/`, data)
      .then((res) => {
        const response = res.data;
        console.log("axios create unit response ", response);
        return response;
      });
    return {
      message: "Staff invite created successfully",
      status: 200,
      res: res,
    };
  } catch (error) {
    console.log("Create staff invite error Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}


//Create a function to call the API endpoint /staff-invites/ to make a GET request to retrieve all staff invites using the authenticatedInstance
export async function getStaffInvites() {
  try {
    const res = await authenticatedInstance
      .get(`/staff-invites/`)
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get staff invites Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to call the API endpoint /staff-invites/ to make a GET request to retrieve one staff invite using the authenticatedInstance
export async function getStaffInvite(staffInviteId) {
  try {
    const res = await authenticatedInstance
      .get(`/staff-invites/${staffInviteId}/`)
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {
    console.log("Get staff invite Error: ", error);
    return error.response;
  }
}

//Create a function to call the API endpoint /staff-invites/ to make a DELETE request to delete a staff invite using the authenticatedInstance
export async function deleteStaffInvite(staffInviteId) {
  try {
    const res = await authenticatedInstance
      .delete(`/staff-invites/${staffInviteId}/`)
      .then((res) => {
        console.log(res);
        return res;
      });
    return res;
  } catch (error) {
    console.log("Delete staff invite Error: ", error);
    return error.response;
  }
}

//Create a funtion to verify that the staff invite registration credentials are valid using the API endpoint /auth/staff/invite/register/verify/
export async function verifyStaffInviteRegistrationCredentials(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`/auth/invite/staff/register/verify/`, data)
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
