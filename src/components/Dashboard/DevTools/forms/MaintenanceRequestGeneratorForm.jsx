import React, { useState, useEffect } from "react";
import {
  devToolInputStyle,
  validationMessageStyle,
} from "../../../../constants";
import { getLandlordTenants } from "../../../../api/landlords";
import { authUser, uiGreen } from "../../../../constants";
import { useForm } from "react-hook-form";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import { Box, CircularProgress, IconButton, Stack } from "@mui/material";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import UIButton from "../../UIComponents/UIButton";
import AlertModal from "../../UIComponents/Modals/AlertModal";
const MaintenanceRequestGeneratorForm = (props) => {
  const [tenants, setTenants] = useState([]);
  const [tenantId, setTenantId] = useState(null);
  const [numberOfItems, setNumberOfItems] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [tenantMode, setTenantMode] = useState(""); //Values: specific, random
  const [conversationMode, setConversationMode] = useState(true); //THis is a value to track weather or noit to alternate the sender and recipient of the messages
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);
    // Collect input values

    let payload = {
      count: data.numberOfItems,
      user_id: authUser.user_id,
      tenant_mode: data.tenantMode,
      conversation_mode: data.conversationMode,
      type: data.type,
      tenant_id: data.tenantId,
    };
    // Use Axios or your preferred HTTP client to call the appropriate endpoints in your DRF backend.
    axios
      .post(
        `${process.env.REACT_APP_API_HOSTNAME}/generate/maintenance-requests/`,
        payload
      )
      .then((response) => {
        console.log("Response ", response);
        if (response.data.status === 201) {
          setIsLoading(false);
          alert(`Successfully generated ${numberOfItems} maintenance requrests`);
          setIsLoading(false);
        }
      });
  };
  useEffect(() => {
    getLandlordTenants().then((res) => {
      setTenants(res.data);
    });
  }, []);
  return (
    <div>
      <AlertModal
        open={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        title={alertModalTitle}
        message={alertModalMessage}
      />
      <UIDialog
        open={props.open}
        onClose={props.onClose}
        style={{ padding: "10px", width: "500px" }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ marginBottom: "5px" }}
        >
          <h3>Maintenance Requests Generator </h3>
          <IconButton
            sx={{ color: "white", float: "right" }}
            edge="start"
            color="inherit"
            onClick={props.onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          {console.log("Form errors ", errors)}
          <div className="form-group my-2">
            <label style={{ color: "white", marginBottom: "10px" }}>
              Number of Maintenance Requests
            </label>
            <input
              {...register("numberOfItems", {
                required: "This is a required field",
                min: 1,
                max: 1000,
              })}
              className=""
              style={devToolInputStyle}
              label="Number of Items"
              type="number"
              defaultValue={numberOfItems}
              onChange={(e) => setNumberOfItems(e.target.value)}
            />
            <span style={validationMessageStyle}>
              {errors.numberOfItems && errors.numberOfItems.message}
            </span>
          </div>
          <div className="form-group my-2">
            <label style={{ color: "white" }}>Tenant Options</label>
            <select
              {...register("tenantMode", {
                required: "This is a required field",
                //Validate that the value is not a blank string
                validate: (value) => value !== "",
              })}
              className="form-select"
              style={{ background: "white", color: "black" }}
              onChange={(e) => setTenantMode(e.target.value)}
              defaultValue={tenantMode}
            >
              <option value="">Choose One</option>
              <option value="random">
                Create maintenance request for random Tenant(s){" "}
              </option>
              <option value="specific">
                Create maintenance request for a specific tenant
              </option>
            </select>
            {tenantMode === "specific" && (
              <select
                {...register("tenantId", {
                  required: "This is a required field",
                  //Validate that the value is not a blank string
                  validate: (value) => value !== "",
                })}
                className="form-select mt-1"
                style={{ background: "white", color: "black" }}
                onChange={(e) => setTenantId(e.target.value)}
                defaultValue={tenantId}
              >
                <option value="">Choose One</option>
                {tenants.map((tenant) => {
                  return (
                    <option value={tenant.id}>
                      {tenant.first_name} {tenant.last_name}
                    </option>
                  );
                })}
              </select>
            )}
            <span style={validationMessageStyle}>
              {errors.messageMode && errors.messageMode.message}
            </span>
          </div>
          <div className="form-group my-2">
            <label style={{ color: "white" }}>Type Options</label>
            <select
              {...register("type", {
                required: "This is a required field",
                //Validate that the value is not a blank string
                validate: (value) => value !== "",
              })}
              className="form-select"
              style={{ background: "white", color: "black" }}
            >
              <option value="">Choose One</option>
              <option value="random">Random</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="appliance">Appliance</option>
              <option value="structural">Structural</option>
              <option value="hvac">HVAC</option>
              <option value="other">Other</option>
            </select>
            <span style={validationMessageStyle}>
                {errors.type && errors.type.message}
                </span>
          </div>

          {/* Add other input fields for options, if needed */}
          {isLoading ? (
            <Box sx={{ display: "flex" }}>
              <Box m={"55px auto"}>
                <CircularProgress sx={{ color: uiGreen }} />
              </Box>
            </Box>
          ) : (
            <UIButton
              variant="contained"
              style={{ width: "100%", marginTop: "10px" }}
              btnText={`Generate Tenants`}
              type="submit"
            />
          )}
        </form>
      </UIDialog>
    </div>
  );
};

export default MaintenanceRequestGeneratorForm;
