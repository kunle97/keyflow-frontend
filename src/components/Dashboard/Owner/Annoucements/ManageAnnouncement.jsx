import React, { useState, useEffect } from "react";
import {
  triggerValidation,
  validateForm,
} from "../../../../helpers/formValidation";
import { useNavigate } from "react-router";
import {
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../../../api/announcements";
import { authenticatedInstance } from "../../../../api/api";
import {
  authUser,
  uiGreen,
  uiGrey2,
  validationMessageStyle,
} from "../../../../constants";
import UIButton from "../../UIComponents/UIButton";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import UIInput from "../../UIComponents/UIInput";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import { useParams } from "react-router";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import Joyride, { STATUS } from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import UIPageHeader from "../../UIComponents/UIPageHeader";
import UIProgressPrompt from "../../UIComponents/UIProgressPrompt";
import {
  lettersNumbersAndSpecialCharacters,
  uppercaseAndLowercaseLetters,
  validAnyString,
} from "../../../../constants/rexgex";
import {
  Button,
  ButtonBase,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import UICheckbox from "../../UIComponents/UICheckbox";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
const ManageAnnouncement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadingPage, setLoadingPage] = useState(true);
  const [announcement, setAnnouncement] = useState({});
  const [targetObject, setTargetObject] = useState(null);
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalRedirect, setAlertModalRedirect] = useState(
    "/dashboard/owner/announcements"
  );
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalTitle, setConfirmModalTitle] = useState("");
  const [confirmModalMessage, setConfirmModalMessage] = useState("");
  const [formData, setFormData] = useState({
    owner: authUser.owner_id,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [progressModalMessage, setProgressModalMessage] = useState("");
  const [selectedTarget, setSelectedTarget] = useState("rental_unit"); //values rental_unit, rental_property, portfolio
  const [rentalUnits, setRentalUnits] = useState([]);
  const [selectedRentalUnit, setSelectedRentalUnit] = useState();
  const [rentalProperties, setRentalProperties] = useState([]);
  const [selectedRentalProperty, setSelectedRentalProperty] = useState();
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState();
  //Error Messages
  const [startDateErrorMessage, setStartDateErrorMessage] = useState("");
  const [endDateErrorMessage, setEndDateErrorMessage] = useState("");
  const [targetSelectModalOpen, setTargetSelectModalOpen] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);

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

  const tourSteps = [
    {
      target: ".manage-announcement-form",
      content: "You can update the announcement details here",
      disableBeacon: true,
    },
    {
      target: '[data-testId="create-announcement"]',
      content:
        "Once you are finished updating the announcement, click here to save the changes",
    },
    {
      target: '[data-testId="delete-announcement"]',
      content: "If you want to delete the announcement, click here",
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
      name: "target",
      label: "Target",
      type: "button_select",
      colSpan: 6,
      placeholder: "Enter target object",
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        regex: validAnyString,
        errorMessage: "Enter a valid target object",
      },
      dataTestId: "target-object",
      errorMessageDataTestid: "target-object-error",
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
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter title",
      colSpan: 6,
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
      name: "severity",
      label: "Severity",
      type: "select",
      colSpan: 6,
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
          // Create a new Date object from the date string
          const selectedDate = new Date(val);

          // Extract year, month, and day from the selected date
          const year = selectedDate.getFullYear();
          const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1 and pad with zero if needed
          const day = String(selectedDate.getDate()).padStart(2, "0"); // Pad with zero if needed

          // Format the date components as yyyy-mm-dd
          const formattedDate = `${year}-${month}-${day}`;

          // Get the current date in the local time zone
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate comparison

          // Extract year, month, and day from the current date
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth() + 1; // Month is 0-indexed, so add 1
          const currentDay = currentDate.getDate();

          // Compare year, month, and day parts without considering time
          if (
            year < currentYear ||
            (year === currentYear && month < currentMonth) ||
            (year === currentYear && month === currentMonth && day < currentDay)
          ) {
            setStartDateErrorMessage("Start date cannot be in the past");
            return "Start date cannot be in the past";
          } else if (
            formData.end_date &&
            selectedDate > new Date(formData.end_date)
          ) {
            setStartDateErrorMessage("Start date cannot be after the end date");
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
          // Create a new Date object from the selected date string
          const selectedDate = new Date(val);

          // Get the current date in the local time zone
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate comparison

          // Allow selecting dates starting from today onwards, disallow past dates
          if (selectedDate < currentDate) {
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
      name: "body",
      label: "Message",
      type: "textarea",
      colSpan: 12,
      placeholder: "Enter a Message",
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        regex: lettersNumbersAndSpecialCharacters,
        errorMessage: "Enter a valid body",
      },
      dataTestId: "body",
      errorMessageDataTestid: "body-error",
    },
  ];

  const handleSubmit = async () => {

    const { isValid, newErrors } = validateForm(formData, formInputs);


    if (!isValid) {
      setErrors(newErrors);
      return;
    } else {
      setProgressModalMessage("Creating announcement...");
      setLoading(true);

      //Remove rental_property, rental_unit, portfolio from form data
      delete formData.rental_property;
      delete formData.rental_unit;
      delete formData.portfolio;

      if (selectedTarget === "rental_unit") {
        formData.target = JSON.stringify({
          rental_unit: selectedRentalUnit.id,
        });
      } else if (selectedTarget === "rental_property") {
        formData.target = JSON.stringify({
          rental_property: selectedRentalProperty.id,
        });
      } else if (selectedTarget === "portfolio") {
        formData.target = JSON.stringify({
          portfolio: selectedPortfolio.id,
        });
      }

      const response = await updateAnnouncement(id, formData).then((res) => {

        if (res.status === 200) {
          setLoading(false);
          setFormData({});
          setErrors({});
          setAlertModalTitle("Success");
          setAlertModalMessage("Announcement updated successfully");
          setAlertModalRedirect(0);
          setAlertModalOpen(true);
        } else {
          setLoading(false);
          setAlertModalTitle("Error");
          setAlertModalMessage("An error occurred while updating announcement");
          setAlertModalRedirect("/dashboard/owner/announcements/" + id);
          setAlertModalOpen(true);
        }
      });
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    // Ensure month and day are two digits
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setLoadingPage(true);
    getAnnouncement(id)
      .then((res) => {
        // Convert date strings to Date objects for date inputs
        res.start_date = new Date(res.start_date);
        res.end_date = new Date(res.end_date);

        setAnnouncement(res);
        if (res.target_object) {
          setTargetObject(res.target_object);
          setSelectedTarget(res.target_object.datatype);
          if (res.target_object.datatype === "rental_unit") {
            setSelectedRentalUnit(res.target_object);
            formData.rental_unit = res.target_object.id;
          } else if (res.target_object.datatype === "rental_property") {
            setSelectedRentalProperty(res.target_object);
            formData.rental_property = res.target_object.id;
          } else if (res.target_object.datatype === "portfolio") {
            setSelectedPortfolio(res.target_object);
            formData.portfolio = res.target_object.id;
          }
        }
        setFormData((prevData) => ({ ...prevData, ...res }));
      })
      .catch((error) => {
        setAlertModalTitle("Error");
        setAlertModalMessage(
          "An error occurred while fetching announcement details"
        );
        setAlertModalOpen(true);
      })
      .finally(() => {
        setLoadingPage(false);
      });
  }, []);

  return (
    <>
      {loadingPage ? (
        <>
          <UIProgressPrompt
            title="Loading Announcement details..."
            message="Please wait while we load the announcement details."
          />
        </>
      ) : (
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
                        formInputs.find(
                          (input) => input.name === "rental_property"
                        ).validations
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
          <UIPageHeader
            style={{ marginBottom: "20px" }}
            backButtonURL="/dashboard/owner/announcements"
            backButtonPosition="top"
            title={
              <span>
                Manage Anouncement
                {targetObject &&
                  ` for ${targetObject?.type + " " + targetObject?.name}`}
              </span>
            }
            subtitle="Update announcement details below"
            menuItems={[
              {
                label: "Delete Announcement",
                action: () => {
                  setConfirmModalTitle("Delete Announcement");
                  setConfirmModalMessage(
                    "Are you sure you want to delete this announcement?"
                  );
                  setConfirmModalOpen(true);
                },
              },
            ]}
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
          <ConfirmModal
            open={confirmModalOpen}
            title={confirmModalTitle}
            message={confirmModalMessage}
            handleClose={() => setConfirmModalOpen(false)}
            cancelBtnText="Cancel"
            handleCancel={() => setConfirmModalOpen(false)}
            confirmBtnText="Yes"
            handleConfirm={() => {
              setConfirmModalOpen(false);
              // Call the delete function here
              deleteAnnouncement(id).then((res) => {

                navigate("/dashboard/owner/announcements");
              });
            }}
          />
          <div className="card manage-announcement-form">
            <div className="card-body">
              <form>
                <div className="row">
                  <div className="col-md-12">
                    <label className="text-black" style={{ display: "block" }}>
                      {announcement.rental_property && "Renting Property: "}
                      {announcement.rental_unit && "Rental Unit"}
                      {announcement.portfolio && "Portfolio"}
                    </label>
                    <p className="text-black">
                      {announcement.rental_property &&
                        announcement.rental_property.name}
                      {announcement.rental_unit &&
                        announcement.rental_unit.name}
                      {announcement.portfolio && announcement.portfolio.name}
                    </p>
                  </div>
                  {formInputs.map((input, index) => {
                    return (
                      <>
                        {input.type === "select" && (
                          <div
                            className={`col-md-${input.colSpan} mb-2`}
                            key={index}
                          >
                            <label
                              className="text-black mb-1"
                              style={{ display: "block" }}
                            >
                              {input.label}
                            </label>
                            <select
                              name={input.name}
                              className="form-control"
                              onChange={input.onChange}
                              onBlur={input.onChange}
                              value={
                                input.name === "target"
                                  ? targetObject?.datatype
                                    ? targetObject.datatype
                                    : ""
                                  : formData[input.name]
                              }
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
                              errorMessageDataTestid={
                                input.errorMessageDataTestid
                              }
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
                              className="text-black mb-1"
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
                              value={formatDate(new Date(formData[input.name]))}
                              error={errors[input.name]}
                              dataTestId={input.dataTestId}
                              errorMessageDataTestid={
                                input.errorMessageDataTestId
                              }
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
                          <div
                            className={`col-md-${input.colSpan}`}
                            key={index}
                          >
                            <div>
                              <label
                                className="text-black mb-1"
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
                              onBlur={input.onChange}
                              className="form-control"
                              style={{ height: "100px" }}
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
                  dataTestId="create-announcement"
                  onClick={handleSubmit}
                  btnText="Update Announcement"
                  style={{ margin: "10px 0", width: "100%" }}
                />
              </form>
            </div>
          </div>
          <UIHelpButton onClick={handleClickStart} />
        </div>
      )}
    </>
  );
};

export default ManageAnnouncement;
