import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { deleteUnit } from "../../../../api/units";
import {
  Alert,
  Avatar,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
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
import { authenticatedInstance } from "../../../../api/api";
import FileManagerView from "../../UIComponents/FileManagerView";
import { retrieveFilesBySubfolder } from "../../../../api/file_uploads";
import UIProgressPrompt from "../../UIComponents/UIProgressPrompt";
import useScreen from "../../../../hooks/useScreen";
import HotelIcon from "@mui/icons-material/Hotel";
import BathtubIcon from "@mui/icons-material/Bathtub";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import EditIcon from "@mui/icons-material/Edit";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import UISwitch from "../../UIComponents/UISwitch";
const ManageProperty = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [units, setUnits] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [unitCount, setUnitCount] = useState(0); //Create a state to hold the number of units in the property
  const [isLoading, setIsLoading] = useState(true); //create a loading variable to display a loading message while the units are  being retrieved
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [bedsCount, setBedsCount] = useState(0); //Create a state to hold the number of beds in the property
  const [bathsCount, setBathsCount] = useState(0); //Create a state to hold the number of baths in the property
  const [responseMessage, setResponseMessage] = useState("Property updated");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [tabPage, setTabPage] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState(null); //Create a file state to hold the file to be uploaded
  const [propertyMedia, setPropertyMedia] = useState([]); //Create a propertyMedia state to hold the property media files
  const [propertyMediaCount, setPropertyMediaCount] = useState(0); //Create a propertyMediaCount state to hold the number of property media files
  const { isMobile, breakpoints, screenWidth } = useScreen();
  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowUpdateSuccess(false);
  };

  const tabs = [
    { name: "details", label: "Details" },
    { name: "units", label: `Units (${unitCount})` },
    { name: "analytics", label: "Finances/Analytics" },
    { name: "media", label: `Files (${propertyMediaCount})` },
    { name: "preferences", label: "Preferences" },
  ];
  const handleChangeTabPage = (event, newValue) => {
    setTabPage(newValue);
  };

  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/landlord/units/${rowData}/${property.id}`;
    navigate(navlink);
  };
  const columns = [
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
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm(
    //Set the default values of the form inputs
    {
      defaultValues: {
        name: property?.name,
        street: property?.street,
        city: property?.city,
        state: property?.state,
        zip_code: property?.zip_code,
        country: property?.country,
      },
    }
  );
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
        navigate("/dashboard/landlord/properties");
      });
    }
  };

  useEffect(() => {
    if (!property) {
      getProperty(id).then((res) => {
        setProperty(res.data);
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
        setUnits(res.data.units);
        setUnitCount(res.data.units.length);
        setBedsCount(
          res.data.units.map((unit) => unit.beds).reduce((a, b) => a + b, 0)
        );
        setBathsCount(
          res.data.units.map((unit) => unit.baths).reduce((a, b) => a + b, 0)
        );
      });
      retrieveFilesBySubfolder(`properties/${id}`, authUser.user_id)
        .then((res) => {
          setPropertyMedia(res.data);
          console.log(res.data);
          setPropertyMediaCount(res.data.length);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [property]);

  return (
    <>
      {isLoading ? (
        <UIProgressPrompt
          title="Loading Property"
          message="Please wait while we load the property information for you."
        />
      ) : (
        <div className={`${screenWidth > breakpoints.md && "container-fluid"}`}>
          {/* <BackButton  /> */}

          <div>
            {propertyMedia && propertyMedia.length > 0 && (
              <div
                style={{
                  width: "100%",
                  height: isMobile ? "200px" : "320px",
                  //Vertical center the image
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={propertyMedia[0].file}
                  style={{
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
            {/* Property Detail Edit Dialog  */}
            <UIDialog
              open={editDialogOpen}
              onClose={() => setEditDialogOpen(false)}
              maxWidth="md"
              title="Edit Property Details"
            >
              <div className="row">
                <div className="col-md-12">
                  <div className=" mb-3">
                    <div className="card-body">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                          <label
                            className="form-label text-dark"
                            htmlFor="name"
                          >
                            <strong>Property Name</strong>
                          </label>
                          <input
                            {...register("name", {
                              required: "This is a required field",
                            })}
                            defaultValue={property?.name}
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
                            className="form-label text-dark"
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
                            defaultValue={property?.street}
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
                                className="form-label text-dark"
                                htmlFor="city"
                              >
                                <strong>City</strong>
                              </label>
                              <input
                                {...register("city", {
                                  required: "This is a required field",
                                })}
                                defaultValue={property?.city}
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
                                className="form-label text-dark"
                                htmlFor="state"
                              >
                                <strong>State</strong>
                              </label>
                              <input
                                {...register("state", {
                                  required: "This is a required field",
                                })}
                                defaultValue={property?.state}
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
                                className="form-label text-dark"
                                htmlFor="zipcode"
                              >
                                <strong>Zip Code</strong>
                              </label>
                              <input
                                {...register("zip_code", {
                                  required: "This is a required field",
                                })}
                                defaultValue={property?.zip_code}
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
                                className="form-label text-dark"
                                htmlFor="country"
                              >
                                <strong>Country</strong>
                              </label>
                              <input
                                {...register("country", {
                                  required: "This is a required field",
                                })}
                                defaultValue={property?.country}
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
                          <UIButton
                            className="btn btn-primary btn-sm ui-btn"
                            type="submit"
                            btnText="Save Changes"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </UIDialog>
            <div className="p-2">
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <div>
                  <h4>{property?.name}</h4>
                  <span className="text-black">
                    {property?.street} {property?.city}, {property?.state}{" "}
                    {property?.zip_code}
                  </span>
                </div>
                <IconButton
                  onClick={() => {
                    setEditDialogOpen(true);
                  }}
                >
                  <EditIcon sx={{ color: uiGreen }} />
                </IconButton>
              </Stack>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-lg-12">
              <UITabs
                tabs={tabs}
                value={tabPage}
                handleChange={handleChangeTabPage}
                variant="scrollable"
                scrollButtons="auto"
                style={{ margin: "1rem 0" }}
              />
              {tabPage === 0 && (
                <div className="px-2">
                  <div className="row mb-3">
                    <div className="col-4 col-sm-4 col-md-3 mb-4">
                      <div className="card">
                        <div className="card-body">
                          <div>
                            <MeetingRoomIcon
                              sx={{
                                fontSize: "22pt",
                                color: uiGreen,
                                marginBottom: "10px",
                              }}
                            />
                          </div>
                          <span
                            className="text-black"
                            style={{
                              fontSize:
                                isMobile ? "12pt" : "15pt",
                            }}
                          >
                            {unitCount} Units
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-4 col-sm-4 col-md-3 mb-4">
                      <div className="card">
                        <div className="card-body">
                          <div>
                            <HotelIcon
                              sx={{
                                fontSize: "22pt",
                                color: uiGreen,
                                marginBottom: "10px",
                              }}
                            />
                          </div>
                          <span
                            className="text-black"
                            style={{
                              fontSize:
                                isMobile ? "12pt" : "15pt",
                            }}
                          >
                            {bedsCount} Beds
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-4 col-sm-4 col-md-3 mb-4">
                      <div className="card">
                        <div className="card-body">
                          <div>
                            <BathtubIcon
                              sx={{
                                fontSize: "22pt",
                                color: uiGreen,
                                marginBottom: "10px",
                              }}
                            />
                          </div>
                          <span
                            className="text-black"
                            style={{
                              fontSize:
                                isMobile ? "12pt" : "15pt",
                            }}
                          >
                            {bathsCount} Baths
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-4 col-sm-4 col-md-3 mb-4">
                      <div className="card">
                        <div className="card-body">
                          <div>
                            <ZoomOutMapIcon
                              sx={{
                                fontSize: "22pt",
                                color: uiGreen,
                                marginBottom: "10px",
                              }}
                            />
                          </div>
                          <span
                            className="text-black"
                            style={{
                              fontSize:
                                isMobile ? "12pt" : "15pt",
                            }}
                          >
                            1234 Sq. Ft.
                          </span>
                        </div>
                      </div>
                    </div>

                    {property?.description && (
                      <div className="col-12 mb-4">
                        <div className="card">
                          <div className="card-body">
                            <h5 className="text-black ">Description</h5>
                            <p className="text-black">
                              {property?.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
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
                  </div>
                </div>
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
                            icon={
                              <i className="fas fa-home fa-2x text-gray-300" />
                            }
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
                          <div>
                            {false ? (
                              <UITable
                                columns={columns}
                                options={options}
                                data={units}
                                title="Units"
                                createURL={`/dashboard/landlord/units/create/${id}`}
                                showCreate={true}
                              />
                            ) : (
                              <UITableMobile
                                data={units}
                                infoProperty="name"
                                createTitle={(row) =>
                                  `Occupied: ${row.is_occupied ? `Yes` : "No"} `
                                }
                                createSubtitle={(row) =>
                                  `Beds: ${row.beds} | Baths: ${row.baths}`
                                }
                                createURL={`/dashboard/landlord/units/create/${id}`}
                                showCreate={true}
                                // getImage={(row) => {
                                //   retrieveFilesBySubfolder(
                                //     `properties/${property.id}/units/${row.id}`,
                                //     authUser.user_id
                                //   ).then((res) => {
                                //     if (res.data.length > 0) {
                                //       return res.data[0].file;
                                //     } else {
                                //       return "https://picsum.photos/200";
                                //     }
                                //   });
                                // }}
                                onRowClick={(row) => {
                                  const navlink = `/dashboard/landlord/units/${row.id}/${row.rental_property}`;
                                  navigate(navlink);
                                }}
                              />
                            )}
                          </div>
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
                                className="form-label text-dark"
                                htmlFor="username"
                              >
                                <strong>Total Revenue</strong>
                              </label>
                              <p className="text-dark">$23,049</p>
                            </div>
                            <div className="mb-3">
                              <label
                                className="form-label text-dark"
                                htmlFor="first_name"
                              >
                                <strong>Net Operating Income (NOI)</strong>
                              </label>
                              <p className="text-dark">23.4%</p>
                            </div>
                            <div className="mb-3">
                              <label
                                className="form-label text-dark"
                                htmlFor="first_name"
                              >
                                <strong>Property Value</strong>
                              </label>
                              <p className="text-dark">$428,324</p>
                            </div>
                            <div className="mb-3">
                              <label
                                className="form-label text-dark"
                                htmlFor="email"
                              >
                                <strong>Total Expenses</strong>
                              </label>
                              <p className="text-dark">$13,123</p>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
              {tabPage === 3 && (
                <div>
                  <FileManagerView
                    files={propertyMedia}
                    subfolder={`properties/${id}`}
                    acceptedFileTypes={[".png", ".jpg", ".jpeg"]}
                  />
                </div>
              )}
              {tabPage === 4 && (
                <div
                  className={isMobile && "container-fluid"}
                >
                  <List
                    sx={{
                      width: "100%",
                      // maxWidth: 360,
                    }}
                  >
                    {[0, 1, 2, 3].map((value) => {
                      return (
                        <ListItem
                          style={{
                            borderRadius: "10px",
                            background: "white",
                            margin: "10px 0",
                            boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ width: "100%" }}
                          >
                            <ListItemText
                              primary={
                                <Typography sx={{ color: "black" }}>
                                  Open Applications
                                </Typography>
                              }
                              secondary={
                                <React.Fragment>
                                  {
                                    "Rental applications that are allowed to be created for units in this property."
                                  }
                                </React.Fragment>
                              }
                            />
                            <UISwitch />
                          </Stack>
                        </ListItem>
                      );
                    })}
                  </List>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageProperty;
