import React, { useEffect } from "react";
import { logout } from "../../api/auth";
import { useNavigate } from "react-router-dom";
const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let redirect_link = "/";
    const handleLogout = async () => {
      try {
        const res = await logout();

        // Navigate to the login page or any other page after successful logout
        navigate(redirect_link);
      } catch (error) {
        console.error("Error during logout:", error);
        navigate(redirect_link);
      }
    };
    // Call the asynchronous function
    handleLogout();
  }, [navigate]);

  return <>You have been logged out.</>;
};

export default Logout;
