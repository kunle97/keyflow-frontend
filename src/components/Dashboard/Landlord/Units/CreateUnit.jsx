import React, { useState } from "react";
import { createUnit } from "../../../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { faker } from "@faker-js/faker";
import BackButton from "../../UIComponents/BackButton";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../../constants";
const CreateUnit = () => {
  //Create a state for the form data
  const [nameGen, setNameGen] = useState(true);
  const navigate = useNavigate();
  const { property_id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: `${process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.string.alpha()}${process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.finance.accountNumber(1)}`,
      beds: process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.number.int({ min: 4, max: 10 }),
      baths: process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : faker.number.int({ min: 4, max: 6 }),
    },
  });

  //Call the create unit api function and pass the form data
  const onSubmit = async (data) => {
    console.log(data);
    const res = await createUnit(data);

    console.log(res);
    if (res.status === 200) {
      navigate(`/dashboard/landlord/properties/${property_id}`);
    }
  };

  return (
    <div className="container">
      <div className="row mb-3">
        <div className="col-sm-12 col-md-12 col-lg-8 offset-sm-0 offset-md-0 offset-lg-2">
          <BackButton />
          <div className="card shadow my-3">
            <div className="card-header p-3">
              <h6 className="text-primary fw-bold m-0 card-header-text">
                Create Unit
              </h6>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <input
                  {...register("rental_property", {
                    required: "This is a required field",
                  })}
                  defaultValue={property_id}
                  type="hidden"
                  name="rental_property"
                />
                <div className="mb-3">
                  <label className="form-label text-white" htmlFor="name">
                    <strong>Unit #/Name</strong>
                  </label>
                  <input
                    {...register("name", {
                      required: "This is a required field",
                    })}
                    className="form-control text-black"
                    type="text"
                    id="name"
                    placeholder="5B"
                    name="name"
                    style={{ borderStyle: "none", color: "rgb(255,255,255)" }}
                  />
                  <span style={validationMessageStyle}>
                    {errors.name && errors.name.message}
                  </span>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div>
                      <label className="form-label text-white">Beds</label>
                      <input
                        {...register("beds", {
                          required: "This is a required field",
                        })}
                        className="form-control text-black"
                        type="number"
                        name="beds"
                        style={{
                          borderStyle: "none",
                          color: "rgb(255,255,255)",
                        }}
                        min="1"
                        step="1"
                      />
                      <span style={validationMessageStyle}>
                        {errors.beds && errors.beds.message}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div>
                      <label className="form-label text-white">Baths</label>
                      <input
                        {...register("baths", {
                          required: "This is a required field",
                        })}
                        className="form-control text-black "
                        type="number"
                        name="baths"
                        style={{
                          borderStyle: "none",
                          color: "rgb(255,255,255)",
                        }}
                        min="1"
                        step="1"
                      />
                      <span style={validationMessageStyle}>
                        {errors.baths && errors.baths.message}
                      </span>
                    </div>
                  </div>
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
  );
};

export default CreateUnit;
