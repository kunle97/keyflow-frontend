import { authenticatedInstance } from "./api";
import { authUser } from "../constants";

//-----------------LANDLORD API FUNCTIONS---------------------------///
//Create a function that retrieves landlords tenants using the endpoint /users/{landlord_id}/landlord-tenants/
export async function getLandlordTenants() {
  try {
    const res = await authenticatedInstance
      .get(`/tenants/`)
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Landlord Tenants Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function that retrieves a specific landlord tenant using the endpoint /users/{landlord_id}/tenant/
export async function getLandlordTenant(tenantId) {
  try {
    const res = await authenticatedInstance
      .get(`/tenants/${tenantId}/`)
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Landlord Tenant Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function called getTenantUnit that retrieves a specific tenant unit using the endpoint /tenants/{tenant_id}/unit/
export async function getTenantUnit(tenantId) {
  try {
    const res = await authenticatedInstance
      .get(`/tenants/${tenantId}/unit/`)
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Tenant Unit Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function getLandlordStaff that retrieves all of the landlords staff using the endpoint /staff/
export async function getLandlordStaff() {
  try {
    const res = await authenticatedInstance
      .get(`/staff/`)
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Landlord Staff Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}
//Create a function that retrieves a specific landlord staff member using the endpoint /staff/{staff_id}/
export async function getLandlordStaffMember(staffId) {
  try {
    const res = await authenticatedInstance
      .get(`/staff/${staffId}/`)
      .then((res) => {
        console.log(res);
        if (res.status == 200 && res.data.length == 0) {
          return { data: [] };
        }
        return { data: res.data };
      });
    return res;
  } catch (error) {
    console.log("Get Landlord Staff Member Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}