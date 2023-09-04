import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getProperty } from "../../../../api/api";
import {
  Alert,
  Card,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import { updateProperty } from "../../../../api/api";
import { useNavigate } from "react-router";
import MUIDataTable from "mui-datatables";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import UIButton from "../../UIButton";
import { getUnits } from "../../../../api/api";
import { uiGreen } from "../../../../constants";
import BackButton from "../../BackButton";

const ManageProperty = () => {
  const { id } = useParams();
  const [property, setProperty] = useState({});
  //Create state variables for each property field
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [units, setUnits] = useState([]);
  //create a loading variable to display a loading message while the units are  being retrieved
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [responseMessage, setResponseMessage] = useState("Property updated");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShowUpdateSuccess(false);
  };

  const columns = [
    { name: "id", label: "ID", options: { display: false } },
    { name: "name", label: "Name" },
    { name: "beds", label: "Beds" },
    { name: "baths", label: "Baths" },
    {
      name: "is_occupied",
      label: "Occupied",
      options: {
        customBodyRender: (value) => {
          if (value === true) {
            return <span>Yes</span>;
          } else {
            return <span>No</span>;
          }
        },
      },
    },
  ];
  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/landlord/units/${rowData[0]}/${property.id}`;
    navigate(navlink);
  };
  const options = {
    filter: true,
    sort: true,
    onRowClick: handleRowClick,
  };
  console.log(units);
  useEffect(() => {
    getProperty(id).then((res) => {
      setProperty(res);
      setName(res.name);
      setAddress(res.address);
      setCity(res.city);
      setState(res.state);
      setZip(res.zip_code);
      setCountry(res.country);
      setUnits(res.units);
    });
  }, []);

  useEffect(() => {
    //Retireve the units for the property
    getUnits(id)
      .then((res) => {
        setUnits(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [property]);

  //Create a handle function to handle the form submission of updating property info
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const res = await updateProperty(id, data);
    if (res.id) {
      setShowUpdateSuccess(true);
      setAlertSeverity("success");
      setResponseMessage("Property updated");
    } else {
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
        <Alert
          onClose={handleClose}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          <>{responseMessage}</>
        </Alert>
      </Snackbar>
      <div className="row mb-3">
        <div className="col-lg-12">
          <BackButton />
          <div className="row">
            <div className="col">
              <div className="card shadow mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h6 className="text-primary fw-bold m-0 card-header-text">
                    Address
                  </h6>
                  <div className="dropdown no-arrow">
                    <button
                      className="btn btn-link btn-sm dropdown-toggle"
                      aria-expanded="false"
                      data-bs-toggle="dropdown"
                      type="button"
                    >
                      <i className="fas fa-ellipsis-v text-gray-400" />
                    </button>
                    <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                      <p className="text-center dropdown-header">
                        dropdown header:
                      </p>
                      <a className="dropdown-item" href="#">
                        &nbsp;Action
                      </a>
                      <a className="dropdown-item" href="#">
                        &nbsp;Another action
                      </a>
                      <div className="dropdown-divider" />
                      <a className="dropdown-item" href="#">
                        &nbsp;Something else here
                      </a>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label text-white" htmlFor="name">
                        <strong>Name</strong>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        id="name"
                        placeholder="Sunset Blvd, 38"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ borderStyle: "none" }}
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        className="form-label text-white"
                        htmlFor="address"
                      >
                        <strong>Address</strong>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        id="address"
                        placeholder="Sunset Blvd, 38"
                        name="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        style={{ borderStyle: "none" }}
                      />
                    </div>
                    <div className="row">
                      <div className="col-sm-12 col-md-4 col-lg-4">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="city"
                          >
                            <strong>City</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            id="city"
                            placeholder="Los Angeles"
                            name="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            style={{ borderStyle: "none" }}
                          />
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-4 col-lg-4">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="state"
                          >
                            <strong>State</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            id="state"
                            placeholder="California"
                            name="state"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            style={{ borderStyle: "none" }}
                          />
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-4 col-lg-4">
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
                            id="zip_code"
                            placeholder="USA"
                            name="zip_code"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            style={{ borderStyle: "none" }}
                          />
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12">
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
                            id="country-1"
                            placeholder="USA"
                            name="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            style={{ borderStyle: "none" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-end mb-3">
                      <button
                        className="btn btn-primary btn-sm ui-btn"
                        type="submit"
                      >
                        Save&nbsp;Settings
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 col-sm-12">
                  <div className="card shadow mb-3">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h6 className="text-primary fw-bold m-0 card-header-text">
                        Proeprty Information
                      </h6>
                      <div className="dropdown no-arrow">
                        <button
                          className="btn btn-link btn-sm dropdown-toggle"
                          aria-expanded="false"
                          data-bs-toggle="dropdown"
                          type="button"
                        >
                          <i className="fas fa-ellipsis-v text-gray-400" />
                        </button>
                        <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                          <p className="text-center dropdown-header">
                            dropdown header:
                          </p>
                          <a className="dropdown-item" href="#">
                            &nbsp;Action
                          </a>
                          <a className="dropdown-item" href="#">
                            &nbsp;Another action
                          </a>
                          <div className="dropdown-divider" />
                          <a className="dropdown-item" href="#">
                            &nbsp;Something else here
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <form>
                        <div className="row">
                          <div className="col">
                            <div className="mb-3">
                              <label
                                className="form-label text-white"
                                htmlFor="first_name"
                              >
                                <strong>Beds</strong>
                              </label>
                              <p className="text-white">4</p>
                            </div>
                            <div className="mb-3">
                              <label
                                className="form-label text-white"
                                htmlFor="last_name"
                              >
                                <strong>Baths</strong>
                              </label>
                              <p className="text-white">2</p>
                            </div>
                            <div className="mb-3">
                              <label
                                className="form-label text-white"
                                htmlFor="last_name"
                              >
                                <strong>MLS #</strong>
                              </label>
                              <p className="text-white">
                                732EFH82F8BO189FB917B
                              </p>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="card shadow mb-3">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h6 className="text-primary fw-bold m-0 card-header-text">
                        Finances
                      </h6>
                      <div className="dropdown no-arrow">
                        <button
                          className="btn btn-link btn-sm dropdown-toggle"
                          aria-expanded="false"
                          data-bs-toggle="dropdown"
                          type="button"
                        >
                          <i className="fas fa-ellipsis-v text-gray-400" />
                        </button>
                        <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                          <p className="text-center dropdown-header">
                            dropdown header:
                          </p>
                          <a className="dropdown-item" href="#">
                            &nbsp;Action
                          </a>
                          <a className="dropdown-item" href="#">
                            &nbsp;Another action
                          </a>
                          <div className="dropdown-divider" />
                          <a className="dropdown-item" href="#">
                            &nbsp;Something else here
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <form>
                        <div className="row">
                          <div className="col">
                            <div className="mb-3">
                              <label
                                className="form-label text-white"
                                htmlFor="username"
                              >
                                <strong>Total Revenue</strong>
                              </label>
                              <p className="text-white">$23,049</p>
                            </div>
                            <div className="mb-3">
                              <label
                                className="form-label text-white"
                                htmlFor="first_name"
                              >
                                <strong>Net Operating Income (NOI)</strong>
                              </label>
                              <p className="text-white">23.4%</p>
                            </div>
                            <div className="mb-3">
                              <label
                                className="form-label text-white"
                                htmlFor="first_name"
                              >
                                <strong>Property Value</strong>
                              </label>
                              <p className="text-white">$428,324</p>
                            </div>
                            <div className="mb-3">
                              <label
                                className="form-label text-white"
                                htmlFor="email"
                              >
                                <strong>Total Expenses</strong>
                              </label>
                              <p className="text-white">$13,123</p>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-md-8 col-sm-12">
                  {isLoading ? (
                    <Box sx={{ display: "flex" }}>
                      <Box m={"55px auto"}>
                        <CircularProgress sx={{ color: uiGreen }} />
                      </Box>
                    </Box>
                  ) : (
                    <>
                      {" "}
                      {units.length === 0 ? (
                        <Box display={"flex"}>
                          <Box m={"auto"}>
                            <Typography
                              mt={5}
                              color={"white"}
                              textAlign={"center"}
                            >
                              No units created
                            </Typography>
                            <UIButton
                              style={{ marginTop: "20px" }}
                              onClick={() => {
                                navigate(
                                  `/dashboard/landlord/units/create/${id}`
                                );
                              }}
                              btnText="Create Unit"
                            />
                          </Box>
                        </Box>
                      ) : (
                        <>
                          <Box sx={{ overflow: "auto" }}>
                            <Link to={`/dashboard/landlord/units/create/${id}`}>
                              <Button
                                className="w-full"
                                style={{
                                  marginBottom: "20px",
                                  backgroundColor: uiGreen,
                                  float: "right",
                                  color: "white",
                                  textTransform: "none",
                                }}
                              >
                                Add Unit
                              </Button>
                            </Link>
                          </Box>
                          <Card>
                            <MUIDataTable
                              title={"Units"}
                              data={units}
                              columns={columns}
                              options={options}
                            />
                          </Card>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProperty;
