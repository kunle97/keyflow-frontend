import React, { useState } from "react";
import { uiGreen, validationMessageStyle } from "../../../../constants";
import { Button, Stack } from "@mui/material";
import { hasNoErrors, triggerValidation } from "../../../../helpers/formValidation";
import { validateUnitName } from "../../../../api/units";
import { validAnyString, validWholeNumber } from "../../../../constants/rexgex";

const UnitRow = (props) => {
  const { beds, baths, size, name } = props.unit;
  const [formData, setFormData] = useState({
    name: name,
    beds: beds,
    baths: baths,
    size: size,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Name ", name);
    console.log("Value ", value);
    let newErrors = triggerValidation(
      name,
      value,
      formInputs.find((input) => input.name === name).validations
    );
    props.setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: newErrors[name],
    }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log("Form data ", formData);
    console.log("Errors ", props.errors);
  };

  const formInputs = [
    {
      name: "name",
      label: "Name",
      type: "text",
      colSpan: 3,
      onChange: (e) => handleChange(e),
      placeholder: "A5",
      validations: {
        required: true,
        // errorMessage: "Please enter a valid name for the unit",
        validate: async (value) => {
          let regex = validAnyString;
          if (!regex.test(value)){
            //Check errorMessage value in this object
            props.setErrors((prevErrors) => ({
              ...prevErrors,
              name: "Please enter a valid name for the unit",
            }));
            return false;
          }
          let payload = {
            name: value,
            rental_property: parseInt(props.property_id),
          }
          await validateUnitName(payload).then((res) => {
            console.log(res)
            if (res.status === 400) {
              props.setErrors((prevErrors) => ({
                ...prevErrors,
                name: "A unit with this name already exists in this property",
              }));
            }
          });
        },
      },
      dataTestId: "unit-name",
      errorMessageDataTestId: "unit-name-error",
    },
    {
      name: "beds",
      label: "Beds",
      type: "number",
      colSpan: 3,
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        regex: validWholeNumber,
        errorMessage: "Please enter a valid number of beds",
      },
      dataTestId: "unit-beds",
      errorMessageDataTestId: "unit-beds-error",
    },
    {
      name: "baths",
      label: "Baths",
      type: "number",
      colSpan: 3,
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        regex: validWholeNumber,
        errorMessage: "Please enter a valid number of baths",
      },
      dataTestId: "unit-baths",
      errorMessageDataTestId: "unit-baths-error",
    },
    {
      name: "size",
      label: "Size (sqft)",
      type: "number",
      colSpan: 3,
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        regex: validWholeNumber,
        errorMessage: "Please enter a valid size",
      },
      dataTestId: "unit-size",
      errorMessageDataTestId: "unit-size-error",
    },
  ];

  return (
    <div
      className="row unit-row"
      style={{ ...props.style }}
      data-testId={`${props.dataTestId}`}
    >
      {formInputs.map((input, index) => {
        return (
          <div className={`col-md-${input.colSpan} mb-3`} key={index}>
            <label
              className="form-label text-black"
              htmlFor={input.name}
              data-testId={`${input.dataTestId}-label`}
            >
              <strong>{input.label}</strong>
            </label>
            <input
              name={input.name}
              data-testId={`${input.dataTestId}`}
              className="form-control"
              type={input.type}
              defaultValue={formData[input.name]}
              onChange={(e) => {
                input.onChange(e);
                props.onUnitChange(e);
              }}
              onBlur={(e) => {
                input.onChange(e);
              }}
              placeholder={input.placeholder}
            />
            {props.errors[input.name] && (
              <span
                data-testId={input.errorMessageDataTestId}
                style={{ ...validationMessageStyle }}
              >
                {props.errors[input.name]}
              </span>
            )}
          </div>
        );
      })}
      <Stack direction="row" gap={2}>
        {props.removeBtn}
        <Button
          className="add-unit-button"
          data-testId={`${props.dataTestId}-add-unit-button`}
          sx={{
            color: uiGreen,
            textTransform: "none",
          }}
          //   variant="contained"
          onClick={() => {
            //Check if all the values in the array are undefined
            if (hasNoErrors(props.errors)) {
              props.addUnit();
            }
          }}
        >
          + Add
        </Button>
      </Stack>
    </div>
  );
};

export default UnitRow;
