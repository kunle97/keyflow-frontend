import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { deleteUnit } from "../../../../api/units";
import {
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import {
  deleteProperty,
  getProperty,
  updatePropertyMedia,
  updatePropertyPreferences,
  updatePropertyPortfolio,
  removePropertyLeaseTemplate,
  getPropertyUnits,
} from "../../../../api/properties";
import { useNavigate } from "react-router";
import { Box } from "@mui/material";
import UIButton from "../../UIComponents/UIButton";
import {
  authUser,
  globalMaxFileSize,
  token,
  uiGreen,
  uiGrey2,
  uiRed,
  validationMessageStyle,
} from "../../../../constants";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UITable from "../../UIComponents/UITable/UITable";
import UITabs from "../../UIComponents/UITabs";
import UIPrompt from "../../UIComponents/UIPrompt";
import { authenticatedMediaInstance } from "../../../../api/api";
import FileManagerView from "../../UIComponents/FileManagerView";
import { retrieveFilesBySubfolder } from "../../../../api/file_uploads";
import UIProgressPrompt from "../../UIComponents/UIProgressPrompt";
import useScreen from "../../../../hooks/useScreen";
import HotelIcon from "@mui/icons-material/Hotel";
import BathtubIcon from "@mui/icons-material/Bathtub";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import { getPortfolios } from "../../../../api/portfolios";
import UIDropzone from "../../UIComponents/Modals/UploadDialog/UIDropzone";
import {
  isValidFileExtension,
  isValidFileName,
} from "../../../../helpers/utils";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  triggerValidation,
  validateForm,
} from "../../../../helpers/formValidation";
import UISwitch from "../../UIComponents/UISwitch";
import { syncPropertyPreferences } from "../../../../helpers/preferences";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import UIPageHeader from "../../UIComponents/UIPageHeader";
import { getUserStripeSubscriptions } from "../../../../api/auth";
import { validAnyString } from "../../../../constants/rexgex";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
const ManageProperty = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [propertyPreferences, setPropertyPreferences] = useState([]);
  const [portfolios, setPortfolios] = useState([]); //Create a state to hold the portfolios
  const [currentPortfolio, setCurrentPortfolio] = useState(null); //Create a state to hold the current portfolio
  const [isUploading, setIsUploading] = useState(false); //Create a state to hold the value of the upload progress
  const [selectPortfolioDialogOpen, setSelectPortfolioDialogOpen] =
    useState(false); //Create a state to hold the select portfolio dialog open state
  const [units, setUnits] = useState([]);
  const [isLoadingUnits, setIsLoadingUnits] = useState(true);
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
  const [deleteAlertTitle, setDeleteAlertTitle] = useState("");
  const [deleteAlertMessage, setDeleteAlertMessage] = useState("");
  const [deleteAlertAction, setDeleteAlertAction] = useState(() => {});
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [tabPage, setTabPage] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [propertyMedia, setPropertyMedia] = useState([]); //Create a propertyMedia state to hold the property media files
  const [propertyMediaCount, setPropertyMediaCount] = useState(0); //Create a propertyMediaCount state to hold the number of property media files
  const { isMobile, breakpoints, screenWidth } = useScreen();
  const [csvFiles, setCsvFiles] = useState([]); //Create a csvFiles state to hold the csv file to be uploaded
  const [showCsvFileUploadDialog, setShowCsvFileUploadDialog] = useState(false); //Create a state to hold the value of the csv file upload dialog
  const [showFileUploadAlert, setShowFileUploadAlert] = useState(false); //Create a state to hold the value of the alert modal
  const [responseTitle, setResponseTitle] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [
    showResetLeaseTemplateConfirmModal,
    setShowResetLeaseTemplateConfirmModal,
  ] = useState(false);
  const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState(null);
  const navigate = useNavigate();
  const anchorRef = useRef(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [isOnStep2, setIsOnStep2] = useState(false); // Add this line
  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setTourIndex(0);
      setRunTour(false);
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      setTourIndex(nextStepIndex);
    }
  };

  const handleClickStart = (event) => {
    event.preventDefault();
    if (tabPage === 0) {
      setTourIndex(0);
    } else if (tabPage === 1) {
      setTourIndex(4);
    } else if (tabPage === 2) {
      setTourIndex(5);
    }
    setRunTour(true); // Start the tour
  };

  const tourSteps = [
    {
      target: ".manage-property-container",
      content:
        "This is the property management page. Here you can edit your property details, create units, upload media, and change preferences",
      disableBeacon: true,
      placement: "center",
    },
    {
      target: ".property-info-header",
      content:
        "This is the property information section. Here you can view and edit the property details",
    },
    {
      target: "button[data-testid='property-edit-button']",
      content:
        "Click the 'Edit' button to edit the property details. You can change the name, address, and other details",
    },
    //Start Unit List Tour
    {
      target: ".units-list",
      content:
        "This is the list of units in the property. When you add a new unit click the button on the right of each unit to view or edit the unit",
      placement: "bottom",
    },
    //Start Media Manager Tour
    {
      target: ".property-media-file-manager",
      content:
        "Here is where you can upload media files for the property. Click the 'Upload Media' button to upload images for the property",
    },
    //Start Preferences Tour
    {
      target: ".property-preferences",
      content:
        "This is the property preferences section. Here you can set specific preferences for the property. All units in the property will inherit these preferences.",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = triggerValidation(
      name,
      value,
      formInputs.find((input) => input.name === name).validations
    );
    setErrors((prevErrors) => ({ ...prevErrors, [name]: newErrors[name] }));

    // Update the value based on input type
    const newValue = e.target.type === "select-one" ? e.target.value : value;

    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  const formInputs = [
    {
      label: "Name",
      name: "name",
      type: "text",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "Lynx Society Highrises",
      validations: {
        required: true,
        regex: /^[a-zA-Z0-9\s,'-]{3,}$/,
        errorMessage: "Must be at least 3 characters long",
      },
      dataTestId: "update-property-name-input",
      errorMessageDataTestId: "update-property-name-error-message",
      step: 0,
    },
    {
      label: "Street",
      name: "street",
      type: "text",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "Sunset Blvd, 38",
      validations: {
        required: true,
        regex: validAnyString,
        errorMessage: "Enter a valid street address (e.g., 123 Main St)",
      },
      dataTestId: "update-property-street-input",
      errorMessageDataTestId: "update-property-street-error-message",
      step: 0,
    },
    {
      label: "City",
      name: "city",
      type: "text",
      colSpan: 4,
      onChange: (e) => handleChange(e),
      placeholder: "Los Angeles",
      validations: {
        required: true,
        regex: /^[a-zA-Z0-9\s,'-]*$/,
        errorMessage: "Must be at least 3 characters long",
      },
      dataTestId: "update-property-city-input",
      errorMessageDataTestId: "update-property-city-error-message",
      step: 0,
    },
    {
      label: "State",
      name: "state",
      type: "select",
      colSpan: 4,
      onChange: (e) => handleChange(e),
      options: [
        { value: "", label: "Select One" },
        { value: "AL", label: "Alabama" },
        { value: "AK", label: "Alaska" },
        { value: "AZ", label: "Arizona" },
        { value: "AR", label: "Arkansas" },
        { value: "CA", label: "California" },
        { value: "CO", label: "Colorado" },
        { value: "CT", label: "Connecticut" },
        { value: "DE", label: "Delaware" },
        { value: "DC", label: "District Of Columbia" },
        { value: "FL", label: "Florida" },
        { value: "GA", label: "Georgia" },
        { value: "HI", label: "Hawaii" },
        { value: "ID", label: "Idaho" },
        { value: "IL", label: "Illinois" },
        { value: "IN", label: "Indiana" },
        { value: "IA", label: "Iowa" },
        { value: "KS", label: "Kansas" },
        { value: "KY", label: "Kentucky" },
        { value: "LA", label: "Louisiana" },
        { value: "ME", label: "Maine" },
        { value: "MD", label: "Maryland" },
        { value: "MA", label: "Massachusetts" },
        { value: "MI", label: "Michigan" },
        { value: "MN", label: "Minnesota" },
        { value: "MS", label: "Mississippi" },
        { value: "MO", label: "Missouri" },
        { value: "MT", label: "Montana" },
        { value: "NE", label: "Nebraska" },
        { value: "NV", label: "Nevada" },
        { value: "NH", label: "New Hampshire" },
        { value: "NJ", label: "New Jersey" },
        { value: "NM", label: "New Mexico" },
        { value: "NY", label: "New York" },
        { value: "NC", label: "North Carolina" },
        { value: "ND", label: "North Dakota" },
        { value: "OH", label: "Ohio" },
        { value: "OK", label: "Oklahoma" },
        { value: "OR", label: "Oregon" },
        { value: "PA", label: "Pennsylvania" },
        { value: "RI", label: "Rhode Island" },
        { value: "SC", label: "South Carolina" },
        { value: "SD", label: "South Dakota" },
        { value: "TN", label: "Tennessee" },
        { value: "TX", label: "Texas" },
        { value: "UT", label: "Utah" },
        { value: "VT", label: "Vermont" },
        { value: "VA", label: "Virginia" },
        { value: "WA", label: "Washington" },
        { value: "WV", label: "West Virginia" },
        { value: "WI", label: "Wisconsin" },
        { value: "WY", label: "Wyoming" },
      ],
      validations: {
        required: true,
        regex: /^[a-zA-Z0-9\s,'-]*$/,
        errorMessage: "Must be at least 3 characters long",
      },
      dataTestId: "update-property-state-input",
      errorMessageDataTestId: "update-property-state-error-message",
      step: 0,
    },
    {
      label: "Zip Code",
      name: "zip_code",
      type: "text",
      colSpan: 4,
      onChange: (e) => handleChange(e),
      placeholder: "90210",
      validations: {
        required: true,
        regex: /^\d{5}(?:[-\s]\d{4})?$/,
        errorMessage: "Must be in zip code format",
      },
      dataTestId: "update-property-zip-code-input",
      errorMessageDataTestId: "update-property-zip-code-error-message",
      step: 0,
    },
    {
      label: "Country",
      name: "country",
      type: "text",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "United States",
      validations: {
        required: true,
        regex: /^[a-zA-Z0-9\s,'-]*$/,
        errorMessage: "Must be at least 3 characters long",
      },
      dataTestId: "update-property-country-input",
      errorMessageDataTestId: "update-property-country-error-message",
    },
  ];

  // Dropdown
  const handleToggle = () => {
    setOpenDropdown((prevOpen) => !prevOpen);
  };

  const handleCloseDropdownMenu = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpenDropdown(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenDropdown(false);
    } else if (event.key === "Escape") {
      setOpenDropdown(false);
    }
  }
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowUpdateSuccess(false);
  };

  const unit_columns = [
    { label: "Name", name: "name" },
    { label: "Beds", name: "beds" },
    { label: "Baths", name: "baths" },
    { label: "Size", name: "size" },
    {
      label: "Occupied",
      name: "is_occupied",
      options: { customBodyRender: (value) => (value ? "Yes" : "No") },
    },
  ];
  const unit_options = {
    isSelectable: false,
    onRowClick: (row) => {
      let navlink = "/";
      navlink = `/dashboard/owner/units/${row.id}/${row.rental_property}`;
      navigate(navlink);
    },
    onRowDelete: (row) => {
      setIsProcessing(true);
      let payload = {
        unit_id: row.id,
        rental_property: row.rental_property,
        product_id: currentSubscriptionPlan?.plan?.product
          ? currentSubscriptionPlan?.plan?.product
          : null,
        subscription_id: currentSubscriptionPlan?.id
          ? currentSubscriptionPlan?.id
          : null,
      };
      //Delete the unit with the api
      deleteUnit(payload)
        .then((res) => {
          if (res.status === 204) {
            //Redirect to the property page
            setAlertMessage("Unit has been deleted");
            setAlertTitle("Success");
            setShowAlertModal(true);
          } else {
            //Display error message
            setErrorMessage(res.message ? res.message : "An error occurred");
            setShowDeleteError(true);
          }
        })
        .catch((err) => {
          setErrorMessage(err.message ? err.message : "An error occurred");
          setShowDeleteError(true);
        })
        .finally(() => {
          setIsProcessing(false);
        });
    },
  };

  const tabs = [
    {
      name: "units",
      label: `Units (${unitCount})`,
      dataTestId: "property-units-tab",
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
      //Check if file is valid size
      if (file.size > globalMaxFileSize) {
        setResponseTitle("File Upload Error");
        setResponseMessage("File size is too large. Max file size is 3MB");
        setShowFileUploadAlert(true);
        validFiles = false;
        return;
      }
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

    setCsvFiles(updatedFiles);
    setResponseMessage(null);
    setResponseTitle(null);
  };
  //Handling Upload via CSV file dropzone
  const handleUpload = () => {
    setIsUploading(true); //Set isUploading to true to show the progress bar
    //Create a function to handle the file upload from the  files array
    const updloadFormData = new FormData(); //Create a new FormData object
    csvFiles.forEach((file) => {
      updloadFormData.append("file", file); //Append each file to the FormData object
    });
    authenticatedMediaInstance
      .post(`/properties/${id}/upload-csv-units/`, updloadFormData)
      .then((res) => {
        setResponseTitle("File Upload Success");
        setResponseMessage("File(s) uploaded successfully");
        setShowFileUploadAlert(true);
        setShowCsvFileUploadDialog(false);
        setCsvFiles([]); //Clear the files array
      })
      .catch((err) => {
        setResponseTitle("File Upload Error");
        if (err.response.data.error_type === "duplicate_name_error") {
          setResponseMessage(
            "There was an error uploading your file(s). One or more of the unit names already exist. Please ensure that you file has unique unit names and try again."
          );
        } else {
          setResponseMessage(
            "There was an error uploading your file(s). Please ensure that you file has the correct column headers and try again."
          );
        }
        setShowFileUploadAlert(true);
        setShowCsvFileUploadDialog(false);
        setCsvFiles([]); //Clear the files array
      })
      .finally(() => {
        setIsUploading(false); //Set isUploading to false to hide the progress bar
      });
  };

  //Create a handle function to handle the form submission of updating property info
  const onSubmit = async () => {
    const response = await updatePropertyMedia(id, formData)
      .then((res) => {
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
      })
      .catch((error) => {
        console.error("Error updating property", error);
        setUpdateAlertTitle("Error");
        setUpdateAlertMessage("Something went wrong");
        setUpdateAlertIsOpen(true);
        setEditDialogOpen(false);
      });
  };

  const handleChangePortfolio = (selected_portfolio_id) => {
    setCurrentPortfolio(
      portfolios.find((portfolio) => portfolio.id === selected_portfolio_id)
    );
    updatePropertyPortfolio(property.id, selected_portfolio_id)
      .then((res) => {
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
      })
      .catch((error) => {
        console.error("Error updating property portfolio", error);
        setUpdateAlertTitle("Error");
        setUpdateAlertMessage("Something went wrong");
        setUpdateAlertIsOpen(true);
      });
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
        navigate("/dashboard/owner/properties");
      });
    }
  };
  const retrieveSubscriptionPlan = async () => {
    const res = await getUserStripeSubscriptions(authUser.id, token).then(
      (res) => {
        setCurrentSubscriptionPlan(res.subscriptions);
      }
    );
    return res;
  };
  //Create a function that deletes all units in a property by looping through the units array and deleting each unit using the deleteUnit function
  const handleDeleteAllUnits = async () => {
    try {
      //Check if any units are occupied before deleting
      let occupiedUnits = units.filter((unit) => unit.is_occupied);
      if (occupiedUnits.length > 0) {
        //Hide confirm modal
        setShowDeleteAlert(false);
        setShowDeleteError(true);
        setErrorMessage(
          `This property has occupied units. Please vacate all units before deleting them.`
        );
      } else {
        //Loop through the units array and delete each unit
        units.forEach((unit) => {
          let payload = {
            unit_id: unit.id,
            rental_property: unit.rental_property.id,
            product_id: currentSubscriptionPlan.plan.product,
            subscription_id: currentSubscriptionPlan.id,
          };
          deleteUnit(payload).then((res) => {});
        });
        //Show success alert
        setUpdateAlertTitle("Success");
        setUpdateAlertMessage("All units deleted");
        setShowDeleteAlert(false);
        setUpdateAlertIsOpen(true);
      }
    } catch (error) {
      console.error("Error deleting units", error);
      setUpdateAlertTitle("Error");
      setUpdateAlertMessage("Something went wrong");
      setUpdateAlertIsOpen(true);
    }
  };

  const getUnits = async () => {
    setIsLoadingUnits(true);
    getPropertyUnits(id)
      .then((res) => {
        console.log("property units", res);
        if (res.status === 200) {
          setUnits(res.data);
          setUnitCount(res.data.length);
          setBedsCount(
            res.data.map((unit) => unit.beds).reduce((a, b) => a + b, 0)
          );
          setBathsCount(
            res.data.map((unit) => unit.baths).reduce((a, b) => a + b, 0)
          );
        } else {
          setUpdateAlertTitle("Error");
          setUpdateAlertMessage("Something went wrong");
          setUpdateAlertIsOpen(true);
        }
      })
      .catch((error) => {
        console.error("Error retrieving units", error);
        setUpdateAlertTitle("Error");
        setUpdateAlertMessage("Something went wrong");
        setUpdateAlertIsOpen(true);
      })
      .finally(() => {
        setIsLoadingUnits(false);
      });
  };

  //Create a function that handle the change of the value of a preference
  const handlePreferenceChange = (e, inputType, preferenceName) => {
    if (inputType === "switch") {
      //Update the unit preferences state to be the opposite of the current value
      setPropertyPreferences((prevPreferences) => {
        const updatedPreferences = prevPreferences.map((preference) =>
          preference.name === preferenceName
            ? { ...preference, value: e.target.checked }
            : preference
        );
        //Update tProperty preferences with the api
        updatePropertyPreferences(id, {
          preferences: JSON.stringify(updatedPreferences),
        });
        return updatedPreferences;
      });
    } else {
    }
  };

  useEffect(() => {
    try {
      if (!property || !formData) {
        getProperty(id).then((res) => {
          if (res.status === 404) {
            //Navigate to properties page
            navigate("/dashboard/owner/properties");
          } else {
            retrieveSubscriptionPlan();
            syncPropertyPreferences(id);
            setProperty(res.data);

            if (res.data.preferences) {
              setPropertyPreferences(JSON.parse(res.data.preferences));
            }
            setFormData({
              name: res.data.name,
              street: res.data.street,
              city: res.data.city,
              state: res.data.state,
              zip_code: res.data.zip_code,
              country: res.data.country,
            });
            getPortfolios()
              .then((portfolio_res) => {
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
              })
              .catch((error) => {
                console.error("An error occured retieving portfolios", error);
                setUpdateAlertTitle("Error");
                setUpdateAlertMessage("Something went wrong");
                setUpdateAlertIsOpen(true);
              });
            retrieveFilesBySubfolder(`properties/${id}`, authUser.id)
              .then((res) => {
                setPropertyMedia(res.data);

                setPropertyMediaCount(res.data.length);
              })
              .catch((error) => {
                console.error(
                  "An error occured retieving property media",
                  error
                );
                setUpdateAlertTitle("Error");
                setUpdateAlertMessage(
                  "Something went wrong retrieving property media"
                );
                setUpdateAlertIsOpen(true);
              })
              .finally(() => {
                setIsLoading(false);
              });
          }
        });
      }
      if (!units || units.length === 0) {
        getUnits();
      }
    } catch (error) {
      return error.response;
    }
  }, [property, formData]);

  return (
    <>
      {isLoading || isLoadingUnits ? (
        <UIProgressPrompt
          dataTestId="property-loading-progress-prompt"
          title="Loading Property"
          message="Please wait while we load the property information for you."
        />
      ) : (
        <div
          className={`${
            screenWidth > breakpoints.md && "container-fluid"
          } manage-property-container`}
        >
          <Joyride
            // key={runTour ? "run" : "stop"}
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
            dataTestId="unit-delete-alert-modal"
            open={showAlertModal}
            title={alertTitle}
            message={alertMessage}
            btnText={"Ok"}
            onClick={() => {
              navigate(0);
            }}
          />
          <ProgressModal
            dataTestId="unit-delete-progress-modal"
            open={isProcessing}
            title="Please wait..."
          />
          <ConfirmModal
            open={showResetLeaseTemplateConfirmModal}
            title="Remove Lease Template"
            message="Are you sure you want to remove the lease template for this property? All the lease terms of its units, and  additional charges will be reset to default and lease document will no longer be associated with this unit."
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
              removePropertyLeaseTemplate(id)
                .then((res) => {
                  if (res.status === 200) {
                    setUpdateAlertTitle("Success");
                    setUpdateAlertMessage(
                      "Lease template removed from property"
                    );
                    setUpdateAlertIsOpen(true);
                  } else {
                    setUpdateAlertTitle("Error");
                    setUpdateAlertMessage("Something went wrong");
                    setUpdateAlertIsOpen(true);
                  }
                })
                .catch((err) => {
                  setUpdateAlertTitle("Error");
                  setUpdateAlertMessage("Something went wrong");
                  setUpdateAlertIsOpen(true);
                })
                .finally(() => {
                  setShowResetLeaseTemplateConfirmModal(false);
                });
            }}
          />
          <AlertModal
            dataTestId="property-update-alert-modal"
            open={updateAlertIsOpen}
            title={updateAlertTitle}
            message={updateAlertMessage}
            btnText={"Ok"}
            onClick={() => {
              navigate(0);
              setUpdateAlertIsOpen(false);
            }}
          />
          <AlertModal
            dataTestId="property-delete-error-alert-modal"
            open={showDeleteError}
            title="Error"
            message={errorMessage}
            onClick={() => setShowDeleteError(false)}
          />
          <ConfirmModal
            open={showDeleteAlert}
            title={deleteAlertTitle}
            message={deleteAlertMessage}
            confirmBtnText="Delete"
            cancelBtnText="Cancel"
            confirmBtnStyle={{
              backgroundColor: uiRed,
              color: "white",
            }}
            cancelBtnStyle={{
              backgroundColor: uiGrey2,
              color: "white",
            }}
            handleConfirm={deleteAlertAction}
            handleCancel={() => setShowDeleteAlert(false)}
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
                    <form>
                      <div className="row">
                        {formInputs.map((input, index) => {
                          return (
                            <div
                              className={`mb-3 col-md-${input.colSpan}`}
                              key={index}
                            >
                              <label
                                className="form-label text-black"
                                htmlFor={input.name}
                                data-testid={`update-property-${input.name}-label`}
                              >
                                <strong>{input.label}</strong>
                              </label>
                              {input.type === "text" ? (
                                <>
                                  {" "}
                                  <input
                                    data-testid={`update-property-${input.name}-input`}
                                    onChange={handleChange}
                                    onBlur={input.onChange}
                                    className="form-control"
                                    type="text"
                                    id={input.name}
                                    placeholder={input.placeholder}
                                    name={input.name}
                                    style={{
                                      borderStyle: "none",
                                      color: "black",
                                    }}
                                    value={formData[input.name]}
                                  />
                                  {errors[input.name] && (
                                    <span
                                      data-testId={input.errorMessageDataTestId}
                                      style={{ ...validationMessageStyle }}
                                    >
                                      {errors[input.name]}
                                    </span>
                                  )}
                                </>
                              ) : input.type === "select" ? (
                                <>
                                  <select
                                    onChange={handleChange} // Use handleChange function for select input
                                    data-testId={`update-property-${input.name}-input`}
                                    name={input.name}
                                    className="form-select"
                                    value={formData[input.name]} // Use formData to get the value for the select input
                                  >
                                    {input.options.map((option, index) => {
                                      return (
                                        <option
                                          key={index}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      );
                                    })}
                                  </select>
                                  {errors[input.name] && (
                                    <span
                                      data-testId={input.errorMessageDataTestId}
                                      style={{ ...validationMessageStyle }}
                                    >
                                      {errors[input.name]}
                                    </span>
                                  )}
                                </>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-end mb-3">
                        <UIButton
                          dataTestId="property-edit-dialog-save-button"
                          className="btn btn-primary btn-sm ui-btn"
                          onClick={() => {
                            const { isValid, newErrors } = validateForm(
                              formData,
                              formInputs
                            );
                            if (isValid) {
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
          <UIPageHeader
            headerImageSrc={
              propertyMedia && propertyMedia.length > 0 && propertyMedia[0].file
            }
            title={property?.name}
            subtitle={
              <>
                <span className="text-black">{currentPortfolio?.name}</span>
                <span className="text-black">
                  {property?.street} {property?.city}, {property?.state}{" "}
                  {property?.zip_code}
                </span>
              </>
            }
            subtitle2={
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                alignContent={"center"}
                spacing={2}
              >
                <div>
                  <MeetingRoomIcon
                    sx={{
                      fontSize: "15pt",
                      color: uiGreen,
                      marginRight: "5px",
                    }}
                  />
                  <span
                    data-testId="property-unit-count"
                    className="text-black"
                    style={{
                      fontSize: "12pt",
                    }}
                  >
                    {unitCount}
                  </span>
                </div>
                <div>
                  <HotelIcon
                    sx={{
                      fontSize: "15pt",
                      color: uiGreen,
                      marginRight: "5px",
                    }}
                  />
                  <span
                    data-testId="property-bed-count"
                    className="text-black"
                    style={{
                      fontSize: "12pt",
                    }}
                  >
                    {bedsCount}
                  </span>
                </div>
                <div>
                  <BathtubIcon
                    sx={{
                      fontSize: "15pt",
                      color: uiGreen,
                      marginRight: "5px",
                    }}
                  />
                  <span
                    className="text-black"
                    style={{
                      fontSize: "12pt",
                    }}
                    data-testId="property-bath-count"
                  >
                    {bathsCount}
                  </span>
                </div>
                <div>
                  <ZoomOutMapIcon
                    sx={{
                      fontSize: "15pt",
                      color: uiGreen,
                      marginRight: "5px",
                    }}
                  />
                  <span
                    data-testId="property-size"
                    className="text-black"
                    style={{
                      fontSize: "12pt",
                    }}
                  >
                    1234 Sq. Ft.
                  </span>
                </div>
              </Stack>
            }
            menuItems={[
              {
                label: "Edit Property",
                action: () => setEditDialogOpen(true),
              },
              {
                label: "Reset Lease Template",
                action: () => setShowResetLeaseTemplateConfirmModal(true),
              },
              {
                label: "Change Portfolio",
                action: () => setSelectPortfolioDialogOpen(true),
              },
              {
                label: "Delete All Units",
                action: () => {
                  setDeleteAlertTitle("Delete All Units");
                  setDeleteAlertMessage(
                    "Are you sure you want to delete all units in this property?"
                  );
                  setDeleteAlertAction(() => handleDeleteAllUnits);
                  setShowDeleteAlert(true);
                },
              },
              {
                label: "Delete Property",
                action: () => {
                  setDeleteAlertTitle("Delete Property");
                  setDeleteAlertMessage(
                    "Are you sure you want to delete this property?"
                  );
                  setDeleteAlertAction(() => handleDeleteProperty);
                  setShowDeleteAlert(true);
                },
              },
            ]}
          />
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
                            <ProgressModal
                              open={isUploading}
                              title="Uploading File..."
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
                                        `/dashboard/owner/units/create/${id}`
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
                          <div className="units-list">

                            <>
                              {isMobile ? (
                                <UITableMobile
                                  testRowIdentifier="rental-unit"
                                  tableTitle="Units"
                                  data={units}
                                  infoProperty="name"
                                  createTitle={(row) =>
                                    `Occupied: ${
                                      row.is_occupied ? `Yes` : "No"
                                    } `
                                  }
                                  createSubtitle={(row) =>
                                    `Beds: ${row.beds} | Baths: ${row.baths}`
                                  }
                                  createURL={`/dashboard/owner/units/create/${id}`}
                                  showCreate={true}
                                  acceptedFileTypes={[".csv"]}
                                  showUpload={true}
                                  uploadButtonText="Upload CSV"
                                  uploadHelpText="CSV file must contain the following columns: name, beds, baths, size. All lowercase and no spaces."
                                  fileUploadEndpoint={`/properties/${id}/upload-csv-units/`}
                                  onRowClick={(row) => {
                                    const navlink = `/dashboard/owner/units/${row.id}/${row.rental_property}`;
                                    navigate(navlink);
                                  }}
                                  orderingFields={[
                                    {
                                      field: "name",
                                      label: "Name (Ascending)",
                                    },
                                    {
                                      field: "-name",
                                      label: "Name (Descending)",
                                    },
                                  ]}
                                  searchFields={["name", "beds", "baths"]}
                                />
                              ) : (
                                <UITable
                                  testRowIdentifier="rental-unit"
                                  title="Rental Units"
                                  columns={unit_columns}
                                  data={units}
                                  options={unit_options}
                                  showCreate={true}
                                  createURL={`/dashboard/owner/units/create/${id}`}
                                  acceptedFileTypes={[".csv"]}
                                  showUpload={true}
                                  uploadHelpText="CSV file must contain the following columns: name, beds, baths, size. All lowercase and no spaces."
                                  uploadButtonText="Upload CSV"
                                  fileUploadEndpoint={`/properties/${id}/upload-csv-units/`}
                                  menuOptions={[
                                    {
                                      name: "Manage",
                                      onClick: (row) => {
                                        const navlink = `/dashboard/owner/units/${row.id}/${row.rental_property}`;
                                        navigate(navlink);
                                      },
                                    },
                                  ]}
                                />
                              )}
                            </>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
              {tabPage === 1 && (
                <div className="property-media-file-manager">
                  <FileManagerView
                    dataTestIdentifier="property-media"
                    files={propertyMedia}
                    subfolder={`properties/${id}`}
                    acceptedFileTypes={[".png", ".jpg", ".jpeg"]}
                  />
                </div>
              )}
              {tabPage === 2 && (
                <div className="property-preferences">
                  {propertyPreferences &&
                    propertyPreferences.map((preference, index) => {
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
          </div>
        </div>
      )}
      <UIHelpButton onClick={handleClickStart} />
    </>
  );
};

export default ManageProperty;
