import React from "react";
import { Navigate } from "react-router";
import { authUser } from "../constants";
import { clearLocalStorage, isTokenExpired } from "../helpers/utils";
const LoggedInRedirect = ({ token, children }) => {
  if (!isTokenExpired() && token && authUser.account_type === "owner") {
    return <Navigate to="/dashboard/landlord" replace />;
  } else if (!isTokenExpired() && token && authUser.account_type === "tenant") {
    return <Navigate to="/dashboard/tenant" replace />;
  }else{
    clearLocalStorage();
    return children;
  }
};

export default LoggedInRedirect;
