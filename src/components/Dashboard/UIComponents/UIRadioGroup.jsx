import React from "react";
import { uiGreen } from "../../../constants";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

const UIRadioGroup = (props) => {
  return (
    <div>
      {" "}
      <FormControl>
        <FormLabel
          id="demo-controlled-radio-buttons-group"
          sx={{ ...props.labelStyle }}
        >
          {props.formLabel}
        </FormLabel>
        <RadioGroup
          sx={{
            "& .MuiFormControlLabel-label": {
              color: "black", // Set label text color to white
            },
            "& .MuiRadio-root": {
              color: "black", // Set radio button color to white
            },
            "& .Mui-checked": {
              color: uiGreen, // Set checked radio button color
            },
            "& .MuiRadio-root.Mui-checked:hover": {
              backgroundColor: "transparent", // Set checked radio hover background color
            },
            display: "flex",
            flexDirection: "row",
            ...props.radioGroupStyles,
          }} // radioGroupStyle is an object
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={props.value}
          onChange={props.onChange}
        >
          {props.radioOptions.map((option) => {
            return (
              <FormControlLabel
                value={option.value}
                control={<Radio />}
                label={option.label}
                sx={{
                  flexDirection: props.direction, // posoible values: row, column
                }}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default UIRadioGroup;
