import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { FormControlLabel } from "@mui/material";
import { FormGroup } from "@mui/material";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
export function MultiSelectDropdown({
  options,
  label,
  selectedOptions,
  onChange,
}) {
  return (
    <Autocomplete
      multiple
      id="checkbox-dropdown"
      options={options}
      value={selectedOptions}
      onChange={(event, newValue) => {
        onChange(newValue.map((item) => item)); // Extract and pass the selected values
      }}
      disableCloseOnSelect
      getOptionLabel={(option) => option}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="small" />}
                  checkedIcon={<CheckBoxOutlinedIcon fontSize="small" />}
                  checked={selected}
                />
              }
              label={option}
            />
          </FormGroup>
        </li>
      )}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={label}
          InputProps={{
            ...params.InputProps,
            style: {
              color: "white", // Placeholder text color
              borderColor: "#3aaf5c", // Outline color
            },
          }}
        />
      )}
    />
  );
}
