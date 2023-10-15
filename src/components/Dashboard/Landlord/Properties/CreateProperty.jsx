import React, { useState } from "react";
import {createProperty } from "../../../../api/properties";
import {createUnit} from "../../../../api/units";

import { getUserStripeSubscriptions } from "../../../../api/auth";
import { faker } from "@faker-js/faker";
import { Button, Stack } from "@mui/material";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import {
  authUser,
  token,
  uiRed,
  validationMessageStyle,
} from "../../../../constants";
import UIStepper from "../../UIComponents/UIStepper";
import UIButton from "../../UIComponents/UIButton";
import UnitRow from "./UnitRow";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import { useEffect } from "react";
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.company.name(),
      street:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.location.streetAddress(),
      city:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.location.city(),
      state:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.location.state(),
      zipcode:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.location.zipCode(),
      country: "United States",
    },
  });
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
    const list = [...units];
    list[index][name] = value;
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
    setIsLoading(true);
    const res = await createProperty(
      data.name,
      data.street,
      data.city,
      data.state,
      data.zipcode,
      data.country
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

      const res = await createUnit(payload);
      console.log(res);
      if (res.status === 200) {
        setIsLoading(false);
        navigate(`/dashboard/landlord/properties/${newPropertyId}`);
      } else {
        setUnitCreateError(true);
        setErrorMessage(res.message);
        setIsLoading(false);
      }
    }
  };

  const retrieveSubscriptionPlan = async () => {
    const res = await getUserStripeSubscriptions(authUser.id, token).then(
      (res) => {
        setCurrentSubscriptionPlan(res.subscriptions);
      }
    );
    return res;
  };

  useEffect(() => {
    retrieveSubscriptionPlan();
  }, []);

  return (
    <div className="container-fluid">
      <ProgressModal open={isLoading} title="Creating your property..." />
      <AlertModal
        open={unitCreateError}
        onClick={() => {
          setUnitCreateError(false);
          navigate(`/dashboard/landlord/properties/`);
        }}
        message={errorMessage}
        btnText={"Ok"}
      />
      <div className="row mb-3">
        <div className="col-sm-12 col-md-12 col-lg-8 offset-sm-0 offset-md-0 offset-lg-2">
          <div className="card shadow mb-3">
            <UIStepper
              steps={steps}
              activeStep={step}
              style={{ margin: "40px 0 20px" }}
            />
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                {step === 0 && (
                  <div className="property-info-section">
                    <div className="mb-3">
                      <label className="form-label text-white" htmlFor="street">
                        <strong>Name</strong>
                      </label>
                      <input
                        {...register("name", {
                          required: "This is a required field",
                          minLength: {
                            value: 3,
                            message: "Must be at least 3 characters long",
                          },
                        })}
                        className="form-control"
                        type="text"
                        id="street"
                        placeholder="Lynx Society Highrises"
                        name="name"
                        style={{ borderStyle: "none" }}
                      />
                      <span style={validationMessageStyle}>
                        {errors.name && errors.name.message}
                      </span>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-white" htmlFor="street">
                        <strong>Street Address</strong>
                      </label>
                      <input
                        {...register("street", {
                          required: "This is a required field",
                          minLength: {
                            value: 3,
                            message: "Must be at least 3 characters long",
                          },
                          //Create pattern to only be in street address format
                          pattern: {
                            value: /^[a-zA-Z0-9\s,'-]*$/,
                            message: "Must be in street address format",
                          },
                        })}
                        className="form-control"
                        type="text"
                        id="street-1"
                        placeholder="Sunset Blvd, 38"
                        name="street"
                        style={{ borderStyle: "none" }}
                      />
                      <span style={validationMessageStyle}>
                        {errors.street && errors.street.message}
                      </span>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="city"
                          >
                            <strong>City</strong>
                          </label>
                          <input
                            {...register("city", {
                              required: "This is a required field",
                              minLength: {
                                value: 3,
                                message: "Must be at least 3 characters long",
                              },
                            })}
                            className="form-control"
                            type="text"
                            id="city"
                            placeholder="Los Angeles"
                            name="city"
                            style={{ borderStyle: "none" }}
                          />
                          <span style={validationMessageStyle}>
                            {errors.city && errors.city.message}
                          </span>
                        </div>
                      </div>
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="state"
                          >
                            <strong>State</strong>
                          </label>
                          <select
                            {...register("state", {
                              required: "This is a required field",
                              minLength: {
                                value: 2,
                                message: "Must be at least 2 characters long",
                              },
                            })}
                            className="form-select"
                          >
                            <option
                              selected
                              value={
                                process.env.REACT_APP_ENVIRONMENT !==
                                "development"
                                  ? ""
                                  : faker.location.state()
                              }
                            >
                              {process.env.REACT_APP_ENVIRONMENT !==
                              "development"
                                ? ""
                                : faker.location.state()}
                            </option>
                            <option value="">Select One</option>
                            <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="AR">Arkansas</option>
                            <option value="CA">California</option>
                            <option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option>
                            <option value="DE">Delaware</option>
                            <option value="DC">District Of Columbia</option>
                            <option value="FL">Florida</option>
                            <option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option>
                            <option value="ID">Idaho</option>
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="ME">Maine</option>
                            <option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option>
                            <option value="MI">Michigan</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="MT">Montana</option>
                            <option value="NE">Nebraska</option>
                            <option value="NV">Nevada</option>
                            <option value="NH">New Hampshire</option>
                            <option value="NJ">New Jersey</option>
                            <option value="NM">New Mexico</option>
                            <option value="NY">New York</option>
                            <option value="NC">North Carolina</option>
                            <option value="ND">North Dakota</option>
                            <option value="OH">Ohio</option>
                            <option value="OK">Oklahoma</option>
                            <option value="OR">Oregon</option>
                            <option value="PA">Pennsylvania</option>
                            <option value="RI">Rhode Island</option>
                            <option value="SC">South Carolina</option>
                            <option value="SD">South Dakota</option>
                            <option value="TN">Tennessee</option>
                            <option value="TX">Texas</option>
                            <option value="UT">Utah</option>
                            <option value="VT">Vermont</option>
                            <option value="VA">Virginia</option>
                            <option value="WA">Washington</option>
                            <option value="WV">West Virginia</option>
                            <option value="WI">Wisconsin</option>
                            <option value="WY">Wyoming</option>
                          </select>
                          <span style={validationMessageStyle}>
                            {errors.state && errors.state.message}
                          </span>
                        </div>
                      </div>
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="zipcode"
                          >
                            <strong>Zip Code</strong>
                          </label>
                          <input
                            {...register("zipcode", {
                              required: "This is a required field",
                              //Create pattern to only be in zip code format
                              pattern: {
                                value: /^\d{5}(?:[-\s]\d{4})?$/,
                                message: "Must be in zip code format",
                              },
                            })}
                            className="form-control"
                            type="text"
                            id="zipcode"
                            placeholder="90210"
                            name="zipcode"
                            style={{ borderStyle: "none" }}
                          />
                          <span style={validationMessageStyle}>
                            {errors.zipcode && errors.zipcode.message}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="country"
                          >
                            <strong>Country</strong>
                          </label>
                          <input
                            {...register("country", {
                              required: "This is a required field",
                            })}
                            className="form-control"
                            type="text"
                            id="country"
                            placeholder="United States"
                            value={"United States"}
                            name="country"
                            style={{ borderStyle: "none" }}
                          />
                          <span style={validationMessageStyle}>
                            {errors.country && errors.country.message}
                          </span>
                        </div>
                      </div>
                    </div>
                    <UIButton
                      type="submit"
                      style={{ float: "right" }}
                      btnText="Next"
                      onClick={() => setStep(1)}
                    />
                  </div>
                )}
                {step === 1 && (
                  <div className="units-section">
                    {units.map((unit, index) => {
                      return (
                        <UnitRow
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
                        type="button"
                        btnText="Back"
                        onClick={() => setStep(0)}
                      />
                      <div className="text-end my-3">
                        <button
                          className="btn btn-primary ui-btn"
                          type="submit"
                        >
                          Create Property
                        </button>
                      </div>
                    </Stack>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProperty;
