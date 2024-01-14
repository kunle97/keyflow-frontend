import React from "react";
import { Modal, Backdrop, Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { uiGreen, uiGrey1 } from "../../../../constants";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
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
    padding: "20px",
    outline: "none", // Remove focus outline
  },
  button: {
    background: `${uiGreen} !important`,
    color: "white",
    textTransform: "none",
    marginTop: "20px",
  },
}));

const AlertModal = (props) => {
  const classes = useStyles();

  return (
    <Modal
      className={classes.modal}
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      hideBackdrop={false}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        classes: {
          root: classes.backdrop,
        },
      }}
    >
      <div data-testid={props.dataTestId} className={props.dataTestId}>
        <div className={classes.modalContent}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            data-testid="alert-modal-title"
          >
            {props.title}
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2, mb:2 }}
            data-testid="alert-modal-message"
          >
            {props.message}
          </Typography>

          {props.to ? (
            <a href={props.to}>
              <Button
                id="modal-modal-button"
                className={classes.button}
                variant="contained"
                data-testid="alert-modal-button"
              >
                {props.btnText}
              </Button>
            </a>
          ) : (
            <Button
              id="modal-modal-button"
              onClick={props.onClick}
              className={classes.button}
              variant="contained"
              data-testid="alert-modal-button"
            >
              {props.btnText}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AlertModal;
