import React, { useState } from "react";
import { validationMessageStyle } from "../../../constants";
import { Stack } from "@mui/material";
import UIButton from "../../Dashboard/UIComponents/UIButton";
import {
  triggerValidation,
  validateForm,
} from "../../../helpers/formValidation";
const AdditionalInformationSection = (props) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = triggerValidation(
      name,
      value,
      formInputs.find((input) => input.name === name).validations
    );
    props.setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: newErrors[name],
    }));
    props.setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log("Form data ", props.formData);
    console.log("Errors ", props.errors);
  };

  const formInputs = [
    {
      name: "other_occupants",
      label: "Will there be any other occupants?",
      type: "select",
      options: [
        { value: "", label: "Select One" },
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "Select One",
      validations: {
        required: true,
      },
    },
    {
      name: "pets",
      label: "Do you plan on having any pets during your lease?",
      type: "select",
      options: [
        { value: "", label: "Select One" },
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "Select One",
      validations: {
        required: true,
      },
    },
    {
      name: "vehicles",
      label: "Do you plan on having/storing any vehicles?",
      type: "select",
      options: [
        { value: "", label: "Select One" },
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "Select One",
      validations: {
        required: true,
      },
    },
    {
      name: "crime",
      label: "Have you ever been convicted of a crime?",
      type: "select",
      options: [
        { value: "", label: "Select One" },
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "Select One",
      validations: {
        required: true,
      },
    },
    {
      name: "bankrupcy",
      label: "Have you ever filed for bankrupcy?",
      type: "select",
      options: [
        { value: "", label: "Select One" },
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "Select One",
      validations: {
        required: true,
      },
    },
    {
      name: "evicted",
      label: "Have you been evicted from a previous residence?",
      type: "select",
      options: [
        { value: "", label: "Select One" },
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "Select One",
      validations: {
        required: true,
      },
    },
  ];

  return (
    <div id="questionaire-section">
      <h5 className="my-4 ml-5">Additional Information</h5>
      <div className="card mb-3">
        <div className="card-body">
          <div className="row">
            {formInputs.map((input, index) => {
              return (
                <div
                  className={`col-md-${input.colSpan} mb-3`}
                  key={index}
                  data-testId={`${input.dataTestId}`}
                >
                  <label className="form-label text-black" htmlFor={input.name}>
                    {input.label}
                  </label>
                  <select
                    className="form-select"
                    name={input.name}
                    onChange={handleChange} // Use handleChange function directly
                    onBlur={handleChange} // Also handle onBlur event if needed
                    defaultValue={props.formData[input.name]}
                  >
                    {input.options.map((option, index) => {
                      return (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      );
                    })}
                  </select>
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
          </div>
        </div>
      </div>
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        className="mt-5"
      >
        <UIButton
          style={{ width: "100%" }}
          btnText="Back"
          onClick={() => {
            props.previousStep();
          }}
        />
        <UIButton
          style={{ width: "100%" }}
          btnText="Next"
          onClick={() => {
            const { isValid, newErrors } = validateForm(
              props.formData,
              formInputs
            );
            if (isValid) {
              //Handle next button click
              props.nextStep();
            } else {
              props.setErrors(newErrors);
            }
          }}
          buttonStyle="btnGreen"
        />
      </Stack>
    </div>
  );
};

export default AdditionalInformationSection;
