import { authenticatedInstance } from "./api";

//Create a function to call the API endpoint /annoucements/ to make a POST request to create a new announcement using the authenticatedInstance
export async function createAnnouncement(data) {
  console.log("create announcement data: ", data);
  try {
    const res = await authenticatedInstance
      .post(`/announcements/`, data)
      .then((res) => {
        const response = res.data;
        console.log("axios create announcement response ", response);
        return response;
      });
    return {
      message: "Announcement created successfully",
      status: 200,
      res: res,
    };
  } catch (error) {
    console.log("Create announcement error Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to call the API endpoint /announcements/ to make a GET request to retrieve all announcements using the authenticatedInstance
export async function getAnnouncements() {
  try {
    const res = await authenticatedInstance
      .get(`/announcements/`)
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get announcements Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to call the API endpoint /announcements/ to make a GET request to retrieve a single announcement using the authenticatedInstance
export async function getAnnouncement(announcementId) {
  try {
    const res = await authenticatedInstance
      .get(`/announcements/${announcementId}/`)
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {
    console.log("Get announcement Error: ", error);
    return error.response;
  }
}


//Create a function to call the API endpoint /announcements/?unit_id= to make a GET request to retrieve all announcements for a specific unit using the authenticatedInstance
export async function getUnitAnnouncements(unitId) {
  try {
    const res = await authenticatedInstance
      .get(`/announcements/?unit_id=${unitId}`)
      .then((res) => {
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get unit announcements Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}
//Create a function to call the API endpoint /announcements/ to make a PATCH request to update an announcement using the authenticatedInstance
export async function updateAnnouncement(announcementId, data) {
  try {
    const res = await authenticatedInstance
      .patch(`/announcements/${announcementId}/`, data)
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
        return { data: [] };
      });
    return res;
  } catch (error) {
    console.log("Update announcement Error: ", error);
    return error.response;
  }
}

//Create a function to call the API endpoint /announcements/ to make a DELETE request to delete an announcement using the authenticatedInstance
export async function deleteAnnouncement(announcementId) {
  try {
    const res = await authenticatedInstance
      .delete(`/announcements/${announcementId}/`)
      .then((res) => {
        if (res.status == 204) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {
    console.log("Delete announcement Error: ", error);
    return error.response;
  }
}
