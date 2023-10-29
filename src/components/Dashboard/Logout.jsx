import { useEffect, useState } from "react";
import { logout } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { authUser } from "../../constants";

const Logout = async () => {
  const [accountType, setAccountType] = useState(authUser.account_type);
  const navigate = useNavigate();
  const handleLogout = async () => {
    //call logout api
    let response = await logout();
    console.log("Logout funtion return value on Login.jsx: ", response);

    navigate("dashboard/tenant/login");
    if (response.status == 200) {
      //navigate to login page
      if (accountType == "tenant") {
      } else {
        navigate("dashboard/landlord/login");
      }
    }
  };
  useEffect(() => {
    handleLogout();
  }, []);

  return <>Logout</>;
};

export default Logout;
