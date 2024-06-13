import React, { useState } from "react";
import StepControl from "./StepControl";
import UIButton from "../../../../UIComponents/UIButton";
import { uiRed, validationMessageStyle } from "../../../../../../constants";
import {
  triggerValidation,
  validateForm,
} from "../../../../../../helpers/formValidation";
import { Stack } from "@mui/material";
import { numberUpTo2DecimalPlaces, validAnyString } from "../../../../../../constants/rexgex";

const AdditionalCharge = (props) => {
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
    props.setAdditionalCharges((prevCharges) => {
      let newCharges = [...prevCharges];
      newCharges[prevCharges.length - 1][name] = value;
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
      colSpan: 3,
      onChange: (e) => handleChange(e),
      placeholder: "Pet Rent",
      validations: {
        required: true,
        regex: validAnyString,
        errorMessage: "Please enter a valid name for the unit",
      },
      dataTestId: "unit-name",
      errorMessageDataTestId: "unit-name-error",
    },
    {
      name: "amount",
      label: "Amount",
      type: "number",
      colSpan: 3,
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        regex: numberUpTo2DecimalPlaces,
        errorMessage: "Please enter a valid amount",
      },
      dataTestId: "unit-amount",
      errorMessageDataTestId: "unit-amount-error",
    },
    {
      name: "frequency",
      label: "Frequency",
      type: "select",
      options: [
        { value: "", label: "Select Frequency" },
        { value: "month", label: "Monthly" },
        { value: "year", label: "Yearly" },
        { value: "week", label: "Weekly" },
      ],
      colSpan: 3,
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        errorMessage: "Please select a frequency",
      },
      dataTestId: "unit-frequency",
      errorMessageDataTestId: "unit-frequency-error",
    },
  ];
  return (
    <div className="additional-charges-section" style={{ ...props.style }}>
      <div className="row mt-3">
        {formInputs.map((input, i) => (
          <div key={i} className={`col-md-${input.colSpan}`}>
            <div className="form-group">
              <label className="text-black" htmlFor={input.name}>
                {input.label}
              </label>
              {input.type === "text" ? (
                <input
                  type="text"
                  className="form-control"
                  id={input.name}
                  name={input.name}
                  onChange={input.onChange}
                  onBlur={input.onChange}
                  placeholder={input.placeholder}
                  value={formData[input.name]}
                />
              ) : input.type === "number" ? (
                <input
                  type="number"
                  className="form-control"
                  id={input.name}
                  name={input.name}
                  onChange={input.onChange}
                  onBlur={input.onChange}
                  value={formData[input.name]}
                />
              ) : input.type === "select" ? (
                <select
                  className="form-control"
                  id={input.name}
                  name={input.name}
                  onChange={input.onChange}
                  onBlur={input.onChange}
                  value={formData[input.name]}
                >
                  {input.options.map((option, i) => (
                    <option key={i} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : null}
              {props.errors[input.name] &&
                props.index == props.additionalCharges.length - 1 && (
                  <span
                    data-testId={input.errorMessageDataTestId}
                    style={{ ...validationMessageStyle }}
                  >
                    {props.errors[input.name]}
                  </span>
                )}
            </div>
          </div>
        ))}
        <div className="col-md-3 align-self-center">
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={1}
          >
            {props.index == props.additionalCharges.length - 1 && (
              <UIButton
                onClick={() => {
                  const { isValid, newErrors } = validateForm(
                    formData,
                    formInputs
                  );
                  if (isValid) {
                    props.addAdditionalCharge();
                  } else {
                    props.setErrors(newErrors);
                  }
                }}
                btnText="Add Charge"
                color="secondary"
              />
            )}
            <>
              {props.index !== 0 && (
                <div className="col-md-1">
                  <UIButton
                    onClick={() => {
                      props.removeAdditionalCharge(props.index);
                      //Reset the errors:
                      props.setErrors({});
                    }}
                    btnText="Remove"
                    color="danger"
                  />
                </div>
              )}
            </>
          </Stack>
        </div>
      </div>
      <StepControl
        skipAllowed={true}
        style={{ marginTop: "30px" }}
        step={props.step}
        steps={props.steps}
        handlePreviousStep={props.handlePreviousStep}
        handleNextStep={()=>{
          props.setSkipAdditionalChargesStep(false);
          props.handleNextStep()
        }}
        formData={formData}
        formInputs={formInputs}
        handleSkipStep={()=>{
          props.setSkipAdditionalChargesStep(true);
          if(props.skipAdditionalChargesStep === false){
            props.setSkipAdditionalChargesStep(true);
            console.log("Skip additional charges", props.skipAdditionalChargesStep);
          }else{
            props.handleNextStep();
          }
        }}
      />
    </div>
  );
};

export default AdditionalCharge;
