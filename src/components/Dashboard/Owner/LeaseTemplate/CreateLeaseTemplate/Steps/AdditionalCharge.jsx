import React, { useState } from "react";
import StepControl from "./StepControl";
import UIButton from "../../../../UIComponents/UIButton";
import {
  uiGreen,
  uiRed,
  validationMessageStyle,
} from "../../../../../../constants";
import {
  hasNoErrors,
  triggerValidation,
  validateForm,
} from "../../../../../../helpers/formValidation";
import { Button, Stack } from "@mui/material";
import {
  numberUpTo2DecimalPlaces,
  validAnyString,
} from "../../../../../../constants/rexgex";
import AlertModal from "../../../../UIComponents/Modals/AlertModal";

const AdditionalCharge = (props) => {
  const { name, amount, frequency } = props.charge;

  const [formData, setFormData] = useState({
    name: name,
    amount: amount,
    frequency: frequency,
  });
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [errors, setErrors] = useState({});

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
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: newErrors[name],
    }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    props.setAdditionalCharges((prevCharges) => {
      let newCharges = [...prevCharges];
      newCharges[prevCharges.length - 1][name] = value;
      return newCharges;
    });
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
      <AlertModal
        open={alertOpen}
        title={alertTitle}
        message={alertMessage}
        handleClose={() => setAlertOpen(false)}
        onClick={() => setAlertOpen(false)}
      />
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
              {errors[input.name] && (
                <span
                  data-testId={input.errorMessageDataTestId}
                  style={{ ...validationMessageStyle }}
                >
                  {errors[input.name]}
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
            <Button
              className="add-unit-button"
              data-testId={`${props.dataTestId}-add-unit-button`}
              sx={{
                color: uiGreen,
                textTransform: "none",
              }}
              //   variant="contained"
              onClick={() => {
                const { isValid, newErrors } = validateForm(
                  formData,
                  formInputs
                );
                if (isValid && hasNoErrors(errors)) {
                  props.addAdditionalCharge();
                } else {
                  setErrors(newErrors);
                  props.setErrors(newErrors);
                }
              }}
            >
              + Add
            </Button>
            <>
              <div className="col-md-1">
                <Button
                  onClick={() => {
                    props.removeAdditionalCharge(props.index);
                    //Reset the errors:
                    props.setErrors({});
                    setErrors({});
                  }}
                  sx={{
                    color: uiRed,
                    textTransform: "none",
                  }}
                >
                  Remove
                </Button>
              </div>
            </>
          </Stack>
        </div>
      </div>
      {props.index === props.additionalCharges.length - 1 && (
        <>
          {!props.hideStepControl ? (
            <StepControl
              skipAllowed={true}
              style={{ marginTop: "30px" }}
              step={props.step}
              steps={props.steps}
              handlePreviousStep={props.handlePreviousStep}
              handleNextStep={() => {
                //Check all additional charges have the same frequency
                //Check if additional charges all have the same frequency
                const frequencies = props.additionalCharges.map(
                  (charge) => charge.frequency
                );
                const allFrequenciesEqual = frequencies.every(
                  (freq, index) => freq === frequencies[0]
                );
                if (!allFrequenciesEqual) {
                  // Handle case where frequencies are not all the same

                  // Perform actions or show an error message to the user
                  // You can return early, show an error message, or prevent form submission
                  setAlertMessage(
                    "All additional charges must have the same frequency"
                  );
                  setAlertTitle("Frequency Mismatch");
                  setAlertOpen(true);
                  return; // Example: return or show an error message
                }
                //Check if additional charges have the same frequency as the rent frequency
                // const rentFrequency = props.formData?.rent_frequency;//TODO: Fix this showing up as undefined
                // const chargesMatchRentFrequency = props.additionalCharges.every(
                //   (charge) => charge.frequency === rentFrequency
                // );
                // if (!chargesMatchRentFrequency) {

                //   // Handle case where frequencies don't match rent frequency
                //   setAlertMessage(
                //     "Additional charges must have the same frequency as the rent frequency"
                //   );
                //   setAlertTitle("Frequency Mismatch");
                //   setAlertOpen(true);
                //   return; // Example: return or show an error message
                // }
                props.setSkipAdditionalChargesStep(false);
                props.handleNextStep();
              }}
              formData={formData}
              formInputs={formInputs}
              handleSkipStep={() => {
                props.setSkipAdditionalChargesStep(true);
                if (props.skipAdditionalChargesStep === false) {
                  props.setSkipAdditionalChargesStep(true);
                } else {
                  props.handleNextStep();
                }
              }}
            />
          ) : (
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={2}
            >
              <UIButton
                btnText="Update Charges"
                onClick={() => {
                  const { isValid, newErrors } = validateForm(
                    formData,
                    formInputs
                  );
                  if (isValid && hasNoErrors(props.errors)) {
                    props.saveAdditionalCharges();
                  } else {
                    props.setErrors(newErrors);
                    setErrors(newErrors);
                  }
                }}
                style={{ marginTop: "20px", float: "right" }}
              />
            </Stack>
          )}
        </>
      )}
    </div>
  );
};

export default AdditionalCharge;
