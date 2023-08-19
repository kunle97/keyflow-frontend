import React, { useState } from "react";
import { createProperty } from "../../../../api/api";
import { faker } from "@faker-js/faker";
import { Typography } from "@mui/material";
import { authUser } from "../../../../constants";
import { useNavigate } from "react-router";
const CreateProperty = () => {
  //Create state variable that is a boolean to determine if we usee faker or not
  const [enableFaker, setEnableFaker] = useState(true);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  
  const navigate = useNavigate();

  //Create a handle function to handle the form submission of creating a property
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log(data);
    const res = await createProperty(
      data.name,
      data.address,
      data.city,
      data.state,
      data.zipcode,
      data.country
    );
    console.log(res);
    if(res.status === 200){
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
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-white" htmlFor="address">
                    <strong>Name</strong>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="address"
                    placeholder="Lynx Society Highrises"
                    required
                    name="name"
                    value={enableFaker ? faker.company.name() : name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ borderStyle: "none" }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-white" htmlFor="address">
                    <strong>Street Address</strong>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="address-1"
                    placeholder="Sunset Blvd, 38"
                    name="address"
                    value={
                      enableFaker ? faker.location.streetAddress() : address
                    }
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    style={{ borderStyle: "none" }}
                  />
                </div>
                <div className="row">
                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label text-white" htmlFor="city">
                        <strong>City</strong>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        id="city"
                        placeholder="Los Angeles"
                        name="city"
                        value={enableFaker ? faker.location.city() : city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        style={{ borderStyle: "none" }}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label text-white" htmlFor="state">
                        <strong>State</strong>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        id="state"
                        placeholder="Los Angeles"
                        name="state"
                        value={enableFaker ? faker.location.state() : state}
                        onChange={(e) => setState(e.target.value)}
                        required
                        style={{ borderStyle: "none" }}
                      />
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
                        className="form-control"
                        type="text"
                        id="zipcode"
                        placeholder="90210"
                        name="zipcode"
                        value={enableFaker ? faker.location.zipCode() : zip}
                        onChange={(e) => setZip(e.target.value)}
                        required
                        style={{ borderStyle: "none" }}
                      />
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
                        className="form-control"
                        type="text"
                        id="country"
                        placeholder="United States"
                        value={"United States"}
                        name="country"
                        required
                        style={{ borderStyle: "none" }}
                      />
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
