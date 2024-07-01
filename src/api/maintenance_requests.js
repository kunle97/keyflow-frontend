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
      .get(`/users/${authUser.id}/tenant-maintenance-requests/`)
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Get Maintenance Requests Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to list all maintenance requests for a specific owner user
export async function getAllOwnerMaintenanceRequests(ordering = "-created_at", query = "", limit = 10) {
  try {
    const res = await authenticatedInstance
      .get(`/maintenance-requests/`, {
        params: {
          ordering: ordering,
          search: query,
          limit: limit,
        },
      })
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

//Create a funtion toi fetch a  tenants maintenance requests by their id using the endpoint /tenants/{tenant_id}/maintenance-requests/
export async function getMaintenanceRequestsByTenant(tenantId) {
  try {
    const res = await authenticatedInstance
      .get(`/tenants/${tenantId}/maintenance-requests/`)
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res;
  } catch (error) {
    console.log("Get Maintenance Requests Error: ", error);
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
            user: res.data.tenant.user.id,
            title: "Maintenance Request Status Change",
            type: "maintenance_request_status_change",
            message: `Your maintenance request has been set to ${convertMaintenanceRequestStatus(
              data.status
            )}`,
            resource_url: `/dashboard/tenant/maintenance-requests/${maintenanceRequestId}/`,
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

//Create a function to change the priorty of a maintenance request
export async function changeMaintenanceRequestPriority(
  maintenanceRequestId,
  data
) {
  try {
    const res = await authenticatedInstance
      .patch(`/maintenance-requests/${maintenanceRequestId}/`, data)
      .then((res) => {
        //TODO: Create notification for priority change if assigned to a staff memeber
        return res;
      });
    return res;
  } catch (error) {
    console.log("Change Maintenance Request Priority Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to update a maintenance request using the patch method and call it updateMaintenanceRequest
export async function updateMaintenanceRequest(maintenanceRequestId, data) {
  try {
    const res = await authenticatedInstance
      .patch(`/maintenance-requests/${maintenanceRequestId}/`, data)
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Update Maintenance Request Error: ", error);
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
