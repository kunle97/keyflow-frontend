import Checkbox from "@mui/material/Checkbox";
import React, { useState } from "react";
import { uiGreen, validationMessageStyle } from "../../../constants";
import UIButton from "../../Dashboard/UIComponents/UIButton";
import { Button, Stack } from "@mui/material";
import {
  triggerValidation,
  validateForm,
} from "../../../helpers/formValidation";
import { uppercaseAndLowercaseLetters, validAnyString, validEmail, validPhoneNumber } from "../../../constants/rexgex";

const RentalHistorySection = (props) => {
  const {
    address,
    residenceStartDate,
    residenceEndDate,
    ownerName,
    ownerPhone,
    ownerEmail,
  } = props.residence;
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    address: address,
    residenceStartDate: residenceStartDate,
    residenceEndDate: residenceEndDate,
    ownerName: ownerName,
    ownerPhone: ownerPhone,
    ownerEmail: ownerEmail,
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
    //Find the residence history node that is being edited by matching the index of the node with the index from the props.index
    const residenceHistoryNode = props.residenceHistory.find(
      (node, index) => index === props.index
    );
    //UPdate the residence history node with the new data
    props.setResidenceHistory([
      ...props.residenceHistory.slice(0, props.index),
      { ...residenceHistoryNode, [name]: value },
      ...props.residenceHistory.slice(props.index + 1),
    ]);
    console.log("Form data ", formData);
    console.log("Errors ", errors);
  };

  const formInputs = [
    {
      name: "address",
      label: "Full Address (Street, City, State, Zip)",
      type: "text",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "123 Durmot Lane, Apt 2, New York, NY 10001",
      validations: {
        required: true,
        errorMessage: "This is a required field",
        regex: validAnyString,
      },
      dataTestId: "address",
      errorMessageDataTestId: "address-error",
    },
    {
      name: "residenceStartDate",
      label: "Start Date",
      type: "date",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        errorMessage: "This is a required field",
      },
      dataTestId: "residenceStartDate",
      errorMessageDataTestId: "residenceStartDate-error",
    },
    {
      name: "residenceEndDate",
      label: "End Date",
      type: "date",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        errorMessage: "This is a required field",
      },
      dataTestId: "residenceEndDate",
      errorMessageDataTestId: "residenceEndDate-error",
    },
    {
      name: "ownerName",
      label: "Owner Name",
      type: "text",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "John Doe",
      validations: {
        required: true,
        errorMessage: "This is a required field",
        regex: uppercaseAndLowercaseLetters,
      },
      dataTestId: "ownerName",
      errorMessageDataTestId: "ownerName-error",
    },
    {
      name: "ownerPhone",
      label: "Owner Phone",
      type: "text",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "123-456-7890",
      validations: {
        required: true,
        errorMessage: "This is a required field",
        regex: validPhoneNumber,
      },
      dataTestId: "ownerPhone",
      errorMessageDataTestId: "ownerPhone-error",
    },
    {
      name: "ownerEmail",
      label: "Owner Email",
      type: "email",
      colSpan: 6,
      onChange: (e) => handleChange(e),
      placeholder: "johndoe@email.com",
      validations: {
        required: true,
        errorMessage: "This is a required field",
        regex: validEmail,
      },
      dataTestId: "ownerEmail",
      errorMessageDataTestId: "ownerEmail-error",
    },
  ];
  return (
    <>
      <div className="card mb-3">
        <div className="row card-body">
          {formInputs.map((input, index) => {
            return (
              <div className={`col-md-${input.colSpan} mb-4`} key={index}>
                <label className="mb-2 text-black">{input.label}</label>
                <input
                  type={input.type}
                  className="form-control"
                  name={input.name}
                  defaultValue={formData[input.name]}
                  onChange={input.onChange}
                  sx={{ color: "white", width: "100%" }}
                  placeholder={input.placeholder}
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
          <Stack direction="row" gap={2}>
            {props.removeBtn}
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
                    props.addRentalHistoryNode();
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
      {props.showStepButtons && (
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
                const { isValid, newErrors } = validateForm(
                  formData,
                  formInputs
                );
                if (isValid) {
                  props.nextStep();
                } else {
                  setErrors(newErrors);
                }
              }}
              type="button"
            />
          </Stack>
        </>
      )}
    </>
  );
};

export default RentalHistorySection;
