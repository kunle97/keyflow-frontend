/**
 * API functions for the frontend
 * **/
import axios from "axios";
import { token } from "../constants";

const API_HOST = process.env.REACT_APP_API_HOSTNAME;

export const authenticatedInstance = axios.create({
  baseURL: API_HOST,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
export const unauthenticatedInstance = axios.create({
  baseURL: API_HOST,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

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
