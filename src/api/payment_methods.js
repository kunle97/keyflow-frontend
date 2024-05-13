import { authenticatedInstance } from "./api";
import { authUser } from "../constants";
//-------------------MANAGE PAYMENT METHOD API FUNCTIONS----------------------///

//Create a function to add a payment method to a users stripe account
export async function addStripePaymentMethod(data) {
  try {
    const res = await authenticatedInstance
      .post(`/stripe/add-payment-method/`, {
        user_id: data.user_id,
        payment_method_id: data.payment_method_id,
      })
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Add Payment Method Error: ", error);
    return error.response;
  }
}

//Create a function to list styripe payment methods using the endpoint /stripe/list-payment-methods/
export async function listStripePaymentMethods(user_id) {
  try {
    const res = await authenticatedInstance
      .post(`/stripe/list-payment-methods/`, {
        user_id: user_id,
      })
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("List Payment Methods Error: ", error);
    return error.response;
  }
}

//Create a function to retrieve all owners stripe payment methods using the endpoint /stripe/list-owner-payment-methods/
export async function listOwnerStripePaymentMethods() {
  try {
    const res = await authenticatedInstance
      .post(`/stripe/list-owner-payment-methods/`, {
        user_id: authUser.id,
      })
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("List Owner Payment Methods Error: ", error);
    return error.response;
  }
}

//Create a function to delete a stripe payment method using the endpoint /stripe/delete-payment-method/
export async function deleteStripePaymentMethod(data) {
  try {
    const res = await authenticatedInstance
      .post(`/stripe/delete-payment-method/`, {
        user_id: authUser.id,
        payment_method_id: data.payment_method_id,
      })
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Delete Payment Method Error: ", error);
    return error.response;
  }
}

//Create A function to set payment method as default using the endpoint /stripe/set-default-payment-method/
export async function setDefaultPaymentMethod(data) {
  try {
    const res = await authenticatedInstance
      .post(`/stripe/set-default-payment-method/`, data)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Set Default Payment Method Error: ", error);
    return error.response;
  }
}

//Create a function to set a default payment method for the owner using the endpoint /stripe/set-owner-default-payment-method/
export async function setOwnerDefaultPaymentMethod(data) {
  try {
    const res = await authenticatedInstance
      .post(`/stripe/set-owner-default-payment-method/`, data)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Set Owner Default Payment Method Error: ", error);
    return error.response;
  }
}

//Create a function tat returns the stripebilling portal session using the endpoint /stripe/create-billing-portal-session/
export async function createBillingPortalSession() {
  try {
    const res = await authenticatedInstance
      .post(`/stripe/create-billing-portal-session/`, {
        user_id: authUser.id,
      })
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Create Billing Portal Session Error: ", error);
    return error.response;
  }
}