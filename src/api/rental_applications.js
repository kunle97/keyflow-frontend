import { authenticatedInstance, unauthenticatedInstance } from "./api";
import { authUser } from "../constants";
import { makeId } from "../helpers/utils";
//----------------RENTAL APPLICATION API FUNCTIONS------------------------///
//Create a function to create a rental application
export async function createRentalApplication(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`/rental-applications/`, {
        unit_id: data.unit_id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        date_of_birth: data.date_of_birth,
        phone_number: data.phone,
        desired_move_in_date: data.desired_move_in_date,
        other_occupants: data.other_occupants,
        pets: data.pets,
        vehicles: data.vehicles,
        convicted: data.crime,
        bankrupcy: data.bankrupcy,
        evicted: data.evicted,
        employment_history: JSON.stringify(data.employment_history),
        residential_history: JSON.stringify(data.residential_history),
        owner_id: data.owner_id,
        comments: data.comments,
      })
      .then((res) => {
        const response = res.data;

        return response;
      });
    return {
      message: "Rental app created successfully",
      status: 200,
      res: res,
    };
  } catch (error) {

    return { response: error.response, message: "Error", status: 400 };
  }
}

//Create a function to get all rental applications for a specific unit
export async function getRentalApplications(unitId) {
  try {
    const res = await authenticatedInstance
      .get(`/units/${unitId}/rental-applications/`)
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

//Create a function to get all rental ids for logged in user
export async function getRentalApplicationsByUser() {
  try {
    const res = await authenticatedInstance
      .get(`/rental-applications/`)
      .then((res) => {

        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {

    return error.response;
  }
}

//Create a function to get one specific rental application by its id
export async function getRentalApplicationById(rentalAppId) {
  try {
    const res = await authenticatedInstance
      .get(`/rental-applications/${rentalAppId}/`)
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
//Retreives Approval Hash. Used to populate form data when tenant registers for the first time
export async function getRentalApplicationByApprovalHash(approval_hash) {
  try {
    const res = await unauthenticatedInstance
      .post(`/auth/tenant/register/retrieve-rental-application/`, {
        approval_hash: approval_hash,
      })
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

//Create A function to approve a rental application
// export async function approveRentalApplication(rentalAppId) {
//   try {
//     const res = await authenticatedInstance
//       .patch(`/rental-applications/${rentalAppId}/`, {
//         is_approved: true,
//         approval_hash: makeId(64),
//         is_archived: true,
//       })
//       .then((res) => {

//         return res.data;
//       });

//     return res;
//   } catch (error) {

//     return error.response;
//   }
// }

export async function approveRentalApplication(rentalAppId) {
  try {
    const res = await authenticatedInstance
      .post(`/rental-applications/${rentalAppId}/approve-rental-application/`)
      .then((res) => {

        return res.data;
      });

    return res;
  } catch (error) {

    return error.response;
  }
}

//Create A function to reject a rental application
export async function rejectRentalApplication(rentalAppId) {
  try {
    const res = await authenticatedInstance
      .delete(`/rental-applications/${rentalAppId}/`)
      .then((res) => {
        return {
          data: res.data,
          message: "Rental application rejected.",
          status: 200,
        };
      });
    return res;
  } catch (error) {

    return error.response;
  }
}

//Create a function to delete all other rental applications other than the one that was approved
export async function deleteOtherRentalApplications(rentalAppId) {
  try {
    const res = await authenticatedInstance
      .delete(
        `/rental-applications/${rentalAppId}/delete-remaining-rental-applications/`
      )
      .then((res) => {
        return {
          data: res.data,
          message: "Remaining Rental applications deleted.",
          status: 200,
        };
      });
    return res;
  } catch (error) {

    return error.response;
  }
}

//Create a function to delete one specific rental application by its id
export async function revokeRentalApplication(rentalAppId) {
  try {
    const res = await authenticatedInstance
      .delete(`/rental-applications/${rentalAppId}/revoke-rental-application/`)
      .then((res) => {
        return {
          data: res.data,
          message: "Rental application deleted.",
          status: 200,
        };
      });
    return res;
  } catch (error) {

    return error.response;
  }
}

//Create a function to archive a rental application using the POST endpoint  /rental-applications/{id}/archive-rental-application/
export async function archiveRentalApplication(rentalAppId) {
  try {
    const res = await authenticatedInstance
      .post(`/rental-applications/${rentalAppId}/archive-rental-application/`)
      .then((res) => {
        return {
          data: res.data,
          message: "Rental application archived.",
          status: 200,
        };
      });
    return res;
  } catch (error) {

    return error.response;
  }
}

//Create a function to unarchive a rental application using the POST endpoint  /rental-applications/{id}/unarchive-rental-application/
export async function unarchiveRentalApplication(rentalAppId) {
  try {
    const res = await authenticatedInstance
      .post(`/rental-applications/${rentalAppId}/unarchive-rental-application/`)
      .then((res) => {
        return {
          data: res.data,
          message: "Rental application unarchived.",
          status: 200,
        };
      });
    return res;
  } catch (error) {

    return error.response;
  }
}
//Create a function to delete a rental application using the DELETE method  /rental-applications/{id}
export async function deleteRentalApplication(rentalAppId) {
  try {
    const res = await authenticatedInstance
      .delete(`/rental-applications/${rentalAppId}/`)
      .then((res) => {
        return {
          data: res.data,
          message: "Rental application deleted.",
          status: 204,
        };
      });
    return res;
  } catch (error) {
    return error.response;
  }
}