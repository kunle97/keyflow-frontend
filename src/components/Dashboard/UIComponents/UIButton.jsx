import React from "react";
import { Button } from "@mui/material";
import { uiGreen } from "../../../constants";
const UIButton = (props) => {
  const defaultStyle = {
    backgroundColor: props.invertedColors
      ? "white !important"
      : `${uiGreen} !important`,
    textTransform: "none !important",
    color: props.invertedColors ? `${uiGreen} !important` : "white !important",
    borderRadius: "5px !important",
    fontSize: "10pt !important",
  };
  return (
    <Button
      id={props.id}
      data-testid={props.dataTestId}
      disabled={props.disabled}
      onClick={props.onClick}
      sx={{ ...defaultStyle, ...props.style }}
      variant={props.variant ? props.variant : "contained"}
      type={props.type}
      size={props.size}
    >
      {props.btnText}
    </Button>
  );
};

export default UIButton;
