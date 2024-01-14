import React from "react";
import { uiGreen, validationMessageStyle } from "../../../../constants";
import { Button, Stack } from "@mui/material";

const UnitRow = (props) => {
  const { beds, baths, size, name } = props.unit;
  return (
    <div
      className="row unit-row"
      style={{ ...props.style }}
      data-testId={`${props.dataTestId}`}
    >
      <div className="col-md-3 mb-3">
        <label
          className="form-label text-black"
          htmlFor="street"
          data-testId={`${props.dataTestId}-unit-name-label`}
        >
          <strong>Name</strong>
        </label>
        <input
          data-testId={`${props.dataTestId}-unit-name-input`}
          {...props.register(`name_${props.id}`, {
            required: "This field is required",
          })}
          className="form-control"
          defaultValue={name}
          onChange={props.onUnitChange}
        />
        <span style={validationMessageStyle}>
          {props.unitNameErrors && props.unitNameErrors.message}
        </span>
      </div>
      <div className="col-md-3 mb-3">
        <label
          className="form-label text-black"
          htmlFor="street"
          data-testId={`${props.dataTestId}-unit-beds-label`}
        >
          <strong>Beds</strong>
        </label>
        <input
          data-testId={`${props.dataTestId}-unit-beds-input`}
          {...props.register(`beds_${props.id}`, {
            required: "This field is required",
          })}
          className="form-control"
          type="number"
          defaultValue={beds}
          onChange={props.onUnitChange}
        />
        <span style={validationMessageStyle}>
          {props.unitBedsErrors && props.unitBedsErrors.message}
        </span>
      </div>
      <div className="col-md-3 mb-3">
        <label
          className="form-label text-black"
          htmlFor="street"
          data-testId={`${props.dataTestId}-unit-baths-label`}
        >
          <strong>Baths</strong>
        </label>
        <input
          data-testId={`${props.dataTestId}-unit-baths-input`}
          {...props.register(`baths_${props.id}`, {
            required: "This field is required",
          })}
          className="form-control"
          type="number"
          defaultValue={baths}
          onChange={props.onUnitChange}
        />
        <span style={validationMessageStyle}>
          {props.unitBathsErrors && props.unitBathsErrors.message}
        </span>
      </div>
      <div className="col-md-3 mb-3">
        <label
          className="form-label text-black"
          htmlFor="street"
          data-testId={`${props.dataTestId}-unit-size-label`}
        >
          <strong>Size (sqft)</strong>
        </label>
        <input
          data-testId={`${props.dataTestId}-unit-size-input`}
          {...props.register(`size_${props.id}`, {
            required: "This field is required",
          })}
          className="form-control"
          type="number"
          defaultValue={size}
          onChange={props.onUnitChange}
        />
        <span style={validationMessageStyle}>
          {props.unitSizeErrors && props.unitSizeErrors.message}
        </span>
      </div>
      <Stack direction="row" gap={2}>
        {props.removeBtn}
        <Button
          data-testId={`${props.dataTestId}-add-unit-button`}
          sx={{
            color: uiGreen,
            textTransform: "none",
          }}
          //   variant="contained"
          onClick={props.addUnit}
        >
          + Add
        </Button>
      </Stack>
    </div>
  );
};

export default UnitRow;
