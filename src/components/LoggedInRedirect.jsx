import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
const LoggedInRedirect = ({ token, children }) => {
  const { authUser } = useAuth();
  if (token && authUser.account_type === "owner") {
    return <Navigate to="/dashboard/landlord" replace />;
  } else if (token && authUser.account_type === "tenant") {
    return <Navigate to="/dashboard/tenant" replace />;
  }
  return children;
};

export default LoggedInRedirect;
