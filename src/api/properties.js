import { authenticatedInstance, unauthenticatedInstance } from "./api";
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
      const res = await authenticatedInstance
        .post(`/properties/`, {
          name,
          user: authUser.id,
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
      return error.response.data;
    }
  }
  
  //Create function to get all properties for this user
  export async function getProperties() {
    try {
      const res = await authenticatedInstance
        .get(`/users/${authUser.id}/properties/`)
        .then((res) => {
          console.log(res);
          if (res.status == 200 && res.data.length == 0) {
            return { data: [] };
          }
          return { data: res.data };
        });
      return res;
    } catch (error) {
      console.log("Get Properties Error: ", error);
      return error.response.data;
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
      return error.response.data;
    }
  }
  

  
  //Create function to retrieve one specific property
  export async function getProperty(propertyId) {
    try {
      const res = await authenticatedInstance
        .get(`/properties/${propertyId}/`)
        .then((res) => {
          if (res.status == 200) {
            return { data: res.data };
          }
          return { data: [] };
        });
      return res.data;
    } catch (error) {
      console.log("Get Properties Error: ", error);
      return error.response.data;
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
      return error.response.data;
    }
  }
  
  //create function to update a property with patch method
  export async function updateProperty(propertyId, data) {
    try {
      const res = await authenticatedInstance
        .patch(`/properties/${propertyId}/`, data)
        .then((res) => {
          if (res.status == 200) {
            return { data: res.data };
          }
          return { data: [] };
        });
      return res.data;
    } catch (error) {
      console.log("Get Properties Error: ", error);
      return error.response.data;
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
      return error.response.data;
    }
  }