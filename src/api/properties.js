import {
  authenticatedInstance,
  authenticatedMediaInstance,
  unauthenticatedInstance,
} from "./api";
import { authUser } from "../constants";

// create an api function to create a property
export async function createProperty(
  name,
  street,
  city,
  state,
  zip_code,
  country
) {
  try {
    const res = await authenticatedMediaInstance
      .post(`/properties/`, {
        name,
        user: authUser.id,
        owner: authUser.owner_id,
        street,
        city,
        state,
        zip_code,
        country,
      })
      .then((res) => {
        const response = res.data;
        console.log("axios create property response ", response);
        return response;
      });
    return { message: "Property created successfully", status: 200, res: res };
  } catch (error) {
    console.log("Create Property Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create function to get all properties for this user
export async function getProperties() {
  try {
    const res = await authenticatedInstance.get(`/properties/`).then((res) => {
      console.log(res);
      if (res.status == 200 && res.data.length == 0) {
        return { data: [] };
      }
      return { data: res.data };
    });
    return res;
  } catch (error) {
    console.log("Get Properties Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function tor retrieve property filters
export async function getPropertyFilters() {
  try {
    const res = await authenticatedInstance
      .get(`/properties/filters/`)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Get Property Filters Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create function to retrieve one specific property
export async function getProperty(propertyId) {
  try {
    const res = await authenticatedInstance
      .get(`/properties/${propertyId}/`)
      .then((res) => {
        if (res.status == 200) {
          return { data: res };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {
    console.log("Get Properties Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function that retrieves a unit by its id without the use of an authorization token
export async function getPropertyUnauthenticated(propertyId) {
  try {
    const res = await unauthenticatedInstance
      .post(`/retrieve-property/`, { property_id: propertyId })
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Proprty Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//create function to update a property with patch method
export async function updateProperty(propertyId, data) {
  try {
    const res = await authenticatedInstance
      .patch(`/properties/${propertyId}/`, data)
      .then((res) => {
        if (res.status !== 200) {
          return { status: 200, message: "Property updated successfully" };
        }
        return { data: [] };
      });
    return {
      data: res.data,
      status: 200,
      message: "Property updated successfully",
    };
  } catch (error) {
    console.log("Get Properties Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}
export async function updatePropertyMedia(propertyId, data) {
  try {
    const res = await authenticatedMediaInstance
      .patch(`/properties/${propertyId}/`, data)
      .then((res) => {
        if (res.status !== 200) {
          return { status: 200, message: "Property updated successfully" };
        }
        return { data: [] };
      });
    return {
      data: res.data,
      status: 200,
      message: "Property updated successfully",
    };
  } catch (error) {
    console.log("Get Properties Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function that call the api/properties/{id}/update-preferences endpoint to update the preferences of a property using a patch request
export async function updatePropertyPreferences(propertyId, data) {
  try {
    const res = await authenticatedMediaInstance
      .patch(`/properties/${propertyId}/update-preferences/`, data)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Update Property Preferences Error: ", error);
    return error.response;
  }
}

//Create a function that updates the preferences of a property with a patch request using the url_path: api/properties/{id}/update-portfolio
export async function updatePropertyPortfolio(propertyId, portfolio) {
  try {
    const res = await authenticatedMediaInstance
      .patch(`/properties/${propertyId}/update-portfolio/`, {
        portfolio:portfolio,
      })
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Update Property Portfolio Error: ", error);
    return error.response;
  }
}

//create function to delete a property
export async function deleteProperty(propertyId) {
  try {
    // const res = await axios
    const res = await authenticatedInstance
      .delete(`/properties/${propertyId}/`)
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {
    console.log("Get Properties Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}
