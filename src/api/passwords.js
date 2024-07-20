import { authenticatedInstance, unauthenticatedInstance } from "./api";
import { authUser } from "../constants";
//Create a function to change a user's password using enpoint /users/{user_id}/change-password/
export async function changePassword(data) {
  try {
    const res = await authenticatedInstance
      .post(`/users/${authUser.id}/change-password/`, {
        old_password: data.old_password,
        new_password: data.new_password,
      })
      .then((res) => {

        return res.data;
      });
    return res;
  } catch (error) {

    return error.response;
  }
}

//Create a function to send a password reset email using the endpoint /password-reset/
export async function sendPasswordResetEmail(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`/password-reset/create-reset-token/`, {
        email: data.email,
        token: data.token,
      })
      .then((res) => {

        return res.data;
      });
    return res;
  } catch (error) {

    return error.response;
  }
}
//Create a function to reset a users password using the endpoint /password-reset/validate-token/
export async function resetPassword(data) {
  try {
    const res = await unauthenticatedInstance
      .post(`/password-reset/reset-password/`, {
        email: data.email,
        token: data.token,
        new_password: data.new_password,
      })
      .then((res) => {

        return res.data;
      });
    return res;
  } catch (error) {

    return error.response;
  }
}
//Create a post funciton to validate a password reset token using the endpoint /password-reset/validate-token/
export async function validatePasswordResetToken(token) {
  try {
    const res = await unauthenticatedInstance
      .post(`/password-reset/validate-token/`, {
        token: token,
      })
      .then((res) => {

        return res.data;
      });
    return res;
  } catch (error) {

    return error.response;
  }
}
