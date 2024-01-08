/**
 * Axios instances for making API calls as well as some helper  API functions
 * **/
import axios from "axios";
import { token } from "../constants";

const API_HOST = process.env.REACT_APP_API_HOSTNAME;

const handleError = (error) => {
  console.error("Request failed:", error);
  return Promise.reject(error);
};

const addErrorHandler = (instance) => {
  instance.interceptors.request.use(
    (config) => config,
    handleError
  );

  instance.interceptors.response.use(
    (response) => response,
    handleError
  );
};

export const authenticatedInstance = axios.create({
  baseURL: API_HOST,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  },
});
addErrorHandler(authenticatedInstance);

export const authenticatedMediaInstance = axios.create({
  baseURL: API_HOST,
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Token ${token}`,
  },
});
addErrorHandler(authenticatedMediaInstance);

export const unauthenticatedInstance = axios.create({
  baseURL: API_HOST,
  headers: {
    "Content-Type": "application/json",
  },
});
addErrorHandler(unauthenticatedInstance);

//Create a function to retrieve all the emails of all landlords using the endpoint /landlords-emails/
export async function getLandlordsEmails() {
  try {
    const res = await unauthenticatedInstance
      .get(`/landlords-emails/`)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.error("Get Landlords Emails Error: ", error);
    return error.response;
  }
}

//Create a function to retrieve all the emails of all landlords using the endpoint /landlords-emails/
export async function getLandlordsUsernames() {
  try {
    const res = await unauthenticatedInstance
      .get(`/landlords-usernames/`)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.error("Get Landlords Emails Error: ", error);
    return error.response;
  }
}

//Create a function to retrieve all the emails of all landlords using the endpoint /landlords-emails/
export async function getTenantsEmails() {
  try {
    const res = await unauthenticatedInstance
      .get(`/tenants-emails/`)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.error("Get Landlords Emails Error: ", error);
    return error.response;
  }
}

//Create a function to retrieve all the emails of all landlords using the endpoint /landlords-emails/
export async function getTenantsUsernames() {
  try {
    const res = await unauthenticatedInstance
      .get(`/tenants-usernames/`)
      .then((res) => {
        console.log(res);
        return res.data;
      });
    return res;
  } catch (error) {
    console.error("Get Landlords Emails Error: ", error);
    return error.response;
  }
}
