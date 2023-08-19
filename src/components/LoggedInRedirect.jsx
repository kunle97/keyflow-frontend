import React from "react";
import { Navigate } from 'react-router';

const LoggedInRedirect = ({ token, children }) => {
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default LoggedInRedirect;
