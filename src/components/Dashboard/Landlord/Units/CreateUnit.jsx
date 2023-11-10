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
} from "../../../../constants";
import UnitRow from "../Properties/UnitRow";
import { Button, Stack } from "@mui/material";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import AlertModal from "../../UIComponents/Modals/AlertModal";
const CreateUnit = () => {
  //Create a state for the form data
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [unitCreateError, setUnitCreateError] = useState(false);
  const { property_id } = useParams();
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    property_id ? property_id : null
  );
  const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState({
    items: { data: [{ plan: { product: "" } }] },
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

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
    let payload = {};
    payload.units = JSON.stringify(units);
    payload.rental_property = selectedPropertyId;
    payload.subscription_id = currentSubscriptionPlan.id;
    payload.product_id = currentSubscriptionPlan.plan.product;
    payload.user = authUser.user_id;
    console.log("Data ", data);
    console.log("Pay load ", payload);
    console.log("UNits ", units);
    setIsLoading(true);

    const res = await createUnit(payload);
    console.log(res);
    if (res.status === 200) {
      setIsLoading(false);
      navigate(`/dashboard/landlord/properties/${selectedPropertyId}`);
    } else {
      setUnitCreateError(true);
      setErrorMessage(
        res.message ? res.message : "Something went wrong. Please try again."
      );
      setIsLoading(false);
    }
  };

  //Create a function to handle the property select change
  const handlePropertySelectChange = (e) => {
    setSelectedPropertyId(e.target.value);
    console.log(e.target.value);
  };
  const retrieveSubscriptionPlan = async () => {
    const res = await getUserStripeSubscriptions(authUser.user_id, token).then(
      (res) => {
        setCurrentSubscriptionPlan(res.subscriptions);
      }
    );
    return res;
  };

  useEffect(() => {
    //Retrieve all users properties
    getProperties().then((res) => {
      setProperties(res.data);
    });
    retrieveSubscriptionPlan();
  }, []);

  return (
    <>
      <ProgressModal open={isLoading} title="Adding units..." />
      <AlertModal
        open={unitCreateError}
        onClick={() => {
          setUnitCreateError(false);
          navigate(`/dashboard/landlord/properties/`);
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
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ marginBottom: "20px" }}
                  >
                    <h6 className="text-primary fw-bold m-0 card-header-text">
                      Add Units
                    </h6>
                    <div>
                      <select
                        {...register("rental_property", {
                          required: "This is a required field",
                        })}
                        name="rental_property"
                        onChange={handlePropertySelectChange}
                        className="form-control"
                        style={{ width: "250px" }}
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
                          <option value="">Select Property</option>
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
                  </div>

                  <div className="text-end my-3">
                    <button className="btn btn-primary ui-btn" type="submit">
                      Create Unit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateUnit;
