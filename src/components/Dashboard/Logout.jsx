import { useEffect, useState } from "react";
import { logout } from "../../api/auth";
import { useNavigate } from "react-router-dom";

const Logout = async () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    //call logout api
    let response = await logout();
    console.log("Logout funtion return value on Login.jsx: ", response);

    navigate("/");

  };
  useEffect(() => {
    handleLogout();
  }, []);

  return <>Logout</>;
};

export default Logout;
