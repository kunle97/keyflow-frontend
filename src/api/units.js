import { authenticatedInstance, unauthenticatedInstance } from "./api";
import { authUser } from "../constants";
///-----------------UNIT API FUNCTIONS---------------------------///
//create a function to create a unit
export async function createUnit(data) {
    console.log("create unit data: ", data);
    try {
      const res = await authenticatedInstance
        .post(`/units/`, data)
        .then((res) => {
          const response = res.data;
          console.log("axios create unit response ", response);
          return response;
        });
      return { message: "Unit created successfully", status: 200, res: res };
    } catch (error) {
      console.log("Create Unit Error: ", error);
      return error.response.data;
    }
  }
  
  //Create function to get all units for the specific property
  export async function getUnits(propertyId) {
    try {
      const res = await authenticatedInstance
        .get(`/properties/${propertyId}/units/`)
        .then((res) => {
          console.log(res);
          if (res.status == 200 && res.data.length == 0) {
            return { data: [] };
          }
          return { data: res.data };
        });
      return res;
    } catch (error) {
      console.log("Get Units Error: ", error);
      return error.response.data;
    }
  }
  
  //Create function to retrieve one specific unit
  export async function getUnit(unitId) {
    try {
      const res = await authenticatedInstance
        .get(`/units/${unitId}/`)
        .then((res) => {
          if (res.status == 200) {
            return { data: res.data };
          }
          return { data: [] };
        });
      return res.data;
    } catch (error) {
      console.log("Get Unit Error: ", error);
      return error.response;
    }
  }
  
  //Create a function that retrieves a unit by its id without the use of an authorization token
  export async function getUnitUnauthenticated(unitId) {
    try {
      const res = await unauthenticatedInstance
        .post(`/retrieve-unit/`, { unit_id: unitId })
        .then((res) => {
          console.log(res);
          if (res.status == 200 && res.data.length == 0) {
            return { data: [] };
          }
          return { data: res.data };
        });
      return res;
    } catch (error) {
      console.log("Get Units Error: ", error);
      return error.response.data;
    }
  }
  
  //Create function to retrieve one lease term from one specific
  export async function getLeaseTermByUnitId(unitId) {
    try {
      const res = await unauthenticatedInstance
        .post(`/retrieve-lease-term-unit/`, { unit_id: unitId })
        .then((res) => {
          if (res.status == 200) {
            return { data: res.data };
          }
          return { data: [] };
        });
      return res.data;
    } catch (error) {
      console.log("Get Unit Error: ", error);
      return error.response;
    }
  }
  
  //Create function to update a unit with patch method
  export async function updateUnit(unitId, data) {
    try {
      const res = await authenticatedInstance
        .patch(`/units/${unitId}/`, data)
        .then((res) => {
          if (res.status == 200) {
            return { data: res.data };
          }
          return { data: [] };
        });
      return res.data;
    } catch (error) {
      console.log("Update Unit Error: ", error);
      return error.response.data;
    }
  }
  
  //Create function to delete a unit
  export async function deleteUnit(data) {
    try {
      const res = await authenticatedInstance
        .delete(`/units/${data.unit_id}/`, {
          data: {
            product_id: data.product_id,
            subscription_id: data.subscription_id,
            rental_property: data.rental_property,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            return { data: res.data };
          }
          return { data: [] };
        });
      return res.data;
    } catch (error) {
      console.log("Delete Unit Error: ", error);
      return error.response.data;
    }
  }
  //Create a funtion to get all units for a specific landlord using the endpoint /users/{landlord_id}/units/
  export async function getLandlordUnits() {
    try {
      const res = await authenticatedInstance
        .get(`/users/${authUser.id}/units/`)
        .then((res) => {
          console.log(res);
  
          if (res.status == 200 && res.data.length == 0) {
            return { data: [] };
          }
          return { data: res.data };
        });
  
      return res;
    } catch (error) {
      console.log("Get Landlord Units Error: ", error);
      return error.response.data;
    }
  }
