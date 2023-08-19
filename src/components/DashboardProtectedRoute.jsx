import React from 'react'
import { Navigate } from 'react-router';
const DashboardProtectedRoute = ({ token, children }) => {
    if (!token) {
      return <Navigate to="/dashboard/login" replace />;
    }
  
    return children;
  };
export default DashboardProtectedRoute