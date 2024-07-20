import React from "react";
import {
  devToolInputStyle,
  validationMessageStyle,
} from "../../../../constants";
import { getOwnerTenants } from "../../../../api/owners";
import { useState } from "react";
import { useEffect } from "react";
import { authUser, uiGreen, uiGrey } from "../../../../constants";
import { useForm } from "react-hook-form";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import { Box, CircularProgress, IconButton, Stack } from "@mui/material";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import UIButton from "../../UIComponents/UIButton";
import AlertModal from "../../UIComponents/Modals/AlertModal";
const MessageGeneratorForm = (props) => {
  const [tenants, setTenants] = useState([]);
  const [tenantId, setTenantId] = useState(null);
  const [numberOfItems, setNumberOfItems] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [messageMode, setMessageMode] = useState(""); //Values: specific, random
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
      user_id: authUser.id,
      message_mode: data.messageMode,
      conversation_mode: data.conversationMode,
      tenant_id: data.tenantId,
    };
    // Use Axios or your preferred HTTP client to call the appropriate endpoints in your DRF backend.
    axios
      .post(`${process.env.REACT_APP_API_HOSTNAME}/generate/messages/`, payload)
      .then((response) => {

        if (response.data.status === 201) {
          setIsLoading(false);
          alert(`Successfully generated ${numberOfItems} messages`);
          setIsLoading(false);
        }
      });
  };
  useEffect(() => {
    getOwnerTenants().then((res) => {
      setTenants(res.data);
    });
  }, []);
  return (
    <div>
      <UIDialog
        open={props.open}
        onClose={props.onClose}
        style={{ padding: "10px", width: "500px", background: uiGrey }}
      >
        {" "}
        <AlertModal
          open={alertModalOpen}
          onClose={() => setAlertModalOpen(false)}
          title={alertModalTitle}
          message={alertModalMessage}
          onClick={() => setAlertModalOpen(false)}
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ marginBottom: "5px" }}
        >
          <h3>Message Generator </h3>
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

          <div className="form-group my-2">
            <label style={{ color: "white", marginBottom: "10px" }}>
              Number of Messages
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
            <label style={{ color: "white" }}>Message Options</label>
            <select
              {...register("messageMode", {
                required: "This is a required field",
                //Validate that the value is not a blank string
                validate: (value) => value !== "",
              })}
              className="form-select"
              style={{ background: "white", color: "black" }}
              onChange={(e) => setMessageMode(e.target.value)}
              defaultValue={messageMode}
            >
              <option value="">Choose One</option>
              <option value="random">Send To Random Tenants </option>
              <option value="specific">Send to a specific tenant</option>
            </select>
            {messageMode === "specific" && (
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
            <label style={{ color: "white" }}>
              Alternate recipient and Sender
            </label>
            <select
              {...register("conversationMode", {
                required: "This is a required field",
                //Validate that the value is not a blank string
                validate: (value) => value !== "",
              })}
              className="form-select"
              style={{ background: "white", color: "black" }}
              onChange={(e) => setConversationMode(e.target.value)}
              defaultValue={conversationMode}
            >
              <option value="">Choose One</option>
              <option value={true}>Yes </option>
              <option value={false}>No</option>
            </select>
            <span style={validationMessageStyle}>
              {errors.conversationMode && errors.conversationMode.message}
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

export default MessageGeneratorForm;
