import { authenticatedInstance } from "./api";
import { authUser } from "../constants";
//A function to get an owner's preferences using the endpoint api/owners/{id}/preferences
export async function getOwnerPreferences() {
  try {
    const res = await authenticatedInstance
      .get(`/owners/${authUser.owner_id}/preferences/`)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Get Owner Preferences Error: ", error);
    return error.response;
  }
}

//Create a function to update an owner's preferences using a POST request the endpoint api/owners/{id}/update-preferences
export async function updateOwnerPreferences(data) {
  try {
    const res = await authenticatedInstance
      .post(`/owners/${authUser.owner_id}/update-preferences/`, data)
      .then((res) => {
        console.log(res);
        return res;
      });
    return res;
  } catch (error) {
    console.log("Update Owner Preferences Error: ", error);
    return error.response;
  }
}
