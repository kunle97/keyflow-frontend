import React, { useEffect, useState } from "react";
import { getLandlordTenants } from "../../../../api/landlords";
import { authUser, uiGreen, uiGrey1 } from "../../../../constants";
import { Box, CircularProgress, IconButton, Stack } from "@mui/material";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import UIButton from "../../UIComponents/UIButton";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

const LeaseCancellationRequestGeneratorForm = (props) => {
  const [numberOfItems, setNumberOfItems] = useState(10); // Default value
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
      user_id: authUser.user_id,
      // Add other options as needed
    };

    // Use Axios or your preferred HTTP client to call the appropriate endpoints in your DRF backend.
    axios
      .post(
        `${process.env.REACT_APP_API_HOSTNAME}/generate/lease-cancellation-requests/`,
        data
      )
      .then((response) => {
        console.log("Response ", response);
        if (response.data.status === 201) {
          alert(`Successfully generated ${response.data.count} lease cancellations`);
          setIsLoading(false);
        }
      });
  };
  return (
    <UIDialog
      open={props.open}
      onClose={props.onClose}
      style={{ padding: "10px", width: "500px", background: "#f4f7f8" }}
    >
      <AlertModal
        open={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        title={alertModalTitle}
        message={alertModalMessage}
      />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginBottom: "5px" }}
      >
        <h3>Lease Cancellation Request Generator </h3>
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
            Number of Lease Cancellation Requests
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
            btnText={`Generate Lease Cancellation Requests`}
            type="submit"
          />
        )}
      </form>
    </UIDialog>
  );
};

export default LeaseCancellationRequestGeneratorForm;
