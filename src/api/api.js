import axios from "axios";
import { token } from "../constants";
import { clearLocalStorage, isTokenExpired } from "../helpers/utils";

const API_HOST = process.env.REACT_APP_API_HOSTNAME;

const handleError = (error) => {
  console.error("Request failed:", error);
  return Promise.reject(error);
};

const addErrorHandler = (instance) => {
  instance.interceptors.request.use((config) => config, handleError);

  instance.interceptors.response.use((response) => response, handleError);
};

// Create authenticated instances with different configurations
export const authenticatedInstance = axios.create({
  baseURL: API_HOST,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  },
});

export const authenticatedMediaInstance = axios.create({
  baseURL: API_HOST,
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Token ${token}`,
  },
});

// Add a request interceptor to check for token expiration in authenticatedInstance
authenticatedInstance.interceptors.request.use(
  (config) => {
    const accessTokenExpired = isTokenExpired();
    if (accessTokenExpired) {
      clearLocalStorage(); // Clear local storage and redirect to login if token is expired
      window.location.href = "/"; // Redirect to login page
      return Promise.reject(new Error("Token expired or invalid")); // Reject the request
    } else {
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// Add the same interceptor to authenticatedMediaInstance
authenticatedMediaInstance.interceptors.request.use(
  (config) => {
    const accessTokenExpired = isTokenExpired();
    if (accessTokenExpired) {
      clearLocalStorage(); // Clear local storage and redirect to login if token is expired
      window.location.href = "/"; // Redirect to login page
      return Promise.reject(new Error("Token expired or invalid")); // Reject the request
    } else {
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// Apply the error handler to the authenticated instances
addErrorHandler(authenticatedInstance);
addErrorHandler(authenticatedMediaInstance);

export const unauthenticatedInstance = axios.create({
  baseURL: API_HOST,
  headers: {
    "Content-Type": "application/json",
  },
});
addErrorHandler(unauthenticatedInstance);

// Create functions to retrieve credentials (emails or usernames)
const getCredentials = async (endpoint) => {
  try {
    const res = await unauthenticatedInstance.get(endpoint);
    console.log(res);
    return res.data;
  } catch (error) {
    console.error("API Error:", error);
    return error.response;
  }
};

export const getLandlordsEmails = () => getCredentials("/landlords-emails/");
export const getLandlordsUsernames = () => getCredentials("/landlords-usernames/");
export const getTenantsEmails = () => getCredentials("/tenants-emails/");
export const getTenantsUsernames = () => getCredentials("/tenants-usernames/");
export const getStaffEmails = () => getCredentials("/staff-emails/");
export const getStaffUsernames = () => getCredentials("/staff-usernames/");
