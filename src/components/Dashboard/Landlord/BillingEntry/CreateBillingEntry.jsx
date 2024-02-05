import React, { useCallback, useState } from "react";
import UIInput from "../../UIComponents/UIInput";
import UIRadioGroup from "../../UIComponents/UIRadioGroup";
import { createBillingEntry } from "../../../../api/billing-entries";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import { authUser, uiGreen, uiGrey2 } from "../../../../constants";
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
import { getLandlordTenants } from "../../../../api/landlords";
import { authenticatedInstance } from "../../../../api/api";
import { useNavigate } from "react-router";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import UIPrompt from "../../UIComponents/UIPrompt";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import useFormValidation from "../../../../hooks/useFormValidation";
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
  const { errors, validateForm, triggerValidation } = useFormValidation();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: "",
    create_transaction: "",
    type: "",
    status: "",
    create_subscription: "",
    collection_method: "",
    description: "",
    owner: authUser.owner_id,
    tenant: null,
    rental_unit: null,
  });
  const handleChange = useCallback(
    (e) => {
      console.log("Handle Chnage");
      console.log("E target value ", e.target.value);
      const { name, value } = e.target;
      triggerValidation(
        name,
        value,
        formInputs.find((input) => input.name === name).validations
      );
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      console.log("Form data ", formData);
    },
    [setFormData]
  );
  const formInputs = [
    {
      id: 1,
      label: "Amount",
      type: "number",
      placeholder: "Enter amount",
      name: "amount",
      step: "0.01",
      hide: false,
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        regex: /^\d+(\.\d{1,2})?$/,
        errorMessage:
          "Amount cannot be blank and must be a decimal number with two decimal places",
      },
    },
    {
      id: 2,
      label: "Tenant",
      type: "button_select",
      name: "tenant",
      dialogAction: () => handleOpenTenantSelectModal(),
      errorMessage: "Tenant cannot be blank",
      hide: isExpense,
      validations: {
        required: false,
        errorMessage: "Tenant cannot be blank",
        regex: null,
      },
    },
    {
      id: 3,
      label: "Rental Unit",
      type: "button_select",
      name: "rental_unit",
      dialogAction: () => handleOpenRentalUnitSelectModal(),
      errorMessage: "Rental Unit cannot be blank",
      hide: !isExpense,
      validations: {
        required: false,
        errorMessage: "Rental Unit cannot be blank",
        regex: null,
      },
    },
    {
      id: 4,
      label: "Type",
      type: "select",
      name: "type",
      options: [
        { value: "revenue", text: "Revenue" },
        { value: "expense", text: "Expense" },
        { value: "security_deposit", text: "Security Deposit" },
        { value: "rent_payment", text: "Rent Payment" },
        { value: "late_fee", text: "Late Fee" },
        { value: "pet_fee", text: "Pet Fee" },
        { value: "lease_renewal_fee", text: "Lease Renewal Fee" },
        { value: "lease_cancellation_fee", text: "Lease Cancellation Fee" },
        { value: "maintenance_fee", text: "Maintenance Fee" },
        { value: "vendor_payment", text: "Vendor Payment" },
      ],
      errorMessage: "Type cannot be blank",
      validations:  {
        required: true,
        errorMessage: "Type cannot be blank",
        regex: null,
      },
      hide: false,
      onChange: (e) => {
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
          }));
        } else {
          setIsExpense(false);
        }
        handleChange(e);
      },
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
      errorMessage: "Status cannot be blank",
      hide: false,
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        errorMessage: "Status cannot be blank",
        regex: null,
      }
    },
    {
      id: 6,
      label: "Collection Method",
      type: "select",
      name: "collection_method",
      options: [
        { value: "charge_automatically", text: "Charge Immediately" },
        { value: "send_invoice", text: "Send Invoice" },
      ],
      errorMessage: "Collection Method cannot be blank",
      hide: isExpense,
      onChange: (e) => handleChange(e),
      validations:{
        required: true,
        errorMessage: "Collection Method cannot be blank",
        regex: null,
      }
    },
    {
      id: 7,
      label: "Due Date",
      type: "date",
      name: "due_date",
      errorMessage: "Due Date cannot be blank",
      hide: isExpense,
      onChange: (e) => handleChange(e),
      validations: {
        required: false,
        errorMessage: "Due Date cannot be blank",
        regex: null,
      }
    },
    {
      id: 8,
      label: "Description",
      type: "textarea",
      name: "description",
      placeholder: "Enter description",
      errorMessage: "Description cannot be blank",
      hide: false,
      onChange: (e) => handleChange(e),
      validations: {
        required: true,
        errorMessage: "Description cannot be blank",
        regex: null,
      }

    },
  ];
  const retrieveTenants = async () => {
    setLoadingTenants(true);
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
    const isValid = validateForm(formData, formInputs);
    if (isValid) {
      setIsLoading(true);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      createBillingEntry(formData)
        .then((res) => {
          console.log("Create biling entrry res ", res);
          if (res.status === 200) {
            console.log("Billing entry created successfully");
            setAlertTitle("Success");
            setAlertMessage("Billing entry created successfully");
          } else {
            console.error("Create billing entry error ", res);
            setAlertTitle("Error");
            setAlertMessage("There was an error creating the billing entry.");
          }
        })
        .catch((err) => {
          console.error("Create billing entry error ", err);
          setAlertTitle("Error");
          setAlertMessage("There was an error creating the billing entry.");
        })
        .finally(() => {
          console.log("Create billing entry finally");
          setAlertOpen(true);
          setIsLoading(false);
        });
    } else {
      console.log("There are errors in this form ",errors);
      setAlertTitle("Error");
      let form_errors = "";
      Object.entries(errors).forEach(([key, value]) => {
        form_errors += `${value}\n`;
      });
      setAlertMessage(
        "The following errors were found in the form. Please fix them and try again.",
        form_errors
      );
    }
  };
  return (
    <div className="container-fluid">
      <ProgressModal open={isLoading} title="Creating Billing Entry..." />
      <AlertModal
        open={alertOpen}
        title={alertTitle}
        message={alertMessage}
        btnText={"Ok"}
        onClick={() => {
          navigate("/dashboard/landlord/billing-entries/");
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
                              <Button
                                data-testid={`select-tenant-button-${index}`}
                                onClick={() => {
                                  setSelectedTenant(tenant);
                                  setFormData((prevData) => ({
                                    ...prevData,
                                    tenant: tenant.id,
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
                              >
                                Select
                              </Button>
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
                  setFormData((prevData) => ({
                    ...prevData,
                    rental_unit: unit.id,
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
      <h4 className="">Create Billing Entry</h4>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* <div className="col-md-6 mb-3">
                <UIInput
                  onChange={handleChange}
                  label="Amount"
                  type="number"
                  placeholder="Enter amount"
                  //   description="Enter the amount of the billing entry."
                  inputStyle={{ margin: "10px 0" }}
                  name="amount"
                  step="0.01"
                />
              </div>
              {!isExpense ? (
                <div className="col-md-6 mb-3">
                  <label className="text-black" style={{ display: "block" }}>
                    Tenant
                  </label>

                  {!selectedTenant ? (
                    <UIButton
                      onClick={handleOpenTenantSelectModal}
                      btnText="Select Tenant"
                      style={{ margin: "10px 0" }}
                    />
                  ) : (
                    <span className="text-black">
                      {selectedTenant.user.first_name}{" "}
                      {selectedTenant.user.last_name}
                      <Button
                        onClick={handleOpenTenantSelectModal}
                        sx={{
                          textTransform: "none",
                          color: uiGreen,
                        }}
                      >
                        Change Tenant
                      </Button>
                    </span>
                  )}
                </div>
              ) : (
                <div className="col-md-6 mb-3">
                  <label className="text-black" style={{ display: "block" }}>
                    Rental Unit
                  </label>
                  {!selectedRentalUnit ? (
                    <UIButton
                      onClick={() => setRentalUnitModalOpen(true)}
                      btnText="Select Rental Unit"
                      style={{ margin: "10px 0" }}
                    />
                  ) : (
                    <span className="text-black">
                      {selectedRentalUnit.name} -{" "}
                      {selectedRentalUnit.rental_property_name}
                      <Button
                        onClick={() => setRentalUnitModalOpen(true)}
                        sx={{
                          textTransform: "none",
                          color: uiGreen,
                        }}
                      >
                        Change Rental Unit
                      </Button>
                    </span>
                  )}
                </div>
              )}
              <div className="col-md-6 mb-3">
                <label className="text-black" style={{ display: "block" }}>
                  Type
                </label>
                <select
                  className="form-select"
                  name="type"
                  style={{ margin: "10px 0" }}
                  onChange={(e) => {
                    console.log("Type change ", e.target.value);
                    //Check if type is expense or vendor payment
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
                      }));
                    } else {
                      setIsExpense(false);
                    }
                    handleChange(e);
                  }}
                >
                  <option value={null} selected disabled>
                    Select One
                  </option>
                  <option value="revenue">Revenue</option>
                  <option value="expense">Expense</option>
                  <option value="security_deposit">Security Deposit</option>
                  <option value="rent_payment">Rent Payment</option>
                  <option value="late_fee">Late Fee</option>
                  <option value="pet_fee">Pet Fee</option>
                  <option value="lease_renewal_fee">Lease Renewal Fee</option>
                  <option value="lease_cancellation_fee">
                    Lease Cancellation Fee
                  </option>
                  <option value="maintenance_fee">Maintenance Fee</option>
                  <option value="vendor_payment">Vendor Payment</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="text-black" style={{ display: "block" }}>
                  Status
                </label>
                <select
                  onChange={handleChange}
                  className="form-select"
                  name="status"
                  style={{ margin: "10px 0" }}
                >
                  <option value={null} selected disabled>
                    Select One
                  </option>
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              {!isExpense && (
                <>
                  <div className="col-md-6 mb-3">
                    <label className="text-black" style={{ display: "block" }}>
                      Collection Method
                    </label>
                    <select
                      className="form-select"
                      name="collection_method"
                      style={{ margin: "10px 0" }}
                      onChange={handleChange}
                    >
                      <option value={null} selected disabled>
                        Select One
                      </option>
                      <option value="charge_automatically">
                        Charge Immediately
                      </option>
                      <option value="send_invoice">Send Invoice</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <UIInput
                      onChange={handleChange}
                      type="date"
                      label={isExpense ? "Transaction Date" : "Due Date"}
                      placeholder="Enter due date"
                      inputStyle={{ margin: "10px 0" }}
                      name="due_date"
                    />
                  </div>
                </>
              )}
              <div className="col-md-12">
                <label className="text-black" style={{ display: "block" }}>
                  Description
                </label>
                <textarea
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter description"
                  style={{ margin: "10px 0" }}
                  name="description"
                  rows={5}
                ></textarea>
              </div> */}
              {formInputs.map((input, index) => {
                return (
                  <>
                    {input.hide === false && (
                      <>
                        {input.type === "select" && (
                          <div className="col-md-6">
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
                            >
                              <option value={null} selected disabled>
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
                          </div>
                        )}
                        {input.type === "button_select" && (
                          <div className="col-md-6">
                            <label
                              className="text-black"
                              style={{ display: "block" }}
                            >
                              {input.label}
                            </label>
                            <UIButton
                              onClick={input.dialogAction}
                              btnText={`Select ${input.label}`}
                              style={{ margin: "10px 0" }}
                            />
                          </div>
                        )}
                        {(input.type === "number" || input.type === "date") && (
                          <div className="col-md-6">
                            <UIInput
                              key={index}
                              onChange={input.onChange}
                              label={input.label}
                              type={input.type}
                              placeholder={input.placeholder}
                              inputStyle={{ margin: "10px 0" }}
                              name={input.name}
                              step={input.step}
                              errorMessage={input.errorMessage}
                              hide={input.hide}
                            />
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
                            ></textarea>
                          </div>
                        )}
                      </>
                    )}
                  </>
                );
              })}
            </div>
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBillingEntry;
