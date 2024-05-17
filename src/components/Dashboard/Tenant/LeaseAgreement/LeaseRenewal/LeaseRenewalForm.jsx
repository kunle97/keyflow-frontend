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
import {
  triggerValidation,
  validateForm,
} from "../../../../../helpers/formValidation";

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
  const [currentLeaseTerms, setCurrentLeaseTerms] = useState(null); //This is the lease terms that the tenant is currently renting
  const [selectedLeaseTerm, setSelectedLeaseTerm] = useState(null); //This is the lease term that the tenant has selected to renew their lease to
  const [selectedRentFrequency, setSelectedRentFrequency] = useState(null); //This is the rent frequency that the tenant has selected to renew their lease to
  const [units, setUnits] = useState([]);
  const [isSameUnit, setIsSameUnit] = useState(true); //This is true if the tenant is renewing their lease to the same unit that they are currently renting
  const [isSameLeaseTerm, setIsSameLeaseTerm] = useState(true); //This is true if the tenant is renewing their lease to the same lease term that they are currently renting
  const [errors, setErrors] = useState({});
  const [step0FormData, setStep0FormData] = useState({
    moveInDate: "",
  });
  const [step1FormData, setStep1FormData] = useState({
    leaseTerm: "",
    rentFrequency: "",
  });

  const [step3FormData, setStep3FormData] = useState({
    comments: "",
  });

  const handleChange = (e, formData, setFormData, formInputs) => {
    const { name, value } = e.target;
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
    console.log("Form data ", formData);
    console.log("Errors ", errors);
  };
  const step0FormInputs = [
    {
      name: "moveInDate",
      label: "Desired Move In Date",
      type: "date",
      onChange: (e) =>
        handleChange(e, step0FormData, setStep0FormData, step0FormInputs),
      validations: {
        required: true,
        regex: /^\d{4}-\d{2}-\d{2}$/,
        errorMessage: "Please enter a valid move in date",
      },
      dataTestId: "move-in-date",
      errorMessageDataTestId: "move-in-date-error",
    },
  ];
  const step1FormInputs = [
    {
      name: "leaseTerm",
      label: "Lease Term",
      type: "number",
      onChange: (e) =>
        handleChange(e, step1FormData, setStep1FormData, step1FormInputs),
      validations: {
        required: true,
        regex: /^[0-9]*$/,
        errorMessage: "Please enter a valid lease term",
      },
      dataTestId: "lease-term",
      errorMessageDataTestId: "lease-term-error",
    },
    {
      name: "rentFrequency",
      label: "Rent Frequency",
      type: "select",
      options: [
        { value: "", label: "Select One" },
        { value: "day", label: "Day(s)" },
        { value: "week", label: "Week(s)" },
        { value: "month", label: "Month(s)" },
        { label: "year", label: "Year(s)" },
      ],
      onChange: (e) =>
        handleChange(e, step1FormData, setStep1FormData, step1FormInputs),
      validations: {
        required: true,
        regex: /^[a-zA-Z0-9\s]*$/,
        errorMessage: "Please select a rent frequency",
      },
      dataTestId: "rent-frequency",
      errorMessageDataTestId: "rent-frequency-error",
    },
  ];
  const step3FormInputs = [
    {
      name: "comments",
      label: "Comments",
      type: "textarea",
      onChange: (e) =>
        handleChange(e, step3FormData, setStep3FormData, step3FormInputs),
      validations: {
        required: true,
        regex: /^[a-zA-Z0-9\s]*$/,
        errorMessage: "Please enter a comment",
      },
      dataTestId: "comments",
      errorMessageDataTestId: "comments-error",
    },
  ];

  const unit_table_columns = [
    { name: "name", label: "Unit Name" },
    { name: "beds", label: "Beds" },
    { name: "baths", label: "Baths" },
    { name: "size", label: "Size" },
  ];

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

  const onSubmit = () => {
    const payload = {
      move_in_date: step0FormData.moveInDate,
      lease_term:
        leaseMode === "current_lease"
          ? JSON.parse(props.leaseAgreement.rental_unit.lease_terms).find(
              (term) => term.name === "term"
            ).value
          : step1FormData.leaseTerm,
      rent_frequency:
        leaseMode === "current_lease"
          ? JSON.parse(props.leaseAgreement.rental_unit.lease_terms).find(
              (term) => term.name === "rent_frequency"
            ).value
          : step1FormData.rent_frequency,
      comments: step3FormData.comments,
      tenant: authUser.id,
      owner: props.leaseAgreement.owner.id,
      rental_unit:
        unitMode === "current_unit"
          ? props.leaseAgreement.rental_unit.id
          : selectedUnit,
      rental_property: props.leaseAgreement.rental_unit.rental_property,
    };
    console.log(payload);
    //Check that move in date comes after the lease end date
    let leaseEndDate = new Date(props.leaseAgreement.end_date);
    let moveInDate = new Date(step0FormData.moveInDate);
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
          "Your lease renewal request has been submitted successfully. You will be notified once your owner has responded to your request."
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
    }).catch((error) => {
      console.error("Error creating lease renewal request:", error);
      props.setShowLeaseRenewalDialog(false);
      props.setAlertModalTitle("Lease Renewal Request Error");
      props.setAlertModalMessage(
        "Your lease renewal request has failed to submit. Please try again later."
      );
      props.setShowAlertModal(true);
    });
  };

  useEffect(() => {
    console.log("Lease agreement prop", props.leaseAgreement);
    setCurrentLeaseTerms(
      JSON.parse(props.leaseAgreement.rental_unit.lease_terms)
    );
    //Find only units that have the is_occopied property set to false
    let unoccupied_units = props.leaseAgreement.rental_property.units.filter(
      (unit) => unit.is_occupied === false
    );
    setUnits(unoccupied_units);
  }, []);

  return (
    <div>
      <UIStepper steps={steps} step={step} />
      <form style={{ margin: "20px 0", width: "100%" }}>
        <div style={{ margin: "15px 0" }}>
          {step === 0 && (
            <div className="row">
              {step0FormInputs.map((input, index) => {
                return (
                  <div className={`col-md-12`} key={index}>
                    <label
                      className="form-label text-black"
                      htmlFor={input.name}
                      data-testId={`${input.dataTestId}-label`}
                    >
                      <strong>{input.label}</strong>
                    </label>
                    <input
                      name={input.name}
                      data-testId={`${input.dataTestId}-input`}
                      className="form-control"
                      type={input.type}
                      onChange={input.onChange}
                      onBlur={input.onChange}
                      placeholder={input.placeholder}
                    />
                    {errors[input.name] && (
                      <span
                        data-testId={input.errorMessageDataTestId}
                        style={{ ...validationMessageStyle }}
                      >
                        {errors[input.name]}
                      </span>
                    )}{" "}
                    <Stack
                      direction="row"
                      alignItems={"center"}
                      justifyContent={"flex-end"}
                    >
                      <UIButton
                        style={{ marginTop: "20px" }}
                        btnText="Next"
                        onClick={() => {
                          const { isValid, newErrors } = validateForm(
                            step0FormData,
                            step0FormInputs
                          );
                          if (isValid) {
                            handleNext();
                          } else {
                            setErrors(newErrors);
                          }
                        }}
                      />
                    </Stack>
                  </div>
                );
              })}
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
                    {" "}
                    {step1FormInputs.map((input, index) => {
                      return (
                        <div className={`form-group mb-3`} key={index}>
                          <label
                            className="form-label text-black"
                            htmlFor={input.name}
                            data-testId={`${input.dataTestId}-label`}
                          >
                            <strong>{input.label}</strong>
                          </label>
                          {input.type === "select" ? (
                            <select
                              className="form-control"
                              id={input.name}
                              name={input.name}
                              onChange={input.onChange}
                              onBlur={input.onChange}
                              data-testid={input.dataTestId}
                            >
                              {input.options.map((option, index) => {
                                return (
                                  <option key={index} value={option.value}>
                                    {option.label}
                                  </option>
                                );
                              })}
                            </select>
                          ) : (
                            <input
                              type={input.type}
                              className="form-control"
                              id={input.name}
                              name={input.name}
                              onChange={input.onChange}
                              onBlur={input.onChange}
                              data-testid={input.dataTestId}
                            />
                          )}
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
                  </>
                ) : (
                  <>
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <h5>Term</h5>
                        <p className="text-black">
                          {
                            currentLeaseTerms.find(
                              (term) => term.name === "term"
                            ).value
                          }{" "}
                          Months
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h5>Rent</h5>
                        <p className="text-black">
                          $
                          {
                            currentLeaseTerms.find(
                              (term) => term.name === "rent"
                            ).value
                          }
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h5>Late Fee</h5>
                        <p className="text-black">
                          $
                          {
                            currentLeaseTerms.find(
                              (term) => term.name === "late_fee"
                            ).value
                          }
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h5>Security Deposit</h5>
                        <p className="text-black">
                          $
                          {
                            currentLeaseTerms.find(
                              (term) => term.name === "security_deposit"
                            ).value
                          }
                        </p>
                      </div>
                    </div>

                    <input type="hidden" value={props.leaseAgreement} />
                  </>
                )}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                  sx={{ marginTop: "20px" }}
                >
                  <UIButton
                    btnText="Back"
                    onClick={handleBack}
                    sx={{ width: "100px" }}
                  />
                  <UIButton
                    btnText="Next"
                    onClick={() => {
                      if (leaseMode === "new_lease") {
                        const { isValid, newErrors } = validateForm(
                          step1FormData,
                          step1FormInputs
                        );
                        if (isValid) {
                          handleNext();
                        } else {
                          setErrors(newErrors);
                        }
                      } else {
                        handleNext();
                      }
                    }}
                    sx={{ width: "100px" }}
                  />
                </Stack>
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
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                    sx={{ marginTop: "20px" }}
                  >
                    <UIButton
                      btnText="Back"
                      onClick={handleBack}
                      sx={{ width: "100px" }}
                    />
                    <UIButton
                      btnText="Next"
                      onClick={handleNext}
                      sx={{ width: "100px" }}
                    />
                  </Stack>
                </div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="row">
              {step3FormInputs.map((input, index) => {
                return (
                  <div className={`form-group`} key={index}>
                    <label
                      className="form-label text-black"
                      htmlFor={input.name}
                      data-testId={`${input.dataTestId}-label`}
                    >
                      <strong>{input.label}</strong>
                    </label>
                    {input.type === "select" ? (
                      <select
                        className="form-control"
                        id={input.name}
                        name={input.name}
                        onChange={input.onChange}
                        onBlur={input.onChange}
                        data-testid={input.dataTestId}
                      >
                        {input.options.map((option, index) => {
                          return (
                            <option key={index} value={option.value}>
                              {option.label}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <textarea
                        className="form-control"
                        id={input.name}
                        name={input.name}
                        onChange={input.onChange}
                        onBlur={input.onChange}
                        data-testid={input.dataTestId}
                        rows="5"
                      ></textarea>
                    )}
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
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                sx={{ marginTop: "20px" }}
              >
                <UIButton
                  btnText="Back"
                  onClick={handleBack}
                  sx={{ width: "100px" }}
                />
                <UIButton
                  btnText="Next"
                  onClick={() => {
                    const { isValid, newErrors } = validateForm(
                      step3FormData,
                      step3FormInputs
                    );
                    if (isValid) {
                      handleNext();
                    } else {
                      setErrors(newErrors);
                    }
                  }}
                  sx={{ width: "100px" }}
                />
              </Stack>
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
              <p
                className="text-black"
                style={{ textAlign: "center", marginBottom: "30px" }}
              >
                Are you sure you want to submit this lease renewal request? You
                will not be able to edit this request once it has been
                submitted. Below is a summary of your lease renewal request.
                Please review before submitting.
              </p>
              {/* <div
                className="row"
                style={{
                  maxWidth: "550px",
                }}
              >
                <div className="col-12 col-sm-6 col-md-4">
                  <h5>Lease Term</h5>
                  <p className="text-black">
                    {leaseMode === "current_lease"
                      ? currentLeaseTerms.find((term) => term.name === "term")
                          .value
                      : step1FormData.leaseTerm}
                  </p>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                  <h5>Unit</h5>
                  <p className="text-black">
                    {unitMode === "current_unit"
                      ? props.leaseAgreement.rental_unit.name
                      : units.find((unit) => unit.id === selectedUnit)?.name}
                  </p>
                </div>{" "}
                <div className="col-12 col-sm-6 col-md-4">
                  <h5>Desired Move In Date</h5>
                  <p className="text-black">{step0FormData.moveInDate}</p>
                </div>
                <div className="col-12 col-sm-12 col-md-12">
                  <h5>Comments</h5>
                  <div style={{ width: "100%" }}>
                    <p
                      className="text-black"
                      style={{ width: "524px", overflowWrap: "break-word" }}
                    >
                      {step3FormData.comments}
                    </p>
                  </div>
                </div>
              </div> */}
            </Stack>
          )}
        </div>
        <div className="d-flex justify-content-between mt-4">
          {step === steps.length - 1 && (
            <>
              <UIButton
                btnText="Back"
                onClick={handleBack}
                sx={{ width: "100px" }}
              />
              <UIButton
                btnText="Submit"
                onClick={() => {
                  //Validate all formData and form input opbjects using validateForm
                  const { isValid, newErrors } = validateForm(
                    step3FormData,
                    step3FormInputs
                  );
                  if (isValid) {
                    onSubmit();
                  } else {
                    setErrors(newErrors);
                  }
                }}
                sx={{ width: "100px" }}
              />
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default LeaseRenewalForm;
