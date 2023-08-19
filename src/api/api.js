import axios from "axios";
import { useNavigate } from "react-router";
export async function login(email, password) {
  try {
    const res = await axios
      .post("http://127.0.0.1:8000/api/auth/login/", { email, password })
      .then((res) => {
        const response = res.data;
        console.log("axios login response ", response);
        return response;
      });

    if (res.statusCode === 200 && email !== "" && password !== "") {
      localStorage.setItem("accessToken", res.token);

      //Check for response code before storing data in context
      const userData = {
        id: res.user.id,
        first_name: res.user.first_name,
        last_name: res.user.last_name,
        username: res.user.username,
        email: res.user.email,
        account_type: res.user.account_type,
        stripe_account_id: res.user.stripe_account_id,
        isAuthenticated: res.isAuthenticated,
        accessToken: res.token,
      };

      //   console.log(authUser);
      //   console.log(isLoggedIn);
      //Redirect to dashboard
      // navigate("/dashboard");
      console.log(userData);
      console.log("res. ", res);
      return { userData: userData, message: res.message, token: res.token };
    } else {
      return res.message;
    }
  } catch (error) {
    console.log("Login Error: ",error);
    return error.response.data;
  }
}

// create an api function to logout
export async function logout(token) {
  console.log(token);
  let message = "";
  let status = 0;
  try {
    const res = await axios
      .post(
        "http://127.0.0.1:8000/api/auth/logout/",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        const response = res.data;
        console.log("axios logout response ", response);
        if (response.status === 200) {
          //redirect to login page on Login.jsx
          localStorage.removeItem("accessToken");
          message = response.message;
          status = response.status;
        } else {
          return {message: "Logout failed"};
        }
      });

      return {message: message, status: status};
  } catch (error) {
    return error;
  }
}
