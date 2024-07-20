import { authenticatedInstance, unauthenticatedInstance } from "./api";
import { authUser } from "../constants";

//--------------MANAGE SUBSCRIPTION  API FUNCTIONS-----------------///
//Create a function to retrieve a stripe subscripion
export async function getStripeSubscription(subscription_id) {
  try {
    const res = await authenticatedInstance
      .post(`/stripe/retrieve-subscription/`, {
        subscription_id: subscription_id,
        user_id: authUser.id,
      })

      .then((res) => {

        return res.data;
      });
    return res;
  } catch (error) {

    return error.response;
  }
}
//Create a function to turn off auto pay on a subscription from endpoint /manage-lease/turn-off-auto-pay/
export async function turnOffAutoPay() {
  try {
    const res = await authenticatedInstance
      .post(`/tenants/turn-off-autopay/`, {
        user_id: authUser.id,
      })
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
  }
}
//Create a function to turn on auto pay on a subscription from endpoint /manage-lease/turn-on-auto-pay/
export async function turnOnAutoPay() {
  try {
    const res = await authenticatedInstance
      .post(`/tenants/turn-on-autopay/`, { user_id: authUser.id })
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to get the next payment date for a subscription from endpoint /manage-lease/next-payment-date/
export async function getNextPaymentDate(user_id) {
  try {
    const res = await authenticatedInstance
      .post(`/tenants/next-payment-date/`, { user_id: user_id })
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to get all payment date for a subscription from endpoint /manage-lease/payment-dates/
export async function getPaymentDates(user_id) {
  try {
    const res = await authenticatedInstance
      .post(`/tenants/payment-dates/`, { user_id: user_id })
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to retrieve subscription plan prices for owner registration
export async function getSubscriptionPlanPrices() {
  try {
    const res = await unauthenticatedInstance
      .post(`/retrieve-owner-subscription-prices/`)
      .then((res) => {

        return res.data;
      });
    return res;
  } catch (error) {
    console.error("Get Subscription Plan Prices Error: ", error);
    return error.response;
  }
}
//Create a function to change a user's subscription plan using the endpoint /users/{user_id}/change-subscription-plan/
export async function changeSubscriptionPlan(data) {
  try {
    const res = await authenticatedInstance
      .post(`/owners/${authUser.owner_id}/change-subscription-plan/`, data)
      .then((res) => {

        return res.data;
      });
    return res;
  } catch (error) {
    console.error("Change Subscription Plan Error: ", error);
    return error.response;
  }
}
