import React, { useEffect } from "react";
import UIStepper from "../../../UIComponents/UIStepper";
import UIButton from "../../../UIComponents/UIButton";
import { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ButtonBase,
  IconButton,
  Stack,
} from "@mui/material";
import {
  authUser,
  uiGreen,
  uiGrey2,
  validationMessageStyle,
} from "../../../../../constants";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { createLeaseRenewalRequest } from "../../../../../api/lease_renewal_requests";
import UIRadioGroup from "../../../UIComponents/UIRadioGroup";
import {
  triggerValidation,
  validateForm,
} from "../../../../../helpers/formValidation";
import ProgressModal from "../../../UIComponents/Modals/ProgressModal";
import { useNavigate } from "react-router";
import {
  lettersNumbersAndSpecialCharacters,
  validAnyString,
  validHTMLDateInput,
  validWholeNumber,
} from "../../../../../constants/rexgex";
import { authenticatedInstance } from "../../../../../api/api";
import UIInput from "../../../UIComponents/UIInput";
const LeaseRenewalForm = (props) => {
  const [step, setStep] = useState(0);
  const [steps, setSteps] = useState([
    "Desired Move In Date",
    "Lease Options",
    "Desired Unit",
    "Comments",
    "Submit",
  ]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [unitMode, setUnitMode] = useState(
    props.leaseAgreement ? "current_unit" : "new_unit"
  ); //This is the unit that the tenant is currently renting
  const [selectedUnit, setSelectedUnit] = useState(null); //This is the unit that the tenant has selected to renew their lease to
  const [leaseMode, setLeaseMode] = useState(
    props.leaseAgreement ? "current_lease" : "new_lease"
  );
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
  //Rental unit state variables
  const [rentalUnitModalOpen, setRentalUnitModalOpen] = useState(false);
  const [rentalUnitSearchQuery, setRentalUnitSearchQuery] = useState("");
  const [rentalUnitEndpoint, setRentalUnitEndpoint] = useState(
    "/units/?is_occupied=False"
  );
  const [showOccupiedUnitsOnly, setShowOccupiedUnitsOnly] = useState(true);
  const [rentalUnitNextPage, setRentalUnitNextPage] = useState("");
  const [rentalUnitPreviousPage, setRentalUnitPreviousPage] = useState("");

  const handleChange = (e, formData, setFormData, formInputs) => {
    const { name, value } = e.target;
    console.log("Name:", name, " - Value:", value);
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
        validHTMLDateInput,
        errorMessage: "Please enter a valid move in date",
      },
      dataTestId: "move-in-date-input",
      errorMessageDataTestId: "move-in-date-input-error",
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
        regex: validWholeNumber,
        errorMessage: "Please enter a valid lease term",
      },
      dataTestId: "lease-term-input",
      errorMessageDataTestId: "lease-term-input-error",
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
        regex: validAnyString,
        errorMessage: "Please select a rent frequency",
      },
      dataTestId: "rent-frequency-select",
      errorMessageDataTestId: "rent-frequency-select-error",
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
        required: false,
        // required: true,
        regex: lettersNumbersAndSpecialCharacters,
        errorMessage: "Please enter a comment",
      },
      dataTestId: "comments-textarea",
      errorMessageDataTestId: "comments-textarea-error",
    },
  ];

  const unit_table_columns = [
    { name: "name", label: "Unit Name" },
    { name: "beds", label: "Beds" },
    { name: "baths", label: "Baths" },
    { name: "size", label: "Size" },
  ];

  const handleNext = () => {
    //If props.isOwnerMode is true, then we skip the comments step
    if (step === 2 && props.isOwnerMode) {
      setStep(step + 2);
    } else {
      setStep(step + 1);
    }
    //props.leaseAgreement is null then skip step 1
    if (step === 0 && !props.leaseAgreement) {
      setStep(step + 2);
    } else {
      setStep(step + 1);
    }
  };
  const handleBack = () => {
    //If props.isOwnerMode is true, then we skip the comments step
    if (step === 4 && props.isOwnerMode) {
      setStep(step - 2);
    } else {
      setStep(step - 1);
    }
    //props.leaseAgreement is null then skip step 1
    if (step === 2 && !props.leaseAgreement) {
      setStep(step - 2);
    }
  };

  const handleSearchRentalUnits = async (endpoint = rentalUnitEndpoint) => {
    try {
      const res = await authenticatedInstance.get(endpoint, {
        params: {
          search: rentalUnitSearchQuery,
          limit: 10,
        },
      });

      setUnits(res.data.results);
      setRentalUnitNextPage(res.data.next);
      setRentalUnitPreviousPage(res.data.previous);
    } catch (error) {
      console.error("Failed to fetch rental units:", error);
    }
  };

  const handleNextPageRentalUnitClick = async () => {
    if (rentalUnitNextPage) {
      handleSearchRentalUnits(rentalUnitNextPage);
      setRentalUnitEndpoint(rentalUnitNextPage);
    }
  };

  const handlePreviousPageRentalUnitClick = async () => {
    if (rentalUnitPreviousPage) {
      handleSearchRentalUnits(rentalUnitPreviousPage);
      setRentalUnitEndpoint(rentalUnitPreviousPage);
    }
  };

  const handleChangeLeaseMode = (event) => {
    console.log("Lease Mode:", event.target.value);
    console.log(
      "Current Rent Frequency:",
      "Current rent frequency: ",
      JSON.parse(props.leaseAgreement.rental_unit.lease_terms).find(
        (term) => term.name === "rent_frequency"
      ).value
    );
    console.log("New Rent Frequency:", );
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
    setIsLoading(true);

    let payload = {};
    if (props.leaseAgreement) {
      console.log("lEase agreement exists: ", props.leaseAgreement);
      payload = {
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
            : step1FormData.rentFrequency,
        comments: step3FormData.comments,
        tenant: props.leaseAgreement.tenant.id,
        owner: props.leaseAgreement.owner.id,
        rental_unit:
          unitMode === "current_unit"
            ? props.leaseAgreement.rental_unit.id
            : selectedUnit.id,
        rental_property: props.leaseAgreement.rental_unit.rental_property,
      };
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
    } else {
      console.log("lEase agreement does not exist: ");
      let parsed_lease_terms = JSON.parse(selectedUnit.lease_terms);
      let lease_term = parsed_lease_terms.find(
        (term) => term.name === "term"
      ).value;
      let rent_frequency = parsed_lease_terms.find(
        (term) => term.name === "rent_frequency"
      ).value;

      payload = {
        move_in_date: step0FormData.moveInDate,
        lease_term: lease_term,
        rent_frequency: rent_frequency,
        comments: step3FormData.comments,
        tenant: props.tenant.id,
        owner: authUser.owner_id,
        rental_unit: selectedUnit.id,
        rental_property: selectedUnit.rental_property,
      };
    }
    console.log("lease agreement rent frequency: ", payload.rent_frequency);
    console.log("Set1FormData: ", step1FormData);
    console.log("Lease Renewal Request Payload: ", payload);
    createLeaseRenewalRequest(payload)
      .then((res) => {
        if (res.status === 201) {
          if (props.isOwnerMode) {
            //If the user is an owner, then redirect them to the lease documents page
            navigate(`/dashboard/owner/lease-renewal-requests/${res.data.id}`);
          } else {
            props.setShowLeaseRenewalDialog(false);
            props.setAlertModalTitle("Lease Renewal Request Submitted");
            props.setAlertModalMessage(
              "Your lease renewal request has been submitted successfully. You will be notified once your owner has responded to your request."
            );
            props.setShowAlertModal(true);
          }
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
      })
      .catch((error) => {
        console.error("Error creating lease renewal request:", error);
        props.setShowLeaseRenewalDialog(false);
        props.setAlertModalTitle("Lease Renewal Request Error");
        props.setAlertModalMessage(
          "Your lease renewal request has failed to submit. Please try again later."
        );
        props.setShowAlertModal(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    console.log(
      "Current rent frequency: ",
      JSON.parse(props.leaseAgreement.rental_unit.lease_terms).find(
        (term) => term.name === "rent_frequency"
      ).value
    );
     
    handleSearchRentalUnits();
    setCurrentLeaseTerms(
      props.leaseAgreement
        ? JSON.parse(props.leaseAgreement.rental_unit.lease_terms)
        : null
    );
    authenticatedInstance.get("/units/?is_occupied=False").then((res) => {
      setUnits(res.data);
    });
    setLeaseMode("new_lease");
  }, [rentalUnitSearchQuery]);

  return (
    <div>
      <ProgressModal
        open={isLoading}
        title="Submitting Lease Renewal Request..."
      />
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
                      data-testId={`${input.dataTestId}`}
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
                        dataTestId="step-0-next-button"
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
                      hidden: !props.leaseAgreement,
                      dataTestId: "current-lease-radio",
                    },
                    {
                      value: "new_lease",
                      label: "New Lease Terms",
                      dataTestId: "new-lease-radio",
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
                        <h5 data-testId="current-lease-terms-label">Term</h5>
                        <p
                          className="text-black"
                          data-testId="current-lease-terms-term-value"
                        >
                          {
                            currentLeaseTerms.find(
                              (term) => term.name === "term"
                            ).value
                          }{" "}
                          Months
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h5 data-testId="current-lease-terms-rent-label">
                          Rent
                        </h5>
                        <p
                          className="text-black"
                          data-testId="current-lease-terms-rent-value"
                        >
                          $
                          {
                            currentLeaseTerms.find(
                              (term) => term.name === "rent"
                            ).value
                          }
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h5 data-testId="current-lease-terms-late-fee-label">
                          Late Fee
                        </h5>
                        <p
                          className="text-black"
                          data-testId="current-lease-terms-late-fee-value"
                        >
                          $
                          {
                            currentLeaseTerms.find(
                              (term) => term.name === "late_fee"
                            ).value
                          }
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h5 data-testId="current-lease-terms-security-deposit-label">
                          Security Deposit
                        </h5>
                        <p
                          className="text-black"
                          data-testId="current-lease-terms-security-deposit-value"
                        >
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
                    dataTestId="step-1-back-button"
                    btnText="Back"
                    onClick={handleBack}
                    sx={{ width: "100px" }}
                  />
                  <UIButton
                    dataTestId="step-1-next-button"
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
                        hidden: !props.leaseAgreement,
                        dataTestId: "current-unit-radio",
                      },
                      {
                        value: "new_unit",
                        label: "New Unit",
                        dataTestId: "new-unit-radio",
                      },
                    ]}
                    value={unitMode}
                    onChange={handleChangeUnitMode}
                    direction="row"
                  />
                  {unitMode === "new_unit" && (
                    <>
                      <UIInput
                        dataTestId="rental-unit-search-input"
                        onChange={(e) => {
                          setRentalUnitSearchQuery(e.target.value);
                          handleSearchRentalUnits();
                        }}
                        type="text"
                        placeholder="Search rental unit"
                        inputStyle={{ margin: "10px 0" }}
                        value={rentalUnitSearchQuery}
                        name="rental_unit_search"
                      />
                      <List
                        data-testid="rental-unit-list"
                        sx={{
                          width: "100%",
                          maxWidth: "100%",
                          maxHeight: 500,
                          overflow: "auto",
                          color: uiGrey2,
                          bgcolor: "white",
                        }}
                      >
                        {units.map((unit, index) => (
                          <ListItem
                            data-testid={`rental-unit-list-item-${index}`}
                            key={index}
                            alignItems="flex-start"
                            onClick={() => {
                              setSelectedUnit(unit);

                              handleNext();
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={2}
                              justifyContent={"space-between"}
                              alignContent={"center"}
                              alignItems={"center"}
                              sx={{ width: "100%" }}
                            >
                              <ListItemText
                                primary={
                                  <span data-testid={`unit-row-${index}-name`}>
                                    {`${unit.name} (${
                                      unit.is_occupied ? "Occupied" : "Vacant"
                                    })`}
                                  </span>
                                }
                                secondary={
                                  <span
                                    data-testid={`unit-row-${index}-property-name`}
                                  >
                                    {" "}
                                    {`${unit.rental_property_name}`}
                                  </span>
                                }
                              />
                              <UIButton
                                dataTestId={`select-unit-button-${index}`}
                                onClick={() => {
                                  setSelectedUnit(unit);
                                  handleNext();
                                }}
                                btnText="Select"
                                style={{ margin: "10px 0" }}
                              />
                            </Stack>
                          </ListItem>
                        ))}
                      </List>
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent={"space-between"}
                        alignContent={"center"}
                        alignItems={"center"}
                        sx={{ width: "100%" }}
                      >
                        {rentalUnitPreviousPage && (
                          <ButtonBase
                            onClick={handlePreviousPageRentalUnitClick}
                          >
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              spacing={0}
                            >
                              <IconButton style={{ color: uiGreen }}>
                                <ArrowBackOutlined />
                              </IconButton>
                              <span style={{ color: uiGreen }}>Prev</span>
                            </Stack>
                          </ButtonBase>
                        )}
                        <span></span>
                        {rentalUnitNextPage && (
                          <ButtonBase onClick={handleNextPageRentalUnitClick}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              spacing={0}
                            >
                              <span style={{ color: uiGreen }}>Next</span>
                              <IconButton style={{ color: uiGreen }}>
                                <ArrowForwardIcon />
                              </IconButton>
                            </Stack>
                          </ButtonBase>
                        )}
                      </Stack>
                    </>
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
                      dataTestId="step-2-back-button"
                      btnText="Back"
                      onClick={handleBack}
                      sx={{ width: "100px" }}
                    />
                    <UIButton
                      dataTestId="step-2-next-button"
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
                  dataTestId="step-3-back-button"
                  btnText="Back"
                  onClick={handleBack}
                  sx={{ width: "100px" }}
                />
                <UIButton
                  dataTestId="step-3-next-button"
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
              {props.isOwnerMode ? (
                <h5 data-testId="confirmation-step-title">
                  Renew Lease Agreement?
                </h5>
              ) : (
                <h5 data-testId="confirmation-step-title">
                  Submit Lease Renewal Request?
                </h5>
              )}
              {props.isOwnerMode ? (
                <p
                  data-testId="confirmation-step-message"
                  className="text-black"
                  style={{ textAlign: "center", marginBottom: "30px" }}
                >
                  Once you aubmit this lease renewal you will be redirected to
                  another page to manage the lease documents. Are you sure you
                  want to continue?
                </p>
              ) : (
                <p
                  data-testId="confirmation-step-message"
                  className="text-black"
                  style={{ textAlign: "center", marginBottom: "30px" }}
                >
                  Are you sure you want to submit this lease renewal request?
                  You will not be able to edit this request once it has been
                  submitted. Below is a summary of your lease renewal request.
                  Please review before submitting.
                </p>
              )}
            </Stack>
          )}
        </div>
        <div className="d-flex justify-content-between mt-4">
          {step === steps.length - 1 && (
            <>
              <UIButton
                dataTestId="step-4-back-button"
                btnText="Back"
                onClick={handleBack}
                sx={{ width: "100px" }}
              />
              <UIButton
                dataTestId="submit-button"
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
