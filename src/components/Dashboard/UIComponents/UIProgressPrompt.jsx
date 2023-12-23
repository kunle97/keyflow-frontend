import React from "react";
import UIPrompt from "../UIComponents/UIPrompt";
import { CircularProgress } from "@mui/material";
import { uiGreen } from "../../../constants";
const UIProgressPrompt = (props) => {
  return (
    <UIPrompt
      icon={<CircularProgress sx={{ color: uiGreen }} />}
      title={props.title}
      message={props.message}
    />
  );
};

export default UIProgressPrompt;
