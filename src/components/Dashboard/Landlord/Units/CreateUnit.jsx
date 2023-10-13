import React, { useEffect, useState } from "react";
import { createUnit, getProperties } from "../../../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { faker } from "@faker-js/faker";
import BackButton from "../../UIComponents/BackButton";
import { useForm } from "react-hook-form";
import { uiRed, validationMessageStyle } from "../../../../constants";
import UnitRow from "../Properties/UnitRow";
import { Button, Stack } from "@mui/material";
const CreateUnit = () => {
  //Create a state for the form data
  const [properties, setProperties] = useState([]);
  const [unitCreateError, setUnitCreateError] = useState(false);
  const navigate = useNavigate();
  const { property_id } = useParams();
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    property_id ? property_id : null
  );

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

  //Call the create unit api function and pass the form data
  const onSubmit = async (data) => {
    console.log(data);

    //Use a map function to loop through the units array and create a unit for each unit in the array
    const promises = units.map(async (unit) => {
      unit.rental_property = selectedPropertyId;
      return await createUnit(unit);
    });
    //Use Promise.all to wait for all the promises to resolve
    Promise.all(promises).then((values) => {
      console.log(values);
      //Loop through the values array and check if the status property in each is 200
      values.forEach((value) => {
        if (value.status !== 200) {
          setUnitCreateError(true);
        }
      });
      if (!unitCreateError) {
        //Navigate to newly created property
        navigate(`/dashboard/landlord/properties/${selectedPropertyId}`);
      }
    });
  };

  //Create a function to handle the property select change
  const handlePropertySelectChange = (e) => {
    setSelectedPropertyId(e.target.value);
    console.log(e.target.value);
  };

  useEffect(() => {
    //Retrieve all users properties
    getProperties().then((res) => {
      setProperties(res.data);
    });
  }, []);

  return (
    <>
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
