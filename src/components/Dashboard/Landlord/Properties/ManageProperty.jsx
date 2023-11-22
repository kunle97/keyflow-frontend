import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { deleteUnit } from "../../../../api/units";
import { Alert, CircularProgress, Snackbar, Typography } from "@mui/material";
import {
  deleteProperty,
  updateProperty,
  getProperty,
} from "../../../../api/properties";
import { useNavigate } from "react-router";
import { Box } from "@mui/material";
import UIButton from "../../UIComponents/UIButton";
import { authUser, uiGreen, uiRed } from "../../../../constants";
import BackButton from "../../UIComponents/BackButton";
import { set, useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../../constants";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import DeleteButton from "../../UIComponents/DeleteButton";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UITable from "../../UIComponents/UITable/UITable";
import UITabs from "../../UIComponents/UITabs";
import UIPrompt from "../../UIComponents/UIPrompt";
import Dropzone from "react-dropzone";
import { Stack } from "@mui/material";
import { uploadFile } from "../../../../api/file_uploads";
import { authenticatedInstance } from "../../../../api/api";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
const ManageProperty = () => {
  const { id } = useParams();
  const [property, setProperty] = useState({});
  const [units, setUnits] = useState([]);
  const [unitCount, setUnitCount] = useState(0); //Create a state to hold the number of units in the property
  const [isLoading, setIsLoading] = useState(true); //create a loading variable to display a loading message while the units are  being retrieved
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showFileUploadAlert, setShowFileUploadAlert] = useState(false); //Create a state to hold the value of the alert modal
  const [responseTitle, setResponseTitle] = useState("Success");
  const [responseMessage, setResponseMessage] = useState("Property updated");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [tabPage, setTabPage] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState(null); //Create a file state to hold the file to be uploaded
  const [propertyMedia, setPropertyMedia] = useState([]); //Create a propertyMedia state to hold the property media files
  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowUpdateSuccess(false);
  };

  const tabs = [
    { name: "property_details", label: "Property Details" },
    { name: "units", label: `Units (${unitCount})` },
    { name: "analytics", label: "Finances/Analytics" },
    { name: "media", label: "Media" },
  ];
  const handleChangeTabPage = (event, newValue) => {
    setTabPage(newValue);
  };

  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/landlord/units/${rowData}/${property.id}`;
    navigate(navlink);
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

  const handleDrop = async (acceptedFiles) => {
    let accepted_file = acceptedFiles[0];
    console.log("dropzone file", accepted_file);
    setFile(accepted_file);
  };
  const handleFileUploadSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!file) {
      console.error("No file selected");
      return;
    }

    const payload = {
      file: file,
      user: authUser.user_id,
      subfolder: `properties/${property.id}`,
    };
    uploadFile(payload).then((res) => {
      console.log(res);
      setIsLoading(false);
      if (res.status === 201) {
        setResponseTitle("File Upload");
        setResponseMessage("File uploaded successfully");
        setShowFileUploadAlert(true);
      } else {
        setResponseTitle("File Upload Error");
        setResponseMessage("Something went wrong");
        setShowFileUploadAlert(true);
      }
    });
  };
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
      setUnitCount(res.units.length);
      console.log("State UNITS", units);
      setIsLoading(false);
    });
    authenticatedInstance
      .get(`/file-uploads/?subfolder=properties/${id}`)
      .then((res) => {
        setPropertyMedia(res.data);
      });
  }, []);

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
          <UITabs
            tabs={tabs}
            value={tabPage}
            handleChange={handleChangeTabPage}
            variant="scrollable"
            scrollButtons="auto"
            style={{ margin: "1rem 0" }}
          />
          {tabPage === 0 && (
            <>
              <div className="row">
                <div className="col-md-3">
                  <div className="card shadow mb-3">
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
                </div>
                <div className="col-md-9">
                  <div className="card shadow mb-3">
                    <div className="card-body">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="name"
                          >
                            <strong>Property Name</strong>
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
                </div>
              </div>
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
            </>
          )}

          {tabPage === 1 && (
            <>
              <div className="row">
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
                      <UIPrompt
                        title={"No Units Created"}
                        icon={<i className="fas fa-home fa-2x text-gray-300" />}
                        message={
                          "You have not created any units for this property. Would you like to create one now?"
                        }
                        btnText={"Create Unit"}
                        body={
                          <UIButton
                            btnText={"Create Unit"}
                            onClick={() => {
                              navigate(
                                `/dashboard/landlord/units/create/${id}`
                              );
                            }}
                          />
                        }
                      />
                    ) : (
                      <>
                        <UITable
                          columns={columns}
                          options={options}
                          data={units}
                          title="Units"
                          createURL={`/dashboard/landlord/units/create/${id}`}
                          showCreate={true}
                        />
                      </>
                    )}
                  </>
                )}
              </div>
            </>
          )}
          {tabPage === 2 && (
            <div className="col-md-4 col-sm-12">
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
          )}
          {tabPage === 3 && (
            <>
              <AlertModal
                open={showFileUploadAlert}
                title={responseTitle}
                message={responseMessage}
                btnText={"Ok"}
                onClick={() => setShowFileUploadAlert(false)}
              />
              <ProgressModal open={isLoading} title={"Uploading File"} />
              <div className="row">
                <div className="col-md-12">
                  <form onSubmit={handleFileUploadSubmit}>
                    <h2>Upload a new file</h2>
                    <Dropzone
                      onDrop={handleDrop}
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      minSize={1024}
                      maxSize={3145728}
                      maxFiles={1}
                    >
                      {({
                        getRootProps,
                        getInputProps,
                        isDragActive,
                        isDragAccept,
                        isDragReject,
                      }) => {
                        const additionalClass = isDragAccept
                          ? "accept"
                          : isDragReject
                          ? "reject"
                          : "";

                        return (
                          <Stack
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            spacing={2}
                            {...getRootProps({
                              className: `dropzone ${additionalClass}`,
                            })}
                            style={{
                              width: "100%",
                              height: "400px",
                              border: `1px dashed ${uiGreen}`,
                              marginBottom: "15px",
                            }}
                          >
                            <input
                              {...getInputProps()}
                              onChange={(e) => {
                                setFile(e.target.files[0]);
                                console.log("onChange file", e.target.files[0]);
                                console.log("onCHange state file", file);
                                handleDrop([e.target.files[0]]);
                              }}
                              type="file"
                              name="file"
                            />

                            {!file ? (
                              <>
                                <p>
                                  Drag'n'drop the file representing your lease
                                  agreeement{" "}
                                </p>
                                <p>
                                  Only .pdf, .doc, .docx, .png, .jpg, and .jpeg
                                  files will be accepted (Max. file size: 3MB)
                                </p>
                              </>
                            ) : (
                              <>
                                <p>Selected File</p>
                                <p>
                                  {file.name} - {file.size} bytes
                                </p>
                              </>
                            )}

                            <UIButton
                              btnText={file ? "Select New File" : "Upload File"}
                              type="button"
                            />
                          </Stack>
                        );
                      }}
                    </Dropzone>
                    <UIButton type="submit" btnText="Submit" />
                  </form>
                </div>{" "}
                <div className="col-md-12 mt-5">
                  <h2>Files ({propertyMedia.length})</h2>
                  <div className="row">
                    {propertyMedia.map((media) => (
                      <div className="col-md-3">
                        <div className="card shadow mb-3">
                          <div className="card-body">
                            <img
                              src={media.file_s3_url}
                              alt="media"
                              style={{ width: "100%", height: "100%" }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageProperty;
