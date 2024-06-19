import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import UITabs from "../../UIComponents/UITabs";
import { authenticatedInstance } from "../../../../api/api";
import {
  getPortfolio,
  updatePortfolio,
  deletePortfolio,
  updatePortfolioPreferences,
  removePortfolioLeaseTemplate,
} from "../../../../api/portfolios";
import {
  updatePortfolioProperties,
  updateProperty,
  updatePropertyMedia,
} from "../../../../api/properties";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import EditIcon from "@mui/icons-material/Edit";
import {
  ButtonBase,
  ClickAwayListener,
  Grow,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  Typography,
} from "@mui/material";
import {
  authUser,
  uiGreen,
  uiGrey,
  defaultWhiteInputStyle,
  validationMessageStyle,
  uiRed,
  uiGrey2,
} from "../../../../constants";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import { useForm } from "react-hook-form";
import UIButton from "../../UIComponents/UIButton";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UIProgressPrompt from "../../UIComponents/UIProgressPrompt";
import useScreen from "../../../../hooks/useScreen";
import UITable from "../../UIComponents/UITable/UITable";
import {
  triggerValidation,
  validateForm,
} from "../../../../helpers/formValidation";
import UISwitch from "../../UIComponents/UISwitch";
import { syncPortfolioPreferences } from "../../../../helpers/preferences";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import UIInput from "../../UIComponents/UIInput";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import UICheckbox from "../../UIComponents/UICheckbox";
import UIPageHeader from "../../UIComponents/UIPageHeader";
import { lettersNumbersAndSpecialCharacters } from "../../../../constants/rexgex";
const ManagePortfolio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { screenWidth, breakpoints, isMobile } = useScreen();
  const [isLoading, setIsLoading] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [portfolioPreferences, setPortfolioPreferences] = useState([]);
  const [properties, setProperties] = useState([]);
  const [allUserProperties, setAllUserProperties] = useState([]);
  const [open, setAlertOpen] = useState(false);
  const anchorRef = React.useRef(null);
  const [openPopper, setOpenPopper] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [propertySelectModalOpen, setPropertySelectModalOpen] = useState(false);
  const [rentalUnitModalOpen, setRentalPropertyModalOpen] = useState(false);
  const [selectedRentalProperties, setSelectedRentalProperties] = useState([]);
  const [rentalPropertyEndpoint, setRentalPropertyEndpoint] =
    useState("/properties/");
  const [allUserRentalProperties, setAllUserRentalProperties] = useState([]);
  const [rentalPropertyNextPage, setRentalPropertyNextPage] = useState(null);
  const [rentalPropertyPreviousPage, setRentalPropertyPreviousPage] =
    useState(null);

  const [rentalPropertySearchQuery, setRentalUnitSearchQuery] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertRedirectURL, setAlertRedirectURL] = useState(null);
  const [alertTitle, setAlertTitle] = useState("");
  const [tabPage, setTabPage] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const tabs = [{ label: "Properties " }, { label: "Preferences" }];
  const [checked, setChecked] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // name: portfolio ? portfolio.name : "",
    // description: portfolio ? portfolio.description : "",
  });
  const [
    showResetLeaseTemplateConfirmModal,
    setShowResetLeaseTemplateConfirmModal,
  ] = useState(false);

  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".manage-portfolio-page",
      content: "This is the portfolio management page",
      disableBeacon: true,
    },
    {
      target: ".portfolio-info",
      content: "Here you can see the name and description of the portfolio",
    },
    {
      target: ".edit-portfolio-button-wrapper",
      content:
        "This is the portfolio management icon. Click this to edit, delete or add properties to the portfolio",
    },
    {
      target: ".properties-list-container",
      content: "Here you can see all the properties in this portfolio",
    },
    {
      target: ".portfolio-preferences-container",
      content:
        "Here you can see the preferences for this portfolio. You can change the preferences by toggling the switches. if the preference matches a property, the property will be updated with the new preference as well as its units",
    },
  ];
  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setTourIndex(0);
      setRunTour(false);
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      setTourIndex(nextStepIndex);
    }

    console.log("Current Joyride data", data);
  };
  const handleClickStart = (event) => {
    event.preventDefault();
    if (tabPage === 0) {
      setTourIndex(0);
    } else if (tabPage === 1) {
      setTourIndex(4);
    }
    setRunTour(true);
    console.log(runTour);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = triggerValidation(
      name,
      value,
      formInputs.find((input) => input.name === name).validations
    );
    setErrors((prevErrors) => ({ ...prevErrors, [name]: newErrors[name] }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log("Form data ", formData);
    console.log("Errors ", errors);
  };

  const formInputs = [
    {
      name: "name",
      label: "Name",
      type: "text",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "Portfolio Name",
      validations: {
        required: true,
        regex: lettersNumbersAndSpecialCharacters,
        errorMessage: "Please enter a valid name for the portfolio",
      },
      dataTestId: "portfolio-name",
      errorMessageDataTestId: "portfolio-name-error",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "Portfolio Description",
      validations: {
        required: true,
        regex: lettersNumbersAndSpecialCharacters,
        errorMessage: "Please enter a valid description for the portfolio",
      },
      dataTestId: "portfolio-description",
      errorMessageDataTestId: "portfolio-description-error",
    },
  ];

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm();
  const columns = [
    { label: "Name", name: "name" },
    { label: "Street", name: "street" },
    { label: "City", name: "city" },
    { label: "State", name: "state" },
    { label: "Zip Code", name: "zip_code" },
  ];

  const options = {
    isSelectable: false,
    onRowClick: (row) => {
      let navlink = "/";
      navlink = `/dashboard/owner/properties/${row}`;
      navigate(navlink);
    },
  };
  const onSubmit = () => {
    const payload = {
      name: formData.name,
      description: formData.description,
      owner: authUser.owner_id,
    };
    updatePortfolio(id, payload)
      .then((res) => {
        console.log(res);
        if (res.status === 200 || res.status === 201) {
          setAlertTitle("Success");
          setAlertMessage("Portfolio updated successfully");
          setAlertOpen(true);
          setEditDialogOpen(false);
        } else {
          setAlertTitle("Error");
          setAlertMessage("Error updating portfolio");
          setAlertOpen(true);
          setEditDialogOpen(false);
        }
      })
      .catch((error) => {
        console.error("Error updating portfolio:", error);
        setAlertTitle("Error");
        setAlertMessage(
          "An error occurred while updating the portfolio. Please try again."
        );
        setAlertOpen(true);
        setEditDialogOpen(false);
      });
  };

  const handleDelete = () => {
    deletePortfolio(id).then((res) => {
      console.log(res);
      if (res.status === 200 || res.status === 201) {
        setAlertTitle("Portfolio Deleted");
        setAlertMessage("");
        setEditDialogOpen(false);
        setAlertRedirectURL("/dashboard/owner/portfolios");
        setAlertOpen(true);
      } else {
        setAlertTitle("Error");
        setAlertMessage("Error Deleting Portfolio");
        setAlertOpen(true);
        setEditDialogOpen(false);
      }
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabPage(newValue);
  };

  // Dropdown
  const handleToggle = () => {
    setOpenPopper((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpenPopper(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenPopper(false);
    } else if (event.key === "Escape") {
      setOpenPopper(false);
    }
  }

  //Create a function that handle the change of the value of a preference
  const handlePreferenceChange = (e, inputType, preferenceName) => {
    if (inputType === "switch") {
      //Update the unit preferences state to be the opposite of the current value
      setPortfolioPreferences((prevPreferences) => {
        const updatedPreferences = prevPreferences.map((preference) =>
          preference.name === preferenceName
            ? { ...preference, value: e.target.checked }
            : preference
        );
        //Update tProperty preferences with the api
        updatePortfolioPreferences(id, {
          preferences: JSON.stringify(updatedPreferences),
        });
        return updatedPreferences;
      });
    } else {
    }
  };

  const handleSearchRentalProperties = async () => {
    const res = await authenticatedInstance.get(rentalPropertyEndpoint, {
      params: {
        search: rentalPropertySearchQuery,
        limit: 10,
      },
    });
    setAllUserRentalProperties(res.data.results);
    setRentalPropertyNextPage(res.data.next);
    setRentalPropertyPreviousPage(res.data.previous);
  };

  const handleOpenRentalPropertySelectModal = async () => {
    setRentalPropertyModalOpen(true);
    //Fetch rental units from api
    if (allUserRentalProperties.length === 0) {
      await handleSearchRentalProperties();
    } else {
      setRentalPropertyModalOpen(true);
    }
  };

  //Create a function called handleNextPageRentalUnitClick to handle the next page click of the rental unit modal by fetching the next page of rental units from the api
  const handleNextPageRentalUnitClick = async () => {
    setRentalPropertyEndpoint(rentalPropertyNextPage);
    handleSearchRentalProperties();
  };

  //Create function for previous page
  const handlePreviousPageRentalUnitClick = async () => {
    setRentalPropertyEndpoint(rentalPropertyPreviousPage);
    handleSearchRentalProperties();
  };

  //Create a function that handles the selection of a rental property using the checkbox
  const handleSelectRentalProperty = (property, checked) => {
    if (checked) {
      setSelectedRentalProperties((prevProperties) => {
        if (prevProperties.find((prop) => prop.id === property.id)) {
          return prevProperties;
        } else {
          return [...prevProperties, property];
        }
      });
    } else {
      //Remove the property from the selected properties
      setSelectedRentalProperties((prevProperties) => {
        return prevProperties.filter((prop) => prop.id !== property.id);
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    syncPortfolioPreferences(id);
    if (!properties || !portfolio) {
      getPortfolio(id)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            setPortfolio(res.data);
            setProperties(res.data.rental_properties);
            setSelectedRentalProperties(res.data.rental_properties);
            setPortfolioPreferences(JSON.parse(res.data.preferences));
            console.log(JSON.parse(res.data.preferences));
            setFormData({
              name: res.data.name,
              description: res.data.description,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setPortfolio(null);
          setProperties([]);
          setPortfolioPreferences([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [portfolio, properties]);
  return (
    <div className={`${screenWidth > breakpoints.md && "container-fluid"}`}>
      {isLoading && !portfolio ? (
        <>
          <UIProgressPrompt
            open={isLoading}
            title={"Loading Portfolio..."}
            message={"Please wait while we load your portfolio."}
          />
        </>
      ) : (
        <div
          className={`conatainer manage-portfolio-page ${isMobile && "px-2"}`}
        >
          <Joyride
            run={runTour}
            stepIndex={tourIndex}
            steps={tourSteps}
            callback={handleJoyrideCallback}
            continuous={true}
            showProgress={true}
            showSkipButton={true}
            styles={{
              options: {
                primaryColor: uiGreen,
              },
            }}
            locale={{
              back: "Back",
              close: "Close",
              last: "Finish",
              next: "Next",
              skip: "Skip",
            }}
          />
          <AlertModal
            open={open}
            setOpen={setAlertOpen}
            title={alertTitle}
            message={alertMessage}
            btnText={"Ok"}
            onClick={() => {
              if (alertRedirectURL) {
                navigate(alertRedirectURL);
              } else {
                navigate(0);
              }
              setAlertOpen(false);
            }}
          />
          <ConfirmModal
            open={showResetLeaseTemplateConfirmModal}
            title="Remove Lease Template"
            message="Are you sure you want to remove the lease template for this portfolio? All the lease terms of its associated units, and  additional charges will be reset to default and lease document will no longer be associated with this unit."
            confirmBtnText="Remove"
            cancelBtnText="Cancel"
            confirmBtnStyle={{
              backgroundColor: uiGrey2,
              color: "white",
            }}
            cancelBtnStyle={{
              backgroundColor: uiGreen,
              color: "white",
            }}
            handleCancel={() => {
              setShowResetLeaseTemplateConfirmModal(false);
            }}
            handleConfirm={() => {
              removePortfolioLeaseTemplate(id)
                .then((res) => {
                  console.log("Remove Lease Template Res", res);
                  if (res.status === 200) {
                    setAlertTitle("Success");
                    setAlertMessage(
                      "Lease template removed from portfolio successfully"
                    );
                    setAlertOpen(true);
                  } else {
                    setAlertTitle("Error");
                    setAlertMessage("Something went wrong");
                    setAlertOpen(true);
                  }
                })
                .catch((err) => {
                  setAlertTitle("Error");
                  setAlertMessage("Something went wrong");
                  setAlertOpen(true);
                })
                .finally(() => {
                  setShowResetLeaseTemplateConfirmModal(false);
                });
            }}
          />
          <ConfirmModal
            open={showDeleteConfirmModal}
            title={"Delete Portfolio"}
            message={"Are you sure you want to delete this portfolio?"}
            confirmBtnText={"Delete"}
            cancelBtnText={"Cancel"}
            handleConfirm={handleDelete}
            confirmBtnStyle={{
              backgroundColor: uiRed,
              color: "white",
            }}
            handleCancel={() => setShowDeleteConfirmModal(false)}
          />
          {/* Property Detail Edit Dialog  */}
          <UIDialog
            dataTestId={"edit-portfolio-dialog"}
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            maxWidth="md"
            title="Edit Property Details"
          >
            <div className="row" style={{ width: "500px" }}>
              <div className="col-md-12">
                <div className=" mb-3">
                  <div className="card-body">
                    <form
                      data-dataTestId="edit-portfolio-form"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      {formInputs.map((input, index) => {
                        return (
                          <div
                            className={`col-md-${input.colSpan} mb-3`}
                            key={index}
                            data-testId={`${input.dataTestId}`}
                          >
                            <label
                              className="form-label text-black"
                              htmlFor={input.name}
                            >
                              {input.label}
                            </label>
                            {input.type === "textarea" ? (
                              <textarea
                                style={{
                                  ...defaultWhiteInputStyle,
                                  background: uiGrey,
                                }}
                                type={input.type}
                                name={input.name}
                                onChange={input.onChange}
                                onBlur={input.onChange}

                                // {...register(input.name, { required: true })}
                              >
                                {formData[input.name]}
                              </textarea>
                            ) : (
                              <input
                                style={{
                                  ...defaultWhiteInputStyle,
                                  background: uiGrey,
                                }}
                                type={input.type}
                                name={input.name}
                                onChange={input.onChange}
                                onBlur={input.onChange}
                                defaultValue={formData[input.name]}
                                // {...register(input.name, { required: true })}
                              />
                            )}
                            {errors[input.name] && (
                              <span
                                data-testId={input.errorMessageDataTestId}
                                style={{ ...validationMessageStyle }}
                              >
                                {errors[input.name]}
                              </span>
                            )}
                          </div>
                        );
                      })}

                      <div className="text-end mb-3">
                        <UIButton
                          dataTestId="edit-portfolio-submit-button"
                          className="btn btn-primary btn-sm ui-btn"
                          onClick={() => {
                            const { isValid, newErrors } = validateForm(
                              formData,
                              formInputs
                            );
                            if (isValid) {
                              setIsLoading(true);
                              onSubmit();
                            } else {
                              setErrors(newErrors);
                            }
                          }}
                          btnText="Save Changes"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </UIDialog>
          {/* Add Properties Dialog */}
          <UIDialog
            open={rentalUnitModalOpen}
            title="Select Rental Properties"
            onClose={() => setRentalPropertyModalOpen(false)}
            style={{ width: "500px" }}
          >
            {/* Create a search input using ui input */}
            <UIInput
              onChange={(e) => {
                setRentalUnitSearchQuery(e.target.value);
                handleSearchRentalProperties();
              }}
              type="text"
              placeholder="Search rental properties"
              inputStyle={{ margin: "10px 0" }}
              name="rental_property_search"
            />
            {/* Create a list of rental properties */}
            <List
              sx={{
                width: "100%",
                maxWidth: "100%",
                maxHeight: 500,
                overflow: "auto",
                color: uiGrey2,
                bgcolor: "white",
              }}
            >
              {allUserRentalProperties.map((property, index) => {
                return (
                  <ListItem
                    key={index}
                    alignItems="flex-start"
                    onClick={() => {}}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent={"space-between"}
                      alignContent={"center"}
                      alignItems={"center"}
                      sx={{ width: "100%" }}
                    >
                      <UICheckbox
                        onChange={(e) => {
                          let checked = e.target.checked;
                          handleSelectRentalProperty(property, checked);
                        }}
                        checked={selectedRentalProperties.find(
                          (prop) => prop.id === property.id
                        )}
                      />
                      <ListItemText primary={property.name} />
                    </Stack>
                  </ListItem>
                );
              })}
            </List>
            <Stack
              direction="row"
              spacing={2}
              justifyContent={"space-between"}
              alignContent={"center"}
              alignItems={"center"}
              sx={{ width: "100%" }}
            >
              {rentalPropertyPreviousPage && (
                <ButtonBase onClick={handlePreviousPageRentalUnitClick}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={0}
                  >
                    <IconButton style={{ color: uiGreen }}>
                      <ArrowBackOutlined />
                    </IconButton>
                    <span style={{ color: uiGreen }}>Prev</span>
                  </Stack>
                </ButtonBase>
              )}
              <span></span>
              {rentalPropertyNextPage && (
                <ButtonBase onClick={handleNextPageRentalUnitClick}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={0}
                  >
                    <span style={{ color: uiGreen }}>Next</span>
                    <IconButton style={{ color: uiGreen }}>
                      <ArrowForwardIcon />
                    </IconButton>
                  </Stack>
                </ButtonBase>
              )}
            </Stack>
            <UIButton
              btnText="Save"
              onClick={() => {
                console.log(selectedRentalProperties);
                let selectedProperties = JSON.stringify(
                  selectedRentalProperties.map((property) => property.id)
                );
                console.log("Selected Properties " + selectedProperties);

                setIsLoading(true);
                try {
                  let payload = {
                    properties: selectedProperties,
                    portfolio: id,
                  };
                  console.log(payload);
                  updatePortfolioProperties(payload)
                    .then((res) => {
                      console.log(res);
                      if (res.status !== 200) {
                        throw new Error(
                          "Error updating properties in portfolio"
                        );
                      }
                      setProperties(selectedRentalProperties);
                      setRentalPropertyModalOpen(false);
                      setAlertTitle("Success");
                      setAlertMessage(
                        "Properties updated in portfolio successfully"
                      );
                      setAlertOpen(true);
                      setIsLoading(false);
                    })
                    .catch((error) => {
                      console.error("Error updating properties:", error);
                      setAlertTitle("Error");
                      setAlertMessage("Error updating properties in portfolio");
                      setAlertOpen(true);
                      setIsLoading(false);
                    });
                } catch (e) {
                  setAlertTitle("Error");
                  setAlertMessage(
                    "There was an error adding the properties to the portfolio. Please try again."
                  );
                  setAlertOpen(true);
                } finally {
                  setIsLoading(false);
                }
              }}
            />
          </UIDialog>
          <UIPageHeader
            title={portfolio ? portfolio.name : ""}
            subtitle={portfolio ? portfolio.description : ""}
            menuItems={[
              {
                label: "Edit Portfolio Details",
                action: () => setEditDialogOpen(true),
              },
              {
                label: "Reset Lease Template",
                action: () => setShowResetLeaseTemplateConfirmModal(true),
              },
              {
                label: "Add/Remove Properties",
                action: () => handleOpenRentalPropertySelectModal(true),
              },
              {
                label: "Delete Portfolio",
                action: () => setShowDeleteConfirmModal(true),
              },
            ]}
          />
          <UITabs
            value={tabPage}
            handleChange={handleTabChange}
            tabs={tabs}
            ariaLabel="portfolio tabs"
            style={{ marginBottom: "25px" }}
          />
          {tabPage === 0 && (
            <div className="properties-list-container">
              {isMobile ? (
                <UITableMobile
                  testRowIdentifier="portfolio-property"
                  tableTitle="Properties"
                  data={properties}
                  infoProperty="name"
                  createTitle={(row) =>
                    `${row.street}, ${row.city}, ${row.state}`
                  }
                  subtitleProperty="something"
                  acceptedFileTypes={[".csv"]}
                  onRowClick={(row) => {
                    const navlink = `/dashboard/owner/properties/${row.id}`;
                    navigate(navlink);
                  }}
                  createURL="/dashboard/owner/properties/create"
                  showCreate={true}
                  orderingFields={[
                    { field: "name", label: "Name (Ascending)" },
                    { field: "-name", label: "Name (Descending)" },
                  ]}
                  searchFields={[
                    "name",
                    "street",
                    "city",
                    "state",
                    "zip_code",
                    "country",
                  ]}
                />
              ) : (
                <UITable
                  data={properties}
                  searchFields={[
                    "name",
                    "street",
                    "city",
                    "state",
                    "zip_code",
                    "country",
                  ]}
                  menuOptions={[
                    {
                      name: "Manage",
                      onClick: (row) => {
                        const navlink = `/dashboard/owner/properties/${row.id}`;
                        navigate(navlink);
                      },
                    },
                  ]}
                  title="Properties"
                  options={options}
                  checked={checked}
                  columns={columns}
                  setChecked={setChecked}
                />
              )}
            </div>
          )}

          {tabPage === 1 && (
            <div className="portfolio-preferences-container">
              {portfolioPreferences &&
                portfolioPreferences.map((preference, index) => {
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
                              {preference.label}
                            </Typography>
                          }
                          secondary={
                            <React.Fragment>
                              {preference.description}
                            </React.Fragment>
                          }
                        />
                        <>
                          {preference.inputType === "switch" && (
                            <UISwitch
                              onChange={(e) => {
                                handlePreferenceChange(
                                  e,
                                  preference.inputType,
                                  preference.name
                                );
                              }}
                              value={preference.value}
                            />
                          )}
                        </>
                      </Stack>
                    </ListItem>
                  );
                })}
            </div>
          )}
        </div>
      )}
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default ManagePortfolio;
