import React from "react";
import { uiGreen } from "../../../constants";
import { Checkbox, FormControlLabel } from "@mui/material";

const UICheckbox = (props) => {
  return (
    <div>
      <FormControlLabel
        value="end"
        control={
          <Checkbox
            checked={props.checked}
            onChange={props.onChange}
            sx={{
              color: uiGreen,
              "&.Mui-checked": {
                color: uiGreen,
              },
            }}
          />
        }
        label={
          <span
            className="text-black"
            style={{
              fontSize: "12pt",
              ...props.labelStyle,
            }}
          >
            {props.label}
          </span>
        }
        labelPlacement="end"
      />
    </div>
  );
};

export default UICheckbox;
