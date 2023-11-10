import { authenticatedInstance } from "./api";
import { authUser } from "../constants";

//-----------------LANDLORD API FUNCTIONS---------------------------///
//Create a function that retrieves landlords tenants using the endpoint /users/{landlord_id}/landlord-tenants/
export async function getLandlordTenants() {
  try {
    const res = await authenticatedInstance
      .get(`/users/${authUser.user_id}/tenants/`, {
        landlord_id: authUser.user_id,
      })
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
    return error.response.data;
  }
}

//Create a function that retrieves a specific landlord tenant using the endpoint /users/{landlord_id}/tenant/
export async function getLandlordTenant(tenantId) {
  try {
    const res = await authenticatedInstance
      .post(`/landlord-tenant-detail/`, {
        tenant_id: tenantId,
        landlord_id: authUser.user_id,
      })
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
    return error.response.data;
  }
}
