import { authUser } from "../constants";
import { unauthenticatedInstance, authenticatedInstance } from "./api";

//Create a function to verify the tenant registration via the approval hash and lease agreement id
export async function verifyStaffRegistrationCredentials(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`/auth/staff/register/verify/`, data)
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

//OWNER FUNCTIONs

//Create a function for to update staff members privileges using the endpoint api/owners/{id}/update-privileges/
export async function updateStaffPrivileges(data) {
  try {
    const res = await authenticatedInstance
      .post(`/owners/${authUser.owner_id}/update-staff-privileges/`, data)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Update Staff Privileges Error: ", error);
    return error.response;
  }
}

//create a function to update the staff member's rental assignments
export async function updateStaffRentalAssignments(data) {
  try {
    const res = await authenticatedInstance
      .post(
        `/owners/${authUser.owner_id}/update-staff-rental-assignments/`,
        data
      )
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Update Staff Rental Assignments Error: ", error);
    return error.response;
  }
}

//Create a function to update the staff member's role using the endpoint api/owners/{id}/update-staff-role/
export async function updateStaffRole(data) {
  try {
    const res = await authenticatedInstance
      .post(`/owners/${authUser.owner_id}/update-staff-role/`, data)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Update Staff Role Error: ", error);
    return error.response;
  }
}

//Create a function to delete a staff member using the endpoint api/owners/{id}/delete-staff/
export async function deleteStaff(data) {
  try {
    const res = await authenticatedInstance
      .post(`/owners/${authUser.owner_id}/delete-staff/`, data)
      .then((res) => {
        console.log(res);
        return res;
      });
    return res;
  } catch (error) {
    console.log("Delete Staff Error: ", error);
    return error.response;
  }
}

//STAFF FUNCTIONS

//Create a function to fetch the staff member's rental assignments using the endpoint /retrieve-staff-rental-assignments/
export async function getStaffRentalAssignments() {
  try {
    const res = await authenticatedInstance
      .get(`/retrieve-staff-rental-assignments/?page=1`)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Fetch Staff Rental Assignments Error: ", error);
    return error.response;
  }
}

//Create a function to fetch the staff member's privileges using the endpoint /retrieve-staff-privileges/
export async function getStaffPrivileges() {
  try {
    const res = await authenticatedInstance
      .get(`/retrieve-staff-privileges/`)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Fetch Staff Privileges Error: ", error);
    return error.response;
  }
}