import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { getLandlordTenants } from "../../../api/landlords";
import UITabs from "../UIComponents/UITabs";
import { authUser, uiGrey2 } from "../../../constants";
import UIButton from "../UIComponents/UIButton";
import { sendMessage } from "../../../api/messages";
import UIDialog from "../UIComponents/Modals/UIDialog";
const NewMessageDialog = (props) => {
  const [tenants, setTenants] = useState(null);
  const [tabPage, setTabPage] = useState(0);
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
    sendMessage(payload).then((res) => {
      console.log(res);
    });
  };

  useEffect(() => {
    if (!tenants) {
      getLandlordTenants().then((res) => {
        console.log(res);
        setTenants(res.data);
        console.log(tenants);
      });
    }
  }, [tenants]);
  return (
    <div>
      <UIDialog
        style={{ padding: "15px" }}
        open={props.open}
        onClose={props.handleClose}
      >
        <h4>Send a new message</h4>
        <form onSubmit={handleSend}>
          <UITabs
            tabs={tabs}
            value={tabPage}
            handleChange={(e, newValue) => setTabPage(newValue)}
            ariaLabel="Tabs"
            variant="scrollable"
            scrollButtons="auto"
            style={{ marginBottom: "2rem" }}
          />

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
