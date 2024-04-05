import { authenticatedInstance } from "./api";
import { authUser } from "../constants";
import { convertMaintenanceRequestStatus } from "../helpers/utils";
//--------------------MAINTENANCE REQUEST Event API FUNCTIONS----------------------///
//Create a function to create a maintenance request event using the endpoint /maintenance-request-events/
export async function createMaintenanceRequestEvent(data) {
  try {
    const res = await authenticatedInstance.post(
      `/maintenance-request-events/`,
      data
    );

    return {
      message: "Maintenance request event created successfully",
      status: 201,
      data: res,
    };
  } catch (error) {
    console.log("Create Maintenance Request Event Error: ", error);
    return {
      response: error.response,
      message:
        "There was an error creating your maintenance request event. Please Try again.",
      status: 400,
    };
  }
}
//Create a function to list all maintenance request events for a specific maintenance request
export async function getMaintenanceRequestEvents(maintenanceRequestId) {
  try {
    const res = await authenticatedInstance
      .get(`/maintenance-requests/${maintenanceRequestId}/maintenance-request-events/`)
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Maintenance Request Events Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}