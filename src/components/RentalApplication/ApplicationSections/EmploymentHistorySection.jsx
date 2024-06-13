import React, { useState } from "react";
import { faker } from "@faker-js/faker";
import { uiGreen, validationMessageStyle } from "../../../constants";
import { Button, Checkbox, Stack } from "@mui/material";
import UIButton from "../../Dashboard/UIComponents/UIButton";
import {
  triggerValidation,
  validateForm,
} from "../../../helpers/formValidation";
import { lettersNumbersAndSpecialCharacters, numberUpTo2DecimalPlaces, validAnyString, validEmail, validHTMLDateInput, validName, validPhoneNumber } from "../../../constants/rexgex";
const EmploymentHistorySection = (props) => {
  const {
    companyName,
    position,
    companyAddress,
    income,
    employmentStartDate,
    employmentEndDate,
    supervisorName,
    supervisorPhone,
    supervisorEmail,
  } = props.employment;
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    companyName: companyName,
    position: position,
    companyAddress: companyAddress,
    income: income,
    employmentStartDate: employmentStartDate,
    employmentEndDate: employmentEndDate,
    supervisorName: supervisorName,
    supervisorPhone: supervisorPhone,
    supervisorEmail: supervisorEmail,
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
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: newErrors[name],
    }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    //Find the emplayment history node that is being edited by matchinh the index of the node with the index from the props.index
    const employmentHistoryNode = props.employmentHistory.find(
      (employment, index) => index === props.index
    );
    //Update the employment history node with the new data in employmentHistoryNode
    props.setEmploymentHistory([
      ...props.employmentHistory.slice(0, props.index),
      {
        ...employmentHistoryNode,
        [name]: value,
      },
      ...props.employmentHistory.slice(props.index + 1),
    ]);

    console.log("Form data ", formData);
    console.log("Errors ", errors);
  };

  const [formInputs, setFormInputs] = useState([
    {
      name: "companyName",
      label: "Company Name",
      type: "text",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "Company Name",
      validations: {
        required: true,
        regex: lettersNumbersAndSpecialCharacters,
        errorMessage: "Please enter a valid company name",
      },
      dataTestId: "company-name",
      errorMessageDataTestId: "company-name-error",
    },
    {
      name: "position",
      label: "Title/Position",
      type: "text",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "Title/Position",
      validations: {
        required: true,
        regex: lettersNumbersAndSpecialCharacters,
        errorMessage: "Please enter a valid position",
      },
      dataTestId: "position",
      errorMessageDataTestId: "position-error",
    },
    {
      name: "companyAddress",
      label: "Company Address (Street, City, State, Zip)",
      type: "text",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "Company Address (Street, City, State, Zip)",
      validations: {
        required: true,
        regex: validAnyString,
        errorMessage: "Please enter a valid company address",
      },
      dataTestId: "company-address",
      errorMessageDataTestId: "company-address-error",
    },
    {
      name: "employmentStartDate",
      label: "Start Date",
      type: "date",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "Start Date",
      validations: {
        regex: validHTMLDateInput,
        required: true,
      },
      dataTestId: "employment-start-date",
      errorMessageDataTestId: "employment-start-date-error",
    },
    {
      name: "employmentEndDate",
      label: "End Date",
      type: "date",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "End Date",
      validations: {
        regex: validHTMLDateInput,
        required: true,
      },
      dataTestId: "employment-end-date",
      errorMessageDataTestId: "employment-end-date-error",
    },
    {
      name: "income",
      label: "Income",
      type: "number",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "Income",
      validations: {
        required: true,
        regex: numberUpTo2DecimalPlaces,
        errorMessage: "Please enter a valid income",
      },
      dataTestId: "income",
      errorMessageDataTestId: "income-error",
    },
    {
      name: "supervisorName",
      label: "Supervisor Name",
      type: "text",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "Supervisor Name",
      validations: {
        required: true,
        regex: validName,
        errorMessage: "Please enter a valid supervisor name",
      },
      dataTestId: "supervisor-name",
      errorMessageDataTestId: "supervisor-name-error",
    },
    {
      name: "supervisorPhone",
      label: "Supervisor Phone",
      type: "tel",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "Supervisor Phone",
      validations: {
        required: true,
        regex: validPhoneNumber,
        errorMessage: "Please enter a valid phone number",
      },
      dataTestId: "supervisor-phone",
      errorMessageDataTestId: "supervisor-phone-error",
    },
    {
      name: "supervisorEmail",
      label: "Supervisor Email",
      type: "email",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "Supervisor Email",
      validations: {
        required: true,
        regex: validEmail,
        errorMessage: "Please enter a valid email",
      },
      dataTestId: "supervisor-email",
      errorMessageDataTestId: "supervisor-email-error",
    },
  ]);

  return (
    <div>
      <div className="card mb-3">
        <div className="row card-body">
          {formInputs.map((input, index) => {
            return (
              <div
                className={`col-md-${input.colSpan} mb-4`}
                key={index}
                data-testId={`${input.dataTestId}`}
              >
                <label
                  className="mb-2 text-black"
                  htmlFor={input.name}
                  sx={{ color: "white" }}
                >
                  {input.label}
                </label>
                <input
                  className="form-control"
                  type={input.type}
                  name={input.name}
                  onChange={input.onChange}
                  onBlur={input.onChange}
                  placeholder={input.placeholder}
                  value={formData[input.name]}
                />
                {errors[input.name] && (
                  <span
                    data-testId={input.errorMessageDataTestId}
                    style={{ ...validationMessageStyle }}
                  >
                    {errors[input.name]}
                  </span>
                )}
              </div>
            );
          })}
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
          >
            {props.removeBtn}{" "}
            {props.showStepButtons && (
              <Button
                sx={{
                  background: uiGreen,
                  textTransform: "none",
                }}
                variant="contained"
                onClick={() => {
                  const { isValid, newErrors } = validateForm(
                    formData,
                    formInputs
                  );
                  if (isValid) {
                    props.addEmploymentInfoNode();
                  } else {
                    setErrors(newErrors);
                  }
                }}
              >
                Add
              </Button>
            )}
          </Stack>
        </div>
      </div>
      {props.index == props.employmentHistory.length - 1 && (
        <Stack
          direction="row"
          gap={2}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <UIButton
            btnText="Back"
            onClick={props.previousStep}
            type="button"
            style={{ width: "100%" }}
          />
          <UIButton
            style={{ width: "100%" }}
            btnText="Next"
            onClick={() => {
              const { isValid, newErrors } = validateForm(formData, formInputs);
              if (isValid) {
                props.nextStep();
              } else {
                setErrors(newErrors);
              }
            }}
          />
        </Stack>
      )}
      {/* {props.showStepButtons && (
        <>
          <Stack sx={{ marginTop: "20px" }} direction="row" gap={2}>
            <UIButton
              style={{ width: "100%" }}
              btnText="Back"
              onClick={props.previousStep}
              type="button"
            />
            <UIButton
              style={{ width: "100%" }}
              btnText="Next"
              onClick={() => {
                props.trigger([
                  `supervisorEmail_${props.id}`,
                  `supervisorPhone_${props.id}`,
                  `supervisorName_${props.id}`,
                  `income_${props.id}`,
                  `employmentStartDate_${props.id}`,
                  `employmentEndDate_${props.id}`,
                  `companyAddress_${props.id}`,
                  `position_${props.id}`,
                  `companyName_${props.id}`,
                ]);
                if (
                  props.supervisorEmailErrors ||
                  props.supervisorPhoneErrors ||
                  props.supervisorNameErrors ||
                  props.incomeErrors ||
                  props.employmentStartDateErrors ||
                  props.employmentEndDateErrors ||
                  props.companyAddressErrors ||
                  props.positionErrors ||
                  props.companyNameErrors
                ) {
                  props.setIsValid(false);
                } else {
                  props.setIsValid(true);
                  if (props.isValid) {
                    props.nextStep();
                  }
                }
              }}
              type="button"
            />
          </Stack>
        </>
      )} */}
    </div>
  );
};

export default EmploymentHistorySection;
