import React from "react";
import { uiRed } from "../../../constants";
import { Button } from "@mui/material";

const DeleteButton = (props) => {
  const defaultStyle = {
    backgroundColor: uiRed,
    textTransform: "none",
  };
  return (
    <Button
      disabled={props.disabled}
      onClick={props.onClick}
      sx={{ ...defaultStyle, ...props.style }}
      variant="contained"
      type={props.type}
    >
      {props.btnText}
    </Button>
  );
};

export default DeleteButton;
