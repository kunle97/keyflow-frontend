import React, { useState } from "react";
import StepControl from "./StepControl";
import UIButton from "../../../../UIComponents/UIButton";
import { uiRed, validationMessageStyle } from "../../../../../../constants";

const AddAdditionalCharges = (props) => {
  const [chargesValid, setChargesValid] = useState(false);
  const addCharge = () => {
    props.setAddtionalCharges([
      ...props.addtionalCharges,
      {
        name: "",
        amount: "",
        frequency: "monthly",
      },
    ]);
  };
  const removeCharge = (index) => {
    if (props.addtionalCharges.length === 1) return;
    let newCharges = [...props.addtionalCharges];
    newCharges.splice(index, 1);
    props.setAddtionalCharges(newCharges);
  };

  return (
    <div style={{ ...props.style }}>
      {props.addtionalCharges.map((charge, index) => (
        <div key={index} className="row mt-3">
          <div className="col-md-3">
            <label className="form-label text-white" htmlFor="street">
              <strong>Charge</strong>
            </label>
            <input
              {...props.register(`additionalChargeName_${index}`, {
                required: {
                  value: true,
                  message: "Charge name is required",
                },
              })}
              type="text"
              value={charge.name}
              onChange={(e) => {
                props.trigger(`additionalChargeName_${index}`);
                let newCharges = [...props.addtionalCharges];
                newCharges[index].name = e.target.value;
                props.setAddtionalCharges(newCharges);
              }}
              className="form-control"
            />
            <span style={validationMessageStyle}>
              {props.errors[`additionalChargeName_${index}`] &&
                props.errors[`additionalChargeName_${index}`]?.message}
            </span>
          </div>
          <div className="col-md-3">
            <label className="form-label text-white" htmlFor="street">
              <strong>Amount</strong>
            </label>
            <input
              {...props.register(`additionalChargeAmount_${index}`, {
                required: {
                  value: true,
                  message: "Charge amount is required",
                },
              })}
              type="number"
              value={charge.amount}
              onChange={(e) => {
                props.trigger(`additionalChargeAmount_${index}`);
                let newCharges = [...props.addtionalCharges];
                newCharges[index].amount = e.target.value;
                props.setAddtionalCharges(newCharges);
              }}
              className="form-control"
            />
            <span style={validationMessageStyle}>
              {props.errors[`additionalChargeAmount_${index}`] &&
                props.errors[`additionalChargeAmount_${index}`]?.message}
            </span>
          </div>
          <div className="col-md-3">
            <label className="form-label text-white" htmlFor="street">
              <strong>Frequency</strong>
            </label>
            <select
              {...props.register(`additionalChargeFrequency_${index}`, {
                required: {
                  value: true,
                  message: "Charge frequency is required",
                },
              })}
              onChange={(e) => {
                props.trigger(`additionalChargeFrequency_${index}`);
                let newCharges = [...props.addtionalCharges];
                newCharges[index].frequency = e.target.value;
                props.setAddtionalCharges(newCharges);
              }}
              className="form-control"
            >
              <option value="">Select Frequency</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <span style={validationMessageStyle}>
              {props.errors[`additionalChargeFrequency_${index}`] &&
                props.errors[`additionalChargeFrequency_${index}`]?.message}
            </span>
          </div>
          {charge.index !== 0 && (
            <div className="col-md-3">
              <UIButton
                onClick={() => removeCharge(index)}
                btnText="Remove"
                variant="text"
                style={{
                  marginTop: "30px",
                  color: uiRed,
                  backgroundColor: "transparent",
                  display: "block",
                }}
              />
            </div>
          )}
        </div>
      ))}
      <UIButton
        onClick={() => {
          //TODO: Trigger validation
          props.trigger([
            `additionalChargeName_${props.addtionalCharges.length - 1}`,
            `additionalChargeAmount_${props.addtionalCharges.length - 1}`,
            `additionalChargeFrequency_${props.addtionalCharges.length - 1}`,
          ]);
          if (
            (props.errors[
              `additionalChargeName_${props.addtionalCharges.length - 1}`
            ] ||
              props.errors[
                `additionalChargeAmount_${props.addtionalCharges.length - 1}`
              ] ||
              props.errors[
                `additionalChargeFrequency_${props.addtionalCharges.length - 1}`
              ]) &&
            !chargesValid
          ) {
            setChargesValid(false);
            return;
          } else {
            addCharge();
          }
        }}
        btnText="Add Charge"
        color="secondary"
        style={{ marginTop: "20px" }}
      />

      <StepControl
        skipAllowed={true}
        style={{ marginTop: "30px" }}
        step={props.step}
        steps={props.steps}
        handlePreviousStep={props.handlePreviousStep}
        handleNextStep={() => {
          //TODO: Trigger validation


          props.trigger([
            `additionalChargeName_${props.addtionalCharges.length - 1}`,
            `additionalChargeAmount_${props.addtionalCharges.length - 1}`,
            `additionalChargeFrequency_${props.addtionalCharges.length - 1}`,
          ]);

          if (
            props.errors.length > 0 ||
            props.errors[`additionalChargeName_${props.addtionalCharges.length - 1}`] ||
            props.errors[`additionalChargeAmount_${props.addtionalCharges.length - 1}`] ||
            props.errors[`additionalChargeFrequency_${props.addtionalCharges.length - 1}`]
          ) {
            setChargesValid(false);
            return;
          } else {
            setChargesValid(true);
            //Remove this step from skipped steps
            let newSkippedSteps = [...props.skippedSteps];
            newSkippedSteps.splice(newSkippedSteps.indexOf(props.step), 1);
            props.setSkippedSteps(newSkippedSteps);
            props.handleNextStep();
          }
        }}
        handleSkipStep={() => {
          props.setSkippedSteps([...props.skippedSteps, props.step]);
          props.handleNextStep();
        }}
      />
    </div>
  );
};

export default AddAdditionalCharges;