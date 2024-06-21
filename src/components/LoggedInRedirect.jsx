import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { authUser } from "../constants";
import { clearLocalStorage, isTokenExpired, validateToken } from "../helpers/utils";

const LoggedInRedirect = ({ token, children }) => {
  const [redirectPath, setRedirectPath] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      if (await validateToken() && !isTokenExpired() && token) {
        if (authUser.account_type === "owner") {
          setRedirectPath("/dashboard/owner");
        } else if (authUser.account_type === "tenant") {
          setRedirectPath("/dashboard/tenant");
        } else {
          clearLocalStorage();
          setRedirectPath(null);
        }
      } else {
        clearLocalStorage();
        setRedirectPath(null);
      }
      setIsLoading(false);
    };

    checkToken();
  }, [token]);

  if (isLoading) {
    return null; // or a loading spinner, etc.
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default LoggedInRedirect;
