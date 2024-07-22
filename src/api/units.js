import {
  authenticatedInstance,
  authenticatedMediaInstance,
  unauthenticatedInstance,
} from "./api";
import { authUser } from "../constants";
///-----------------UNIT API FUNCTIONS---------------------------///
//create a function to create a unit
export async function createUnit(data) {

  try {
    const res = await authenticatedInstance
      .post(`/units/`, data)
      .then((res) => {
        const response = res.data;

        return response;
      });
    return { message: "Unit created successfully", status: 200, res: res };
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to retrieve all units from an owner using the endpoint /units/
export async function getAllUnits() {
  try {
    const res = await authenticatedInstance.get(`/units/`).then((res) => {


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


//Create function to get all units for the specific property
export async function getUnits(propertyId) {
  try {
    const res = await authenticatedInstance
      .get(`/properties/${propertyId}/units/`)
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

    return error.response;
  }
}

//Create a function that retrieves a unit by its id without the use of an authorization token
export async function getUnitUnauthenticated(unitId) {
  try {
    const res = await unauthenticatedInstance
      .post(`/retrieve-unit/`, { unit_id: unitId })
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

//Create function to retrieve one lease term from one specific
export async function getLeaseTemplateByUnitId(unit_id) {
  try {
    const res = await unauthenticatedInstance
      .get(`/retrieve-lease-template-unit/`, {
        //Create param for unit id
        params: {
          unit_id,
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
          return res;
        }
        return { data: [] };
      });
    return res;
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
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
        return res;
      });
    return res;
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
  }
}
//Create a funtion to get all units for a specific owner using the endpoint /users/{owner_id}/units/
export async function getOwnerUnits() {
  try {
    const res = await authenticatedInstance.get(`/units/`).then((res) => {


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

//Create a function that applies a lease template to a unit using the endpoint /units/{unit_id}/assign-lease-template/. The function should have the parameter: data:
export async function assignLeaseTemplateToUnit(data) {
  try {
    const res = await authenticatedInstance
      .post(`/units/${data.unit_id}/assign-lease-template/`, {
        lease_template_id: data.lease_template_id,
      })
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//CReate a function that removes a lease template from a unit using the endpoint /units/{unit_id}/remove-lease-template/. The function should have the parameter: data:
export async function removeUnitLeaseTemplate(unit_id) {
  try {
    const res = await authenticatedInstance
      .patch(`/units/${unit_id}/remove-lease-template/`, {
        unit_id: unit_id,
      })
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function that checks if a unit name is valid using the endpoint /units/validate-name/. The function should have the parameter: data:
export async function validateUnitName(data) {
  try {
    const res = await authenticatedInstance
      .post(`/units/validate-name/`, data)
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
  }
}
