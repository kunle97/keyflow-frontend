import { unauthenticatedInstance } from "./api";
//Create a function to retrieve jwt tokens by logging user in with username and password using the endpoint /token/
export async function getTokens(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`/token/`, data)
      .then((res) => {
        const response = res.data;
        console.log("axios get tokens response ", response);
        return response;
      });
    return res;
  } catch (error) {
    console.log("Get Tokens Error: ", error);
    return { error: error, status: error.response.status  };
  }
}

//Create a function to refresh jwt tokens using the endpoint /token/refresh/
export async function refreshTokens(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`/token/refresh/`, data)
      .then((res) => {
        const response = res.data;
        // console.log("axios refresh tokens response ", response);
        return response;
      });
    return res;
  } catch (error) {
    console.log("Refresh Tokens Error: ", error);
    return error;
  }
}