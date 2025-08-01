import { Stack, Typography } from "@mui/material";
import React from "react";
import {
  uiGreen,
  uiGrey2,
  uiRed,
  validationMessageStyle,
} from "../../../../constants";
import { useParams } from "react-router";
import { useEffect } from "react";
import { authenticatedInstance } from "../../../../api/api";
import { useState } from "react";
import UITabs from "../../UIComponents/UITabs";
import BackButton from "../../UIComponents/BackButton";
import UIButton from "../../UIComponents/UIButton";
import UITable from "../../UIComponents/UITable/UITable";
import { useNavigate } from "react-router";
import { createBoldSignEmbeddedTemplateEditLink } from "../../../../api/boldsign";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UIPrompt from "../../UIComponents/UIPrompt";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import useScreen from "../../../../hooks/useScreen";
import {
  triggerValidation,
  validateForm,
} from "../../../../helpers/formValidation";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import AdditionalChargeRow from "./AdditionalChargeRow";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import Assign from "./CreateLeaseTemplate/Steps/Assign";
import {
  assignLeaseTemplate,
  deleteLeaseTemplate,
  removeLeaseTemplateFromAssignedResources,
} from "../../../../api/lease_templates";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import UIPageHeader from "../../UIComponents/UIPageHeader";
import UIProgressPrompt from "../../UIComponents/UIProgressPrompt";
import {
  numberUpTo2DecimalPlaces,
  uppercaseAndLowercaseLetters,
  validWholeNumber,
} from "../../../../constants/rexgex";

const ManageLeaseTemplate = () => {
  const iconStyles = {
    color: uiGreen,
    fontSize: "3rem",
  };
  const { id } = useParams();
  const navigate = useNavigate();
  const [leaseTemplate, setLeaseTemplate] = useState({});
  const [units, setUnits] = useState([]);
  const [properties, setProperties] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  //TODO: Tabs for lease terms: Details, Additional Charges, Units Assigned, View (BoldSign) Document,
  const [tabPage, setTabPage] = useState(0);
  const tabs = [
    { name: "details", label: "Details", dataTestId: "details-tab" },
    {
      name: "additionalCharges",
      label: "Additional Charges",
      dataTestId: "additional-charges-tab",
    },
    {
      name: "unitsAssigned",
      label: "Resources Assigned",
      dataTestId: "units-assigned-tab",
    },
    {
      name: "editDocument",
      label: "Edit Document",
      dataTestId: "edit-document-tab",
    },
  ];
  const { isMobile } = useScreen();
  const [assignmentView, setAssignmentView] = useState("unit");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignmentMode, setAssignmentMode] = useState("unit"); //portfolio, property or unit
  const [selectedAssignments, setSelectedAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [progressModalTitle, setProgressModalTitle] = useState("");
  const [alertModalIsOpen, setAlertModalIsOpen] = useState(false);
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [additionalCharges, setAdditionalCharges] = useState(null);
  const [openLeaseTemplateRemovePrompt, setOpenLeaseTemplateRemovePrompt] =
    useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [editLink, setEditLink] = useState("");
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [chargeErrors, setChargeErrors] = useState({});
  const [alertRedirectURL, setAlertRedirectURL] = useState(null);

  const tourSteps = [
    {
      target: ".lease-template-management-page",
      content:
        "This is the lease template management page where you can make changes to your lease agreement template by updating the lease term, adding additional charges, assigning the lease agreement to units, properties, or portfolios, and editing the lease agreement document.",
      placement: "center",
      disableBeacon: true,
    },
    {
      target: ".add-terms-container",
      content:
        "Here you can add terms to your lease agreement template. You can set the rent amount, rent frequency, term, late fee, security deposit, and other terms.",
    },
    {
      target: ".additional-charges-section",
      content:
        "Here you can add additional charges to your lease agreement template. You can set the name, amount, and frequency of the additional charges. An example of an additional charge is monthly pet rent.",
    },
    {
      target: ".assign-to-units-section",
      content:
        "Here you can assign the lease agreement template to units, properties, or portfolios. You can assign the lease agreement to multiple units, properties, or portfolios.",
    },
    {
      target: ".edit-lease-template-document",
      content:
        "Here you can edit the lease agreement document. You can update the lease agreement terms, add signature fields, and send the lease agreement for signature.",
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
  };
  const handleClickStart = (event) => {
    event.preventDefault();
    if (tabPage === 0) {
      setTourIndex(0);
    } else if (tabPage === 1) {
      setTourIndex(2);
    } else if (tabPage === 2) {
      setTourIndex(3);
    } else if (tabPage === 3) {
      setTourIndex(4);
    } else if (tabPage === 4) {
      setTourIndex(5);
    }
    setRunTour(true);
  };

  const handleChange = (e, formData, setFormData, formInputs, setErrors) => {
    const { name, value } = e.target;
    let newErrors = triggerValidation(
      name,
      value,
      formInputs.find((input) => input.name === name).validations
    );
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: newErrors[name],
    }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const [detailsErrors, setDetailsErrors] = useState({});
  const [detailsFormData, setDetailsFormData] = useState({});
  const detailsFormInputs = [
    {
      name: "rent",
      label: "Rent",
      type: "number",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: numberUpTo2DecimalPlaces,
        errorMessage: "Please enter a valid number",
      },
      dataTestId: "rent-input",
      errorMessageDataTestId: "rent-input-error",
    },
    {
      name: "rent_frequency",
      label: "Rent Frequency",
      type: "select",
      colSpan: 6,
      options: [
        { value: "", label: "Select One" },
        { value: "day", label: "Daily" },
        { value: "week", label: "Weekly" },
        { value: "month", label: "Monthly" },
        { value: "year", label: "Yearly" },
      ],
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: uppercaseAndLowercaseLetters,
        errorMessage: "This field is required",
      },
      dataTestId: "rent-frequency-select",
      errorMessageDataTestId: "rent-frequency-select-error",
    },
    {
      name: "term",
      label: "Term",
      type: "number",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: validWholeNumber,
        errorMessage: "This field is required",
      },
      dataTestId: "term-input",
      errorMessageDataTestId: "term-input-error",
    },
    {
      name: "late_fee",
      label: "Late Fee",
      type: "number",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: numberUpTo2DecimalPlaces,
        errorMessage: "Please enter a valid number",
      },
      dataTestId: "late-fee-input",
      errorMessageDataTestId: "late-fee-input-error",
    },
    {
      name: "security_deposit",
      label: "Security Deposit",
      type: "number",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: numberUpTo2DecimalPlaces,
        errorMessage: "Please enter a valid number",
      },
      dataTestId: "security-deposit-input",
      errorMessageDataTestId: "security-deposit-input-error",
    },
    {
      name: "gas_included",
      label: "Gas Included",
      type: "select",
      options: [
        { value: "", label: "Select One" },
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: uppercaseAndLowercaseLetters,
        errorMessage: "This field is required",
      },
      dataTestId: "gas-included-select",
      errorMessageDataTestId: "gas-included-select-error",
    },
    {
      name: "water_included",
      label: "Water Included",
      type: "select",
      options: [
        { value: "", label: "Select One" },
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: uppercaseAndLowercaseLetters,
        errorMessage: "This field is required",
      },
      dataTestId: "water-included-select",
      errorMessageDataTestId: "water-included-select-error",
    },
    {
      name: "electric_included",
      label: "Electric Included",
      type: "select",
      options: [
        { value: "", label: "Select One" },
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: uppercaseAndLowercaseLetters,
        errorMessage: "This field is required",
      },
      dataTestId: "electric-included-select",
      errorMessageDataTestId: "electric-included-select-error",
    },
    {
      name: "repairs_included",
      label: "Repairs Included",
      type: "select",
      options: [
        { value: "", label: "Select One" },
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: uppercaseAndLowercaseLetters,
        errorMessage: "This field is required",
      },
      dataTestId: "repairs-included-select",
      errorMessageDataTestId: "repairs-included-select-error",
    },
    {
      name: "grace_period",
      label: "Grace Period",
      type: "text",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: validWholeNumber,
        errorMessage: "This field is required",
      },
      dataTestId: "grace-period-input",
      errorMessageDataTestId: "grace-period-input-error",
    },

    {
      name: "lease_cancellation_notice_period",
      label: "Lease Cancellation Notice Period",
      type: "text",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: validWholeNumber,
        errorMessage: "This field is required",
      },
      dataTestId: "lease-cancellation-notice-period-input",
      errorMessageDataTestId: "lease-cancellation-notice-period-input-error",
    },
    {
      name: "lease_cancellation_fee",
      label: "Lease Cancellation Fee",
      type: "number",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: numberUpTo2DecimalPlaces,
        errorMessage: "Please enter a valid number",
      },
      dataTestId: "lease-cancellation-fee-input",
      errorMessageDataTestId: "lease-cancellation-fee-input-error",
    },
    {
      name: "lease_renewal_notice_period",
      label: "Lease Renewal Notice Period",
      type: "number",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: validWholeNumber,
        errorMessage: "This field is required",
      },
      dataTestId: "lease-renewal-notice-period-input",
      errorMessageDataTestId: "lease-renewal-notice-period-input-error",
    },
    {
      name: "lease_renewal_fee",
      label: "Lease Renewal Fee",
      type: "number",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          detailsFormData,
          setDetailsFormData,
          detailsFormInputs,
          setDetailsErrors
        ),
      validations: {
        required: true,
        regex: numberUpTo2DecimalPlaces,
        errorMessage: "Please enter a valid number",
      },
      dataTestId: "lease-renewal-fee-input",
      errorMessageDataTestId: "lease-renewal-fee-input-error",
    },
  ];

  //Additional Charges Functinos
  const addCharge = () => {
    setAdditionalCharges((prevCharges) => [
      ...prevCharges,
      {
        name: "",
        amount: "",
        frequency: "",
      },
    ]);
  };
  const removeCharge = (index) => {
    if (additionalCharges.length === 1) return;
    let newCharges = [...additionalCharges];
    newCharges.splice(index, 1);
    setAdditionalCharges(newCharges);
  };

  const saveAdditionalCharges = async () => {
    //Check if additional charges all have the same frequency
    const frequencies = additionalCharges.map((charge) => charge.frequency);
    const allFrequenciesEqual = frequencies.every(
      (freq, index) => freq === frequencies[0]
    );
    if (!allFrequenciesEqual) {
      // Handle case where frequencies are not all the same
      // Perform actions or show an error message to the user
      // You can return early, show an error message, or prevent form submission
      setIsLoading(false);
      setAlertModalMessage(
        "All additional charges must have the same frequency"
      );
      setAlertModalTitle("Error updating lease term");
      setAlertModalIsOpen(true);
      return; // Example: return or show an error message
    }

    //Check if additional charges have the same frequency as the rent frequency
    const rentFrequency = leaseTemplate.rent_frequency;
    const chargesMatchRentFrequency = additionalCharges.every(
      (charge) => charge.frequency === rentFrequency
    );
    if (!chargesMatchRentFrequency) {
      // Handle case where frequencies don't match rent frequency
      setIsLoading(false);
      setAlertModalMessage(
        "Additional charges must have the same frequency as the rent frequency"
      );
      setAlertModalTitle("Error updating lease term");
      setAlertModalIsOpen(true);
      return; // Example: return or show an error message
    }
    if (allFrequenciesEqual && chargesMatchRentFrequency) {
      // Convert amount fields to numbers
      const chargesWithNumericAmount = additionalCharges.map((charge) => ({
        ...charge,
        amount: `${charge.amount}`, // Convert amount to a number
      }));
      await authenticatedInstance
        .patch(`/lease-templates/${id}/`, {
          additional_charges: JSON.stringify(chargesWithNumericAmount),
        })
        .then((res) => {
          if (res.status === 200) {
            setAlertModalIsOpen(true);
            setAlertModalTitle("Success");
            setAlertModalMessage("Additional charges updated successfully.");
            setAlertRedirectURL(`/dashboard/owner/lease-templates/${id}`);
          } else {
            setAlertModalIsOpen(true);
            setAlertModalTitle("Error");
            setAlertModalMessage("Something went wrong. Please try again.");
            setAlertRedirectURL(`/dashboard/owner/lease-templates/${id}`);
          }
        })
        .catch((error) => {
          console.error(error);
          setAlertModalIsOpen(true);
          setAlertModalTitle("Error");
          setAlertModalMessage("Something went wrong. Please try again.");
          setAlertRedirectURL(`/dashboard/owner/lease-templates/${id}`);
        });
    }
  };

  //Create a function that applies the lease template to the selected assignments using the assignLeaseTemplate API function
  const handleApplyAssignments = async () => {
    setIsLoading(true);
    setProgressModalTitle("Assigning Lease Template...");
    const data = {
      lease_template_id: id,
      assignment_mode: assignmentMode,
      selected_assignments: JSON.stringify(selectedAssignments),
    };
    await assignLeaseTemplate(data).then((res) => {
      if (res.status === 200) {
        setAlertModalIsOpen(true);
        setAlertModalTitle("Success");
        setAlertModalMessage("Lease template assigned successfully.");
        setAlertRedirectURL(`/dashboard/owner/lease-templates/${id}`);
      } else {
        setAlertModalIsOpen(true);
        setAlertModalTitle("Error");
        setAlertModalMessage("Something went wrong. Please try again.");
        setAlertRedirectURL(`/dashboard/owner/lease-templates/${id}`);
      }
    });
    setIsLoading(false);
  };

  const onSubmit = async (data) => {
    await authenticatedInstance
      .patch(`/lease-templates/${id}/`, detailsFormData)
      .then((res) => {
        if (res.status === 200) {
          setAlertModalIsOpen(true);
          setAlertModalTitle("Success");
          setAlertModalMessage("Lease term updated successfully.");
          setAlertRedirectURL(`/dashboard/owner/lease-templates/${id}`);
        } else {
          setAlertModalIsOpen(true);
          setAlertModalTitle("Error");
          setAlertModalMessage("Something went wrong. Please try again.");
          setAlertRedirectURL(`/dashboard/owner/lease-templates/${id}`);
        }
      })
      .catch((error) => {
        console.error(error);
        setAlertModalIsOpen(true);
        setAlertModalTitle("Error");
        setAlertModalMessage("Something went wrong. Please try again.");
        setAlertRedirectURL(`/dashboard/owner/lease-templates/${id}`);
      });
  };
  const retrieveLeaseTemplateData = async () => {
    setIsLoadingPage(true);
    setProgressModalTitle("Retrieving Lease Template Information...");
    authenticatedInstance
      .get(`/lease-templates/${id}/`)
      .then((res) => {
        console.log(res);
        setLeaseTemplate(res.data);
        setDetailsFormData({
          rent: res.data.rent,
          rent_frequency: res.data.rent_frequency,
          term: res.data.term,
          late_fee: res.data.late_fee,
          security_deposit: res.data.security_deposit,
          gas_included: res.data.gas_included,
          water_included: res.data.water_included,
          electric_included: res.data.electric_included,
          repairs_included: res.data.repairs_included,
          grace_period: res.data.grace_period,
          lease_cancellation_notice_period:
            res.data.lease_cancellation_notice_period,
          lease_cancellation_fee: res.data.lease_cancellation_fee,
          lease_renewal_notice_period: res.data.lease_renewal_notice_period,
          lease_renewal_fee: res.data.lease_renewal_fee,
        });
        setAdditionalCharges(JSON.parse(res.data.additional_charges));
        setUnits(res.data.units ? res.data.units : []);
        setProperties(
          res.data.rental_properties ? res.data.rental_properties : []
        );
        setPortfolios(res.data.portfolios ? res.data.portfolios : []);
      })
      .catch((error) => {
        console.error(error);
        setAlertModalIsOpen(true);
        setAlertModalTitle("Error");
        setAlertModalMessage("Something went wrong. Please try again.");
        setAlertRedirectURL(`/dashboard/owner/lease-templates/${id}`);
      })
      .finally(() => {
        setIsLoadingPage(false);
      });
  };
  const retrieveEditLink = async () => {
    setIsLoading(true);
    setProgressModalTitle("Retrieving Lease Document...");
    createBoldSignEmbeddedTemplateEditLink({
      template_id: leaseTemplate.template_id,
    })
      .then((res) => {
        setEditLink(res.url);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleChangeTabPage = (event, newValue) => {
    if (newValue === 0) {
      retrieveLeaseTemplateData();
    } else if (newValue === 3) {
      retrieveEditLink();
    }
    setTabPage(newValue);
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
  };
  const portfolio_columns = [
    {
      name: "name",
      label: "Name",
      flex: 1,
    },
    {
      name: "description",
      label: "Description",
      flex: 1,
    },
    {
      name: "created_at",
      label: "Date Created",
      options: {
        customBodyRender: (value) => {
          return new Date(value).toLocaleDateString();
        },
      },
    },
  ];
  const portfolio_options = {
    onRowClick: (row) => {
      navigate(`/dashboard/owner/portfolios/${row.id}`);
    },
    orderingFields: [
      { field: "name", label: "Name (Ascending)" },
      { field: "-name", label: "Name (Descending)" },
      { field: "description", label: "Description (Ascending)" },
      { field: "-description", label: "Description (Descending)" },
      { field: "created_at", label: "Date Created (Ascending)" },
      { field: "-created_at", label: "Date Created (Descending)" },
    ],
  };
  useEffect(() => {
    retrieveLeaseTemplateData();
  }, []);
  return (
    <>
      {isLoadingPage ? (
        <UIProgressPrompt
          title="Loading Lease Template Information"
          message="Please wait while we retrieve data for your lease template."
        />
      ) : (
        <div className="container lease-template-management-page">
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
          <ConfirmModal
            open={openLeaseTemplateRemovePrompt}
            title="Remove Lease Template"
            message="Are you sure you want to remove this lease template from all assigned resources (i.e. units, properties, portfolios, etc.)?"
            handleConfirm={() => {
              // Remove lease template
              removeLeaseTemplateFromAssignedResources({
                lease_template_id: id,
              }).then((res) => {
                if (res.status === 200) {
                  setAlertModalIsOpen(true);
                  setAlertModalTitle("Success");
                  setAlertModalMessage("Lease template removed successfully.");
                } else {
                  setAlertModalIsOpen(true);
                  setAlertModalTitle("Error");
                  setAlertModalMessage(
                    "Something went wrong. Please try again."
                  );
                }
              });
            }}
            handleCancel={() => {
              setOpenLeaseTemplateRemovePrompt(false);
            }}
            confirmBtnText="Remove"
            cancelBtnText="Cancel"
            confirmBtnStyle={{ backgroundColor: uiRed }}
            cancelBtnStyle={{ backgroundColor: uiGrey2 }}
          />
          <ConfirmModal
            open={showDeleteConfirmModal}
            title="Delete Lease Template"
            message="Are you sure you want to delete this lease template?"
            handleConfirm={() => {
              deleteLeaseTemplate(id)
                .then((res) => {
                  setAlertModalIsOpen(true);
                  setAlertModalTitle("Lease Template Deleted");
                  setAlertModalMessage("");
                  setAlertRedirectURL("/dashboard/owner/lease-templates");
                })
                .catch((error) => {
                  console.error(error);
                  setAlertModalIsOpen(true);
                  setAlertModalTitle("Error");
                  setAlertModalMessage(
                    "Something went wrong. Please try again."
                  );
                });
            }}
            confirmBtnText="Delete"
            confirmBtnStyle={{ backgroundColor: uiRed }}
            cancelBtnText="Cancel"
            handleCancel={() => {
              setShowDeleteConfirmModal(false);
            }}
            cancelBtnStyle={{ backgroundColor: uiGreen }}
          />
          <ProgressModal open={isLoading} title={progressModalTitle} />
          <AlertModal
            open={alertModalIsOpen}
            title={alertModalTitle}
            message={alertModalMessage}
            onClick={() => {
              setAlertModalIsOpen(false);
              if (alertRedirectURL) {
                navigate(alertRedirectURL);
              }
              navigate(0);
            }}
            btnText="Okay"
          />
          <UIDialog
            open={showAssignModal}
            title="Select Assignments"
            onClose={() => setShowAssignModal(false)}
            maxWidth={"lg"}
          >
            <Assign
              hideShadow={true}
              hideStepControl={true}
              selectedAssignments={selectedAssignments}
              setSelectedAssignments={setSelectedAssignments}
              assignmentMode={assignmentMode}
              setAssignmentMode={setAssignmentMode}
            />
            <UIButton
              btnText="Assign Lease Template"
              onClick={handleApplyAssignments}
            />
          </UIDialog>

          <UIPageHeader
            title="Manage Lease Template"
            subtitle={`$${leaseTemplate.rent}/${leaseTemplate.rent_frequency} | ${leaseTemplate.term} months`}
            menuItems={[
              {
                label: "Assign Lease Template",
                action: () => setShowAssignModal(true),
              },
              {
                label: "Reset Lease Template",
                action: () => setOpenLeaseTemplateRemovePrompt(true),
              },
              {
                label: "Delete Lease Template",
                action: () => setShowDeleteConfirmModal(true),
              },
            ]}
          />

          <BackButton />
          <UITabs
            style={{ marginBottom: "2rem" }}
            tabs={tabs}
            value={tabPage}
            handleChange={handleChangeTabPage}
            scrollable={true}
          />
          {tabPage === 0 && (
            <div className="card add-terms-container">
              <div className="card-body" style={{ overflow: "auto" }}>
                <form className="row">
                  {detailsFormInputs.map((input, index) => (
                    <div
                      className={`form-group col-md-${input.colSpan} mb-4`}
                      key={index}
                    >
                      <Typography
                        className="mb-2"
                        sx={{ color: uiGrey2, fontSize: "12pt" }}
                        htmlFor={input.name}
                        data-testid={input.dataTestId + "-label"}
                      >
                        {input.label}
                      </Typography>
                      {input.type === "select" ? (
                        <select
                          data-testid={input.dataTestId}
                          id={input.name}
                          name={input.name}
                          value={detailsFormData[input.name]}
                          onChange={input.onChange}
                          onBlur={input.onChange}
                          className="form-control"
                        >
                          {input.options.map((option, i) => (
                            <option key={i} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          data-testid={input.dataTestId}
                          id={input.name}
                          name={input.name}
                          type={input.type}
                          value={detailsFormData[input.name]}
                          onChange={input.onChange}
                          onBlur={input.onChange}
                          className="form-control"
                        />
                      )}
                      {detailsErrors[input.name] && (
                        <span style={validationMessageStyle}>
                          {detailsErrors[input.name]}
                        </span>
                      )}
                    </div>
                  ))}
                  <div className="form-group col-md-12">
                    <UIButton
                      onClick={() => {
                        const { isValid, newErrors } = validateForm(
                          detailsFormData,
                          detailsFormInputs
                        );
                        if (isValid) {
                          onSubmit();
                        } else {
                          setDetailsErrors(newErrors);
                        }
                      }}
                      btnText="Update"
                      style={{ float: "right" }}
                    />
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Additional Charges */}
          {tabPage === 1 && (
            <>
              {additionalCharges.length > 0 ? (
                <div className="card additional-charges-section">
                  <div className="card-body">
                    <>
                      {additionalCharges.map((charge, index) => (
                        <AdditionalChargeRow
                          key={index}
                          index={index}
                          charge={charge}
                          addCharge={addCharge}
                          removeCharge={removeCharge}
                          setCharges={setAdditionalCharges}
                          charges={additionalCharges}
                          errors={chargeErrors}
                          setErrors={setChargeErrors}
                        />
                      ))}

                      <UIButton
                        btnText="Update Charges"
                        onClick={() => {
                          if (
                            Object.values(chargeErrors).every(
                              (val) => val === undefined
                            )
                          ) {
                            saveAdditionalCharges();
                          } else {
                            setAlertModalIsOpen(true);
                            setAlertModalTitle("Additional Charges Errors");
                            setAlertModalMessage(
                              "Please fix the errors before updating the additional charges."
                            );
                          }
                        }}
                        style={{ marginTop: "20px", float: "right" }}
                      />
                    </>
                  </div>
                </div>
              ) : (
                <>
                  <UIPrompt
                    icon={<AttachMoneyIcon style={iconStyles} />}
                    title="No Additional Charges"
                    message="You have not added any additional charges to this unit. Click the button below to add additional charges."
                    body={
                      <UIButton
                        onClick={addCharge}
                        btnText="Add Additional Charges"
                        variant="text"
                        style={{
                          marginTop: "30px",
                          color: uiGreen,
                          backgroundColor: "transparent",
                          display: "block",
                        }}
                      />
                    }
                  />
                </>
              )}
            </>
          )}
          {tabPage === 2 && (
            <div className="assign-to-units-section">
              <select
                value={assignmentView}
                onChange={(e) => setAssignmentView(e.target.value)}
                style={{
                  background: "white !important",
                  marginBottom: "1rem",
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "5px",
                  border: "none",
                }}
              >
                <option value="unit">Units</option>
                <option value="property">Properties</option>
                <option value="portfolio">Portfolios</option>
              </select>
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                spacing={1}
              >
                <UIButton
                  btnText="Assign Lease Template"
                  style={{
                    marginBottom: "1rem",
                  }}
                  onClick={() => {
                    setShowAssignModal(true);
                  }}
                />
              </Stack>
              {assignmentView === "unit" && (
                <>
                  {isMobile ? (
                    <UITableMobile
                      tableTitle="Units"
                      data={units}
                      infoProperty="name"
                      createTitle={(row) =>
                        `Occupied: ${row.is_occupied ? `Yes` : "No"} `
                      }
                      createSubtitle={(row) =>
                        `Beds: ${row.beds} | Baths: ${row.baths}`
                      }
                      onRowClick={(row) => {
                        const navlink = `/dashboard/owner/units/${row.id}/${row.rental_property}`;
                        navigate(navlink);
                      }}
                      orderingFields={[
                        { field: "name", label: "Name (Ascending)" },
                        { field: "-name", label: "Name (Descending)" },
                        { field: "beds", label: "Beds (Ascending)" },
                        { field: "-beds", label: "Beds (Descending)" },
                        { field: "baths", label: "Baths (Ascending)" },
                        { field: "-baths", label: "Baths (Descending)" },
                      ]}
                      searchFields={["name", "beds", "baths"]}
                    />
                  ) : (
                    <>
                      <UITable
                        title="Units"
                        data={units}
                        columns={unit_columns}
                        options={unit_options}
                        onRowClick={(row) => {
                          let navlink = "/";
                          navlink = `/dashboard/owner/units/${row.id}/${row.rental_property}`;
                          navigate(navlink);
                        }}
                        menuOptions={[
                          {
                            name: "View",
                            onClick: (row) => {
                              const navlink = `/dashboard/owner/units/${row.id}/${row.rental_property_id}`;
                              navigate(navlink);
                            },
                          },
                        ]}
                      />
                    </>
                  )}
                </>
              )}
              {assignmentView === "property" && (
                <>
                  {isMobile ? (
                    <UITableMobile
                      tableTitle="Properties"
                      data={properties}
                      infoProperty="name"
                      createTitle={(row) =>
                        `${row.street}, ${row.city}, ${row.state}`
                      }
                      subtitleProperty="somthing"
                      onRowClick={(row) => {
                        const navlink = `/dashboard/owner/properties/${row.id}`;
                        navigate(navlink);
                      }}
                      createURL="/dashboard/owner/properties/create"
                      showCreate={true}
                      orderingFields={[
                        { field: "name", label: "Name (Ascending)" },
                        { field: "-name", label: "Name (Descending)" },
                        {
                          field: "created_at",
                          label: "Date Created (Ascending)",
                        },
                        {
                          field: "-created_at",
                          label: "Date Created (Descending)",
                        },
                      ]}
                      searchFields={["name", "street", "city", "state"]}
                    />
                  ) : (
                    <UITable
                      title="Properties"
                      data={properties}
                      columns={[
                        { label: "Name", name: "name" },
                        { label: "Street", name: "street" },
                        { label: "City", name: "city" },
                        { label: "State", name: "state" },
                      ]}
                      options={{
                        isSelectable: false,
                      }}
                      onRowClick={(row) => {
                        const navlink = `/dashboard/owner/properties/${row.id}`;
                        navigate(navlink);
                      }}
                      menuOptions={[
                        {
                          name: "View",
                          onClick: (row) => {
                            const navlink = `/dashboard/owner/properties/${row.id}`;
                            navigate(navlink);
                          },
                        },
                      ]}
                    />
                  )}
                </>
              )}
              {assignmentView === "portfolio" && (
                <>
                  {isMobile ? (
                    <UITableMobile
                      testRowIdentifier="portfolio"
                      tableTitle="Portfolios"
                      data={portfolios}
                      createInfo={(row) => {
                        return `${row.name}`;
                      }}
                      createTitle={(row) => {
                        return `${row.description}`;
                      }}
                      createSubtitle={(row) => {
                        return ``;
                      }}
                      showCreate={true}
                      createURL="/dashboard/owner/portfolios/create"
                      onRowClick={(row) => {
                        navigate(`/dashboard/owner/portfolios/${row.id}`);
                      }}
                      orderingFields={[
                        { field: "name", label: "Name (Ascending)" },
                        { field: "-name", label: "Name (Descending)" },
                        {
                          field: "description",
                          label: "Description (Ascending)",
                        },
                        {
                          field: "-description",
                          label: "Description (Descending)",
                        },
                        {
                          field: "created_at",
                          label: "Date Created (Ascending)",
                        },
                        {
                          field: "-created_at",
                          label: "Date Created (Descending)",
                        },
                      ]}
                      searchFields={["name", "description"]}
                    />
                  ) : (
                    <UITable
                      testRowIdentifier="portfolio"
                      title="Portfolios"
                      data={portfolios}
                      columns={portfolio_columns}
                      options={portfolio_options}
                      showCreate={true}
                      createURL="/dashboard/owner/portfolios/create"
                      onRowClick={(row) => {
                        navigate(`/dashboard/owner/portfolios/${row.id}`);
                      }}
                      menuOptions={[
                        {
                          name: "View",
                          onClick: (row) => {
                            navigate(`/dashboard/owner/portfolios/${row.id}`);
                          },
                        },
                      ]}
                    />
                  )}
                </>
              )}
            </div>
          )}
          {tabPage === 3 && (
            <>
              <div className="card edit-lease-template-document">
                <iframe
                  src={editLink}
                  height={isMobile ? "500px" : "1200px"}
                  width="100%"
                  title="Edit Lease Template"
                />
              </div>
            </>
          )}
          <UIHelpButton onClick={handleClickStart} />
        </div>
      )}
    </>
  );
};

export default ManageLeaseTemplate;
