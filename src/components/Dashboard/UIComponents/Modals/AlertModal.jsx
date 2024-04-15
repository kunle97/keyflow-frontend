import React, { useState } from "react";
import { Modal, Backdrop, Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { uiGreen, uiGrey1 } from "../../../../constants";
import { makeStyles } from "@mui/styles";
import UICheckbox from "../UICheckbox";
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
    width: "100%",
  },
}));

const AlertModal = (props) => {
  const [disabled, setDisabled] = useState(false);
  const classes = useStyles();
  const handleDisableChange = (event) => {
    setDisabled(event.target.checked);
    console.log("Disabled: ", disabled);
  };
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
      <div className={props.dataTestId}>
        <div data-testid={props.dataTestId} className={classes.modalContent}>
          <h5
            id="modal-modal-title"
            variant="h6"
            component="h2"
            data-testid="alert-modal-title"
          >
            {props.title}
          </h5>
          <p
            id="modal-modal-description"
            sx={{ mt: 2 }}
            data-testid="alert-modal-message"
          >
            {props.message}
          </p>
          {props.confirmCheckbox && (
            <div style={{ margin: "5px" }}>
              <UICheckbox
                checked={disabled}
                onChange={handleDisableChange}
                label={props.checkboxLabel}
                labelStyle={{ fontSize: "10pt" }}
              />
            </div>
          )}

          {(!props.confirmCheckbox || disabled) && (
            <div
            style={{width:"100%"}}
            >
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
                  onClick={() => {
                    if (!disabled) {
                      props.onClick();
                    } else {
                    }
                  }}
                  className={classes.button}
                  variant="contained"
                  data-testid="alert-modal-button"
                >
                  {props.btnText}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AlertModal;
