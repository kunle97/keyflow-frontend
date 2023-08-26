import React from "react";
import { Navigate } from "react-router";
import { authUser } from "../constants";
const DashboardProtectedRoute = ({ token, children }) => {
  if (!token) {
    return <Navigate to="/dashboard/tenant/login" replace />;
  } 

  return children;
};
export default DashboardProtectedRoute;
