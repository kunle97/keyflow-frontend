import React, { useEffect } from "react";
import { logout } from "../../api/auth";
import { redirect, useNavigate } from "react-router-dom";
import { authUser } from "../../constants";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let redirect_link = "/";
    const handleLogout = async () => {
      try {
        const res = await logout();
        console.log("Logout response:", res);
        // Navigate to the login page or any other page after successful logout
        navigate(redirect_link);
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };
    // Call the asynchronous function
    handleLogout();
  }, [navigate]);

  return <>You have been logged out.</>;
};

export default Logout;
