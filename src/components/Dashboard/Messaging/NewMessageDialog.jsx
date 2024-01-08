import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { getLandlordTenants } from "../../../api/landlords";
import UITabs from "../UIComponents/UITabs";
import { authUser, uiGrey, uiGrey2 } from "../../../constants";
import UIButton from "../UIComponents/UIButton";
import UIDialog from "../UIComponents/Modals/UIDialog";
import AlertModal from "../UIComponents/Modals/AlertModal";
import { sendMessage } from "../../../api/messages";

const NewMessageDialog = (props) => {
  const [tenants, setTenants] = useState(null);
  const [selectedRecipient, setSelectedRecipient] = useState(null); // [id, name
  const [body, setBody] = useState(""); // [id, name
  const [tabPage, setTabPage] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const tabs = [
    { name: "Tenants", label: "Tenants" },
    { name: "Vendors", label: "Vendors" },
    { name: "Owners", label: "Owners" },
    { name: "PropertyManagers", label: "Property Managers" },
  ];
  const handleSend = (e) => {
    e.preventDefault();
    const payload = {
      recipient: selectedRecipient,
      body: body,
      sender: authUser.id,
    };
    //Retrieve tenant
    const tenant = tenants.find(
      (tenant) => tenant.user.id === parseInt(payload.recipient)
    );
    console.log("Message sent to: ",tenant.user.first_name, tenant.user.last_name);
    sendMessage(payload).then((res) => {
      console.log("Tenant", tenant);
      console.log(res);
      if (res.status === 200) {
        setAlertTitle("Message Sent!");
        setAlertMessage(
          `Your message to  ${tenant.user.first_name} ${tenant.user.last_name} was sent successfully.`
        );
        setShowAlert(true);
        props.handleClose();
      }
    });
  };

  useEffect(() => {
    if (!tenants) {
      getLandlordTenants().then((res) => {
        setTenants(res.data);
      });
    }
  }, [tenants]);
  return (
    <div>
      <AlertModal
        open={showAlert}
        onClick={() => setShowAlert(false)}
        title={alertTitle}
        message={alertMessage}
        btnText="Okay"
      />
      <UIDialog
        style={{ padding: "15px" }}
        open={props.open}
        onClose={props.handleClose}
      >
        <h4>Send a new message</h4>
        <form onSubmit={handleSend}>
          {authUser.account_type === "owner" && (
            <UITabs
              tabs={tabs}
              value={tabPage}
              handleChange={(e, newValue) => setTabPage(newValue)}
              ariaLabel="Tabs"
              variant="scrollable"
              scrollButtons="auto"
              style={{ marginBottom: "2rem" }}
            />
          )}

          {authUser.account_type === "owner" && (
            <div className="form-group mb-2">
              {tabPage === 0 && (
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
              )}
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
