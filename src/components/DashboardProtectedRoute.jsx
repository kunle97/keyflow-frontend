import React from "react";
import { Navigate } from "react-router";
import { useNavigate } from "react-router";
import { authUser } from "../constants";
import { clearLocalStorage, isTokenExpired } from "../helpers/utils";
const DashboardProtectedRoute = ({ token, children }) => {
  const navigate = useNavigate();
  if (!authUser || !token || isTokenExpired()) {
    clearLocalStorage();
    navigate("/dashboard/landlord/login");
    return <Navigate to="/dashboard/landlord/login" replace />;
  }
  return children;
};
export default DashboardProtectedRoute;
