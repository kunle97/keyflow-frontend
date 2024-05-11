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

//Create a function to retrieve a specific tenant invoice using the endpoint /tenants/{tenant_id}/retrieve-invoice/
export async function getTenantInvoice(invoiceId) {
  try {
    const res = await authenticatedInstance
      .post(`/tenants/${authUser.tenant_id}/retrieve-invoice/`, {
        invoice_id: invoiceId,
      })
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Get Tenant Invoice Error: ", error);
    return error.response;
  }
}

//Create a function to retrieve all of the tenants invoices using the endpoint api/tenants/{tenant_id}/invoices
export async function getTenantInvoices(tenant_id) {
  if (!tenant_id) {
    tenant_id = authUser.tenant_id;
  }
  let endpoint = `/tenants/${tenant_id}/invoices/`;
  try {
    const res = await authenticatedInstance
      .post(endpoint)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Get Tenant Invoices Error: ", error);
    return error.response;
  }
}

//Create a function to pay a tenant invoice using the endpoint /tenants/{tenant_id}/pay-invoice/
export async function payTenantInvoice(data) {
  try {
    const res = await authenticatedInstance
      .post(`/tenants/${authUser.tenant_id}/pay-invoice/`, data)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Pay Tenant Invoice Error: ", error);
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
export async function verifyTenantInviteRegistrationCredentials(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`/auth/tenant/invite/register/verify/`, data)
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


//A function to get a tenant's preferences using the endpoint api/tenants/{id}/preferences
export async function getTenantPreferences() {
  try {
    const res = await authenticatedInstance
      .get(`/tenants/${authUser.tenant_id}/preferences/`)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Get Tenant Preferences Error: ", error);
    return error.response;
  }
}

//A function to update a tenant's preferences using a POST request the endpoint api/tenants/{id}/update-preferences
export async function updateTenantPreferences(data) {
  try {
    const res = await authenticatedInstance
      .post(`/tenants/${authUser.tenant_id}/update-preferences/`, data)
      .then((res) => {
        console.log(res);
        return res;
      });
    return res;
  } catch (error) {
    console.log("Update Tenant Preferences Error: ", error);
    return error.response;
  }
}