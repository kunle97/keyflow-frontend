import { authenticatedInstance } from "./api";
import { authUser } from "../constants";
import { convertMaintenanceRequestStatus } from "../helpers/utils";
//--------------------MAINTENANCE REQUEST API FUNCTIONS----------------------///
//Create a function to create a maintenance request
export async function createMaintenanceRequest(data) {
  try {
    const res = await authenticatedInstance.post(
      `/maintenance-requests/`,
      data
    );

    return {
      message: "Maintenance request created successfully",
      status: 201,
      data: res,
    };
  } catch (error) {
    console.log("Create Maintenance Request Error: ", error);
    return {
      response: error.response,
      message:
        "There was an error creating your maintenance request. Please Try again.",
      status: 400,
    };
  }
}
//Create a function to list all maintenance requests for a specific unit
export async function getMaintenanceRequests(unitId) {
  try {
    const res = await authenticatedInstance
      .get(`/units/${unitId}/maintenance-requests/`)
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Maintenance Requests Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to list all maintenance requests for a specific tenant user
export async function getMaintenanceRequestsByUser() {
  try {
    const res = await authenticatedInstance
      .get(`/users/${authUser.user_id}/tenant-maintenance-requests/`)
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Get Maintenance Requests Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to list all maintenance requests for a specific landlord user
export async function getMaintenanceRequestsByLandlord() {
  try {
    const res = await authenticatedInstance
      .get(`/users/${authUser.user_id}/landlord-maintenance-requests/`)
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Get Maintenance Requests Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to get maintenance request by its id
export async function getMaintenanceRequestById(maintenanceRequestId) {
  try {
    const res = await authenticatedInstance
      .get(`/maintenance-requests/${maintenanceRequestId}/`)
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res;
  } catch (error) {
    console.log("Get Maintenance Request Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to mark a maintenance request as resolved
export async function markMaintenanceRequestAsResolved(maintenanceRequestId) {
  try {
    const res = await authenticatedInstance
      .patch(`/maintenance-requests/${maintenanceRequestId}/`, {
        is_resolved: true,
        is_archived: true,
      })
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Mark Maintenance Request As Resolved Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to mark a maintenance request as unresolved and unarchive it
export async function markMaintenanceRequestAsUnresolved(maintenanceRequestId) {
  try {
    const res = await authenticatedInstance
      .patch(`/maintenance-requests/${maintenanceRequestId}/`, {
        is_resolved: false,
        is_archived: false,
      })
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Mark Maintenance Request As Resolved Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to change the status of a maintenance request
export async function changeMaintenanceRequestStatus(
  maintenanceRequestId,
  data
) {
  try {
    const res = await authenticatedInstance
      .patch(`/maintenance-requests/${maintenanceRequestId}/`, data)
      .then((res) => {
        //Create a notification using the authenticatedInstance.post() method and  endpoint  /notifications/ and the . THe parameters are user (The tenant that made the request), title, and message (notifiying the status change)
        const notification = authenticatedInstance
          .post(`/notifications/`, {
            user: res.data.tenant.id,
            title: "Maintenance Request Status Change",
            type: "maintenance_request_status_change",
            message: `Your maintenance request has been set to ${convertMaintenanceRequestStatus(
              data.status
            )}`,
          })
          .then((res) => {
            return res;
          });

        return res;
      });
    return res;
  } catch (error) {
    console.log("Change Maintenance Request Status Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to delete a maintenance request
export async function deleteMaintenanceRequest(maintenanceRequestId) {
  try {
    const res = await authenticatedInstance
      .delete(`/maintenance-requests/${maintenanceRequestId}/`)
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Delete Maintenance Request Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}
