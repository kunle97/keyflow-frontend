import { authenticatedInstance, unauthenticatedInstance } from "./api";
import { authUser } from "../constants";

//--------------MANAGE SUBSCRIPTION  API FUNCTIONS-----------------///
//Create a function to retrieve a stripe subscripion
export async function getStripeSubscription(subscription_id) {
  try {
    const res = await authenticatedInstance
      .post(`/stripe/retrieve-subscription/`, {
        subscription_id: subscription_id,
        user_id: authUser.user_id,
      })

      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.log("Get Stripe Subscription Error: ", error);
    return error.response;
  }
}
//Create a function to turn off auto pay on a subscription from endpoint /manage-lease/turn-off-auto-pay/
export async function turnOffAutoPay() {
  try {
    const res = await authenticatedInstance
      .post(`/manage-lease/turn-off-autopay/`, {
        user_id: authUser.user_id,
      })
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Turn Off Auto Pay Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}
//Create a function to turn on auto pay on a subscription from endpoint /manage-lease/turn-on-auto-pay/
export async function turnOnAutoPay() {
  try {
    const res = await authenticatedInstance
      .post(`/manage-lease/turn-on-autopay/`, { user_id: authUser.user_id })
      .then((res) => {
        return res;
      });
    return res;
  } catch (error) {
    console.log("Turn On Auto Pay Error: ", error);
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
    console.log("Get Next Payment Date Error: ", error);
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
    console.log("Get Payment Dates Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to retrieve subscription plan prices for landlord registration
export async function getSubscriptionPlanPrices() {
  try {
    const res = await unauthenticatedInstance
      .post(`/retrieve-landlord-subscription-prices/`)
      .then((res) => {
        console.log(res);
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
      .post(`/users/${authUser.user_id}/change-subscription-plan/`, data)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.error("Change Subscription Plan Error: ", error);
    return error.response;
  }
}
