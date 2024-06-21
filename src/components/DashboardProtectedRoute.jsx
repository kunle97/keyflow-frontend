import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useNavigate } from "react-router";
import { authUser } from "../constants";
import { clearLocalStorage, isTokenExpired, validateToken } from "../helpers/utils";

const DashboardProtectedRoute = ({ token, children }) => {
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      if (!authUser || !token || isTokenExpired()) {
        clearLocalStorage();
        navigate("/dashboard/owner/login");
      } else {
        const isValid = await validateToken();
        if (!isValid) {
          clearLocalStorage();
          navigate("/dashboard/owner/login");
        } else {
          setIsValidToken(true);
        }
      }
    };

    checkToken();
  }, [navigate, token]);

  if (isValidToken === null) {
    return null; // or a loading spinner, etc.
  }

  return isValidToken ? children : <Navigate to="/dashboard/owner/login" replace />;
};

export default DashboardProtectedRoute;
