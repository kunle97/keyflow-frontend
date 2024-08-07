import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { getOwnerTenants } from "../../../api/owners";
import UITabs from "../UIComponents/UITabs";
import { authUser, uiGrey, uiGrey2 } from "../../../constants";
import UIButton from "../UIComponents/UIButton";
import UIDialog from "../UIComponents/Modals/UIDialog";
import AlertModal from "../UIComponents/Modals/AlertModal";
import { sendMessage } from "../../../api/messages";
import { tenantData } from "../../../constants";
import ProgressModal from "../UIComponents/Modals/ProgressModal";
const NewMessageDialog = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [alertRedirectURL, setAlertRedirectURL] = useState("");
  const [tenants, setTenants] = useState(null);
  const [selectedRecipient, setSelectedRecipient] = useState(null); // [id, name
  const [body, setBody] = useState(""); // [id, name
  const [tabPage, setTabPage] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const handleSend = (e) => {
    setIsLoading(true);
    e.preventDefault();
    const payload = {
      recipient: selectedRecipient,
      body: body,
      sender: authUser.id,
    };
    //Retrieve tenant
    sendMessage(payload)
      .then((res) => {
        if (res.status === 200) {
          setAlertTitle("Message Sent!");
          if (authUser.account_type === "owner") {
            const tenant = tenants.find(
              (tenant) => tenant.user.id === parseInt(payload.recipient)
            );
            setAlertMessage(
              `Your message to  ${tenant.user.first_name} ${tenant.user.last_name} was sent successfully.`
            );
          }
          if (authUser.account_type === "tenant") {
            setAlertMessage(
              `Your message to  your landlord was sent successfully.`
            );
          }
          setShowAlert(true);
          props.handleClose();
        }
      })
      .catch((error) => {
        setAlertTitle("Error!");
        setAlertMessage(
          "There was an error sending your message. Please try again."
        );
        setShowAlert(true);
      }).finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (authUser.account_type == "owner" && !tenants && props.open) {
      getOwnerTenants()
        .then((res) => {
          setTenants(res.data);
        })
        .catch((error) => {
          setAlertTitle("Error!");
          setAlertMessage(
            "There was an error fetching tenants. Please try again."
          );
          setShowAlert(true);
          console.error("Error fetching tenants:", error);
        });
    }
    if (authUser.account_type === "tenant") {
      setTenants([]);
      setSelectedRecipient(authUser.owner_id);
    }
  }, [tenants,props.open]);
  return (
    <div>
      <ProgressModal open={isLoading} />
      <AlertModal
        open={showAlert}
        onClick={() => setShowAlert(false)}
        title={alertTitle}
        message={alertMessage}
        btnText="Okay"
      />
      <UIDialog
        style={{ padding: "15px", width: "500px" }}
        open={props.open}
        onClose={props.handleClose}
        title={
          authUser.account_type === "tenant"
            ? "Message to Landlord"
            : "Create New Message"
        }
      >
        <form onSubmit={handleSend}>
          {authUser.account_type === "owner" && (
            <div className="form-group mb-2" style={{ width: "500px" }}>
              <select
                className="form-select"
                style={{
                  width: "100%",
                  color: "black",
                  background: uiGrey,
                  outline: "none",
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
                }}
                onChange={(e) => setSelectedRecipient(e.target.value)}
                required
                name="recipient_id"
              >
                <option value="">Select a Tenant</option>
                {tenants &&
                  tenants.map((tenant) => (
                    <option key={tenant.user.id} value={tenant.user.id}>
                      {tenant.user.first_name} {tenant.user.last_name}
                    </option>
                  ))}
              </select>
            </div>
          )}
          <div className="form-group mb-2">
            <textarea
              placeholder="Message"
              name="body"
              className=""
              onChange={(e) => setBody(e.target.value)}
              style={{
                width: "100%",
                height: "300px",
                border: "none",
                color: "black",
                borderRadius: "10px",
                padding: "10px",
                background: uiGrey,
                outline: "none",
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
              }}
            />
          </div>
          <UIButton type="submit" btnText="Send" style={{ width: "100%" }} />
        </form>
      </UIDialog>
    </div>
  );
};

export default NewMessageDialog;
