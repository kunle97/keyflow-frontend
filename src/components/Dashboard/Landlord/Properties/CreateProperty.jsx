import React, { useState } from "react";
import { createProperty } from "../../../../api/api";
import { faker } from "@faker-js/faker";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../../constants";
const CreateProperty = () => {
  //Create state variable that is a boolean to determine if we usee faker or not
  const [enableFaker, setEnableFaker] = useState(true);
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: faker.company.name(),
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipcode: faker.location.zipCode(),
      country: "United States",
    },
  });

  //Create a handle function to handle the form submission of creating a property
  const onSubmit = async (data) => {
    const res = await createProperty(
      data.name,
      data.street,
      data.city,
      data.state,
      data.zipcode,
      data.country
    );
    console.log(res);
    if (res.status === 200) {
      navigate("/dashboard/properties");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-sm-12 col-md-12 col-lg-8 offset-sm-0 offset-md-0 offset-lg-2">
          <div className="card shadow mb-3">
            <div className="card-header py-3">
              <Typography>Add A Property</Typography>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
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
                      <label className="form-label text-white" htmlFor="city">
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
                      <label className="form-label text-white" htmlFor="state">
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
                        <option selected value={faker.location.state()}>
                          {faker.location.state()}
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
                <div className="text-end my-3">
                  <button className="btn btn-primary ui-btn" type="submit">
                    Create Property
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

export default CreateProperty;
