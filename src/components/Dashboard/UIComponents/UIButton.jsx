import React from "react";
import { Button } from "@mui/material";
import { uiGreen } from "../../../constants";
const UIButton = (props) => {
  const defaultStyle = {
    backgroundColor: `${uiGreen} !important`,
    textTransform: "none !important",
    color: "white !important",
    borderRadius: "5px !important",
    fontSize: "12pt !important",  
  };
  return (
    <Button
      disabled={props.disabled}
      onClick={props.onClick}
      sx={{ ...defaultStyle, ...props.style }}
      variant={!props.variant ? "contained" : props.variant }
      type={props.type}
      
    >
      {props.btnText}
    </Button>
  );
};

export default UIButton;
