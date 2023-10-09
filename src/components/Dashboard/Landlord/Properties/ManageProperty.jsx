import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { deleteProperty, deleteUnit, getProperty } from "../../../../api/api";
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
import UIButton from "../../UIComponents/UIButton";
import { getUnits } from "../../../../api/api";
import { uiGreen, uiRed } from "../../../../constants";
import BackButton from "../../UIComponents/BackButton";
import { set, useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../../constants";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import DeleteButton from "../../UIComponents/DeleteButton";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UITable from "../../UIComponents/UITable/UITable";
const ManageProperty = () => {
  const { id } = useParams();
  const [property, setProperty] = useState({});
  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(true); //create a loading variable to display a loading message while the units are  being retrieved
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [responseMessage, setResponseMessage] = useState("Property updated");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

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
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
    onRowClick: handleRowClick,
    //CREate a function to handle the row delete
    onRowsDelete: (rowsDeleted, data) => {
      console.log(rowsDeleted);
      //Create an array to hold the ids of the rows to be deleted
      const idsToDelete = [];
      //Loop through the rows to be deleted and push the ids to the idsToDelete array
      rowsDeleted.data.map((row) => {
        //Check if the unit is occupied before deleting
        if (units[row.dataIndex].is_occupied === true) {
          setShowDeleteError(true);
          setErrorMessage(
            `One or more of the units you have selected is occupied. Please make sure the unit is vacant before deleting it.`
          );
          return false;
        } else {
          idsToDelete.push(units[row.dataIndex].id);
        }
      });
      //Delete Unit if it is not occupied
      idsToDelete.map((id) => {
        deleteUnit(id).then((res) => {
          console.log(res);
          //If the delete was successful, remove the deleted rows from the properties state
          const newUnits = units.filter((unit) => unit.id !== id);
          setUnits(newUnits);
        });
      });
    },
  };
  console.log(units);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getProperty(id).then((res) => {
      setProperty(res);
      const preloadedData = {
        name: res.name,
        street: res.street,
        city: res.city,
        state: res.state,
        zip_code: res.zip_code,
        country: res.country,
      };
      // Set the preloaded data in the form using setValue
      Object.keys(preloadedData).forEach((key) => {
        setValue(key, preloadedData[key]);
      });
      setUnits(res.units);
      //Retireve the units for the property
      getUnits(id)
        .then((res) => {
          setUnits(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }, []);

  //Create a handle function to handle the form submission of updating property info
  const onSubmit = async (data) => {
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

  const handleDeleteProperty = async () => {
    //Check if property has units before deleting
    if (units.length > 0) {
      //Hide confirm modal
      setShowDeleteAlert(false);
      setShowDeleteError(true);
      setErrorMessage(
        `This property has units. Please delete units first before deleting the property.`
      );
    } else {
      deleteProperty(id).then((res) => {
        console.log(res);
        navigate("/dashboard/landlord/properties");
      });
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
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                      <label className="form-label text-white" htmlFor="name">
                        <strong>Name</strong>
                      </label>
                      <input
                        {...register("name", {
                          required: "This is a required field",
                        })}
                        // defaultValue={property.name}
                        name="name"
                        className="form-control"
                        type="text"
                        id="name"
                        placeholder="Sunset Blvd, 38"
                        style={{ borderStyle: "none" }}
                      />
                      <span style={validationMessageStyle}>
                        {errors.name && errors.name.message}
                      </span>
                    </div>
                    <div className="mb-3">
                      <label
                        className="form-label text-white"
                        htmlFor="address"
                      >
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
                        name="street"
                        // defaultValue={property.street}
                        className="form-control"
                        type="text"
                        placeholder="Sunset Blvd, 38"
                        style={{ borderStyle: "none" }}
                      />
                      <span style={validationMessageStyle}>
                        {errors.street && errors.street.message}
                      </span>
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
                            {...register("city", {
                              required: "This is a required field",
                            })}
                            // defaultValue={property.city}
                            className="form-control"
                            type="text"
                            placeholder="Los Angeles"
                            style={{ borderStyle: "none" }}
                          />
                          <span style={validationMessageStyle}>
                            {errors.city && errors.city.message}
                          </span>
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
                            {...register("state", {
                              required: "This is a required field",
                            })}
                            // defaultValue={property.state}
                            className="form-control"
                            type="text"
                            id="state"
                            placeholder="California"
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
                            {...register("zip_code", {
                              required: "This is a required field",
                            })}
                            // defaultValue={property.zip_code}
                            className="form-control"
                            type="text"
                            id="zip_code"
                            placeholder="USA"
                            style={{ borderStyle: "none" }}
                          />
                          <span style={validationMessageStyle}>
                            {errors.zip_code && errors.zip_code.message}
                          </span>
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
                            {...register("country", {
                              required: "This is a required field",
                            })}
                            // defaultValue={property.country}
                            className="form-control"
                            type="text"
                            id="country-1"
                            placeholder="USA"
                            style={{ borderStyle: "none" }}
                          />
                          <span style={validationMessageStyle}>
                            {errors.country && errors.country.message}
                          </span>
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
                          <UITable
                            columns={columns}
                            endpoint="/units/"
                            title="Units"
                            createURL={`/dashboard/landlord/units/create/${id}`}
                            // detailURL={`/dashboard/landlord/units/${rowData[0]}/${property.id}`}
                            detailURL={`/`}
                            showCreate={true}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* {units.length === 0 && ( */}
          {true && (
            <>
              <AlertModal
                open={showDeleteError}
                setOpen={setShowDeleteError}
                title={"Error"}
                message={errorMessage}
                btnText={"Ok"}
                onClick={() => setShowDeleteError(false)}
              />
              <ConfirmModal
                open={showDeleteAlert}
                title="Delete Property"
                message="Are you sure you want to delete this property?"
                confirmBtnText="Delete"
                cancelBtnText="Cancel"
                confirmBtnStyle={{
                  backgroundColor: uiRed,
                  color: "white",
                }}
                cancelBtnStyle={{
                  backgroundColor: uiGreen,
                  color: "white",
                }}
                handleCancel={() => {
                  setShowDeleteAlert(false);
                }}
                handleConfirm={handleDeleteProperty}
              />
              <DeleteButton
                style={{
                  background: uiRed,
                  textTransform: "none",
                  float: "right",
                }}
                onClick={() => {
                  setShowDeleteAlert(true);
                }}
                btnText="Delete Property"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageProperty;
