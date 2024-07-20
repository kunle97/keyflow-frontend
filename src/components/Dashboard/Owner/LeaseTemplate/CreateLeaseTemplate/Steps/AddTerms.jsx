import React from "react";
import { uiGrey2, validationMessageStyle } from "../../../../../../constants";
import { Tooltip } from "@mui/material";
import { HelpOutline } from "@mui/icons-material";
import StepControl from "./StepControl";
import { triggerValidation } from "../../../../../../helpers/formValidation";
import { numberUpTo2DecimalPlaces, validNoWhiteSpaceOrSpecialCharactersOrNumbers, validWholeNumber } from "../../../../../../constants/rexgex";

const AddTerms = (props) => {
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


  };

  const formInputs = [
    {
      name: "rent",
      label: "Rent",
      type: "number",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "Rent",
      validations: {
        required: true,
        regex: numberUpTo2DecimalPlaces,
        errorMessage: "Please enter a valid rent amount",
      },
      dataTestId: "rent",
      errorMessageDataTestId: "rent-error",
    },
    {
      name: "rent_frequency",
      label: "Rent Frequency",
      type: "select",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "Rent Frequency",
      options: [
        {value:"", label:"Select One"},
        { value: "Day", label: "Daily" },
        { value: "week", label: "Weekly" },
        { value: "month", label: "Monthly" },
        { value: "year", label: "Yearly" },
      ],
      validations: {
        //Create REGEX for for a valid word with no special characters or spaces
        regex: validNoWhiteSpaceOrSpecialCharactersOrNumbers,
        required: true,
        errorMessage: "Please select a rent frequency",
      },
      dataTestId: "rent-frequency",
      errorMessageDataTestId: "rent-frequency-error",
    },
    {
      name: "term",
      label: "Term",
      type: "number",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "Term",
      validations: {
        required: true,
        regex:  validWholeNumber,
        errorMessage: "Please enter a valid term",
      },
      dataTestId: "term",
      errorMessageDataTestId: "term-error",
    },
    {
      name: "late_fee",
      label: "Late Fee",
      type: "number",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "Late Fee",
      validations: {
        required: true,
        regex: numberUpTo2DecimalPlaces,
        errorMessage: "Please enter a valid late fee",
      },
      dataTestId: "late-fee",
      errorMessageDataTestId: "late-fee-error",
    },
    {
      name: "security_deposit",
      label: "Security Deposit",
      type: "number",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "Security Deposit",
      validations: {
        required: true,
        regex:  numberUpTo2DecimalPlaces,
        errorMessage: "Please enter a valid security deposit",
      },
      dataTestId: "security-deposit",
      errorMessageDataTestId: "security-deposit-error",
    },
    {
      name: "gas_included",
      label: "Gas Included",
      type: "select",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      options: [
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
      placeholder: "Gas Included",
      validations: {
        required: true,
        errorMessage: "Please select an option",
      },
      dataTestId: "gas-included",
      errorMessageDataTestId: "gas-included-error",
    },
    {
      name: "water_included",
      label: "Water Included",
      type: "select",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      options: [
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
      placeholder: "Water Included",
      validations: {
        required: true,
        errorMessage: "Please select an option",
      },
      dataTestId: "water-included",
      errorMessageDataTestId: "water-included-error",
    },
    {
      name: "electric_included",
      label: "Electric Included",
      type: "select",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      options: [
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
      placeholder: "Electric Included",
      validations: {
        required: true,
        errorMessage: "Please select an option",
      },
      dataTestId: "electric-included",
      errorMessageDataTestId: "electric-included-error",
    },
    {
      name: "repairs_included",
      label: "Repairs Included",
      type: "select",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      options: [
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
      placeholder: "Repairs Included",
      validations: {
        required: true,
        errorMessage: "Please select an option",
      },
      dataTestId: "repairs-included",
      errorMessageDataTestId: "repairs-included-error",
    },
    {
      name: "grace_period",
      label: "Grace Period",
      type: "number",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "Grace Period",
      validations: {
        required: true,
        regex:  validWholeNumber,
        errorMessage: "Please enter a valid grace period",
      },
      dataTestId: "grace-period",
      errorMessageDataTestId: "grace-period-error",
    },
    {
      name: "lease_cancellation_notice_period",
      label: "Lease Cancellation Notice Period",
      type: "number",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "Lease Cancellation Notice Period",
      validations: {
        required: true,
        regex:  validWholeNumber,
        errorMessage: "Please enter a valid lease cancellation notice period",
      },
      dataTestId: "lease-cancellation-notice-period",
      errorMessageDataTestId: "lease-cancellation-notice-period-error",
    },
    {
      name: "lease_cancellation_fee",
      label: "Lease Cancellation Fee",
      type: "number",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "Lease Cancellation Fee",
      validations: {
        required: true,
        regex: numberUpTo2DecimalPlaces,
        errorMessage: "Please enter a valid lease cancellation fee",
      },
      dataTestId: "lease-cancellation-fee",
      errorMessageDataTestId: "lease-cancellation-fee-error",
    },
    {
      name: "lease_renewal_notice_period",
      label: "Lease Renewal Notice Period",
      type: "number",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "Lease Renewal Notice Period",
      validations: {
        required: true,
        regex: validWholeNumber,
        errorMessage: "Please enter a valid lease renewal notice period",
      },
      dataTestId: "lease-renewal-notice-period",
      errorMessageDataTestId: "lease-renewal-notice-period-error",
    },
    {
      name: "lease_renewal_fee",
      label: "Lease Renewal Fee",
      type: "number",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "Lease Renewal Fee",
      validations: {
        required: true,
        regex: numberUpTo2DecimalPlaces,
        errorMessage: "Please enter a valid lease renewal fee",
      },
      dataTestId: "lease-renewal-fee",
      errorMessageDataTestId: "lease-renewal-fee-error",
    },
  ];
  return (
    <div
      className="add-terms-container"
    >
      {" "}
      <div className="row step-0">
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
              {input.type === "select" ? (
                <select
                  style={{ ...validationMessageStyle, background: uiGrey2 }}
                  name={input.name}
                  className="form-control"
                  onChange={input.onChange}
                  onBlur={input.onChange}
                  data-testId={input.dataTestId}
                >
                  {input.options.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  style={{ ...validationMessageStyle, background: uiGrey2 }}
                  type={input.type}
                  name={input.name}
                  className="form-control"
                  onChange={input.onChange}
                  onBlur={input.onChange}
                  placeholder={input.placeholder}
                  value={props.formData[input.name] || ""}
                  data-testId={input.dataTestId}
                />
              )}
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
      <StepControl
        step={props.step}
        steps={props.steps}
        handlePreviousStep={props.handlePreviousStep}
        handleNextStep={props.handleNextStep}
        formData={props.formData}
        formInputs={formInputs}
        setErrors={props.setErrors}
      />
    </div>
  );
};

export default AddTerms;
