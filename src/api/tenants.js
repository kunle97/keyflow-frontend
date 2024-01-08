import { authenticatedInstance, unauthenticatedInstance } from "./api";
import { authUser } from "../constants";
//Create a function that makes a payment for a tenant using the endpoint /tenant/make-payment/
export async function makePayment(data) {
  try {
    const res = await authenticatedInstance
      .post(`/tenants-v1/${authUser.id}/make-payment/`, data)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Make Payment Error: ", error);
    return error.response;
  }
}
// Create a function to get all necessary data for the tenant dashboard  using the endpoint /retrieve-tenant-dashboard-data/
export async function getTenantDashboardData() {
  try {
    const res = await authenticatedInstance
      .post(`/retrieve-tenant-dashboard-data/`, { user_id: authUser.id })
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Get Tenant Dashboard Data Error: ", error);
    return error.response;
  }
}

//Create a function to verify the tenant registration via the approval hash and lease agreement id
export async function verifyTenantRegistrationCredentials(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`/auth/tenant/register/verify/`, data)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Sign Lease Agreement Error: ", error);
    return error.response;
  }
}
