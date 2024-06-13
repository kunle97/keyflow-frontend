import React, { useCallback, useEffect, useState } from "react";
import UIInput from "../../UIComponents/UIInput";
import { createBillingEntry } from "../../../../api/billing-entries";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import {
  authUser,
  uiGreen,
  uiGrey2,
  uiRed,
  validationMessageStyle,
} from "../../../../constants";
import UIButton from "../../UIComponents/UIButton";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import {
  Button,
  ButtonBase,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import {
  getOwnerTenants,
  getStripeAccountRequirements,
  getStripeOnboardingAccountLink,
} from "../../../../api/owners";
import { authenticatedInstance } from "../../../../api/api";
import { useNavigate } from "react-router";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import UIPrompt from "../../UIComponents/UIPrompt";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import {
  triggerValidation,
  validateForm,
} from "../../../../helpers/formValidation";
import Joyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  STATUS,
  Step,
} from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import { lettersNumbersAndSpecialCharacters, numberUpTo2DecimalPlaces, uppercaseAndLowercaseLetters, validAnyString, validHTMLDateInput, validWholeNumber } from "../../../../constants/rexgex";
const CreateBillingEntry = () => {
  const [tenants, setTenants] = useState([]);
  const [tenantSerchQuery, setTenantSearchQuery] = useState("");
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [tenantModalOpen, setTenantModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [rentalUnitModalOpen, setRentalUnitModalOpen] = useState(false);
  const [selectedRentalUnit, setSelectedRentalUnit] = useState(null);
  const [rentalUnitEndpoint, setRentalUnitEndpoint] = useState("/units/");
  const [rentalUnits, setRentalUnits] = useState([]);
  const [rentalUnitNextPage, setRentalUnitNextPage] = useState(null);
  const [rentalUnitPreviousPage, setRentalUnitPreviousPage] = useState(null);
  const [rentalUnitSearchQuery, setRentalUnitSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTenants, setLoadingTenants] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [isExpense, setIsExpense] = useState(false);
  const [errors, setErrors] = useState({});
  const [redirectToBillingEntries, setRedirectToBillingEntries] =
    useState(false);
  const [stripeAccountRequirements, setStripeAccountRequirements] = useState(
    []
  );
  const [displayOnboardingAlert, setDisplayOnboardingAlert] = useState(false);
  const [stripeOnboardingPromptOpen, setStripeOnboardingPromptOpen] =
    useState(false);
  const [stripeAccountLink, setStripeAccountLink] = useState("");
  const navigate = useNavigate();

  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".create-billing-entry-form",
      content:
        "This is the create billing entry page. Here you can create a new bill to send to your tenants or record a general revenue or expense that may not have been tracked automatically by the system.",
      disableBeacon: true,
    },
    {
      target: '[data-testId="amount-input"]',
      content: "Enter the amount for the billing entry",
    },
    {
      target: '[data-testId="tenant-select"]',
      content: "Select the tenant for the billing entry",
    },
    {
      target: '[data-testId="rental-unit-select"]',
      content: "Select the rental unit for the billing entry",
    },
    {
      target: '[data-testId="type-select"]',
      content: "Select the type of billing entry",
    },
    {
      target: '[data-testId="status-select"]',
      content: "Select the status of the billing entry",
    },
    {
      target: '[data-testId="collection-method-select"]',
      content: "Select the collection method for the billing entry",
    },
    {
      target: '[data-testId="due-date-input"]',
      content: "Enter the due date for the billing entry",
    },
    {
      target: '[data-testId="description-input"]',
      content: "Enter a description for the billing entry",
    },

    {
      target: '[data-testId="create-billing-entry-submit-button"]',
      content: "When finished click here to create the billing entry",
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
    console.log(runTour);
  };

  const [formData, setFormData] = useState({
    amount: "",
    create_transaction: "",
    type: "",
    status: "",
    create_subscription: "",
    collection_method: "",
    description: "",
    due_date: "",
    owner: authUser.owner_id,
    tenant: null,
    rental_unit: null,
  });
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
      id: 1,
      label: "Amount",
      type: "text",
      placeholder: "Enter amount",
      name: "amount",
      step: "0.01",
      hide: false,
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        regex: numberUpTo2DecimalPlaces,
        errorMessage:
          "Amount cannot be blank and must be a decimal number with two decimal places",
      },
      dataTestId: "amount-input",
      errorMessageDataTestId: "amount-error-message",
    },
    {
      id: 4,
      label: "Type",
      type: "select",
      name: "type",
      options: [
        { value: "revenue", text: "General Revenue", optGroup: "Revenues" },
        {
          value: "security_deposit",
          text: "Security Deposit",
          optGroup: "Revenues",
        },
        { value: "rent_payment", text: "Rent Payment", optGroup: "Revenues" },
        { value: "late_fee", text: "Late Fee", optGroup: "Revenues" },
        { value: "pet_fee", text: "Pet Fee", optGroup: "Revenues" },
        {
          value: "lease_renewal_fee",
          text: "Lease Renewal Fee",
          optGroup: "Revenues",
        },
        {
          value: "lease_cancellation_fee",
          text: "Lease Cancellation Fee",
          optGroup: "Revenues",
        },
        {
          value: "maintenance_fee",
          text: "Maintenance Fee",
          optGroup: "Revenues",
        },
        { value: "expense", text: "General Expense", optGroup: "Expenses" },
        {
          value: "vendor_payment",
          text: "Vendor Payment",
          optGroup: "Expenses",
        },
      ],
      validations: {
        required: true,
        errorMessage: "Please specify the type of billing entry.",
        regex: validAnyString,
      },
      hide: false,
      onChange: (e) => {
        setErrors({});
        if (
          e.target.value === "expense" ||
          e.target.value === "vendor_payment"
        ) {
          setIsExpense(true);
          //Set collection_method and due_date to null in form data
          setFormData((prevData) => ({
            ...prevData,
            collection_method: null,
            due_date: null,
            rental_unit: null,
            tenant: null,
          }));
          setSelectedRentalUnit(null);
          setSelectedTenant(null);
        } else {
          setIsExpense(false);
          setFormData((prevData) => ({
            ...prevData,
            rental_unit: null,
            tenant: null,
          }));

          setSelectedRentalUnit(null);
          setSelectedTenant(null);
        }
        handleChange(e);
      },
      dataTestId: "type-select",
      errorMessageDataTestId: "type-error-message",
    },
    {
      id: 2,
      label: "Tenant",
      type: "button_select",
      selectTarget: selectedTenant,
      selectTargetLabel: selectedTenant
        ? selectedTenant.user?.first_name + " " + selectedTenant.user?.last_name
        : "",
      name: "tenant",
      dialogAction: () => handleOpenTenantSelectModal(),
      hide: isExpense,
      validations: {
        required: false,
        errorMessage: "Tenant cannot be blank",
        regex: validWholeNumber,
      },
      dataTestId: "tenant-select",
      errorMessageDataTestId: "tenant-error-message",
    },
    {
      id: 3,
      label: "Rental Unit",
      type: "button_select",
      selectTarget: selectedRentalUnit,
      selectTargetLabel: selectedRentalUnit?.name,
      name: "rental_unit",
      dialogAction: () => handleOpenRentalUnitSelectModal(),
      hide: !isExpense,
      validations: {
        required: false,
        errorMessage: "Rental Unit cannot be blank",
        regex: validWholeNumber,
      },
      dataTestId: "rental-unit-select",
      errorMessageDataTestId: "rental-unit-error-message",
    },

    {
      id: 5,
      label: "Status",
      type: "select",
      name: "status",
      options: [
        { value: "unpaid", text: "Unpaid" },
        { value: "paid", text: "Paid" },
      ],
      hide: false,
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        errorMessage: "Please specify the status of the billing entry.",
        regex: uppercaseAndLowercaseLetters,
      },
      dataTestId: "status-select",
      errorMessageDataTestId: "status-error-message",
    },

    {
      id: 7,
      label: isExpense ? "Transaction Date" : "Due Date",
      type: "date",
      name: "due_date",
      hide: false,
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        errorMessage: isExpense
          ? "A transaction date is required for the billing entry."
          : "A due date is required for the billing entry.",
        regex: validHTMLDateInput,
      },
      dataTestId: "due-date-input",
      errorMessageDataTestId: "due-date-error-message",
    },
    {
      id: 8,
      label: "Description",
      type: "textarea",
      name: "description",
      placeholder: "Enter description",
      hide: false,
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        errorMessage: "A description is required for the billing entry.",
        regex: validAnyString,
      },
      dataTestId: "description-input",
      errorMessageDataTestId: "description-error-message",
    },
  ];
  const retrieveTenants = async () => {
    setLoadingTenants(true);
    const res = await getOwnerTenants()
      .then((res) => {
        setTenants(res.data);
      })
      .catch((err) => {
        console.error("Retrieve tenants error ", err);
        setTenants([]);
      })
      .finally(() => {
        setLoadingTenants(false);
      });
  };

  const handleSearchRentalUnits = async () => {
    const res = await authenticatedInstance.get(rentalUnitEndpoint, {
      params: {
        search: rentalUnitSearchQuery,
        limit: 10,
      },
    });
    setRentalUnits(res.data.results);
    setRentalUnitNextPage(res.data.next);
    setRentalUnitPreviousPage(res.data.previous);
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

  //Create a function called handleNextPageRentalUnitClick to handle the next page click of the rental unit modal by fetching the next page of rental units from the api
  const handleNextPageRentalUnitClick = async () => {
    setRentalUnitEndpoint(rentalUnitNextPage);
    handleSearchRentalUnits();
  };

  //Create function for previous page
  const handlePreviousPageRentalUnitClick = async () => {
    setRentalUnitEndpoint(rentalUnitPreviousPage);
    handleSearchRentalUnits();
  };

  const handleOpenTenantSelectModal = async () => {
    setTenantModalOpen(true);
    //Fetch tenants from api
    if (tenants.length === 0) {
      await retrieveTenants();
    } else {
      setTenantModalOpen(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, newErrors } = validateForm(formData, formInputs);
    setErrors(newErrors);
    if (isValid) {
      setIsLoading(true);
      const data = new FormData();
      formData.collection_method = "send_invoice"
      createBillingEntry(formData)
        .then((res) => {
          if (res.status === 200) {
            console.log("Billing entry created successfully");
            setAlertTitle("Success");
            setAlertMessage("Billing entry created successfully");
            setRedirectToBillingEntries(true);
          } else {
            console.error("Create billing entry error ", res);
            setAlertTitle("Error");
            setAlertMessage("There was an error creating the billing entry.");
            setRedirectToBillingEntries(false);
          }
        })
        .catch((err) => {
          console.error("Create billing entry error ", err);
          setAlertTitle("Error");
          setAlertMessage("There was an error creating the billing entry.");
          setRedirectToBillingEntries(false);
        })
        .finally(() => {
          console.log("Create billing entry finally");
          setAlertOpen(true);
          setIsLoading(false);
        });
    } else {
      setAlertTitle("Error Submitting Form");
      let form_errors = "";
      Object.entries(errors).forEach(([key, value]) => {
        form_errors += `${value}\n`;
      });
      setAlertMessage("Please fix the form errors before submitting.");
      setAlertOpen(true);
      setRedirectToBillingEntries(false);
    }
  };
  useEffect(() => {
    getStripeOnboardingAccountLink().then((res) => {
      console.log("Stripe ACcount link res: ", res);
      setStripeAccountLink(res.account_link);
    });
    getStripeAccountRequirements().then((res) => {
      console.log("Stripe Account Requirements: ", res);
      setStripeAccountRequirements(res.requirements);
      setStripeOnboardingPromptOpen(res.requirements.currently_due.length > 0);
      setDisplayOnboardingAlert(res.requirements.currently_due.length > 0);
    });
  }, []);
  return (
    <div className="container-fluid">
      <ConfirmModal
        open={stripeOnboardingPromptOpen}
        title={"Complete Stripe Account Onboarding"}
        message={
          "In order to create billing entries and invoices you need to complete your Stripe account onboarding. Click the button below to complete your account setup."
        }
        confirmBtnText={"Complete Account Setup"}
        handleConfirm={() => {
          window.open(stripeAccountLink, "_blank");
        }}
        confirmBtnStyle={{
          color: "white",
          background: uiGreen,
        }}
        cancelBtnStyle={{
          color: "white",
          background: uiGrey2,
        }}
        cancelBtnText={"Not Now"}
        handleCancel={() => {
          navigate("/dashboard/owner/billing-entries/");
        }}
      />
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
      <ProgressModal open={isLoading} title="Creating Billing Entry..." />
      <AlertModal
        dataTestId="create-billing-entry-alert-modal"
        open={alertOpen}
        title={alertTitle}
        message={alertMessage}
        btnText={"Ok"}
        onClick={() => {
          if (redirectToBillingEntries) {
            navigate("/dashboard/owner/billing-entries/");
          }
          setAlertOpen(false);
        }}
      />
      <UIDialog
        open={tenantModalOpen}
        title="Select Tenant"
        onClose={() => setTenantModalOpen(false)}
        style={{ width: "500px" }}
      >
        <UIInput
          onChange={(e) => {
            setTenantSearchQuery(e.target.value);
            retrieveTenants();
          }}
          type="text"
          placeholder="Search tenant"
          inputStyle={{ margin: "10px 0" }}
          name="tenant_search"
        />
        {loadingTenants ? (
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{
              padding: "20px",
            }}
          >
            <CircularProgress sx={{ color: uiGreen }} />
          </Stack>
        ) : (
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
            {tenants.length === 0 && (
              <>
                <ListItem alignItems="flex-start">
                  <UIPrompt
                    style={{ padding: "1rem 0" }}
                    hideBoxShadow={true}
                    icon={
                      <PersonOffIcon sx={{ fontSize: 50, color: uiGreen }} />
                    }
                    title="No tenants found"
                    message="Either there are no tenants added to your account or the search query did not match any tenants. Please try again by searching for a different tenant."
                  />
                </ListItem>
              </>
            )}
            {tenants.length > 0 &&
              tenants.map((tenant, index) => {
                return (
                  <>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Stack
                            direction="row"
                            spacing={2}
                            justifyContent={"space-between"}
                            alignContent={"center"}
                            alignItems={"center"}
                          >
                            <div>
                              <span>{`${tenant.user.first_name} ${tenant.user.last_name}`}</span>
                              <span></span>
                            </div>
                            <div>
                              <UIButton
                                dataTestId={`select-tenant-button-${index}`}
                                onClick={() => {
                                  setSelectedTenant(tenant);
                                  triggerValidation(
                                    "tenant",
                                    tenant.id,
                                    formInputs.find(
                                      (input) => input.name === "tenant"
                                    ).validations
                                  );
                                  setFormData((prevData) => ({
                                    ...prevData,
                                    tenant: tenant.id,
                                  }));
                                  //sett the rental unit to null
                                  setFormData((prevData) => ({
                                    ...prevData,
                                    rental_unit: null,
                                  }));
                                  setSelectedRentalUnit(null);
                                  //Clear errors for tenant and rental unit
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    tenant: "",
                                    rental_unit: "",
                                  }));
                                  setTenantModalOpen(false);
                                }}
                                sx={{
                                  background: uiGreen,
                                  color: "white",
                                  textTransform: "none",
                                  float: "right",
                                  marginTop: "10px",
                                }}
                                variant="container"
                                className="ui-btn"
                                btnText="Select"
                              />
                            </div>
                          </Stack>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </>
                );
              })}
          </List>
        )}
      </UIDialog>
      <UIDialog
        open={rentalUnitModalOpen}
        title="Select Rental Unit"
        onClose={() => setRentalUnitModalOpen(false)}
        style={{ width: "500px" }}
      >
        {/* Create a search input using ui input */}
        <UIInput
          onChange={(e) => {
            setRentalUnitSearchQuery(e.target.value);
            handleSearchRentalUnits();
          }}
          type="text"
          placeholder="Search rental unit"
          inputStyle={{ margin: "10px 0" }}
          name="rental_unit_search"
        />
        {/* Create a list of rental units */}
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
          {rentalUnits.map((unit, index) => {
            return (
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
                  //Set the tenant to null
                  setFormData((prevData) => ({
                    ...prevData,
                    tenant: null,
                  }));
                  setSelectedTenant(null);
                  //CLear errors for tenant and rental unit
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    tenant: "",
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
                    primary={unit.name}
                    secondary={unit.rental_property_name}
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
      <h4 className="" data-testId="create-billing-entry-page-title">
        Create Billing Entry
      </h4>
      <div className="card  create-billing-entry-form">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {formInputs.map((input, index) => {
                return (
                  <>
                    {input.hide === false && (
                      <>
                        {input.type === "select" && (
                          <div className="col-md-6 mb-2">
                            <label
                              className="text-black"
                              style={{ display: "block" }}
                            >
                              {input.label}
                            </label>
                            <select
                              className="form-select"
                              name={input.name}
                              style={{ margin: "10px 0" }}
                              onChange={input.onChange}
                              onBlur={input.onChange}
                              data-testid={input.dataTestId}
                            >
                              <option value="" selected>
                                Select One
                              </option>
                              {input.options.map((option, index) => {
                                return (
                                  <option key={index} value={option.value}>
                                    {option.text}
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
                          </div>
                        )}
                        {input.type === "button_select" && (
                          <div className="col-md-6 mb-2">
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
                        {(input.type === "number" ||
                          input.type === "date" ||
                          input.type === "text") && (
                          <div className="col-md-6 mb-2">
                            <UIInput
                              dataTestId={input.dataTestId}
                              key={index}
                              onChange={input.onChange}
                              onBlur={input.onChange}
                              label={input.label}
                              type={input.type}
                              placeholder={input.placeholder}
                              inputStyle={{ margin: "10px 0" }}
                              name={input.name}
                              step={input.step}
                              errorMessage={input.errorMessage}
                              hide={input.hide}
                            />
                            {errors[input.name] && (
                              <span
                                data-testId={input.errorMessageDataTestId}
                                style={{
                                  ...validationMessageStyle,
                                }}
                              >
                                {errors[input.name]}
                              </span>
                            )}
                          </div>
                        )}
                        {input.type === "textarea" && (
                          <div className="col-md-12">
                            <label
                              className="text-black"
                              style={{ display: "block" }}
                            >
                              {input.label}
                            </label>
                            <textarea
                              onChange={handleChange}
                              className="form-control"
                              placeholder={input.placeholder}
                              style={{ margin: "10px 0" }}
                              name={input.name}
                              rows={5}
                              data-testId={input.dataTestId}
                            ></textarea>
                            {errors[input.name] && (
                              <span
                                data-testId={input.errorMessageDataTestId}
                                style={{
                                  color: uiRed,
                                  fontSize: "12px",
                                  marginTop: "5px",
                                }}
                              >
                                {errors[input.name]}
                              </span>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </>
                );
              })}
            </div>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={2}
              style={{ marginTop: "20px" }}
            >
              <UIButton
                type="submit"
                btnText="Create Billing Entry"
                dataTestId="create-billing-entry-submit-button"
              />
            </Stack>
          </form>
        </div>
      </div>
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default CreateBillingEntry;
