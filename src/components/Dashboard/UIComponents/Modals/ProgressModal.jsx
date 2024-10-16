import React from "react";
import { Modal, Box, Typography, CircularProgress } from "@mui/material";
import { uiGreen, uiGrey1 } from "../../../../constants";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  color: uiGrey1,
  bgcolor: "white",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};
const ProgressModal = (props) => {
  return (
    <Modal
      data-testId={props.dataTestId ? props.dataTestId : "progress-modal"}
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <img
          className="topbar-brand"
          src="/assets/img/key-flow-logo-black-transparent.png"
          style={{ height: "40px", width: "auto", margin: "0 auto 15px", textAlign: "center" }}
        />
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          data-testId={
            props.dataTestId
              ? props.dataTestId + "-title"
              : "progress-modal-title"
          }
        >
          {props.title}
        </Typography>
        <Box sx={{ display: "flex" }}>
          <Box m={"55px auto"}>
            <CircularProgress
              sx={{ color: uiGreen }}
              data-testId={
                props.dataTestId
                  ? props.dataTestId + "-progress"
                  : "progress-modal-loading-icon"
              }
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProgressModal;
