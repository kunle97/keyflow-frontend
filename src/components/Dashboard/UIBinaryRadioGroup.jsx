import React, { useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { uiGreen } from "../../constants";
const UIBinaryRadioGroup = (props) => {
  const handleChange = (event) => {
    console.log(event.target.value);
    props.onSet(event.target.value);
  };

  return (
    <FormControl>
      <FormLabel sx={{ color: "white" }} id={props.name}>
        {props.label}
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby={props.name}
        name={props.name}
        defaultValue={props.defaultValue}
        onChange={(event) => handleChange(event)}
      >
        <FormControlLabel
          value={props.radio_one_value}
          control={
            <Radio
              sx={{
                color: "white",
                "&.Mui-checked": {
                  color: uiGreen,
                },
              }}
              onClick={props.onSet(props.radio_one_value)}
            />
          }
          label={props.radio_one_label}
          sx={{ color: "white" }}
        />
        <FormControlLabel
          value={props.radio_two_value}
          control={
            <Radio
              sx={{
                color: "white",
                "&.Mui-checked": {
                  color: uiGreen,
                },
              }}
              onClick={props.onSet(props.radio_two_value)}
            />
          }
          label={props.radio_two_label}
          sx={{ color: "white" }}
        />
      </RadioGroup>
    </FormControl>
  );
};

export default UIBinaryRadioGroup;
