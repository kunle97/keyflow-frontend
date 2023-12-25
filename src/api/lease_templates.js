import { authUser, token } from "../constants";
import { authenticatedInstance, unauthenticatedInstance } from "./api";
import { stringToBoolean } from "../helpers/utils";

///------------LEASE TERM API FUNCTIONS-----------------///
//Create a function that creates a lease term
export async function createLeaseTemplate(data) {
  try {
    const res = await authenticatedInstance
      .post(`/create-lease-template/`, {
        user_id: authUser.user_id,
        rent: parseFloat(data.rent),
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
        grace_period: parseInt(data.grace_period),
        is_active: true,
        additional_charges: data.additional_charges,
        assignment_mode: data.assignment_mode,
        selected_assignments: data.selected_assignments,
        template_id: data.template_id,
      })
      .then((res) => {
        const response = res.data;
        console.log("axios create lease term response ", response);
        return response;
      });
    return {
      message: "Lease term created successfully",
      status: 200,
      res: res,
    };
  } catch (error) {
    console.log("Create Lease Term Error: ", error);
    return { response: error.response, message: "Error", status: 400 };
  }
}

//Create a function that gets all lease terms for a specific user
export async function getLeaseTemplatesByUser() {
  try {
    const res = await authenticatedInstance
      .get(`/lease-templates/?ordering=-created_at`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res);
        return res;
      });
    return res;
  } catch (error) {
    console.log("Get Lease Terms Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
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
    console.log("Error Retrieving LEase Term: ", error);
    return error.response;
  }
}

//Create a function to retrieve one specific lease term by its id
export async function getLeaseTemplateById(data) {
  try {
    const res = await authenticatedInstance
      .post(`/retrieve-lease-template/`, data)
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
        return { data: [] };
      });
    return res.data;
  } catch (error) {
    console.log("Error Retrieving LEase Term: ", error);
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
          Authorization: `Bearer ${token}`,
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
    console.log("Update Lease Term Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}
//Create a function tpo delete a lease term
export async function deleteLeaseTemplate(leaseTemplateId) {
  try {
    const res = await authenticatedInstance
      .post(`/delete-lease-template/`, {
        lease_template_id: leaseTemplateId,
        user_id: authUser.user_id,
      })
      .then((res) => {
        return {
          data: res.data,
          message: "Lease term deleted.",
          status: 200,
        };
      });
    return res;
  } catch (error) {
    console.log("Delete Lease Term Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}
