import React from "react";
import { Navigate } from "react-router";
import { useNavigate } from "react-router";
import { authUser } from "../constants";
import { clearLocalStorage, isTokenExpired, validateToken } from "../helpers/utils";
const DashboardProtectedRoute = ({ token, children }) => {
  const navigate = useNavigate();
  if (!authUser || !token || isTokenExpired() || !validateToken()) {
    clearLocalStorage();
    navigate("/dashboard/owner/login");
    return <Navigate to="/dashboard/owner/login" replace />;
  }
  return children;
};
export default DashboardProtectedRoute;
