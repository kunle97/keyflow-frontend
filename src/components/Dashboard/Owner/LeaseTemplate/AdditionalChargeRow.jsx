import React, { useEffect, useState } from "react";
import { uiGreen, uiRed, validationMessageStyle } from "../../../../constants";
import { Button, Stack } from "@mui/material";
import {
  triggerValidation,
  validateForm,
} from "../../../../helpers/formValidation";
import { numberUpTo2DecimalPlaces, uppercaseAndLowercaseLetters } from "../../../../constants/rexgex";

const AdditionalChargeRow = (props) => {
  const { name, amount, frequency } = props.charge;
  const [formData, setFormData] = useState({
    name: name,
    amount: amount,
    frequency: frequency,
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
    //Set the additional charges in the parent component
    props.setCharges((prevCharges) => {
      let newCharges = [...prevCharges];
      newCharges[props.index][name] = value;
      return newCharges;
    });
    console.log("Form data ", formData);
    console.log("Errors ", props.errors);
  };

  const formInputs = [
    {
      name: "name",
      label: "Name",
      type: "text",
      colSpan: 4,
      onChange: (e) => handleChange(e),
      placeholder: "Pet Rent",
      validations: {
        required: true,
        regex: uppercaseAndLowercaseLetters,
        errorMessage: "Please enter a valid name for the charge",
      },
      dataTestId: "charge-name",
      errorMessageDataTestId: "charge-name-error",
    },
    {
      name: "amount",
      label: "Amount",
      type: "number",
      colSpan: 4,
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        regex: numberUpTo2DecimalPlaces,
        errorMessage: "Please enter a valid amount for the charge",
      },
      dataTestId: "charge-amount",
      errorMessageDataTestId: "charge-amount-error",
    },
    {
      name: "frequency",
      label: "Frequency",
      type: "select",
      colSpan: 4,
      onChange: (e) => handleChange(e),
      options: [
        { value: "day", label: "daily" },
        { value: "week", label: "Weekly" },
        { value: "month", label: "Monthly" },
        { value: "year", label: "Yearly" },
      ],
      validations: {
        required: true,
        errorMessage: "Please select a frequency for the charge",
        regex: uppercaseAndLowercaseLetters
      },
      dataTestId: "charge-frequency",
      errorMessageDataTestId: "charge-frequency-error",
    },
  ];
  useEffect(() => {
    const { newErrors } = validateForm(formData, formInputs);
    props.setErrors(newErrors);
  }, []);
  return (
    <div
      className="additional-charge-row row"
      style={{
        padding: "10px 0",
        ...props.style,
      }}
      data-testid={`${props.dataTestId}`}
    >
      {formInputs.map((input, index) => (
        <div
          className={`col-md-${input.colSpan}`}
          key={index}
          style={{ marginBottom: "1rem" }}
        >
          <label className="text-black mb-2" htmlFor={input.name}>
            {input.label}
          </label>
          {input.type === "text" || input.type === "number" ? (
            <input
              type={input.type}
              name={input.name}
              value={formData[input.name]}
              onChange={input.onChange}
              onBlur={input.onChange}
              placeholder={input.placeholder}
              className="form-control"
              data-testid={input.dataTestId}
            />
          ) : (
            <select
              name={input.name}
              value={formData[input.name]}
              onChange={input.onChange}
              onBlur={input.onChange}
              className="form-select"
              data-testid={input.dataTestId}
            >
              {input.options.map((option, i) => (
                <option key={i} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          {props.errors[input.name] && (
            <div
              className="validation-message"
              style={validationMessageStyle}
              data-testid={input.errorMessageDataTestId}
            >
              {props.errors[input.name]}
            </div>
          )}
        </div>
      ))}
      <Stack direction="row" gap={2}>
        {props.removeBtn}
        <Button
          className="add-unit-button"
          data-testId={`${props.dataTestId}-add-charge-button`}
          sx={{
            color: uiGreen,
            textTransform: "none",
          }}
          //   variant="contained"
          onClick={() => {
            //Check if all the values in the array are undefined
            if (Object.values(props.errors).every((val) => val === undefined)) {
              props.addCharge();
              const { newErrors } = validateForm(formData, formInputs);
              props.setErrors(newErrors);
            }
          }}
        >
          + Add
        </Button>
        {props.index !== 0 && (
          <div className="col-md-3">
            <Button
              onClick={() => props.removeCharge(props.index)}
              btnText="Remove"
              variant="text"
              style={{
                color: uiRed,
                backgroundColor: "transparent",
                display: "block",
                textTransform: "none",
              }}
            >
              Remove
            </Button>
          </div>
        )}
      </Stack>
    </div>
  );
};

export default AdditionalChargeRow;
