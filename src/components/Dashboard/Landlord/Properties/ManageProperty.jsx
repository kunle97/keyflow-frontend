import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { deleteUnit } from "../../../../api/units";
import {
  Alert,
  Avatar,
  Button,
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
import { authUser, uiGreen, uiGrey2, uiRed } from "../../../../constants";
import BackButton from "../../UIComponents/BackButton";
import { set, useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../../constants";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import DeleteButton from "../../UIComponents/DeleteButton";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UITable from "../../UIComponents/UITable/UITable";
import UITabs from "../../UIComponents/UITabs";
import UIPrompt from "../../UIComponents/UIPrompt";
import {
  authenticatedInstance,
  authenticatedMediaInstance,
} from "../../../../api/api";
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
import { getPortfolios } from "../../../../api/portfolios";
import UIPreferenceRow from "../../UIComponents/UIPreferenceRow";
import UIDropzone from "../../UIComponents/Modals/UploadDialog/UIDropzone";
import {
  isValidFileExtension,
  isValidFileName,
} from "../../../../helpers/utils";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const ManageProperty = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [portfolios, setPortfolios] = useState([]); //Create a state to hold the portfolios
  const [currentPortfolio, setCurrentPortfolio] = useState(null); //Create a state to hold the current portfolio
  const [isUploading, setIsUploading] = useState(false); //Create a state to hold the value of the upload progress

  const [selectPortfolioDialogOpen, setSelectPortfolioDialogOpen] =
    useState(false); //Create a state to hold the select portfolio dialog open state
  const [units, setUnits] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [unitCount, setUnitCount] = useState(0); //Create a state to hold the number of units in the property
  const [updateAlertTitle, setUpdateAlertTitle] = useState("Success"); //Create a state to hold the update alert title
  const [updateAlertMessage, setUpdateAlertMessage] =
    useState("Property updated"); //Create a state to hold the update alert message
  const [updateAlertIsOpen, setUpdateAlertIsOpen] = useState(false); //Create a state to hold the update alert open state
  const [isLoading, setIsLoading] = useState(true); //create a loading variable to display a loading message while the units are  being retrieved
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [bedsCount, setBedsCount] = useState(0); //Create a state to hold the number of beds in the property
  const [bathsCount, setBathsCount] = useState(0); //Create a state to hold the number of baths in the property
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [tabPage, setTabPage] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState(null); //Create a file state to hold the file to be uploaded
  const [propertyMedia, setPropertyMedia] = useState([]); //Create a propertyMedia state to hold the property media files
  const [propertyMediaCount, setPropertyMediaCount] = useState(0); //Create a propertyMediaCount state to hold the number of property media files
  const { isMobile, breakpoints, screenWidth } = useScreen();
  const [csvFiles, setCsvFiles] = useState([]); //Create a csvFiles state to hold the csv file to be uploaded
  const [showCsvFileUploadDialog, setShowCsvFileUploadDialog] = useState(false); //Create a state to hold the value of the csv file upload dialog
  const [showFileUploadAlert, setShowFileUploadAlert] = useState(false); //Create a state to hold the value of the alert modal
  const [responseTitle, setResponseTitle] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowUpdateSuccess(false);
  };

  const tabs = [
    { name: "details", label: "Details", dataTestId: "property-detail-tab" },
    {
      name: "units",
      label: `Units (${unitCount})`,
      dataTestId: "property-units-tab",
    },
    {
      name: "analytics",
      label: "Finances/Analytics",
      dataTestId: "propery-analytics-tab",
    },
    {
      name: "media",
      label: `Files (${propertyMediaCount})`,
      dataTestId: "property-media-tab",
    },
    {
      name: "preferences",
      label: "Preferences",
      dataTestId: "property-preference-tab",
    },
  ];
  const handleChangeTabPage = (event, newValue) => {
    setTabPage(newValue);
  };

  //Function for CSV File Dropzone
  const onDrop = (acceptedFiles) => {
    let validFiles = true;
    acceptedFiles.forEach((file) => {
      if (!isValidFileName(file.name)) {
        setResponseTitle("File Upload Error");
        setResponseMessage(
          "One or more of the file names is invalid. File name can only contain numbers, letters, underscores, and dashes. No special characters or spaces."
        );
        setShowFileUploadAlert(true);
        validFiles = false;
        setShowCsvFileUploadDialog(false);
        return;
      } else if (!isValidFileExtension(file.name, [".csv"])) {
        setResponseTitle("File Upload Error");
        setResponseMessage(
          "One or more of the file types is invalid. Accepted file types: " +
            [".csv"].join(", ")
        );
        setShowFileUploadAlert(true);
        setShowCsvFileUploadDialog(false);
        validFiles = false;
        return;
      }
    });

    if (!validFiles) {
      return;
    }

    // Process valid files
    const updatedFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    console.log("updatedFiles", updatedFiles);
    setCsvFiles(updatedFiles);
    setResponseMessage(null);
    setResponseTitle(null);
  };
  //Handling Upload via CSV file dropzone
  const handleUpload = () => {
    setIsUploading(true); //Set isUploading to true to show the progress bar
    //Create a function to handle the file upload from the  files array
    const formData = new FormData(); //Create a new FormData object
    csvFiles.forEach((file) => {
      formData.append("file", file); //Append each file to the FormData object
    });
    authenticatedMediaInstance
      .post(`/properties/${id}/upload-csv-units/`, formData)
      .then((res) => {
        console.log("res", res);
        setResponseTitle("File Upload Success");
        setResponseMessage("File(s) uploaded successfully");
        setShowFileUploadAlert(true);
        setShowCsvFileUploadDialog(false);
        setCsvFiles([]); //Clear the files array
      })
      .catch((err) => {
        console.log("err", err);
        setResponseTitle("File Upload Error");
        setResponseMessage("There was an error uploading your file(s). Please ensure that you file has the correct column headers and try again.");
        setShowFileUploadAlert(true);
        setShowCsvFileUploadDialog(false);
        setCsvFiles([]); //Clear the files array
      })
      .finally(() => {
        setIsUploading(false); //Set isUploading to false to hide the progress bar
      });
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
    console.log("Property Details submit res ", res);
    if (res.status === 200) {
      setUpdateAlertTitle("Success");
      setUpdateAlertMessage("Property updated");
      setUpdateAlertIsOpen(true);
      setEditDialogOpen(false);
    } else {
      setUpdateAlertTitle("Error");
      setUpdateAlertMessage("Something went wrong");
      setUpdateAlertIsOpen(true);
      setEditDialogOpen(false);
    }
  };

  const handleChangePortfolio = (selected_portfolio_id) => {
    setCurrentPortfolio(
      portfolios.find((portfolio) => portfolio.id === selected_portfolio_id)
    );
    updateProperty(property.id, { portfolio: selected_portfolio_id }).then(
      (res) => {
        console.log("Portfolio Change Res", res);
        if (res.status === 200) {
          setUpdateAlertTitle("Portfolio Updated");
          setUpdateAlertMessage("The property's portfolio has been updated");
          setUpdateAlertIsOpen(true);
        } else {
          setShowUpdateSuccess(true);
          setUpdateAlertTitle("Error");
          setUpdateAlertMessage("Something went wrong");
          setUpdateAlertIsOpen(true);
        }
      }
    );
    setSelectPortfolioDialogOpen(false);
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
        getPortfolios().then((portfolio_res) => {
          console.log("Portfolios ", portfolio_res);
          if (portfolio_res.status === 200) {
            setPortfolios(portfolio_res.data);
            if (res.data?.portfolio) {
              setCurrentPortfolio(
                portfolio_res.data.find(
                  (portfolio) => portfolio.id === res.data?.portfolio
                )
              );
            }
          } else {
            console.error(
              "An error occured retieving portfolios",
              portfolio_res
            );
          }
        });
      });
      retrieveFilesBySubfolder(`properties/${id}`, authUser.id)
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
          dataTestId="property-loading-progress-prompt"
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

            <AlertModal
              dataTestId="property-update-alert-modal"
              open={updateAlertIsOpen}
              title={updateAlertTitle}
              message={updateAlertMessage}
              btnText={"Ok"}
              onClick={() => setUpdateAlertIsOpen(false)}
            />

            {/* Property Detail Edit Dialog  */}
            <UIDialog
              dataTestId="property-detail-edit-dialog"
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
                            data-testid="property-edit-dialog-name-label"
                            className="form-label text-dark"
                            htmlFor="name"
                          >
                            <strong>Property Name</strong>
                          </label>
                          <input
                            data-testid="property-edit-dialog-name-input"
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
                            data-testid="property-edit-dialog-street-label"
                            className="form-label text-dark"
                            htmlFor="address"
                          >
                            <strong>Street Address</strong>
                          </label>
                          <input
                            data-testid="property-edit-dialog-street-input"
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
                                data-testid="property-edit-dialog-city-label"
                                className="form-label text-dark"
                                htmlFor="city"
                              >
                                <strong>City</strong>
                              </label>
                              <input
                                data-testid="property-edit-dialog-city-input"
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
                                data-testid="property-edit-dialog-state-label"
                                className="form-label text-dark"
                                htmlFor="state"
                              >
                                <strong>State</strong>
                              </label>
                              <input
                                data-testid="property-edit-dialog-state-input"
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
                                data-testid="property-edit-dialog-zip-code-label"
                                className="form-label text-dark"
                                htmlFor="zipcode"
                              >
                                <strong>Zip Code</strong>
                              </label>
                              <input
                                data-testid="property-edit-dialog-zip-code-input"
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
                                data-testid="property-edit-dialog-country-label"
                                className="form-label text-dark"
                                htmlFor="country"
                              >
                                <strong>Country</strong>
                              </label>
                              <input
                                data-testid="property-edit-dialog-country-input"
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
                            dataTestId="property-edit-dialog-save-button"
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
              <UIDialog
                open={selectPortfolioDialogOpen}
                onClose={() => setSelectPortfolioDialogOpen(false)}
                maxWidth="md"
                title="Select Portfolio"
                dataTestId={"property-select-portfolio-dialog"}
              >
                <List
                  sx={{
                    width: "650px",
                    maxWidth: "100%",
                    maxHeight: 500,
                    overflow: "auto",
                    color: uiGrey2,
                    bgcolor: "white",
                  }}
                >
                  {portfolios.length > 0 ? (
                    <div>
                      {portfolios.map((portfolio) => (
                        <ListItem key={portfolio.id} alignItems="flex-start">
                          <ListItemText
                            primary={
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <div>
                                  {" "}
                                  <h5 style={{ fontSize: "12pt" }}>
                                    {portfolio.name}
                                  </h5>
                                  <p>{portfolio.description}</p>
                                </div>
                                <Button
                                  onClick={() =>
                                    handleChangePortfolio(portfolio.id)
                                  }
                                  sx={{
                                    background: uiGreen,
                                    color: "white",
                                    textTransform: "none",
                                    marginTop: "10px",
                                  }}
                                  variant="container"
                                  className="ui-btn"
                                >
                                  Select
                                </Button>
                              </Stack>
                            }
                          />
                          <Divider light />
                        </ListItem>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <p>No portfolios created</p>
                    </div>
                  )}
                </List>
              </UIDialog>
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
                  {currentPortfolio ? (
                    <Stack
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                      alignContent={"center"}
                    >
                      <span className="text-black">
                        Portfolio: {currentPortfolio?.name}
                      </span>
                      <Button
                        data-testid="property-change-portfolio-button"
                        sx={{
                          display: "block",
                          color: uiGreen,
                          textTransform: "none",
                        }}
                        variant="text"
                        onClick={() => {
                          setSelectPortfolioDialogOpen(true);
                        }}
                      >
                        Change Portfolio
                      </Button>
                    </Stack>
                  ) : (
                    <Button
                      sx={{
                        display: "block",
                        color: uiGreen,
                        textTransform: "none",
                      }}
                      variant="text"
                      onClick={() => {
                        setSelectPortfolioDialogOpen(true);
                      }}
                    >
                      Select Portfolio
                    </Button>
                  )}
                </div>
                <IconButton
                  data-testid="property-edit-button"
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
                            data-testId="property-unit-count"
                            className="text-black"
                            style={{
                              fontSize: isMobile ? "12pt" : "15pt",
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
                            data-testId="property-bed-count"
                            className="text-black"
                            style={{
                              fontSize: isMobile ? "12pt" : "15pt",
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
                              fontSize: isMobile ? "12pt" : "15pt",
                            }}
                            data-testId="property-bath-count"
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
                            data-testId="property-size"
                            className="text-black"
                            style={{
                              fontSize: isMobile ? "12pt" : "15pt",
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
                          <> 
                            <AlertModal
                              open={showFileUploadAlert}
                              setOpen={setShowFileUploadAlert}
                              title={responseTitle}
                              message={responseMessage}
                              btnText={"Ok"}
                              onClick={() => setShowFileUploadAlert(false)}
                            />
                            <UIDialog
                              open={showCsvFileUploadDialog}
                              onClose={() => setShowCsvFileUploadDialog(false)}
                              maxWidth="lg"
                              style={{ width: "700px", zIndex: 991 }}
                            >
                              <UIDropzone
                                onDrop={onDrop}
                                acceptedFileTypes={[".csv"]}
                                files={csvFiles}
                                setFiles={setCsvFiles}
                              />
                              <div style={{ margin: "10px" }}>
                                <HelpOutlineIcon
                                  style={{
                                    color: uiGreen,
                                    marginRight: "5px",
                                  }}
                                />
                                <span
                                  style={{ color: uiGrey2, fontSize: "10pt" }}
                                >
                                  CSV file must contain the following columns:
                                  name, beds, baths, size. All lowercase and no
                                  spaces.
                                </span>
                              </div>
                              {csvFiles.length > 0 && (
                                <UIButton
                                  onClick={handleUpload}
                                  btnText="Upload File"
                                  style={{ width: "100%" }}
                                />
                              )}
                            </UIDialog>
                            <UIPrompt
                              title={"No Units Created"}
                              icon={
                                <MeetingRoomIcon
                                  style={{ fontSize: "32pt", color: uiGreen }}
                                />
                              }
                              message={
                                "You have not created any units for this property. Would you like to create one now?"
                              }
                              btnText={"Create Unit"}
                              body={
                                <Stack
                                  direction="row"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  spacing={2}
                                >
                                  <UIButton
                                    btnText={"Create Unit"}
                                    onClick={() => {
                                      navigate(
                                        `/dashboard/landlord/units/create/${id}`
                                      );
                                    }}
                                  />
                                  <span>Or</span>
                                  <Button
                                    onClick={() => {
                                      setShowCsvFileUploadDialog(true);
                                    }}
                                    style={{
                                      textTransform: "none",
                                      color: uiGreen,
                                    }}
                                  >
                                    Upload CSV
                                  </Button>
                                </Stack>
                              }
                            />
                          </>
                        ) : (
                          <div>
                            {" "}
                            <UITableMobile
                              testRowIdentifier="rental-unit"
                              tableTitle="Units"
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
                              acceptedFileTypes={[".csv"]}
                              showUpload={true}
                              uploadHelpText="CSV file must contain the following columns: name, beds, baths, size. All lowercase and no spaces."
                              fileUploadEndpoint={`/properties/${id}/upload-csv-units/`}
                              // getImage={(row) => {
                              //   retrieveFilesBySubfolder(
                              //     `properties/${property.id}/units/${row.id}`,
                              //     authUser.id
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
                    dataTestIdentifier="property-media"
                    files={propertyMedia}
                    subfolder={`properties/${id}`}
                    acceptedFileTypes={[".png", ".jpg", ".jpeg"]}
                  />
                </div>
              )}
              {tabPage === 4 && (
                <div className={isMobile && "container-fluid"}>
                  <List
                    sx={{
                      width: "100%",
                      // maxWidth: 360,
                    }}
                  >
                    {[0, 1, 2, 3].map((value) => {
                      return (
                        <UIPreferenceRow
                          title="Open Applications"
                          description="Rental applications that are allowed to be created for units in this property."
                          onChange={() => {
                            console.log("Changed Preference");
                          }}
                        />
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
