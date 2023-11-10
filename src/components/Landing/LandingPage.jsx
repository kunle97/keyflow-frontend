import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
const LandingPage = () => {
  const { logoutUser } = useAuth();
  return (
    <div>
      <div>
        <Link to="/dashboard/landlord/login">Landlord Login</Link>
      </div>
      <div>
        <Link to="/dashboard/tenant/login">Tenant Login</Link>
      </div>
    </div>
  );
};

export default LandingPage;
