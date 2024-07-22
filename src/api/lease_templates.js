import { authUser, token } from "../constants";
import { authenticatedInstance, unauthenticatedInstance } from "./api";
import { stringToBoolean } from "../helpers/utils";

///------------LEASE TERM API FUNCTIONS-----------------///
//Create a function that creates a lease term
export async function createLeaseTemplate(data) {
  try {
    const res = await authenticatedInstance
      .post(`/lease-templates/`, {
        user_id: authUser.id,
        rent: parseFloat(data.rent),
        rent_frequency: data.rent_frequency,
        term: data.term,
        description: "_",
        security_deposit: data.security_deposit,
        late_fee: data.late_fee,
        gas_included: stringToBoolean(data.gas_included),
        water_included: stringToBoolean(data.water_included),
        electric_included: stringToBoolean(data.electric_included),
        repairs_included: stringToBoolean(data.repairs_included),
        lease_cancellation_notice_period: data.lease_cancellation_notice_period,
        lease_cancellation_fee: parseFloat(data.lease_cancellation_fee),
        lease_renewal_fee: parseFloat(data.lease_renewal_fee),
        lease_renewal_notice_period: data.lease_renewal_notice_period,
        grace_period: parseInt(data.grace_period),
        is_active: true,
        additional_charges: data.additional_charges,
        assignment_mode: data.assignment_mode,
        selected_assignments: data.selected_assignments,
        template_id: data.template_id,
      })
      .then((res) => {
        const response = res.data;

        return response;
      });
    return {
      message: "Lease term created successfully",
      status: 200,
      res: res,
    };
  } catch (error) {

    return { response: error.response, message: error.response.data.message, status: 400 };
  }
}

//Create a function that gets all lease terms for a specific user
export async function getLeaseTemplatesByUser() {
  try {
    const res = await authenticatedInstance
      .get(`/lease-templates/?ordering=-created_at`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {

        return res;
      });
    return res;
  } catch (error) {

    return error;
  }
}

//Create a function to retrieve one specific lease term by its id
export async function getLeaseTemplateByIdAndApprovalHash(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`/retrieve-lease-template-and-approval/`, data)
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

//Create a function to retrieve one specific lease template by its id
export async function getLeaseTemplateById(leaseTemplateId) {
  try {
    const res = await authenticatedInstance
      .get(`/lease-templates/${leaseTemplateId}/`)
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

//Create a function that updates a lease term
export async function updateLeaseTemplate(leaseTemplateId, data) {
  try {
    const res = await authenticatedInstance
      .patch(`/lease-templates/${leaseTemplateId}/`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
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

    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function that assigs a lease template to a select property, unit or portfolio using the end point /lease-templates/{id}/assign-lease-template/. The function should have the parameter: data:
export async function assignLeaseTemplate(data) {
  try {
    const res = await authenticatedInstance
      .post(`/lease-templates/assign-lease-template/`, {
        user_id: authUser.id,
        assignment_mode: data.assignment_mode,
        selected_assignments: data.selected_assignments,
        lease_template_id: data.lease_template_id,
      })
      .then((res) => {

        return res.data;
      });
    return res;
  } catch (error) {

    return error.response;
  }
}

//Create a function that removes a lease template from a property, unit or portfolio using the endpoint /lease-templates/remove-lease-template-from-assigned-resources/. 
export async function removeLeaseTemplateFromAssignedResources(data) {
  try {
    const res = await authenticatedInstance
      .post(`/lease-templates/remove-lease-template-from-assigned-resources/`, data)
      .then((res) => {

        return res.data;
      });
    return res;
  } catch (error) {

    return error.response;
  }
}

//Create a function tpo delete a lease term using the delete method to call the endpoint /lease-templates/. THere should be the following params: lease_template_id and user_id
export async function deleteLeaseTemplate(leaseTemplateId) {
  try {
    const res = await authenticatedInstance
      .delete(`/lease-templates/${leaseTemplateId}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {

    return error.response;
  }
}