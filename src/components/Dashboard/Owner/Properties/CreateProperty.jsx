import React, { useState } from "react";
import {
  createProperty,
  validatePropertyName,
} from "../../../../api/properties";
import { createUnit } from "../../../../api/units";

import { getUserStripeSubscriptions } from "../../../../api/auth";
import { faker } from "@faker-js/faker";
import { Button, Stack } from "@mui/material";
import { useNavigate } from "react-router";
import { set, useForm } from "react-hook-form";
import {
  authUser,
  token,
  uiGreen,
  uiRed,
  validationMessageStyle,
} from "../../../../constants";
import UIStepper from "../../UIComponents/UIStepper";
import UIButton from "../../UIComponents/UIButton";
import UnitRow from "./UnitRow";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import { useEffect } from "react";
import { defaultRentalUnitLeaseTerms } from "../../../../constants/lease_terms";
import {
  hasNoErrors,
  triggerValidation,
  validateForm,
} from "../../../../helpers/formValidation";
import Joyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  STATUS,
  Step,
} from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import {
  getStripeAccountRequirements,
  getStripeOnboardingAccountLink,
} from "../../../../api/owners";

const CreateProperty = () => {
  const navigate = useNavigate();
  const [unitCreateError, setUnitCreateError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const steps = ["Property Information", "Add Units"];
  const [step, setStep] = useState(0);
  const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState({
    items: { data: [{ plan: { product: "" } }] },
  });
  const [errors, setErrors] = useState({});
  const [unitValidationErrors, setUnitValidationErrors] = useState({});
  const [stripeAccountRequirements, setStripeAccountRequirements] = useState(
    []
  );
  const [stripeAccountLink, setStripeAccountLink] = useState("");
  const [stripeOnboardingPromptOpen, setStripeOnboardingPromptOpen] =
    useState(false);
  const [formData, setFormData] = useState({
    name: faker.company.name(),
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipcode: faker.location.zipCode(),
    country: "United States",
  });
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".property-info-section",
      content: "Here is where you enter address information for your property",
      disableBeacon: true,
    },
    {
      target: "button[data-testid='create-property-next-button']",
      content: "Click this button to continue tothe next step",
      spotlightClicks: true,
    },
    {
      target: ".units-section",
      content:
        "Here is where you add units to your property. Click the add unit button to add a new unit and the remove button to remove a unit",
    },
    {
      target: 'input[name="name"]:first-of-type',
      content: "In this textbox, enter the name of the unit you want to add.",
      placement: "bottom",
    },
    {
      target: 'input[name="beds"]:first-of-type',
      content: "In this textbox, enter the number of bedrooms in the unit.",
      placement: "bottom",
    },
    {
      target: 'input[name="baths"]:first-of-type',
      content: "In this textbox, enter the number of bathrooms in the unit.",
      placement: "bottom",
    },
    {
      target: 'input[name="size"]:first-of-type',
      content: "In this textbox, enter the size of the unit in square feet.",
      placement: "bottom",
    },
    {
      target: ".add-unit-button:first-of-type",
      content:
        "Use this button to add another unit if you have more than one unit to add to this property.",
      placement: "bottom",
    },
    {
      target: "button[data-testid='create-property-back-button']",
      content:
        "Click this button to go back to the previous step to edit your property information",
      placement: "bottom",
    },
    {
      target: "button[data-testid='create-property-submit-button']",
      content:
        "Click this button to create your property and units. You can always come back and edit the property later.",
      placement: "bottom",
    },
  ];
  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setTourIndex(0);
      setRunTour(false);
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      setTourIndex(nextStepIndex);
    }

    console.log("Current Joyride data", data);
  };
  const handleClickStart = (event) => {
    event.preventDefault();
    if (step === 0) {
      setTourIndex(0);
    } else if (step === 1) {
      setTourIndex(1);
    }
    setRunTour(true);
    console.log(runTour);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = triggerValidation(
      name,
      value,
      formInputs.find((input) => input.name === name).validations
    );
    setErrors((prevErrors) => ({ ...prevErrors, [name]: newErrors[name] }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log("Form data ", formData);
    console.log("Errors ", errors);
  };

  const formInputs = [
    {
      label: "Name",
      name: "name",
      type: "text",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "Lynx Society Highrises",
      validations: {
        required: true,
        // errorMessage: "Please enter a valid name for the unit",
        validate: async (value) => {
          let regex = /^[\s\S]*$/;
          if (!regex.test(value)) {
            //Check errorMessage value in this object
            setErrors((prevErrors) => ({
              ...prevErrors,
              name: "Please enter a valid name for the property",
            }));
            return false;
          }
          let payload = {
            name: value,
          };
          await validatePropertyName(payload).then((res) => {
            console.log(res);
            if (res.status === 400) {
              setErrors((prevErrors) => ({
                ...prevErrors,
                name: "One of your properties already has this name.",
              }));
              return false;
            }
          });
        },
      },
      dataTestId: "create-property-name-input",
      errorMessageDataTestId: "create-property-name-error-message",
      step: 0,
    },
    {
      label: "Street",
      name: "street",
      type: "text",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "Sunset Blvd, 38",
      validations: {
        required: true,
        regex: /^\d+\s[a-zA-Z0-9\s,'-]+$/,
        errorMessage: "Enter a valid street address (e.g., 123 Main St)",
      },
      dataTestId: "create-property-street-input",
      errorMessageDataTestId: "create-property-street-error-message",
      step: 0,
    },
    {
      label: "City",
      name: "city",
      type: "text",
      colSpan: 4,
      onChange: (e) => handleChange(e),
      placeholder: "Los Angeles",
      validations: {
        required: true,
        regex: /^[a-zA-Z0-9\s,'-]*$/,
        errorMessage: "Must be at least 3 characters long",
      },
      dataTestId: "create-property-city-input",
      errorMessageDataTestId: "create-property-city-error-message",
      step: 0,
    },
    {
      label: "State",
      name: "state",
      type: "select",
      colSpan: 4,
      onChange: (e) => handleChange(e),
      options: [
        { value: "", label: "Select One" },
        { value: "AL", label: "Alabama" },
        { value: "AK", label: "Alaska" },
        { value: "AZ", label: "Arizona" },
        { value: "AR", label: "Arkansas" },
        { value: "CA", label: "California" },
        { value: "CO", label: "Colorado" },
        { value: "CT", label: "Connecticut" },
        { value: "DE", label: "Delaware" },
        { value: "DC", label: "District Of Columbia" },
        { value: "FL", label: "Florida" },
        { value: "GA", label: "Georgia" },
        { value: "HI", label: "Hawaii" },
        { value: "ID", label: "Idaho" },
        { value: "IL", label: "Illinois" },
        { value: "IN", label: "Indiana" },
        { value: "IA", label: "Iowa" },
        { value: "KS", label: "Kansas" },
        { value: "KY", label: "Kentucky" },
        { value: "LA", label: "Louisiana" },
        { value: "ME", label: "Maine" },
        { value: "MD", label: "Maryland" },
        { value: "MA", label: "Massachusetts" },
        { value: "MI", label: "Michigan" },
        { value: "MN", label: "Minnesota" },
        { value: "MS", label: "Mississippi" },
        { value: "MO", label: "Missouri" },
        { value: "MT", label: "Montana" },
        { value: "NE", label: "Nebraska" },
        { value: "NV", label: "Nevada" },
        { value: "NH", label: "New Hampshire" },
        { value: "NJ", label: "New Jersey" },
        { value: "NM", label: "New Mexico" },
        { value: "NY", label: "New York" },
        { value: "NC", label: "North Carolina" },
        { value: "ND", label: "North Dakota" },
        { value: "OH", label: "Ohio" },
        { value: "OK", label: "Oklahoma" },
        { value: "OR", label: "Oregon" },
        { value: "PA", label: "Pennsylvania" },
        { value: "RI", label: "Rhode Island" },
        { value: "SC", label: "South Carolina" },
        { value: "SD", label: "South Dakota" },
        { value: "TN", label: "Tennessee" },
        { value: "TX", label: "Texas" },
        { value: "UT", label: "Utah" },
        { value: "VT", label: "Vermont" },
        { value: "VA", label: "Virginia" },
        { value: "WA", label: "Washington" },
        { value: "WV", label: "West Virginia" },
        { value: "WI", label: "Wisconsin" },
        { value: "WY", label: "Wyoming" },
      ],
      validations: {
        required: true,
        regex: /^[a-zA-Z0-9\s,'-]*$/,
        errorMessage: "Must be at least 3 characters long",
      },
      dataTestId: "create-property-state-input",
      errorMessageDataTestId: "create-property-state-error-message",
      step: 0,
    },
    {
      label: "Zip Code",
      name: "zipcode",
      type: "text",
      colSpan: 4,
      onChange: (e) => handleChange(e),
      placeholder: "90210",
      validations: {
        required: true,
        regex: /^\d{5}(?:[-\s]\d{4})?$/,
        errorMessage: "Must be in zip code format",
      },
      dataTestId: "create-property-zip-code-input",
      errorMessageDataTestId: "create-property-zip-code-error-message",
      step: 0,
    },
    {
      label: "Country",
      name: "country",
      type: "text",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "United States",
      validations: {
        required: true,
        regex: /^[a-zA-Z0-9\s,'-]*$/,
        errorMessage: "Must be at least 3 characters long",
      },
      dataTestId: "create-property-country-input",
      errorMessageDataTestId: "create-property-country-error-message",
    },
  ];
  const [units, setUnits] = useState([
    {
      name: `${
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.string.alpha()
      }${
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.finance.accountNumber(1)
      }`,
      beds:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.number.int({ min: 4, max: 10 }),
      baths:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.number.int({ min: 4, max: 6 }),
      size:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.number.int({ min: 500, max: 1500 }),
    },
  ]);

  //Create a function to handle unit information change
  const handleUnitChange = (e, index) => {
    const { name, value } = e.target;
    let realName = name.split("_")[0];
    const list = [...units];
    list[index][realName] = value;
    setUnits(list);
  };

  //Create a function to add a new unit
  const addUnit = () => {
    setUnits([
      ...units,
      {
        name: `${
          process.env.REACT_APP_ENVIRONMENT !== "development"
            ? ""
            : faker.string.alpha()
        }${
          process.env.REACT_APP_ENVIRONMENT !== "development"
            ? ""
            : faker.finance.accountNumber(1)
        }`,
        beds:
          process.env.REACT_APP_ENVIRONMENT !== "development"
            ? ""
            : faker.number.int({ min: 4, max: 10 }),
        baths:
          process.env.REACT_APP_ENVIRONMENT !== "development"
            ? ""
            : faker.number.int({ min: 4, max: 6 }),
        size:
          process.env.REACT_APP_ENVIRONMENT !== "development"
            ? ""
            : faker.number.int({ min: 500, max: 1500 }),
      },
    ]);
  };

  //Create a function to remove a unit
  const removeUnit = (index) => {
    const updatedUnits = [...units];
    updatedUnits.splice(index, 1);
    setUnits(updatedUnits);
  };

  //Create a handle function to handle the form submission of creating a property
  const onSubmit = async (data) => {
    console.log("DAta: ", data);
    console.log("Form Data: ", formData);
    setIsLoading(true);
    try {
      const res = await createProperty(
        formData.name,
        formData.street,
        formData.city,
        formData.state,
        formData.zipcode,
        formData.country
      );
      console.log(res);
      const newPropertyId = res.res.id;
      if (res.status === 200) {
        let payload = {};
        payload.units = JSON.stringify(units);
        payload.rental_property = newPropertyId;
        payload.subscription_id = currentSubscriptionPlan.id;
        payload.product_id = currentSubscriptionPlan.plan.product;
        payload.user = authUser.id;
        payload.lease_terms = JSON.stringify(defaultRentalUnitLeaseTerms);

        const res = await createUnit(payload);
        console.log(res);
        if (res.status === 200) {
          setIsLoading(false);
          navigate(`/dashboard/owner/properties/${newPropertyId}`);
        } else {
          setUnitCreateError(true);
          setErrorMessage(
            "There was an error creating your property" + res.message
          );
          setIsLoading(false);
        }
      } else {
        setUnitCreateError(true);
        setErrorMessage(
          "There was an error creating your property" + res.message
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error creating property: ", error);
      setUnitCreateError(true);
      setErrorMessage("Error creating property");
      setIsLoading(false);
    }
  };

  const retrieveSubscriptionPlan = async () => {
    const res = await getUserStripeSubscriptions(authUser.id, token)
      .then((res) => {
        setCurrentSubscriptionPlan(res.subscriptions);
      })
      .catch((error) => {
        console.log("Error retrieving subscription plan: ", error);
        setErrorMessage("Error retrieving subscription plan");
        setUnitCreateError(true);
      });
    return res;
  };

  useEffect(() => {
    try {
      retrieveSubscriptionPlan();
      getStripeOnboardingAccountLink().then((res) => {
        console.log("Stripe ACcount link res: ", res);
        setStripeAccountLink(res.account_link);
      });
      getStripeAccountRequirements().then((res) => {
        console.log("Stripe Account Requirements: ", res);
        setStripeAccountRequirements(res.requirements);
        setStripeOnboardingPromptOpen(
          res.requirements.currently_due.length > 0
        );
      });
    } catch (error) {
      console.log("Error getting stripe account link: ", error);
    }
  }, []);

  return (
    <div className="container-fluid">
      <Joyride
        run={runTour}
        stepIndex={tourIndex}
        steps={tourSteps}
        callback={handleJoyrideCallback}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        styles={{
          options: {
            primaryColor: uiGreen,
          },
        }}
        locale={{
          back: "Back",
          close: "Close",
          last: "Finish",
          next: "Next",
          skip: "Skip",
        }}
      />
      <ConfirmModal
        open={stripeOnboardingPromptOpen}
        title={"Complete Your Stripe Account Onboarding"}
        message={
          "In order to create properties and recieve payments, you need to complete your Stripe account onboarding. Click the button below to complete your account setup."
        }
        confirmBtnText={"Complete Account Setup"}
        handleConfirm={() => {
          window.open(stripeAccountLink, "_blank");
        }}
        cancelBtnText={"Not Now"}
        handleCancel={() => {
          //Navigate to the properties page
          navigate(`/dashboard/owner/properties/`);
        }}
      />
      <ProgressModal open={isLoading} title="Creating your property..." />
      <AlertModal
        open={unitCreateError}
        onClick={() => {
          setUnitCreateError(false);
          navigate(`/dashboard/owner/properties/`);
        }}
        message={errorMessage}
        btnText={"Ok"}
      />
      <div className="row mb-3">
        <div className="col-sm-12 col-md-12 col-lg-8 offset-sm-0 offset-md-0 offset-lg-2">
          <div className="card shadow mb-3">
            <UIStepper
              dataTestId="create-property-stepper"
              steps={steps}
              activeStep={step}
              style={{ margin: "40px 0 20px" }}
            />
            <div className="card-body">
              <form>
                {step === 0 && (
                  <div className="row property-info-section">
                    {formInputs.map((input, index) => {
                      return (
                        <div
                          className={`mb-3 col-md-${input.colSpan}`}
                          key={index}
                        >
                          <label
                            className="form-label text-black"
                            htmlFor={input.name}
                            data-testid={`create-property-${input.name}-label`}
                          >
                            <strong>{input.label}</strong>
                          </label>
                          {input.type === "text" ? (
                            <>
                              {" "}
                              <input
                                data-testid={`create-property-${input.name}-input`}
                                onChange={handleChange}
                                onBlur={input.onChange}
                                className="form-control"
                                type="text"
                                id={input.name}
                                placeholder={input.placeholder}
                                name={input.name}
                                style={{ borderStyle: "none", color: "black" }}
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
                            </>
                          ) : input.type === "select" ? (
                            <>
                              <select
                                onChange={input.onChange}
                                data-testId={`create-property-${input.name}-input`}
                                name={input.name}
                                className="form-select"
                              >
                                {input.options.map((option, index) => {
                                  return (
                                    <option
                                      key={index}
                                      value={
                                        process.env.REACT_APP_ENVIRONMENT !==
                                        "development"
                                          ? ""
                                          : option.value
                                      }
                                    >
                                      {process.env.REACT_APP_ENVIRONMENT !==
                                      "development"
                                        ? ""
                                        : option.label}
                                    </option>
                                  );
                                })}
                              </select>
                              {errors[input.name] && (
                                <span
                                  data-testId={input.errorMessageDataTestId}
                                  style={{ ...validationMessageStyle }}
                                >
                                  {errors[input.name]}
                                </span>
                              )}
                            </>
                          ) : null}
                        </div>
                      );
                    })}
                    <UIButton
                      dataTestId="create-property-next-button"
                      type="button"
                      style={{ float: "right" }}
                      btnText="Next"
                      onClick={() => {
                        const { isValid, newErrors } = validateForm(
                          formData,
                          formInputs
                        );
                        setErrors(newErrors);
                        if (isValid && hasNoErrors(errors)) {
                          setStep(1);
                        } else {
                          setErrors(newErrors);
                        }
                      }}
                    />
                  </div>
                )}
                {step === 1 && (
                  <div className="units-section">
                    {units.map((unit, index) => {
                      return (
                        <UnitRow
                          units={units}
                          errors={unitValidationErrors}
                          setErrors={setUnitValidationErrors}
                          style={{ marginBottom: "20px" }}
                          key={index}
                          id={index}
                          unitNameErrors={errors[`unitName_${index}`]}
                          unitBedsErrors={errors[`unitBeds_${index}`]}
                          unitBathsErrors={errors[`unitBaths_${index}`]}
                          unitSizeErrors={errors[`unitSize_${index}`]}
                          unit={unit}
                          onUnitChange={(e) => handleUnitChange(e, index)}
                          addUnit={addUnit}
                          removeBtn={
                            index !== 0 && (
                              <Button
                                sx={{
                                  color: uiRed,
                                  textTransform: "none",
                                }}
                                onClick={() => removeUnit(index)}
                              >
                                Delete
                              </Button>
                            )
                          }
                        />
                      );
                    })}

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <UIButton
                        dataTestId="create-property-back-button"
                        type="button"
                        btnText="Back"
                        onClick={() => setStep(0)}
                      />
                      <div className="text-end my-3">
                        <UIButton
                          dataTestId="create-property-submit-button"
                          onClick={() => {
                            // check if errors and unitValidationErrors have values that are all undefined
                            if (
                              hasNoErrors(errors) &&
                              hasNoErrors(unitValidationErrors)
                            ) {
                              console.log("Can subm,it");
                              onSubmit();
                            } else {
                              console.log("Cannot submit");
                            }
                          }}
                          btnText="Create Property"
                        />
                      </div>
                    </Stack>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default CreateProperty;
