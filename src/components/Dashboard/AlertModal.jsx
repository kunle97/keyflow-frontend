import React from "react";
import { Modal } from "@mui/base/Modal";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { uiGreen, uiGrey1 } from "../../constants";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: uiGrey1,
  color: "white",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const AlertModal = (props) => {
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {props.title}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {props.message}
        </Typography>
        <a href={props.to}>
          <Button
            style={{
              marginTop: "20px",
              backgroundColor: uiGreen,
            }}
            variant="contained"
          >
            {props.btnText}
          </Button>
        </a>
      </Box>
    </Modal>
  );
};

export default AlertModal;
