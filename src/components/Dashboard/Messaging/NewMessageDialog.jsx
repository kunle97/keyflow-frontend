import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { getLandlordTenants } from "../../../api/landlords";
import UITabs from "../UIComponents/UITabs";
import { authUser, uiGrey2 } from "../../../constants";
import UIButton from "../UIComponents/UIButton";
import { sendMessage } from "../../../api/messages";
import UIDialog from "../UIComponents/Modals/UIDialog";
import AlertModal from "../UIComponents/Modals/AlertModal";

const NewMessageDialog = (props) => {
  const [tenants, setTenants] = useState(null);
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
    //REtrieve form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log(data);
    const payload = {
      recipient: data.recipient_id,
      body: data.body,
      sender: authUser.user_id,
    };
    //Retrieve tenant
    const tenant = tenants.find(
      (tenant) => tenant.id === parseInt(data.recipient_id)
    );
    sendMessage(payload).then((res) => {
      console.log("Tenant", tenant);
      console.log(res);
      if (res.status === 200) {
        setAlertTitle("Message Sent!");
        setAlertMessage(
          `Your message to  ${tenant.first_name} ${tenant.last_name} was sent successfully.`
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
          {authUser.account_type === "landlord" && (
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

          {authUser.account_type === "landlord" && (
            <div className="form-group mb-2">
              {tabPage === 0 && (
                <select
                  className="form-select"
                  style={{ width: "100%", color: "white", background: uiGrey2 }}
                  required
                  name="recipient_id"
                >
                  <option value="">Select a Tenant</option>
                  {tenants &&
                    tenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.first_name} {tenant.last_name}
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
              style={{
                width: "100%",
                height: "300px",
                border: "none",
                color: "white",
                borderRadius: "10px",
                padding: "10px",
                background: "rgb(54, 70, 88) ",
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
