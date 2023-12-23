import React, { useEffect } from "react";
import UIStepper from "../../../UIComponents/UIStepper";
import UIButton from "../../../UIComponents/UIButton";
import { useState } from "react";
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Stack,
} from "@mui/material";
import { set, useForm } from "react-hook-form";
import {
  authUser,
  defaultWhiteInputStyle,
  uiGreen,
  validationMessageStyle,
} from "../../../../../constants";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import { createLeaseCancellationRequest } from "../../../../../api/lease_cancellation_requests";
import UITableMini from "../../../UIComponents/UITable/UITableMini";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { create } from "@mui/material/styles/createTransitions";
import { createLeaseRenewalRequest } from "../../../../../api/lease_renewal_requests";
import { getProperty } from "../../../../../api/properties";
import { FormLabel, Radio } from "@mui/material";
import { getUnits } from "../../../../../api/units";
import UIRadioGroup from "../../../UIComponents/UIRadioGroup";

const LeaseRenewalForm = (props) => {
  const [step, setStep] = useState(0);
  const [steps, setSteps] = useState([
    "Desired Move In Date",
    "Lease Options",
    "Desired Unit",
    "Comments",
    "Submit",
  ]);
  const [unitMode, setUnitMode] = useState("current_unit"); //This is the unit that the tenant is currently renting
  const [selectedUnit, setSelectedUnit] = useState(null); //This is the unit that the tenant has selected to renew their lease to
  const [leaseMode, setLeaseMode] = useState("current_lease");
  const [selectedLeaseTerm, setSelectedLeaseTerm] = useState(null); //This is the lease term that the tenant has selected to renew their lease to
  const [units, setUnits] = useState([]);
  const [isSameUnit, setIsSameUnit] = useState(true); //This is true if the tenant is renewing their lease to the same unit that they are currently renting
  const [isSameLeaseTerm, setIsSameLeaseTerm] = useState(true); //This is true if the tenant is renewing their lease to the same lease term that they are currently renting
  const unit_table_columns = [
    { name: "name", label: "Unit Name" },
    { name: "beds", label: "Beds" },
    { name: "baths", label: "Baths" },
    { name: "size", label: "Size" },
  ];
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const handleNext = () => {
    setStep(step + 1);
  };
  const handleBack = () => {
    setStep(step - 1);
  };

  const handleChangeLeaseMode = (event) => {
    setLeaseMode(event.target.value); // Update selected unit
    setIsSameLeaseTerm(event.target.value === "current_lease");
  };

  const handleChangeUnitMode = (event) => {
    if (event.target.value === "current_unit") {
      setSelectedUnit(props.leaseAgreement.rental_unit.id);
    }
    setUnitMode(event.target.value);
  };

  const handleSelectUnit = (row) => {
    setSelectedUnit(row);
    setStep(step + 1);
  };
  const handleSelectLeaseTerm = (term) => {
    setSelectedLeaseTerm(term);
  };
  const options = {
    actionEnabled: true,
    actionText: "Select",
    actionCallback: handleSelectUnit,
    onRowClick: handleSelectUnit,
  };

  const onSubmit = (data) => {
    console.log(data);
    const payload = {
      move_in_date: data.moveInDate,
      lease_term:
        leaseMode === "current_lease"
          ? props.leaseAgreement.lease_template.term
          : data.leaseTerm,
      comments: data.comments,
      tenant: authUser.user_id,
      user: props.leaseAgreement.user.id,
      rental_unit:
        unitMode === "current_unit"
          ? props.leaseAgreement.rental_unit.id
          : selectedUnit,
      rental_property: props.leaseAgreement.rental_unit.rental_property,
      comments: data.comments,
    };
    console.log(payload);
    console.log(data);
    //Check that move in date comes after the lease end date
    let leaseEndDate = new Date(props.leaseAgreement.end_date);
    let moveInDate = new Date(data.moveInDate);
    if (moveInDate < leaseEndDate) {
      props.setShowLeaseRenewalDialog(false);
      props.setAlertModalTitle("Invalid Move In Date");
      props.setAlertModalMessage(
        "Your move in date must be after the end of your current lease."
      );
      props.setShowAlertModal(true);
      return;
    }

    createLeaseRenewalRequest(payload).then((res) => {
      console.log(res);

      if (res.status === 201) {
        props.setShowLeaseRenewalDialog(false);
        props.setAlertModalTitle("Lease Renewal Request Submitted");
        props.setAlertModalMessage(
          "Your lease renewal request has been submitted successfully. You will be notified once your landlord has responded to your request."
        );
        props.setShowAlertModal(true);
      } else {
        props.setShowLeaseRenewalDialog(false);
        props.setAlertModalTitle("Lease Renewal Request Error");
        props.setAlertModalMessage(
          res.response.data?.message
            ? res.response.data?.message
            : "Your lease renewal request has failed to submit. Please try again later."
        );
        props.setShowAlertModal(true);
      }
    });
  };

  useEffect(() => {
    console.log("Lease agreement prop", props.leaseAgreement);
    //Find only units that have the is_occopied property set to false
    let unoccupied_units = props.leaseAgreement.rental_property.units.filter(
      (unit) => unit.is_occupied === false
    );
    setUnits(unoccupied_units);
  }, []);

  return (
    <div>
      <UIStepper steps={steps} step={step} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ margin: "20px 0", width: "100%" }}
      >
        <div style={{ margin: "15px 0" }}>
          {step === 0 && (
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Desired Move In Date</label>
                  <input
                    type="date"
                    {...register("moveInDate", {
                      required: true,
                      validate: (value) => {
                        //Validation rule that the date must be at most 3 months after the leaseAgreement end date
                        let leaseEndDate = new Date(
                          props.leaseAgreement.end_date
                        );
                        let threeMonthsAfterEndDate = new Date(leaseEndDate);
                        threeMonthsAfterEndDate.setMonth(
                          threeMonthsAfterEndDate.getMonth() + 3
                        );
                        return (
                          value <=
                          threeMonthsAfterEndDate.toISOString().split("T")[0]
                        );
                      },
                    })}
                    style={defaultWhiteInputStyle}
                  />
                  {errors.moveInDate && (
                    <span style={validationMessageStyle}>
                      This field is required
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="row">
              <div className="col-md-12">
                <UIRadioGroup
                  formLabel=""
                  radioOptions={[
                    {
                      value: "current_lease",
                      label: "Current Lease Terms",
                    },
                    {
                      value: "new_lease",
                      label: "New Lease Terms",
                    },
                  ]}
                  value={leaseMode}
                  onChange={handleChangeLeaseMode}
                  direction="row"
                />
                {leaseMode === "new_lease" ? (
                  <>
                    <div className="form-group">
                      <label>Lease Term</label>
                      <select
                        style={defaultWhiteInputStyle}
                        {...register("leaseTerm", { required: true })}
                        onChange={(e) => {
                          setSelectedLeaseTerm(e.target.value);
                        }}
                      >
                        <option value="">Select</option>
                        <option value="6">6 Months</option>
                        <option value="12">12 Months</option>
                        <option value="18">18 Months</option>
                        <option value="24">24 Months</option>
                        <option value="36">36 Months</option>
                        <option value="48">48 Months</option>
                      </select>
                      {errors.leaseTerm && (
                        <span style={validationMessageStyle}>
                          This field is required
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <h5>Term</h5>
                        <p>{props.leaseAgreement.lease_template.term} Months</p>
                      </div>
                      <div className="col-md-6">
                        <h5>Rent</h5>
                        <p>${props.leaseAgreement.lease_template.rent}</p>
                      </div>
                      <div className="col-md-6">
                        <h5>Late Fee</h5>
                        <p>${props.leaseAgreement.lease_template.late_fee}</p>
                      </div>
                      <div className="col-md-6">
                        <h5>Security Deposit</h5>
                        <p>
                          $
                          {props.leaseAgreement.lease_template.security_deposit}
                        </p>
                      </div>
                    </div>

                    <input
                      type="hidden"
                      {...register("leaseTerm", { required: true })}
                      value={props.leaseAgreement}
                    />
                  </>
                )}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <UIRadioGroup
                    formLabel="Select Unit"
                    radioOptions={[
                      {
                        value: "current_unit",
                        label: "Current Unit",
                      },
                      {
                        value: "new_unit",
                        label: "New Unit",
                      },
                    ]}
                    value={unitMode}
                    onChange={handleChangeUnitMode}
                    direction="row"
                  />
                  {unitMode === "new_unit" && (
                    <UITableMini
                      data={units}
                      columns={unit_table_columns}
                      options={options}
                      showViewButton={true}
                      viewButtonText="Select"
                    />
                  )}

                  {errors.unitSelect && (
                    <span style={validationMessageStyle}>
                      This field is required
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Comments</label>
                  <textarea
                    style={defaultWhiteInputStyle}
                    {...register("comments", { required: true })}
                  ></textarea>
                  {errors.comments && (
                    <span style={validationMessageStyle}>
                      This field is required
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          {step === 4 && (
            <Stack
              direction="column"
              alignItems={"center"}
              alignContent={"center"}
              justifyContent={"center"}
              spacing={2}
              sx={{ width: "100%", overflow: "auto" }}
            >
              <FileCopyIcon
                sx={{
                  fontSize: "50px",
                  color: uiGreen,
                }}
              />
              <h5>Submit Lease Renewal Request?</h5>
              <p style={{ textAlign: "center", marginBottom: "30px" }}>
                Are you sure you want to submit this lease renewal request? You
                will not be able to edit this request once it has been
                submitted. Below is a summary of your lease renewal request.
                Please review before submitting.
              </p>
              <div className="row">
                <div className="col-md-4">
                  <h5>Lease Term</h5>
                  <p>{watch("leaseTerm")} Months</p>
                </div>
                <div className="col-md-4">
                  <h5>Unit</h5>
                  <p>
                    {unitMode === "current_unit"
                      ? props.leaseAgreement.rental_unit.name
                      : units.find((unit) => unit.id === selectedUnit)?.name}
                  </p>
                </div>{" "}
                <div className="col-md-4">
                  <h5>Desired Move In Date</h5>
                  <p>{new Date(watch("moveInDate")).toLocaleDateString()}</p>
                </div>
                <div className="col-md-12">
                  <h5>Comments</h5>
                  <div style={{ width: "100%" }}>
                    <p style={{ width: "524px", overflowWrap: "break-word" }}>
                      {watch("comments")}
                    </p>
                  </div>
                </div>
              </div>
            </Stack>
          )}
        </div>
        <div className="d-flex justify-content-between mt-4">
          {step !== 0 && (
            <UIButton
              btnText="Back"
              onClick={handleBack}
              disabled={step === 0}
              sx={{ width: "100px" }}
            />
          )}
          <div></div>
          {step !== steps.length - 1 && (
            <UIButton
              btnText="Next"
              onClick={handleNext}
              disabled={step === steps.length - 1}
              sx={{ width: "100px" }}
            />
          )}
          {step === steps.length - 1 && (
            <UIButton
              btnText="Submit"
              onClick={handleSubmit(onSubmit)}
              sx={{ width: "100px" }}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default LeaseRenewalForm;
