import React from "react";
import { Modal, Backdrop, Box, Typography, Button, Stack } from "@mui/material";
import { uiGreen, uiGrey1, uiGrey2 } from "../../../../constants";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    color: uiGrey1,
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.15)",
    padding: "16px",
    zIndex: 1000,
  },
  confirmBtn: {
    marginTop: "16px",
    backgroundColor: uiGreen,
    marginRight: "16px",
    textTransform: "none",
  },
  cancelBtn: {
    marginTop: "16px",
    backgroundColor: "red",
    textTransform: "none",
  },
}));

const ConfirmModal = (props) => {
  const classes = useStyles();

  return (
    <div>
      <Modal
        className={classes.modal}
        open={props.open}
        onClose={props.handleClose}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          classes: {
            root: classes.backdrop,
          },
        }}
      >
        <Box className={classes.modalContent}>
          <Typography
            id="modal-modal-title"
            data-testid="confirm-modal-title"
            variant="h6"
            component="h2"
          >
            {props.title}
          </Typography>
          <Typography
            id="modal-modal-description"
            data-testid="confirm-modal-message"
            sx={{ my: "5px" }}
          >
            {props.message}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: "16px" }}>
            <Button
              data-testid="confirm-modal-cancel-button"
              onClick={props.handleCancel}
              className={classes.cancelBtn}
              style={{
                background: uiGrey2,
                textTransform: "none",
                ...props.cancelBtnStyle,
              }}
              variant="contained"
            >
              {props.cancelBtnText}
            </Button>
            <Button
              data-testid="confirm-modal-confirm-button"
              onClick={props.handleConfirm}
              className={classes.confirmBtn}
              style={{
                background: uiGreen,
                textTransform: "none",
                ...props.confirmBtnStyle,
              }}
              variant="contained"
            >
              {props.confirmBtnText}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};

export default ConfirmModal;
