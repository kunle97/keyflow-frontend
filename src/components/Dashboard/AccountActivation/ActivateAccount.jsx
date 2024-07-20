import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { activateAccount } from "../../../api/auth";
import AlertModal from "../UIComponents/Modals/AlertModal";

const ActivateAccount = () => {
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();
  useEffect(() => {
    //Activate users account
    activateAccount(token).then((res) => {
      if (res.status === 200) {

        //Log user out if logged in
        if (localStorage.getItem("accessToken")) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("authUser");
            localStorage.removeItem("stripe_onoboarding_link");
        }
        //navigate to login page
        if (res.account_type === "owner") {
          navigate("/dashboard/owner/login");
        } else if (res.account_type === "tenant") {
          navigate("/dashboard/tenant/login");
        }
      } else if (res.response.status !== 200) {
        //Display error

        setShowError(true);
      }
    }).catch((error) => {
      console.error("Error:", error);
      setShowError(true);
    });
  }, []);
  return (
    <div>
      <AlertModal
        open={showError}
        onClose={null}
        title="Error"
        message="An Error Occured. Please try again later. If this issue persists, please contact customer support."
        btnText="OK"
        to="/dashboard/owner/login"
      />
    </div>
  );
};

export default ActivateAccount;
