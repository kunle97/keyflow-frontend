import { unauthenticatedInstance } from "./api";

//Create a function requestDemo that submits the subscribe form on landing page using tthe endpoint /mailchimp/request-demo-subscribe/
export async function requestDemo(data){
  try {
    const res = unauthenticatedInstance
      .post(`/mailchimp/request-demo-subscribe/`, data)
      .then((res) => {

        return res.data;
      });
    return res;
  } catch (error) {
    console.error("Request Demo Error: ", error);
    return error.response;
  }
};
