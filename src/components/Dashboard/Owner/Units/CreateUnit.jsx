import React, { useEffect, useState } from "react";
import { createUnit } from "../../../../api/units";
import { getProperties } from "../../../../api/properties";
import { getUserStripeSubscriptions } from "../../../../api/auth";
import { useNavigate, useParams } from "react-router-dom";
import { faker } from "@faker-js/faker";
import BackButton from "../../UIComponents/BackButton";
import { useForm } from "react-hook-form";
import {
  authUser,
  uiRed,
  validationMessageStyle,
  token,
  uiGreen,
} from "../../../../constants";
import UnitRow from "../Properties/UnitRow";
import { Button, Stack } from "@mui/material";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import useScreen from "../../../../hooks/useScreen";
import { defaultRentalUnitLeaseTerms } from "../../../../constants/lease_terms";
import UIButton from "../../UIComponents/UIButton";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import Joyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  STATUS,
  Step,
} from "react-joyride";
const CreateUnit = () => {
  //Create a state for the form data
  const { isMobile } = useScreen();
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [unitCreateError, setUnitCreateError] = useState(false);
  const [unitValidationErrors, setUnitValidationErrors] = useState({});
  const { property_id } = useParams();
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    property_id ? property_id : null
  );
  const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState({
    items: { data: [{ plan: { product: "" } }] },
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [progressModalTitle, setProgressModalTitle] = useState("");
  const navigate = useNavigate();
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: '[data-testid="create-unit-form"]',
      content:
        "This is the form you will use this form to add a unit to your property.",
      disableBeacon: true,
    },
    {
      target: 'input[name="name"]:first-of-type',
      content: "In this textbox, enter the name of the unit you want to add.",
    },
    {
      target: 'input[name="beds"]:first-of-type',
      content: "In this textbox, enter the number of bedrooms in the unit.",
    },
    {
      target: 'input[name="baths"]:first-of-type',
      content: "In this textbox, enter the number of bathrooms in the unit.",
    },
    {
      target: 'input[name="size"]:first-of-type',
      content: "In this textbox, enter the size of the unit in square feet.",
    },
    {
      target: ".add-unit-button:first-of-type",
      content:
        "Use this button to add another unit if you have more than one unit to add to this property.",
    },
    {
      target: ".submit-create-unit-button",
      content:
        "Once you are finished adding units, click this button to create the units.",
    },
  ];
  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setTourIndex(0);
      setRunTour(false);
    }
  };
  const handleClickStart = (event) => {
    event.preventDefault();
    setRunTour(true);
    console.log(runTour);
  };
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
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
    },
  });

  //Create a function to handle unit information change
  const handleUnitChange = (e, index) => {
    const { name, value } = e.target;
    let realName = name.split("_")[0];
    const list = [...units];
    list[index][realName] = value;
    setUnits(list);
    console.log(units);
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

  //Call the create unit api function and pass the form data
  const onSubmit = async (data) => {
    setIsLoading(true);
    setProgressModalTitle("Creating Unit...");
    let payload = {};
    payload.units = JSON.stringify(units);
    payload.rental_property = selectedPropertyId;
    payload.subscription_id = currentSubscriptionPlan.id;
    payload.product_id = currentSubscriptionPlan.plan.product;
    payload.user = authUser.id;
    payload.lease_terms = JSON.stringify(defaultRentalUnitLeaseTerms);

    console.log("Data ", data);
    console.log("Pay load ", payload);
    console.log("UNits ", units);

    const response = await createUnit(payload)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setIsLoading(false);
          navigate(`/dashboard/owner/properties/${selectedPropertyId}`);
        } else {
          setUnitCreateError(true);
          setErrorMessage(
            res.message
              ? res.message
              : "Something went wrong. Please try again."
          );
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error creating unit:", error);
        setErrorMessage(
          "An error occurred while creating unit. Please try again later."
        );
        setUnitCreateError(true);
        setIsLoading(false);
      });
  };

  //Create a function to handle the property select change
  const handlePropertySelectChange = (e) => {
    setSelectedPropertyId(e.target.value);
    console.log(e.target.value);
  };
  const retrieveSubscriptionPlan = async () => {
    setIsLoading(true);
    setProgressModalTitle("Retrieving Subscription Data...");
    const res = await getUserStripeSubscriptions(authUser.id, token)
      .then((res) => {
        setCurrentSubscriptionPlan(res.subscriptions);
      })
      .catch((error) => {
        console.error("Error getting subscription plan:", error);
        setErrorMessage(
          "An error occurred while retrieving subscription plan. Please try again later."
        );
        setUnitCreateError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
    return res;
  };

  useEffect(() => {
    //Retrieve all users properties
    getProperties()
      .then((res) => {
        setProperties(res.data);
      })
      .catch((error) => {
        console.error("Error getting properties:", error);
        setErrorMessage(
          "An error occurred while retrieving properties. Please try again later."
        );
        setUnitCreateError(true);
      });
    retrieveSubscriptionPlan();
  }, []);

  return (
    <>
      <Joyride
        run={runTour}
        index={tourIndex}
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
      <ProgressModal open={isLoading} title={progressModalTitle} />
      <AlertModal
        open={unitCreateError}
        onClick={() => {
          setUnitCreateError(false);
          navigate(`/dashboard/owner/properties/`);
        }}
        message={errorMessage}
        btnText="Ok"
      />
      <div className="container">
        <div className="row mb-3">
          <div className="col-sm-12 col-md-12 col-lg-8 offset-sm-0 offset-md-0 offset-lg-2">
            <BackButton />
            <div className="card shadow my-3">
              <div className="card-body">
                <form
                  data-testid="create-unit-form"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ marginBottom: "20px" }}
                  >
                    <h6
                      data-testid="create-unit-title"
                      className="text-black fw-bold m-0 "
                    >
                      Add Unit(s)
                    </h6>
                    <div>
                      <select
                        data-testid="create-unit-property-select"
                        {...register("rental_property", {
                          required: "This is a required field",
                        })}
                        name="rental_property"
                        onChange={handlePropertySelectChange}
                        className="form-control"
                        style={{
                          width: isMobile ? "inherit" : "250px",
                          visibility: property_id ? "hidden" : "visible",
                        }}
                      >
                        {selectedPropertyId ? (
                          <option value={selectedPropertyId}>
                            {/* {
                              properties.find((property) => {
                                return (
                                  property.id === parseInt(selectedPropertyId)
                                );
                              }).name
                            } */}
                            Current Property
                          </option>
                        ) : (
                          <option value="" selected disabled>
                            Select Property
                          </option>
                        )}

                        {properties.map((property) => {
                          return (
                            <option value={property.id}>{property.name}</option>
                          );
                        })}
                      </select>{" "}
                      <span style={validationMessageStyle}>
                        {errors.rental_property &&
                          errors.rental_property.message}
                      </span>
                    </div>
                  </Stack>

                  <div className="units-section">
                    {units.map((unit, index) => {
                      return (
                        <UnitRow
                          errors={unitValidationErrors}
                          setErrors={setUnitValidationErrors}
                          dataTestId={`unit-row-${index}`}
                          style={{ marginBottom: "20px" }}
                          key={index}
                          id={index}
                          register={register}
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
                                data-testid={`unit-row-${index}-delete-button`}
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
                  </div>

                  <div className="text-end my-3 ">
                    <span className="submit-create-unit-button">
                      <UIButton
                        data-testid="create-unit-submit-button"
                        className="btn btn-primary ui-btn "
                        onClick={() => {
                          if (
                            Object.values(unitValidationErrors).every(
                              (val) => val === undefined
                            )
                          ) {
                            setIsLoading(true);
                            onSubmit();
                          } else {
                            console.log("Errors ", unitValidationErrors);
                          }
                        }}
                        btnText="Create Unit(s)"
                      />
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UIHelpButton onClick={handleClickStart} />
    </>
  );
};

export default CreateUnit;
