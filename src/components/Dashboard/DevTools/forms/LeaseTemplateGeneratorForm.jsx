import React, { useState } from "react";
import UIButton from "../../UIComponents/UIButton";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import axios from "axios";
import { authUser, token, uiGrey1, uiGrey } from "../../../../constants";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Stack } from "@mui/material";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
const LeaseTemplateGeneratorForm = (props) => {
  const [numberOfItems, setNumberOfItems] = useState(10); // Default value
  const [isLoading, setIsLoading] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const handleGenerateData = (dataType) => {
    setIsLoading(true);
    // Collect input values
    const data = {
      count: numberOfItems,
      user_id: authUser.user_id,
    };

    // Use Axios or your preferred HTTP client to call the appropriate endpoints in your DRF backend.
    axios
      .post(
        `${process.env.REACT_APP_API_HOSTNAME}/generate/lease-templates/`,
        data
      )
      .then((response) => {
        console.log("Response ", response);
        if (response.data.status === 201) {
          setIsLoading(false);
          setAlertModalMessage(
            `Successfully generated ${numberOfItems} ${dataType}`
          );
          setAlertModalTitle("Success");
          setAlertModalOpen(true);
        }
      });
  };
  return (
    <UIDialog
      open={props.open}
      onClose={props.onClose}
      style={{ padding: "10px", width: "500px", background: uiGrey}}
    >
      <ProgressModal open={isLoading} title="Generating lease templates..." />
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
        sx={{ marginBottom: "20px" }}
      >
        <h3>Lease Template Generator </h3>
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
      <form>
        <div className="form-group my-3">
          <label style={{ color: "white", marginBottom: "10px" }}>
            Number of Lease Templates
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
        <UIButton
          variant="contained"
          onClick={() => {
            handleGenerateData(props.dataType); // Pass the data type
            props.onClose();
          }}
          style={{ width: "100%" }}
          btnText={`Generate Lease Templates`}
        />
      </form>
    </UIDialog>
  );
};

export default LeaseTemplateGeneratorForm;
