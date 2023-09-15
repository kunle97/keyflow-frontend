import React from "react";
import { Button } from "@mui/material";
import { uiGreen } from "../../../constants";
const UIButton = (props) => {
  const defaultStyle = {
    backgroundColor: uiGreen,
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

export default UIButton;
