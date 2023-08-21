import React, { useEffect, useState } from "react";
import { updateUnit, getUnit } from "../../../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../BackButton";
import { Alert, Button } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";

const CreateUnit = () => {
  //Create a state for the form data
  const [name, setName] = useState("");
  const [rent, setRent] = useState(1000);
  const [beds, setBeds] = useState(1);
  const [baths, setBaths] = useState(1);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [responseMessage, setResponseMessage] = useState(
    "Unit updated successfully"
  );
  const [alertSeverity, setAlertSeverity] = useState("success");
  const navigate = useNavigate();
  const { unit_id, property_id } = useParams();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowUpdateSuccess(false);
  };

  useEffect(() => {
    getUnit(unit_id).then((res) => {
      console.log(res);
      setName(res.name);
      setRent(res.rent);
      setBeds(res.beds);
      setBaths(res.baths);
    });
  }, []);

  //Create a function to handle the form submission to update unit information
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log(data);
    const res = await updateUnit(unit_id, data);
    console.log(res);
    if (res.id) {
      setShowUpdateSuccess(true);
      setAlertSeverity("success");
      setResponseMessage("Unit updated");
    }else{
      setShowUpdateSuccess(true);
      setAlertSeverity("error");
      setResponseMessage("Something went wrong");
    }
  };

  return (
    <div className="container">
      <Snackbar
        open={showUpdateSuccess}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: "100%" }}>
          <>
            {responseMessage}
          </>
        </Alert>
      </Snackbar>
      <div className="row mb-3">
        <div className="col-sm-12 col-md-12 col-lg-8 offset-sm-0 offset-md-0 offset-lg-2">
          <BackButton />
          <div className="card shadow mb-3">
            <div className="card-header p-3">
              <h6 className="text-primary fw-bold m-0 card-header-text">
                Manage Unit
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ borderStyle: "none", color: "rgb(255,255,255)" }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-white" htmlFor="rent">
                    <strong>Rent Price</strong>
                  </label>
                  <input
                    className="form-control text-black"
                    type="number"
                    id="rent"
                    placeholder="Sunset Blvd, 38"
                    name="rent"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    required
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
                    Update Unit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-sm-12 col-md-12 col-lg-8 offset-sm-0 offset-md-0 offset-lg-2">
          <div className="card shadow mb-3">
            <div className="card-header p-3">
              <h6 className="text-primary fw-bold m-0 card-header-text">
                Manage Tenant
              </h6>
            </div>
            <div className="card-body"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUnit;
