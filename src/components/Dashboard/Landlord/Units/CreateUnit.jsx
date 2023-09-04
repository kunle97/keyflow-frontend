import React, { useState } from "react";
import { createUnit } from "../../../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { faker } from "@faker-js/faker";
import BackButton from "../../BackButton";

const CreateUnit = () => {
  //Create a state for the form data
  const [nameGen, setNameGen] = useState(true);
  const [name, setName] = useState("");
  const [beds, setBeds] = useState(faker.number.int({ min: 4, max: 10 }));
  const [baths, setBaths] = useState(faker.number.int({ min: 4, max: 6 }));
  const navigate = useNavigate();
  const { property_id } = useParams();
  //Call the create unit api function and pass the form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log(data);
    const res = await createUnit(data);
    console.log(res);
    if (res.status === 200) {
      navigate(`/dashboard/properties/${property_id}`);
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
              <form onSubmit={handleSubmit}>
                <input
                  type="hidden"
                  name="rental_property"
                  value={property_id}
                />
                <div className="mb-3">
                  <label className="form-label text-white" htmlFor="name">
                    <strong>Unit #/Name</strong>
                  </label>
                  <input
                    className="form-control text-black"
                    type="text"
                    id="name"
                    placeholder="5B"
                    name="name"
                    required
                    value={
                      nameGen
                        ? `${faker.string.alpha()}${faker.finance.accountNumber(
                            1
                          )}`
                        : `${name}`
                    }
                    onChange={(e) => setName(e.target.value)}
                    style={{ borderStyle: "none", color: "rgb(255,255,255)" }}
                  />
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div>
                      <label className="form-label text-white">Beds</label>
                      <input
                        className="form-control text-black "
                        type="number"
                        name="beds"
                        value={beds}
                        onChange={(e) => setBeds(e.target.value)}
                        required
                        style={{
                          borderStyle: "none",
                          color: "rgb(255,255,255)",
                        }}
                        min="1"
                        step="1"
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div>
                      <label className="form-label text-white">Baths</label>
                      <input
                        className="form-control text-black "
                        type="number"
                        name="baths"
                        value={baths}
                        onChange={(e) => setBaths(e.target.value)}
                        required
                        style={{
                          borderStyle: "none",
                          color: "rgb(255,255,255)",
                        }}
                        min="1"
                        step="1"
                      />
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
