import React from "react";
import { Button } from "@mui/material";
import { uiGreen } from "../../constants";
const UIButton = (props) => {
  const defaultStyle = {
    backgroundColor: uiGreen,
    textTransform: "none",
  };
  return (
    <Button
      disabled={props.disabled}
      onClick={props.onClick}
      style={{ ...defaultStyle, ...props.style }}
      variant="contained"
    >
      {props.btnText}
    </Button>
  );
};

export default UIButton;
