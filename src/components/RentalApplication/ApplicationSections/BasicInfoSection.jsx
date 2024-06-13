import React, { useState } from "react";
import { uiGrey, validationMessageStyle } from "../../../constants";
import { HelpOutline } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import UIButton from "../../Dashboard/UIComponents/UIButton";
import {
  triggerValidation,
  validateForm,
} from "../../../helpers/formValidation";
import { faker } from "@faker-js/faker";
import { validEmail, validHTMLDateInput, validName, validPhoneNumber, validSSN } from "../../../constants/rexgex";
const BasicInfoSection = (props) => {
  const [formData, setFormData] = useState({});

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
      name: "first_name",
      label: "First Name",
      type: "text",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "First Name",
      validations: {
        required: true,
        regex: validName,
        errorMessage: "Please enter a valid first name",
      },
      dataTestId: "first-name",
      errorMessageDataTestId: "first-name-error",
    },
    {
      name: "last_name",
      label: "Last Name",
      type: "text",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "Last Name",
      validations: {
        required: true,
        regex: validName,
        errorMessage: "Please enter a valid last name",
      },
      dataTestId: "last-name",
      errorMessageDataTestId: "last-name-error",
    },
    {
      name: "date_of_birth",
      label: "Date of Birth",
      type: "date",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "Date of Birth",
      validations: {
        required: true,
        regex: validHTMLDateInput,
        errorMessage: "Please enter a valid date",
      },
      dataTestId: "date-of-birth",
      errorMessageDataTestId: "date-of-birth-error",
    },
    {
      name: "email",
      label: "E-mail",
      type: "email",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "E-mail",
      validations: {
        required: true,
        regex: validEmail,
        errorMessage: "Please enter a valid email address",
      },
      dataTestId: "email",
      errorMessageDataTestId: "email-error",
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "text",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "Phone Number",
      validations: {
        required: true,
        regex: validPhoneNumber,
        errorMessage: "Please enter a valid phone number",
      },
      dataTestId: "phone",
      errorMessageDataTestId: "phone-error",
    },
    {
      name: "ssn",
      label: "Social Security Number",
      type: "text",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "SSN",
      tooltip:
        "Your social security number will not be stored on KeyFlow servers. It will only be used for credit reporting and background checks.",
      validations: {
        required: true,
        regex: validSSN,
        errorMessage: "Please enter a valid social security number",
      },
      dataTestId: "ssn",
      errorMessageDataTestId: "ssn-error",
    },
    {
      name: "desired_move_in_date",
      label: "Desired Move-in Date",
      type: "date",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "Desired Move-in Date",
      validations: {
        required: true,
        regex: validHTMLDateInput,
        errorMessage: "Please enter a valid date",
      },
      dataTestId: "desired-move-in-date",
      errorMessageDataTestId: "desired-move-in-date-error",
    },
  ];

  return (
    <div id="basic-info-section">
      <h5 className="my-4 ml-5">Basic Information</h5>
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
                    {input.label}{" "}
                    {input.tooltip && (
                      <Tooltip title={input.tooltip}>
                        <HelpOutline
                          sx={{
                            marginLeft: "5px",
                            width: "20px",
                          }}
                        />
                      </Tooltip>
                    )}
                  </label>
                  <input
                    style={{ ...validationMessageStyle, background: uiGrey }}
                    type={input.type}
                    name={input.name}
                    className="form-control"
                    onChange={input.onChange}
                    onBlur={input.onChange}
                    placeholder={input.placeholder}
                    value={props.formData[input.name] || ""}
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
          </div>
        </div>
      </div>
      <UIButton
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
        style={{ width: "100%" }}
        buttonStyle="btnGreen"
      />
    </div>
  );
};

export default BasicInfoSection;
