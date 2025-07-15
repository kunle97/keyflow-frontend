import React, { useEffect, useState } from "react";
import { getOwnerTenants } from "../../../../api/owners";
import {
  authUser,
  defaultWhiteInputStyle,
  uiGreen,
  uiGrey1,
  uiGrey,
} from "../../../../constants";
import { Box, CircularProgress, IconButton, Stack } from "@mui/material";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import UIButton from "../../UIComponents/UIButton";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

const LeaseRenewalRequestGeneratorForm = (props) => {
  const [tenants, setTenants] = useState([]);
  const [numberOfItems, setNumberOfItems] = useState(10); // Default value
  const [leaseTerm, setLeaseTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const handleGenerateData = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Collect input values
    const data = {
      count: numberOfItems,
      user_id: authUser.id,
      request_term: leaseTerm,
      // Add other options as needed
    };

    // Use Axios or your preferred HTTP client to call the appropriate endpoints in your DRF backend.
    axios
      .post(
        `${process.env.REACT_APP_API_HOSTNAME}/generate/lease-renewal-requests/`,
        data
      )
      .then((response) => {

        if (response.data.status === 201) {
          alert(`Successfully generated ${response.data.count} lease renewals`);
          setIsLoading(false);
        }
      });
  };
  return (
    <UIDialog
      open={props.open}
      onClose={props.onClose}
      style={{ padding: "10px", width: "500px", background: uiGrey}}
    >
      <AlertModal
        open={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        title={alertModalTitle}
        message={alertModalMessage}
        onClick={() => setAlertModalOpen(false)}
        btnText="Okay"
      />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginBottom: "5px" }}
      >
        <h3>Lease Renewal Request Generator </h3>
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
      <form onSubmit={handleGenerateData}>
        <div className="form-group my-3">
          <label style={{ color: "white", marginBottom: "10px" }}>
            Number of Lease Renewal Requests
          </label>
          <input
            className="form-control card"
            style={{ background: `${uiGrey1} !important`, color: "black" }}
            label="Number of Items"
            type="number"
            value={numberOfItems}
            onChange={(e) => setNumberOfItems(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Lease Term</label>
          <select
            style={defaultWhiteInputStyle}
            value={leaseTerm}
            onChange={(e) => {
              setLeaseTerm(e.target.value);
            }}
          >
            <option value="">Select</option>
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
            <option value="18">18 Months</option>
            <option value="24" selected>
              24 Months
            </option>
            <option value="36">36 Months</option>
            <option value="48">48 Months</option>
          </select>
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
            btnText={`Generate Lease Renewal Requests`}
            type="submit"
          />
        )}
      </form>
    </UIDialog>
  );
};

export default LeaseRenewalRequestGeneratorForm;
