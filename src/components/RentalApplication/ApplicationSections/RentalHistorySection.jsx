import Checkbox from "@mui/material/Checkbox";
import React from "react";
import { uiGreen, validationMessageStyle } from "../../../constants";
import UIButton from "../../Dashboard/UIComponents/UIButton";
import { Button, Stack } from "@mui/material";

const RentalHistorySection = (props) => {
  const {
    address,
    residenceStartDate,
    residenceEndDate,
    landlordName,
    landlordPhone,
    landlordEmail,
  } = props.residence;

  return (
    <>
      <div className="card mb-3">
        <div className="row card-body">
          <div className="col-md-12 mb-4">
            <label className="mb-2 text-black">
              Full Address (Street, City, State, Zip)
            </label>
            <input
              {...props.register(`address_${props.id}`, {
                required: "This is a required field",
              })}
              className="form-control"
              name="address"
              defaultValue={address}
              onChange={props.onResidenceChange}
              sx={{ color: "white", width: "100%" }}
              placeholder=" Address"
            />
            <span style={validationMessageStyle}>
              {props.addressErrors && props.addressErrors.message}
            </span>
          </div>
          <div className="col-md-6 mb-4">
            <label className="mb-2 text-black">Start Date</label>
            <input
              {...props.register(`residenceStartDate_${props.id}`, {
                required: "This is a required field",
              })}
              type="date"
              className="form-control"
              defaultValue={residenceStartDate}
              onChange={props.onResidenceChange}
              sx={{ color: "white", width: "100%" }}
              placeholder="Start Date"
            />
            <span style={validationMessageStyle}>
              {props.residenceStartDateErrors &&
                props.residenceStartDateErrors.message}
            </span>
          </div>
          <div className="col-md-6 mb-4">
            <label className="mb-2 text-black">End Date</label>
            <input
              {...props.register(`residenceEndDate_${props.id}`, {
                required: "This is a required field",
                validate: (value) => {
                  if (
                    props.watch(`residenceStartDate_${props.id}`) > value ||
                    value === "" ||
                    value === props.watch(`residenceStartDate_${props.id}`)
                  ) {
                    return "End date must be after start date";
                  }
                },
              })}
              type="date"
              className="form-control"
              name="endDate"
              defaultValue={residenceEndDate}
              onChange={props.onResidenceChange}
              sx={{ color: "white", width: "100%" }}
              placeholder="End Date"
            />
            <span className="text-black">
              <Checkbox /> Current Residence
            </span>
            <div style={validationMessageStyle}>
              {props.residenceEndDateErrors &&
                props.residenceEndDateErrors.message}
            </div>
          </div>
          <div className="col-md-12 mb-4">
            <label className="mb-2 text-black">Landlord Name</label>
            <input
              {...props.register(`landlordName_${props.id}`, {
                required: "This is a required field",
              })}
              className="form-control"
              name="landlordName"
              defaultValue={landlordName}
              onChange={props.onResidenceChange}
              sx={{ color: "white", width: "100%" }}
              placeholder="Company Name"
            />
            <span style={validationMessageStyle}>
              {props.landlordNameErrors && props.landlordNameErrors.message}
            </span>
          </div>
          <div className="col-md-6 mb-4">
            <label className="mb-2 text-black">Landlord Phone</label>
            <input
              {...props.register(`landlordPhone_${props.id}`, {
                required: "This is a required field",
                pattern: {
                  value: /\d{3}-\d{3}-\d{4}/,
                  message: "Please enter a valid phone number",
                },
              })}
              className="form-control"
              name="landlordPhone"
              defaultValue={landlordPhone}
              onChange={props.onResidenceChange}
              sx={{ color: "white", width: "100%" }}
              placeholder="Landlord Phone"
            />
            <span style={validationMessageStyle}>
              {props.landlordPhoneErrors && props.landlordPhoneErrors.message}
            </span>
          </div>
          <div className="col-md-6 mb-4">
            <label className="mb-2 text-black">Landlord Email</label>
            <input
              {...props.register(`landlordEmail_${props.id}`, {
                required: "This is a required field",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please enter a valid email address",
                },
              })}
              className="form-control"
              name="landlordEmail"
              defaultValue={landlordEmail}
              onChange={props.onResidenceChange}
              sx={{ color: "white", width: "100%" }}
              placeholder="Landlord Email"
            />
            <span style={validationMessageStyle}>
              {props.landlordEmailErrors && props.landlordEmailErrors.message}
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
                onClick={props.addRentalHistoryNode}
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
                  `address_${props.id}`,
                  `residenceStartDate_${props.id}`,
                  `residenceEndDate_${props.id}`,
                  `landlordName_${props.id}`,
                  `landlordPhone_${props.id}`,
                  `landlordEmail_${props.id}`,
                ]);
                if (
                  props.addressErrors ||
                  props.residenceStartDateErrors ||
                  props.residenceEndDateErrors ||
                  props.landlordNameErrors ||
                  props.landlordPhoneErrors ||
                  props.landlordEmailErrors
                ) {
                  props.setIsValid(false);
                } else {
                  props.setIsValid(true);
                }

                if (props.isValid) {
                  props.nextStep();
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
