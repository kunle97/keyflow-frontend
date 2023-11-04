import React, { useState } from "react";
import UIButton from "../../UIComponents/UIButton";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import axios from "axios";
import { authUser, uiGreen, uiGrey1 } from "../../../../constants";
import CloseIcon from "@mui/icons-material/Close";
import { Box, CircularProgress, IconButton, Stack } from "@mui/material";
import { set } from "react-hook-form";
const RentalApplicationGeneratorForm = (props) => {
  const [numberOfItems, setNumberOfItems] = useState(10); // Default value
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateData = () => {
    setIsLoading(true);
    // Collect input values
    const data = {
      count: numberOfItems,
      user_id: authUser.id,
      // Add other options as needed
    };

    // Use Axios or your preferred HTTP client to call the appropriate endpoints in your DRF backend.
    axios
      .post(`${process.env.REACT_APP_API_HOSTNAME}/generate/rental-applications/`, data)
      .then((response) => {
        console.log("Response ", response);
        if (response.data.status === 201) {
          alert(`Successfully generated ${numberOfItems} rental-applications`);
          setIsLoading(false);
        }
      });
  };
  return (
    <UIDialog
      open={props.open}
      onClose={props.onClose}
      style={{ padding: "10px", width: "500px" }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginBottom: "20px" }}
      >
        <h3>Property Generator </h3>
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
      {isLoading ? (
        <Box sx={{ display: "flex" }}>
          <Box m={"55px auto"}>
            <CircularProgress sx={{ color: uiGreen }} />
          </Box>
        </Box>
      ) : (
        <form>
          <div className="form-group my-3">
            <label style={{ color: "white", marginBottom: "10px" }}>
              Number of Properties
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
            btnText={`Generate properties`}
          />
        </form>
      )}
    </UIDialog>
  );
};

export default RentalApplicationGeneratorForm;
