import React from "react";
import { Modal } from "@mui/base/Modal";
import { Button, Box, Typography, Stack } from "@mui/material";
import { uiGreen, uiGrey1 } from "../../../../constants";

const ConfirmModal = (props) => {
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

  return (
    <div>
      <Modal open={props.open} onClose={props.handleClose}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {props.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {props.message}
          </Typography>
          <Stack direction="row">
            <Button
              onClick={props.handleCancel}
              style={{
                marginTop: "20px",
                backgroundColor: "red",
                marginRight: "20px",
                textTransform: "none",
              }}
              variant="contained"
            >
              {props.cancelBtnText}
            </Button>
            <Button
              onClick={props.handleConfirm}
              style={{
                marginTop: "20px",
                backgroundColor: uiGreen,
                marginRight: "20px",
                textTransform: "none",
              }}
              variant="contained"
            >
              {props.conformBtnText}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};

export default ConfirmModal;
