import React, { useState, useEffect } from "react";
import {
  triggerValidation,
  validateForm,
} from "../../../../helpers/formValidation";
import { useNavigate } from "react-router";
import { createAnnouncement } from "../../../../api/announcements";
import { authenticatedInstance } from "../../../../api/api";
import {
  authUser,
  uiGreen,
  uiGrey2,
  validationMessageStyle,
} from "../../../../constants";
import {
  Button,
  ButtonBase,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import UIButton from "../../UIComponents/UIButton";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import UIInput from "../../UIComponents/UIInput";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import UICheckbox from "../../UIComponents/UICheckbox";
import BackButton from "../../UIComponents/BackButton";
import Joyride, {
  STATUS,
} from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import {
  uppercaseAndLowercaseLetters,
  validAnyString,
} from "../../../../constants/rexgex";
import { preventPageReload } from "../../../../helpers/utils";
import { getOwnerSubscriptionPlanData } from "../../../../api/owners";

const CreateAnnouncement = () => {
  const navigate = useNavigate();
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalRedirect, setAlertModalRedirect] = useState(
    "/dashboard/owner/announcements"
  );
  const [formData, setFormData] = useState({
    owner: authUser.owner_id,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [rentalUnits, setRentalUnits] = useState([]);
  const [selectedRentalUnit, setSelectedRentalUnit] = useState();
  const [rentalProperties, setRentalProperties] = useState([]);
  const [selectedRentalProperty, setSelectedRentalProperty] = useState();
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState();
  const [progressModalMessage, setProgressModalMessage] = useState("");
  const [selectedTarget, setSelectedTarget] = useState("rental_unit"); //values rental_unit, rental_property, portfolio
  const [notifyImmediatelyEnabled, setNotifyImmediatelyEnabled] =
    useState(false);
  //Rental unit state variables
  const [rentalUnitModalOpen, setRentalUnitModalOpen] = useState(false);
  const [rentalUnitSearchQuery, setRentalUnitSearchQuery] = useState("");
  const [rentalUnitEndpoint, setRentalUnitEndpoint] = useState(
    "/units/?is_occupied=True"
  );
  const [showOccupiedUnitsOnly, setShowOccupiedUnitsOnly] = useState(true);
  const [rentalUnitNextPage, setRentalUnitNextPage] = useState("");
  const [rentalUnitPreviousPage, setRentalUnitPreviousPage] = useState("");

  //Rental property state variables
  const [rentalPropertyModalOpen, setRentalPropertyModalOpen] = useState(false);
  const [rentalPropertySearchQuery, setRentalPropertySearchQuery] =
    useState("");
  const [rentalPropertyEndpoint, setRentalPropertyEndpoint] =
    useState("/properties/");
  const [rentalPropertyNextPage, setRentalPropertyNextPage] = useState("");
  const [rentalPropertyPreviousPage, setRentalPropertyPreviousPage] =
    useState("");

  ///Portfolio state variables
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [portfolioSearchQuery, setPortfolioSearchQuery] = useState("");
  const [portfolioEndpoint, setPortfolioEndpoint] = useState("/portfolios/");
  const [portfolioNextPage, setPortfolioNextPage] = useState("");
  const [portfolioPreviousPage, setPortfolioPreviousPage] = useState("");

  //Error Messages
  const [startDateErrorMessage, setStartDateErrorMessage] = useState("");
  const [endDateErrorMessage, setEndDateErrorMessage] = useState("");
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: `.create-announcement-form`,
      content:
        "Here is the form to create an announcement. An announcement is a message that can be sent to tenants to notify them of important information. They will see the message as soon as they log in to the tenant portal.",
      disableBeacon: true,
    },
    {
      target: `[data-testid="target"]`,
      content:
        "Select the target for the announcement. This could be a rental unit, rental property or portfolio.",
    },
    {
      target: `[data-testid="rental-unit"]`,
      content: "Select the rental unit for the announcement here.",
    },
    {
      target: `[data-testid="rental-property"]`,
      content: "Select the rental property for the announcement here.",
    },
    {
      target: `[data-testid="portfolio"]`,
      content: "Select the portfolio for the announcement here.",
    },
    {
      target: `[data-testid="severity"]`,
      content: "Select the severity for the announcement here.",
    },
    {
      target: `[data-testid="start-date"]`,
      content: "Select the start date for the announcement here.",
    },
    {
      target: `[data-testid="end-date"]`,
      content: "Select the end date for the announcement here.",
    },
    {
      target: `[data-testid="title"]`,
      content: "Enter the title for the announcement here.",
    },
    {
      target: `[data-testid="body"]`,
      content: "Enter the the message for the announcement here.",
    },
    {
      target: `[data-testid="create-announcement-submit-button"]`,
      content: "Click here to create the announcement.",
    },
  ];
  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setTourIndex(0);
      setRunTour(false);
    }
  };
  const handleClickStart = (event) => {
    event.preventDefault();
    setRunTour(true);

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
  };

  //RENTAL UNIT FUNCTIONS
  const handleSearchRentalUnits = async (endpoint = rentalUnitEndpoint) => {
    try {
      const res = await authenticatedInstance.get(endpoint, {
        params: {
          search: rentalUnitSearchQuery,
          limit: 10,
        },
      });

      setRentalUnits(res.data.results);
      setRentalUnitNextPage(res.data.next);
      setRentalUnitPreviousPage(res.data.previous);
    } catch (error) {
      console.error("Failed to fetch rental units:", error);
    }
  };

  const handleNextPageRentalUnitClick = async () => {
    if (rentalUnitNextPage) {
      handleSearchRentalUnits(rentalUnitNextPage);
      setRentalUnitEndpoint(rentalUnitNextPage);
    }
  };

  const handlePreviousPageRentalUnitClick = async () => {
    if (rentalUnitPreviousPage) {
      handleSearchRentalUnits(rentalUnitPreviousPage);
      setRentalUnitEndpoint(rentalUnitPreviousPage);
    }
  };

  const handleOpenRentalUnitSelectModal = async () => {
    setRentalUnitModalOpen(true);
    //Fetch rental units from api
    if (rentalUnits.length === 0) {
      await handleSearchRentalUnits();
    } else {
      setRentalUnitModalOpen(true);
    }
  };

  const handleChangeShowOccupiedUnitsOnly = (e) => {
    const isChecked = e.target.checked;
    setShowOccupiedUnitsOnly(isChecked);
    const updatedEndpoint = isChecked ? "/units/?is_occupied=True" : "/units/";
    setRentalUnitEndpoint(updatedEndpoint);
    handleSearchRentalUnits(updatedEndpoint);
  };

  //RENTAL PROPERTY FUNCTIONS
  const handleSearchRentalProperties = async () => {
    const res = await authenticatedInstance.get(rentalPropertyEndpoint, {
      params: {
        search: rentalPropertySearchQuery,
        limit: 10,
      },
    });
    setRentalProperties(res.data.results);
    setRentalPropertyNextPage(res.data.next);
    setRentalPropertyPreviousPage(res.data.previous);
  };

  //Create a function called handleNextPageRentalPropertyClick to handle the next page click of the rental property modal by fetching the next page of rental properties from the api
  const handleNextPageRentalPropertyClick = async () => {
    setRentalPropertyEndpoint(rentalPropertyNextPage);
    handleSearchRentalProperties();
  };

  //Create function for previous page
  const handlePreviousPageRentalPropertyClick = async () => {
    setRentalPropertyEndpoint(rentalPropertyPreviousPage);
    handleSearchRentalProperties();
  };

  const handleOpenRentalPropertySelectModal = async () => {
    setRentalPropertyModalOpen(true);
    //Fetch rental properties from api
    if (rentalProperties.length === 0) {
      await handleSearchRentalProperties();
    } else {
      setRentalPropertyModalOpen(true);
    }
  };

  //PORTFOLIO FUNCTIONS
  const handleSearchPortfolios = async () => {
    const res = await authenticatedInstance.get(portfolioEndpoint, {
      params: {
        search: portfolioSearchQuery,
        limit: 10,
      },
    });
    setPortfolios(res.data.results);
    setPortfolioNextPage(res.data.next);
    setPortfolioPreviousPage(res.data.previous);
  };

  //Create a function called handleNextPagePortfolioClick to handle the next page click of the portfolio modal by fetching the next page of portfolios from the api
  const handleNextPagePortfolioClick = async () => {
    setPortfolioEndpoint(portfolioNextPage);
    handleSearchPortfolios();
  };

  //Create function for previous page
  const handlePreviousPagePortfolioClick = async () => {
    setPortfolioEndpoint(portfolioPreviousPage);
    handleSearchPortfolios();
  };

  const handleOpenPortfolioSelectModal = async () => {
    setPortfolioModalOpen(true);
    //Fetch portfolios from api
    if (portfolios.length === 0) {
      await handleSearchPortfolios();
    } else {
      setPortfolioModalOpen(true);
    }
  };

  const formInputs = [
    {
      name: "target",
      label: "Select Target",
      type: "select",
      colSpan: 6,
      options: [
        { label: "Rental Unit", value: "rental_unit" },
        { label: "Rental Property", value: "rental_property" },
        { label: "Portfolio", value: "portfolio" },
      ],
      placeholder: "Select target",
      onChange: (e) => {
        handleChange(e);
        setSelectedTarget(e.target.value);
        //Set the rental unit, rental property and portfolio to null in form data and leave the rest of the form data as is
        setFormData((prevData) => ({
          ...prevData,
          rental_unit: null,
          rental_property: null,
          portfolio: null,
        }));
        setSelectedRentalUnit(null);
        setSelectedRentalProperty(null);
        setSelectedPortfolio(null);
      },
      validations: {
        required: true,
        regex: validAnyString,
        errorMessage: "Select a target",
      },
      dataTestId: "target",
      errorMessageDataTestid: "target-error",
    },
    {
      name: "rental_unit",
      label: "Rental Unit",
      type: "button_select",
      colSpan: 6,
      selectTarget: selectedRentalUnit,
      selectTargetLabel: selectedRentalUnit?.name,
      placeholder: "Select rental unit",
      dialogAction: () => handleOpenRentalUnitSelectModal(),
      validations: {
        required: selectedTarget === "rental_unit" ? true : false,
        errorMessage: "Select a rental unit",
      },
      dataTestId: "rental-unit",
      errorMessageDataTestid: "rental-unit-error",
    },
    {
      name: "rental_property",
      label: "Rental Property",
      type: "button_select",
      colSpan: 6,
      placeholder: "Select rental property",
      selectTarget: selectedRentalProperty,
      selectTargetLabel: selectedRentalProperty?.name,
      dialogAction: () => handleOpenRentalPropertySelectModal(),
      validations: {
        required: selectedTarget === "rental_property" ? true : false,
        errorMessage: "Select a rental property",
      },
      dataTestId: "rental-property",
      errorMessageDataTestid: "rental-property-error",
    },
    {
      name: "portfolio",
      label: "Portfolio",
      type: "button_select",
      colSpan: 6,
      selectTarget: selectedPortfolio,
      selectTargetLabel: selectedPortfolio?.name,
      dialogAction: () => handleOpenPortfolioSelectModal(),
      placeholder: "Select portfolio",
      validations: {
        required: selectedTarget === "portfolio" ? true : false,
        errorMessage: "Select a portfolio",
      },
      dataTestId: "portfolio",
      errorMessageDataTestid: "portfolio-error",
    },
    {
      name: "severity",
      label: "Severity",
      type: "select",
      colSpan: 12,
      options: [
        { label: "Select Severity", value: "" },
        { label: "Normal", value: "success" },
        { label: "Informational", value: "info" },
        { label: "Warning", value: "warning" },
        { label: "Critical", value: "error" },
      ],
      placeholder: "Select severity",
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        regex: uppercaseAndLowercaseLetters,
        errorMessage: "Select a severity",
      },
      dataTestId: "severity",
      errorMessageDataTestid: "severity-error",
    },
    {
      name: "start_date",
      label: "Announcement Start Date",
      type: "date",
      colSpan: 6,
      placeholder: "Select start date",
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        errorMessage: startDateErrorMessage,
        validate: (val) => {
          // Extract year, month, and day from the selected date string (YYYY-MM-DD format)
          const [year, month, day] = val.split("-").map(Number);

          // Create a new Date object using the extracted components
          const selectedDate = new Date(year, month - 1, day); // Month is 0-indexed, so subtract 1

          // Get the current date in the local time zone
          let currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate comparison

          // Extract year, month, and day from the current date
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth();
          const currentDay = currentDate.getDate();

          // Compare year, month, and day parts without considering time
          if (
            selectedDate < currentDate ||
            (year === currentYear &&
              month - 1 === currentMonth &&
              day < currentDay)
          ) {
            setStartDateErrorMessage("Start date cannot be in the past");
            return "Start date cannot be in the past";
          } else if (
            formData.end_date &&
            new Date(val) > new Date(formData.end_date)
          ) {
            setStartDateErrorMessage(
              "Start date cannot be after than end date"
            );
            return "Start date cannot be greater than end date";
          }
        },
      },
      dataTestId: "start-date",
      errorMessageDataTestid: "start-date-error",
    },
    {
      name: "end_date",
      label: "Announcement End Date",
      type: "date",
      colSpan: 6,
      placeholder: "Select end date",
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        errorMessage: endDateErrorMessage,
        validate: (val) => {
          // Extract year, month, and day from the selected date string (YYYY-MM-DD format)
          const [year, month, day] = val.split("-").map(Number);

          // Create a new Date object using the extracted components
          const selectedDate = new Date(year, month - 1, day); // Month is 0-indexed, so subtract 1

          // Get the current date in the local time zone
          let currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate comparison

          // Compare year, month, and day parts without considering time
          if (selectedDate <= currentDate) {
            setEndDateErrorMessage("End date cannot be in the past");
            setErrors((prevErrors) => ({
              ...prevErrors,
              end_date: "End date cannot be in the past",
            }));
            return "End date cannot be in the past";
          } else if (
            formData.start_date &&
            selectedDate < new Date(formData.start_date)
          ) {
            setEndDateErrorMessage("End date cannot be before the start date");
            setErrors((prevErrors) => ({
              ...prevErrors,
              end_date: "End date cannot be before the start date",
            }));
            return "End date cannot be less than the start date";
          }
        },
      },
      dataTestId: "end-date",
      errorMessageDataTestid: "end-date-error",
    },

    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter title",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        regex: validAnyString,
        errorMessage: "Enter a valid title",
      },
      dataTestId: "title",
      errorMessageDataTestid: "title-error",
    },
    {
      name: "body",
      label: "Message",
      type: "textarea",
      colSpan: 12,
      placeholder: "Enter a Message",
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        regex: validAnyString,
        errorMessage: "Enter a valid message",
      },
      dataTestId: "body",
      errorMessageDataTestid: "body-error",
    },
  ];

  const handleSubmit = async () => {
    setProgressModalMessage("Creating announcement...");
    setLoading(true);
    let target = {};
    if (selectedTarget === "rental_unit") {
      target = { rental_unit: formData.rental_unit };
    } else if (selectedTarget === "rental_property") {
      target = { rental_property: formData.rental_property };
    } else if (selectedTarget === "portfolio") {
      target = { portfolio: formData.portfolio };
    }
    const announcementData = {
      ...formData,
      target: JSON.stringify(target),
      start_date: new Date(formData.start_date).toISOString(), // Convert to UTC format
      end_date: new Date(formData.end_date).toISOString(), // Convert to UTC format
    };

    const response = await createAnnouncement(announcementData)
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          setFormData({});
          setErrors({});
          setAlertModalTitle("Success");
          setAlertModalMessage("Announcement created successfully");
          setAlertModalRedirect("/dashboard/owner/announcements");
          setAlertModalOpen(true);
        } else {
          setLoading(false);
          setAlertModalTitle("Error Creating Announcement");
          setAlertModalMessage(
            res.message
              ? res.message
              : "An error occurred while creating announcement."
          );
          setAlertModalRedirect("/dashboard/owner/announcements/create");
          setAlertModalOpen(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlertModalTitle("Error Creating Announcement");
        setAlertModalMessage(
          error.message
            ? error.message
            : "An error occurred while creating announcement"
        );
        setAlertModalRedirect("/dashboard/owner/announcements/create");
        setAlertModalOpen(true);
      });
  };

  useEffect(() => {
    getOwnerSubscriptionPlanData().then((res) => {

      if(!res.can_use_announcements){
        setAlertModalRedirect("/dashboard/owner/");
        setAlertModalTitle("Subscription Plan Mismatch");
        setAlertModalMessage("To create an announcement, you need to upgrade your subscription plan to the Keyflow Owner Standard Plan or higher. ");
        setAlertModalOpen(true);
      }else{
        setAlertModalRedirect(null);
        setAlertModalTitle("");
        setAlertModalMessage("");
        setAlertModalOpen(false);
      }
    });
    preventPageReload();
    handleSearchRentalUnits();
  }, [showOccupiedUnitsOnly, rentalUnitSearchQuery, rentalPropertyEndpoint]);

  return (
    <div className="container-fluid">
      <Joyride
        run={runTour}
        index={tourIndex}
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
      <ProgressModal open={loading} message={progressModalMessage} />
      <AlertModal
        open={alertModalOpen}
        title={alertModalTitle}
        message={alertModalMessage}
        onClose={() => setAlertModalOpen(false)}
        onClick={() => {
          navigate(alertModalRedirect);
          setAlertModalOpen(false);
        }}
        btnText="Okay"
      />
      <UIDialog
        open={rentalUnitModalOpen}
        title="Select Rental Unit"
        onClose={() => setRentalUnitModalOpen(false)}
        style={{ width: "500px" }}
      >
        <UIInput
          onChange={(e) => {
            setRentalUnitSearchQuery(e.target.value);
            handleSearchRentalUnits();
          }}
          type="text"
          placeholder="Search rental unit"
          inputStyle={{ margin: "10px 0" }}
          value={rentalUnitSearchQuery}
          name="rental_unit_search"
        />
        <UICheckbox
          label="Show Occupied Units Only"
          checked={showOccupiedUnitsOnly}
          onChange={handleChangeShowOccupiedUnitsOnly}
          style={{ margin: "10px 0" }}
        />

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
          {rentalUnits.map((unit, index) => (
            <ListItem
              key={index}
              alignItems="flex-start"
              onClick={() => {
                setSelectedRentalUnit(unit);
                triggerValidation(
                  "rental_unit",
                  unit.id,
                  formInputs.find((input) => input.name === "rental_unit")
                    .validations
                );
                setFormData((prevData) => ({
                  ...prevData,
                  rental_unit: unit.id,
                }));
                setFormData((prevData) => ({
                  ...prevData,
                  rental_property: null,
                  portfolio: null,
                }));
                setSelectedPortfolio(null);
                setSelectedRentalProperty(null);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  rental_unit: "",
                }));
                setRentalUnitModalOpen(false);
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                justifyContent={"space-between"}
                alignContent={"center"}
                alignItems={"center"}
                sx={{ width: "100%" }}
              >
                <ListItemText
                  primary={`${unit.name} (${
                    unit.is_occupied ? "Occupied" : "Vacant"
                  })`}
                  secondary={`${unit.rental_property_name}`}
                />
                <UIButton
                  dataTestId={`select-unit-button-${index}`}
                  onClick={() => {
                    setSelectedRentalUnit(unit);
                    setFormData((prevData) => ({
                      ...prevData,
                      rental_unit: unit.id,
                    }));
                    setRentalUnitModalOpen(false);
                  }}
                  btnText="Select"
                  style={{ margin: "10px 0" }}
                />
              </Stack>
            </ListItem>
          ))}
        </List>
        <Stack
          direction="row"
          spacing={2}
          justifyContent={"space-between"}
          alignContent={"center"}
          alignItems={"center"}
          sx={{ width: "100%" }}
        >
          {rentalUnitPreviousPage && (
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
          {rentalUnitNextPage && (
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
      </UIDialog>
      <UIDialog
        open={rentalPropertyModalOpen}
        title="Select Rental Property"
        onClose={() => setRentalPropertyModalOpen(false)}
        style={{ width: "500px" }}
      >
        {/* Create a search input using ui input */}
        <UIInput
          onChange={(e) => {
            setRentalPropertySearchQuery(e.target.value);
            handleSearchRentalProperties();
          }}
          type="text"
          placeholder="Search rental property"
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
          {rentalProperties.map((property, index) => {
            return (
              <ListItem
                key={index}
                alignItems="flex-start"
                onClick={() => {
                  setSelectedRentalProperty(property);
                  triggerValidation(
                    "rental_property",
                    property.id,
                    formInputs.find((input) => input.name === "rental_property")
                      .validations
                  );
                  setFormData((prevData) => ({
                    ...prevData,
                    rental_property: property.id,
                  }));
                  //Set the tenant to null
                  setFormData((prevData) => ({
                    ...prevData,
                    rental_unit: null,
                    portfolio: null,
                  }));
                  // setSelectedTenant(null);
                  setSelectedPortfolio(null);
                  setSelectedRentalUnit(null);
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    rental_property: "",
                  }));
                  setRentalPropertyModalOpen(false);
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent={"space-between"}
                  alignContent={"center"}
                  alignItems={"center"}
                  sx={{ width: "100%" }}
                >
                  <ListItemText primary={property.name} />
                  <UIButton
                    dataTestId={`select-property-button-${index}`}
                    onClick={() => {
                      setSelectedRentalProperty(property);
                      setFormData((prevData) => ({
                        ...prevData,
                        rental_property: property.id,
                      }));
                      setRentalPropertyModalOpen(false);
                    }}
                    btnText="Select"
                    style={{ margin: "10px 0" }}
                  />
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
            <ButtonBase onClick={handlePreviousPageRentalPropertyClick}>
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
            <ButtonBase onClick={handleNextPageRentalPropertyClick}>
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
      </UIDialog>
      <UIDialog
        open={portfolioModalOpen}
        title="Select Portfolio"
        onClose={() => setPortfolioModalOpen(false)}
        style={{ width: "500px" }}
      >
        {/* Create a search input using ui input */}
        <UIInput
          onChange={(e) => {
            setPortfolioSearchQuery(e.target.value);
            handleSearchPortfolios();
          }}
          type="text"
          placeholder="Search portfolio"
          inputStyle={{ margin: "10px 0" }}
          name="portfolio_search"
        />
        {/* Create a list of portfolios */}
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
          {portfolios.map((portfolio, index) => {
            return (
              <ListItem
                key={index}
                alignItems="flex-start"
                onClick={() => {
                  setSelectedPortfolio(portfolio);
                  triggerValidation(
                    "portfolio",
                    portfolio.id,
                    formInputs.find((input) => input.name === "portfolio")
                      .validations
                  );
                  setFormData((prevData) => ({
                    ...prevData,
                    portfolio: portfolio.id,
                  }));
                  //Set the tenant to null
                  setFormData((prevData) => ({
                    ...prevData,
                    rental_unit: null,
                    rental_property: null,
                  }));
                  // setSelectedTenant(null);
                  setSelectedRentalProperty(null);
                  setSelectedRentalUnit(null);
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    portfolio: "",
                  }));
                  setPortfolioModalOpen(false);
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent={"space-between"}
                  alignContent={"center"}
                  alignItems={"center"}
                  sx={{ width: "100%" }}
                >
                  <ListItemText primary={portfolio.name} />
                  <UIButton
                    dataTestId={`select-portfolio-button-${index}`}
                    onClick={() => {
                      setSelectedPortfolio(portfolio);
                      setFormData((prevData) => ({
                        ...prevData,
                        portfolio: portfolio.id,
                      }));
                      setPortfolioModalOpen(false);
                    }}
                    btnText="Select"
                    style={{ margin: "10px 0" }}
                  />
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
          {portfolioPreviousPage && (
            <ButtonBase onClick={handlePreviousPagePortfolioClick}>
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
          {portfolioNextPage && (
            <ButtonBase onClick={handleNextPagePortfolioClick}>
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
      </UIDialog>
      <BackButton />
      <div className="card create-announcement-form">
        <div className="card-body">
          <h4 className="card-title text-black">Create Announcement</h4>
          <form>
            <div className="row">
              {formInputs.map((input, index) => {
                return (
                  <>
                    {input.type === "select" && (
                      <div
                        className={`col-md-${input.colSpan} mb-2`}
                        key={index}
                      >
                        <label
                          className="text-black"
                          style={{ display: "block" }}
                        >
                          {input.label}
                        </label>
                        <select
                          name={input.name}
                          className="form-control"
                          onChange={input.onChange}
                          onBlur={input.onChange}
                          data-testId={input.dataTestId}
                        >
                          <option value="">Select One</option>
                          {input.options.map((option, index) => {
                            return (
                              <option key={index} value={option.value}>
                                {option.label}
                              </option>
                            );
                          })}
                        </select>
                        {errors[input.name] && (
                          <span
                            data-testId={input.errorMessageDataTestId}
                            style={{
                              ...validationMessageStyle,
                              display: "block",
                            }}
                          >
                            {errors[input.name]}
                          </span>
                        )}
                      </div>
                    )}
                    {input.type === "button_select" &&
                      input.name === selectedTarget && (
                        <div className={`col-md-${input.colSpan} mb-2`}>
                          <label
                            className="text-black"
                            style={{ display: "block" }}
                          >
                            {input.label}
                          </label>
                          {input.selectTarget ? (
                            <span
                              data-testId={input.errorMessageDataTestId}
                              style={{
                                color: "black",
                                marginTop: "5px",
                              }}
                            >
                              {input.selectTargetLabel} -
                              <Button
                                dataTestId={input.dataTestId}
                                onClick={input.dialogAction}
                                variant="text"
                                style={{
                                  textTransform: "none",
                                  color: uiGreen,
                                }}
                              >
                                {`Change ${input.label}`}
                              </Button>
                            </span>
                          ) : (
                            <UIButton
                              dataTestId={input.dataTestId}
                              onClick={input.dialogAction}
                              btnText={`Select ${input.label}`}
                              style={{ margin: "10px 0" }}
                            />
                          )}
                          {errors[input.name] && (
                            <span
                              data-testId={input.errorMessageDataTestId}
                              style={{
                                ...validationMessageStyle,
                                display: "block",
                              }}
                            >
                              {errors[input.name]}
                            </span>
                          )}
                        </div>
                      )}
                    {input.type === "text" && (
                      <div
                        className={`col-md-${input.colSpan} mb-2`}
                        key={index}
                      >
                        <UIInput
                          name={input.name}
                          label={input.label}
                          type={input.type}
                          placeholder={input.placeholder}
                          onChange={input.onChange}
                          onBlur={input.onChange}
                          value={formData[input.name]}
                          error={errors[input.name]}
                          dataTestId={input.dataTestId}
                          errorMessageDataTestid={input.errorMessageDataTestid}
                        />
                        {errors[input.name] && (
                          <span
                            data-testId={input.errorMessageDataTestId}
                            style={{
                              ...validationMessageStyle,
                              display: "block",
                            }}
                          >
                            {errors[input.name]}
                          </span>
                        )}
                      </div>
                    )}
                    {input.type === "date" && (
                      <div
                        className={`col-md-${input.colSpan} mb-2`}
                        key={index}
                      >
                        <label
                          className="text-black"
                          style={{ display: "block" }}
                        >
                          {input.label}
                        </label>
                        <input
                          className="form-control"
                          name={input.name}
                          label={input.label}
                          type={input.type}
                          placeholder={input.placeholder}
                          onChange={input.onChange}
                          onBlur={input.onChange}
                          value={formData[input.name]}
                          error={errors[input.name]}
                          data-testId={input.dataTestId}
                          errorMessageDataTestid={input.errorMessageDataTestId}
                        />
                        {errors[input.name] && (
                          <span
                            data-testId={input.errorMessageDataTestId}
                            style={{
                              ...validationMessageStyle,
                              display: "block",
                            }}
                          >
                            {errors[input.name]}
                          </span>
                        )}
                      </div>
                    )}
                    {input.type === "textarea" && (
                      <div className={`col-md-${input.colSpan}`} key={index}>
                        <div>
                          <label
                            className="text-black"
                            style={{ display: "block" }}
                          >
                            {input.label}
                          </label>
                        </div>
                        <textarea
                          name={input.name}
                          placeholder={input.placeholder}
                          value={formData[input.name]}
                          onChange={input.onChange}
                          className="form-control"
                          style={{ height: "100px" }}
                          data-testId={input.dataTestId}
                        />
                        {errors[input.name] && (
                          <span
                            data-testId={input.errorMessageDataTestId}
                            style={validationMessageStyle}
                          >
                            {errors[input.name]}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                );
              })}
            </div>
            <UIButton
              dataTestId="create-announcement-submit-button"
              onClick={() => {
                const { isValid, newErrors } = validateForm(
                  formData,
                  formInputs
                );


                if (!isValid) {
                  setErrors(newErrors);
                  return;
                } else {
                  handleSubmit();
                }
              }}
              btnText="Create Announcement"
              style={{ margin: "10px 0", width: "100%" }}
            />
          </form>
        </div>
      </div>
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default CreateAnnouncement;
