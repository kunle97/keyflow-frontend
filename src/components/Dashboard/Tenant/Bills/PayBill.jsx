import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getBillingEntry } from "../../../../api/billing-entries";
import UIProgressPrompt from "../../UIComponents/UIProgressPrompt";
import AlertModal from "../../UIComponents/Modals/AlertModal";
const PayBill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paymentLink, setPaymentLink] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getBillingEntry(id);

        setPaymentLink(res.data.payment_link);
        // Open the payment link in a new window
        const newWindow = window.open(res.data.payment_link, "_blank");

        // If the new window was blocked by the browser, inform the user
        if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
          alert("Popup window blocked. Please allow popups and try again.");
        }

        // Redirect to the billing entries page
        navigate("/dashboard/tenant/bills");
      } catch (error) {
        console.error("Error fetching billing entry:", error);
        setAlertTitle("Error");
        setAlertMessage("An error occurred while fetching the billing entry");
        setShowAlert(true);
      }
    };

    fetchData();
  }, [id, navigate, paymentLink]);

  return (
    <div>
      <AlertModal
        title={alertTitle}
        message={alertMessage}
        open={showAlert}
        onClick={() => {
          setShowAlert(false);
        }}
      />
      <UIProgressPrompt
        title="Redirecting to payment page"
        message="Please wait while we redirect you to the payment page"
      />
    </div>
  );
};

export default PayBill;
