import React from "react";
import { Navigate } from "react-router";
import { authUser } from "../constants";
const LoggedInRedirect = ({ token, children }) => {
  if (token && authUser.account_type === "landlord") {
    return <Navigate to="/dashboard/landlord" replace />;
  } else if (token && authUser.account_type === "tenant") {
    return <Navigate to="/dashboard/tenant" replace />;
  }
  return children;
};

export default LoggedInRedirect;
