import React from "react";
import { uiGreen, uiGrey } from "../../../constants";
import { IconButton, Tooltip } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
const UIHelpButton = (props) => {
  return (
    <div>
      <div className="d-flex justify-content-center">
        <Tooltip title={props.tooltipTitle ? props.tooltipTitle : "Help"}>
          <IconButton
            onClick={props.onClick}
            style={{
              background: uiGrey,
              color: uiGreen,
              position: "fixed",
              bottom: "20px",
              right: "20px",
            }}
          >
            <HelpIcon
              sx={{
                fontSize: "2rem",
              }}
            />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default UIHelpButton;
