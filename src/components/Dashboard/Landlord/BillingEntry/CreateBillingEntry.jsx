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
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import { getLandlordTenants } from "../../../../api/landlords";
import { authenticatedInstance } from "../../../../api/api";
import { useNavigate } from "react-router";

const CreateBillingEntry = () => {
  const [tenants, setTenants] = useState([]);
  const [tenantSerchQuery, setTenantSearchQuery] = useState("");
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [tenantModalOpen, setTenantModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [rentalUnitModalOpen, setRentalUnitModalOpen] = useState(false);
  const [selectedRentalUnit, setSelectedRentalUnit] = useState(null);
  const [rentalUnits, setRentalUnits] = useState([]);
  const [rentalUnitSearchQuery, setRentalUnitSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTenants, setLoadingTenants] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [isExpense, setIsExpense] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    create_transaction: "",
    type: "",
    status: "unpaid",
    create_subscription: "",
    collection_method: "send_invoice",
    description: "",
    owner: authUser.owner_id,
    tenant: null,
    rental_unit: null,
    rental_property: null,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    },
    [setFormData]
  );

  const retrieveTenants = async () => {
    setLoadingTenants(true);
    const res = await authenticatedInstance
      .get(`/tenants/`, {
        params: {
          ordering: "-date_joined",
          search: tenantSerchQuery,
        },
      })
      .then((res) => {
        setTenants(res.data);
      })
      .catch((err) => {
        console.error("Get tenants error ", err);
      })
      .finally(() => {
        setLoadingTenants(false);
      });
  };

  const handleSearchRentalUnits = async (e) => {
    e.preventDefault();
    const res = await authenticatedInstance.get(`/units/`, {
      params: {
        search: e.target.value,
        limit: 10,
      },
    });
    setRentalUnits(res.data);
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
      <h4 className="">Create Billing Entry</h4>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
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
                        {tenants.map((tenant, index) => {
                          if (tenants.length == 0) {
                            return (
                              <>
                                <ListItem alignItems="flex-start">
                                  <ListItemText primary={`No tenants found`} />
                                </ListItem>
                              </>
                            );
                          } else {
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
                          }
                        })}
                      </List>
                    )}
                  </UIDialog>

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
              ):(
                <div className="col-md-6 mb-3">
                  <label className="text-black" style={{ display: "block" }}>
                    Rental Unit
                  </label>
                  <UIDialog
                    open={tenantModalOpen}
                    title="Select Rental Unit"
                    onClose={() => setTenantModalOpen(false)}
                    style={{ width: "500px" }}
                    ></UIDialog>
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
                      label="Due Date"
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
              </div>
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
