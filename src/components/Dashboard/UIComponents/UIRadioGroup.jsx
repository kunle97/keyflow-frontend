import React from "react";
import { uiGreen } from "../../../constants";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

const UIRadioGroup = (props) => {
  return (
    <div>
      {" "}
      <FormControl sx={props.style}>
        <label
          id="demo-controlled-radio-buttons-group"
          style={{ ...props.labelStyle }}
          className="text-black"
        >
          {props.formLabel}
        </label>
        <RadioGroup
          sx={{
            "& .MuiFormControlLabel-label": {
              color: "black", // Set label text color to white
            },
            "& .MuiRadio-root": {
              color: "black", // Set radio button color to white
            },
            "& .Mui-checked": {
              color: `${uiGreen} !important`, // Set checked radio button color
            },
            "& .MuiRadio-root.Mui-checked:hover": {
              backgroundColor: "transparent", // Set checked radio hover background color
            },
            display: "flex",
            flexDirection: "row",
            ...props.radioGroupStyles,
          }} // radioGroupStyle is an object
          aria-labelledby="demo-controlled-radio-buttons-group"
          name={props.name}
          value={props.value}
          onChange={props.onChange}
        >
          {props.radioOptions.map((option, index) => {
            return (
              !option.hidden && ( // if option.hidden is false, then render the radio button
                <FormControlLabel
                  data-testId={option.dataTestId}
                  key={index} // Adding key for list items
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                  sx={{
                    flexDirection: props.direction, // possible values: row, column
                  }}
                />
              )
            );
          })}
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default UIRadioGroup;
