import React, { useState } from "react";
import { faker } from "@faker-js/faker";
import { uiGreen, validationMessageStyle } from "../../../constants";
import { Button, Checkbox, Stack } from "@mui/material";
import UIButton from "../../Dashboard/UIComponents/UIButton";
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

  return (
    <div>
      <div className="card mb-3">
        <div className="row card-body">
          <div className="col-md-6 mb-4">
            <label className="mb-2 text-black">Company Name</label>
            <input
              {...props.register(`companyName_${props.id}`, {
                required: "This is a required field",
              })}
              className="form-control"
              defaultValue={companyName}
              onChange={props.onPositionChange}
              sx={{ color: "white", width: "100%" }}
              placeholder="Company Name"
            />
            <span style={validationMessageStyle}>
              {props.companyNameErrors && props.companyNameErrors.message}
            </span>
          </div>
          <div className="col-md-6 mb-4">
            <label className="mb-2 text-black">Title/Position</label>
            <input
              {...props.register(`position_${props.id}`, {
                required: "This is a required field",
              })}
              className="form-control"
              defaultValue={position}
              onChange={props.onPositionChange}
              sx={{ color: "white", width: "100%" }}
              placeholder="Title/Position"
            />
            <span style={validationMessageStyle}>
              {props.positionErrors && props.positionErrors.message}
            </span>
          </div>
          <div className="col-md-12 mb-4">
            <label className="mb-2 text-black">Company Address</label>
            <input
              {...props.register(`companyAddress_${props.id}`, {
                required: "This is a required field",
              })}
              className="form-control"
              defaultValue={companyAddress}
              onChange={props.onPositionChange}
              sx={{ color: "white", width: "100%" }}
              placeholder="Company Address"
            />
            <span style={validationMessageStyle}>
              {props.companyAddressErrors && props.companyAddressErrors.message}
            </span>
          </div>
          <div className="col-md-6 mb-4">
            <label className="mb-2 text-black">Start Date</label>
            <input
              {...props.register(`employmentStartDate_${props.id}`, {
                required: "This is a required field",
                pattern: {
                  value: /\d{4}-\d{2}-\d{2}/,
                  message: "Please enter a valid date",
                },
              })}
              type="date"
              className="form-control"
              defaultValue={employmentStartDate}
              onChange={props.onPositionChange}
              sx={{ color: "white", width: "100%" }}
              placeholder="Start Date"
            />
            <span style={validationMessageStyle}>
              {props.employmentStartDateErrors &&
                props.employmentStartDateErrors.message}
            </span>
          </div>
          <div className="col-md-6 mb-4">
            <label className="mb-2 text-black">End Date</label>
            <input
              {...props.register(`employmentEndDate_${props.id}`, {
                required: "This is a required field",
                pattern: {
                  value: /\d{4}-\d{2}-\d{2}/,
                  message: "Please enter a valid date",
                },
                validate: (value) => {
                  if (
                    props.watch(`employmentStartDate_${props.id}`) > value ||
                    value === "" ||
                    value === props.watch(`employmentStartDate_${props.id}`)
                  ) {
                    return "End date must be after start date";
                  }
                },
              })}
              type="date"
              className="form-control"
              defaultValue={employmentEndDate}
              onChange={props.onPositionChange}
              sx={{ color: "white", width: "100%" }}
              placeholder="End Date"
            />
            <span className="text-black" ><Checkbox /> Current Employer</span> 
            <span style={validationMessageStyle}>
              {props.employmentEndDateErrors &&
                props.employmentEndDateErrors.message}
            </span>
          </div>
          <div className="col-md-12 mb-4">
            <label className="mb-2 text-black">Income</label>
            <input
              {...props.register(`income_${props.id}`, {
                required: "This is a required field",
                //Create a pattern that only allows numbers and decimals
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Please enter a number",
                },
              })}
              className="form-control"
              defaultValue={income}
              onChange={props.onPositionChange}
              sx={{ color: "white", width: "100%" }}
              placeholder="Income"
            />
            <span style={validationMessageStyle}>
              {props.incomeErrors && props.incomeErrors.message}
            </span>
          </div>

          <div className="col-md-12 mb-4">
            <label className="mb-2 text-black">Supervisor Name</label>
            <input
              {...props.register(`supervisorName_${props.id}`, {
                required: "This is a required field",
              })}
              className="form-control"
              defaultValue={supervisorName}
              onChange={props.onPositionChange}
              sx={{ color: "white", width: "100%" }}
              placeholder="Supervisor Name"
            />
            <span style={validationMessageStyle}>
              {props.supervisorNameErrors && props.supervisorNameErrors.message}
            </span>
          </div>
          <div className="col-md-6 mb-4">
            <label className="mb-2 text-black">Supervisor Phone</label>
            <input
              {...props.register(`supervisorPhone_${props.id}`, {
                required: "This is a required field",
                pattern: {
                  value: /\d{3}-\d{3}-\d{4}/,
                  message: "Please enter a valid phone number",
                },
              })}
              className="form-control"
              defaultValue={supervisorPhone}
              onChange={props.onPositionChange}
              sx={{ color: "white", width: "100%" }}
              placeholder="Supervisor Phone"
            />
            <span style={validationMessageStyle}>
              {props.supervisorPhoneErrors &&
                props.supervisorPhoneErrors.message}
            </span>
          </div>
          <div className="col-md-6 mb-4">
            <label className="mb-2 text-black">Supervisor Email</label>
            <input
              {...props.register(`supervisorEmail_${props.id}`, {
                required: "This is a required field",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please enter a valid email address",
                },
              })}
              className="form-control"
              defaultValue={supervisorEmail}
              onChange={props.onPositionChange}
              sx={{ color: "white", width: "100%" }}
              placeholder="Supervisor Email"
            />
            <span style={validationMessageStyle}>
              {props.supervisorEmailErrors &&
                props.supervisorEmailErrors.message}
            </span>
          </div>
          <Stack direction="row" gap={2}>
            {props.removeBtn}{" "}
            {props.showStepButtons && (
              <Button
                sx={{
                  background: uiGreen,
                  textTransform: "none",
                }}
                variant="contained"
                onClick={props.addEmploymentInfoNode}
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
      )}
    </div>
  );
};

export default EmploymentHistorySection;
