import React, { useEffect, useState } from "react";
import {
  getLeaseTermsByUser,
  getLeaseTermById,
} from "../../../../api/lease_terms";
import { deleteUnit, getUnit, updateUnit } from "../../../../api/units";
import { getUserData } from "../../../../api/auth";
import { getUserStripeSubscriptions } from "../../../../api/auth";
import { Link, useParams } from "react-router-dom";
import BackButton from "../../UIComponents/BackButton";
import {
  Alert,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import { authUser, token, uiGreen, uiRed } from "../../../../constants";
import { uiGrey2 } from "../../../../constants";
import { modalStyle } from "../../../../constants";
import { CloseOutlined } from "@mui/icons-material";
import { set, useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../../constants";
import DeleteButton from "../../UIComponents/DeleteButton";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UIButton from "../../UIComponents/UIButton";
import UITabs from "../../UIComponents/UITabs";
const CreateUnit = () => {
  //Create a state for the form data
  const [unit, setUnit] = useState({});
  const [name, setName] = useState("");
  const [rent, setRent] = useState(1000);
  const [beds, setBeds] = useState(1);
  const [baths, setBaths] = useState(1);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [responseMessage, setResponseMessage] = useState(
    "Unit updated successfully"
  );
  const [alertSeverity, setAlertSeverity] = useState("success");
  const { unit_id, property_id } = useParams();
  const [isOccupided, setIsOccupied] = useState(true);
  const [leaseTerms, setLeaseTerms] = useState([]);
  const [currentLeaseTerm, setCurrentLeaseTerm] = useState(null);
  const [showLeaseTermSelector, setShowLeaseTermSelector] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState({
    items: { data: [{ plan: { product: "" } }] },
  });
  const [tenant, setTenant] = useState({});
  const [tabPage, setTabPage] = useState(0);
  const tabs = [
    { label: "Unit", name: "unit" },
    { label: "Lease", name: "lease_terms" },
  ];
  const handleChangeTabPage = (event, newValue) => {
    setTabPage(newValue);
  };
  const navigate = useNavigate();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: unit.name,
      beds: unit.beds,
      baths: unit.baths,
      rental_property: property_id,
    },
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowUpdateSuccess(false);
  };

  const retrieveSubscriptionPlan = async () => {
    const res = await getUserStripeSubscriptions(authUser.user_id, token).then(
      (res) => {
        setCurrentSubscriptionPlan(res.subscriptions);
      }
    );
    return res;
  };

  //Create a function to handle the form submission to update unit information
  const onSubmit = async (data) => {
    console.log(data);
    const res = await updateUnit(unit_id, data);
    if (res.id) {
      setShowUpdateSuccess(true);
      setAlertSeverity("success");
      setResponseMessage("Unit updated");
    } else {
      setShowUpdateSuccess(true);
      setAlertSeverity("error");
      setResponseMessage("Something went wrong");
    }
  };

  const handleChangeLeaseTerm = (id) => {
    //set Current Lease Term
    setCurrentLeaseTerm(leaseTerms.find((term) => term.id === id));
    //Update the unit with the new lease term with the api
    updateUnit(unit_id, { lease_term: id }).then((res) => {
      console.log(res);
    });
    //Close the lease term selector
    setShowLeaseTermSelector(false);
  };

  //Create a function to handle the deletion of a unit
  const handleDeleteUnit = () => {
    //Check if unit is occupied
    if (isOccupided) {
      //Show an error message in the alert modal
      setShowDeleteAlert(false);
      setShowDeleteError(true);
      setDeleteErrorMessage(
        "This unit is occupied. Please remove the tenant before deleting this unit."
      );
      return false;
    } else {
      let payload = {
        unit_id: unit_id,
        rental_property: property_id,
        product_id: currentSubscriptionPlan.plan.product,
        subscription_id: currentSubscriptionPlan.id,
      };
      //Delete the unit with the api
      deleteUnit(payload).then((res) => {
        console.log(res);
      });
      //Redirect to the property page
      navigate(`/dashboard/landlord/properties/${property_id}`);
    }
  };
  const createLeaseTermButton = (
    <Link to="/dashboard/landlord/lease-terms/create">
      {" "}
      <Button
        sx={{
          textTransform: "none",
          background: uiGreen,
          color: "white",
        }}
      >
        Create Lease Template
      </Button>
    </Link>
  );

  useEffect(() => {
    //Retrieve Unit Information
    getUnit(unit_id).then((res) => {
      setUnit(res);
      const preloadedData = {
        name: res.name,
        beds: res.beds,
        baths: res.baths,
        rental_property: property_id,
      };
      // Set the preloaded data in the form using setValue
      Object.keys(preloadedData).forEach((key) => {
        setValue(key, preloadedData[key]);
      });
      setIsOccupied(res.is_occupied);
      if (res.lease_term) {
        getLeaseTermById({
          lease_term_id: res.lease_term,
          user_id: authUser.user_id,
        }).then((res) => {
          setCurrentLeaseTerm(res);
        });
      }
      if (isOccupided) {
        getUserData(res.tenant).then((res) => {
          console.log("Tenant", res);
          setTenant(res);
        });
      }
    });
    //retrieve lease terms that the user has created
    getLeaseTermsByUser().then((res) => {
      setLeaseTerms(res.data);
    });
    retrieveSubscriptionPlan();
  }, []);
  return (
    <div className="container">
      <Snackbar
        open={showUpdateSuccess}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          <>{responseMessage}</>
        </Alert>
      </Snackbar>
      <BackButton />
      <UITabs
        tabs={tabs}
        value={tabPage}
        handleChange={handleChangeTabPage}
        variant="scrollable"
        scrollButtons="auto"
        style={{ margin: "1rem 0" }}
      />
      <div className="row mb-3">
        {tabPage === 0 && (
          <>
            <div className="col-md-3">
              {isOccupided ? (
                <div className="card shadow mb-3">
                  <div className="card-header pt-3">
                    <h5
                      style={{ fontSize: "13pt" }}
                      className="text-primary fw-bold m-0 card-header-text"
                    >
                      Tenant Information
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-4">
                      <h6
                        style={{ fontSize: "11pt" }}
                        className="text-white fw-bold m-0"
                      >
                        Name
                      </h6>
                      <p
                        style={{ fontSize: "11pt" }}
                        className="text-white m-0"
                      >
                        {tenant.first_name} {tenant.last_name}
                      </p>
                    </div>
                    <div className="mb-4">
                      <h6
                        style={{ fontSize: "11pt" }}
                        className="text-white fw-bold m-0"
                      >
                        Email
                      </h6>
                      <p
                        style={{ fontSize: "11pt" }}
                        className="text-white m-0"
                      >
                        {tenant.email}
                      </p>
                    </div>

                    <UIButton
                      style={{
                        background: uiGreen,
                        color: "white",
                        textTransform: "none",
                      }}
                      btnText="View Tenant Information"
                      onClick={() => {
                        navigate(`/dashboard/landlord/tenants/${tenant.id}`);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h5 className="mb-2">Rental Application Link</h5>
                  <div className="card shadow mb-3">
                    <div className="card-body">
                      <input
                        className="form-control"
                        value={`${process.env.REACT_APP_HOSTNAME}/rental-application/${unit_id}/${authUser.user_id}/`}
                      />
                      <a
                        href={`${process.env.REACT_APP_HOSTNAME}/rental-application/${unit_id}/${authUser.user_id}/`}
                        target="_blank"
                      >
                        <Button
                          style={{
                            background: uiGreen,
                            color: "white",
                            textTransform: "none",
                            marginTop: "1rem",
                            width: "100%",
                          }}
                        >
                          Preview
                        </Button>
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="col-sm-12 col-md-12 col-lg-8 ">
              <h4 className="mb-2">Manage Unit</h4>
              <div className="card shadow mb-3">
                <div className="card-body">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                      <label className="form-label text-white" htmlFor="name">
                        <strong>Unit #/Name</strong>
                      </label>
                      <input
                        {...register("name", {
                          required: "This is a required field",
                        })}
                        // defaultValue={unit.name}
                        className="form-control text-black"
                        type="text"
                        id="name"
                        placeholder="5B"
                        style={{
                          borderStyle: "none",
                          color: "rgb(255,255,255)",
                        }}
                      />
                      <span style={validationMessageStyle}>
                        {errors.name && errors.name.message}
                      </span>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <div>
                          <label className="form-label text-white">Beds</label>
                          <input
                            {...register("beds", {
                              required: "This is a required field",
                            })}
                            className="form-control text-black"
                            type="number"
                            style={{
                              borderStyle: "none",
                              color: "rgb(255,255,255)",
                            }}
                            // defaultValue={unit.beds}
                            min="1"
                            step="1"
                          />
                          <span style={validationMessageStyle}>
                            {errors.beds && errors.beds.message}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div>
                          <label className="form-label text-white">Baths</label>
                          <input
                            {...register("baths", {
                              required: "This is a required field",
                            })}
                            className="form-control text-black "
                            type="number"
                            style={{
                              borderStyle: "none",
                              color: "rgb(255,255,255)",
                            }}
                            // defaultValue={unit.baths}
                            min="1"
                            step="1"
                          />
                          <span style={validationMessageStyle}>
                            {errors.baths && errors.baths.message}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-end my-3">
                      <button className="btn btn-primary ui-btn" type="submit">
                        Update Unit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <>
                <AlertModal
                  open={showDeleteError}
                  setOpen={setShowDeleteError}
                  title={"Error"}
                  message={deleteErrorMessage}
                  btnText={"Ok"}
                  onClick={() => setShowDeleteError(false)}
                />
                <DeleteButton
                  style={{
                    background: uiRed,
                    textTransform: "none",
                    float: "right",
                  }}
                  variant="contained"
                  btnText="Delete Unit"
                  onClick={() => setShowDeleteAlert(true)}
                />
                <ConfirmModal
                  open={showDeleteAlert}
                  title="Delete Unit"
                  message="Are you sure you want to delete this unit?"
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
                  handleConfirm={handleDeleteUnit}
                />
              </>
            </div>
            <div className="col-md-12"></div>
          </>
        )}
        {tabPage === 1 && (
          <>
            <div className="py-3" style={{ overflow: "auto" }}>

              <div style={{ float: "right" }}>{createLeaseTermButton}</div>
            </div>

            <div className="card mb-3">
              <div className="card-body">
                <div className="mb-3">
                  <div>
                    <Modal open={showLeaseTermSelector}>
                      <div className="card" style={modalStyle}>
                        <IconButton
                          onClick={() => setShowLeaseTermSelector(false)}
                          sx={{
                            width: "50px",
                            height: "50px",
                            color: "white",
                            padding: "0",
                          }}
                        >
                          <CloseOutlined />
                        </IconButton>
                        <List
                          sx={{
                            width: "100%",
                            maxWidth: 360,
                            maxHeight: 500,
                            overflow: "auto",
                            bgcolor: uiGrey2,
                            color: "white",
                          }}
                        >
                          {console.log(leaseTerms === 0)}
                          {leaseTerms.map((leaseTerm, index) => {
                            if (leaseTerms.length == 0) {
                              return (
                                <ListItem alignItems="flex-start">
                                  <ListItemText
                                    primary={`No lease templates found`}
                                  />
                                </ListItem>
                              );
                            } else {
                              return (
                                <>
                                  <ListItem alignItems="flex-start">
                                    <ListItemText
                                      primary={`${leaseTerm.term} Month Lease @ $${leaseTerm.rent}/mo`}
                                      secondary={
                                        <React.Fragment>
                                          <h6 style={{ fontSize: "10pt" }}>
                                            Security Deposit: ${" "}
                                            {leaseTerm.security_deposit} | Late
                                            Fee: ${leaseTerm.late_fee} | Grace
                                            Period:{" "}
                                            {leaseTerm.grace_period === 0 ? (
                                              "None"
                                            ) : (
                                              <>{`${leaseTerm.grace_period} Month(s)`}</>
                                            )}
                                          </h6>
                                          <div style={{ overflow: "auto" }}>
                                            <div
                                              style={{
                                                color: "white",
                                                float: "left",
                                              }}
                                            >
                                              <p className="m-0">
                                                Gas{" "}
                                                {leaseTerm.gas_included
                                                  ? "included"
                                                  : "not included"}
                                              </p>
                                              <p className="m-0">
                                                Electric{" "}
                                                {leaseTerm.electric_included
                                                  ? "included"
                                                  : "not included"}
                                              </p>
                                              <p className="m-0">
                                                Water{" "}
                                                {leaseTerm.water_included
                                                  ? "included"
                                                  : "not included"}
                                              </p>
                                            </div>

                                            <Button
                                              onClick={() =>
                                                handleChangeLeaseTerm(
                                                  leaseTerm.id
                                                )
                                              }
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
                                          <p
                                            style={{
                                              color: "white",
                                              width: "100%",
                                            }}
                                          >
                                            Template ID:{" "}
                                            {leaseTerm.template_id
                                              ? leaseTerm.template_id
                                              : "N/A"}
                                          </p>
                                        </React.Fragment>
                                      }
                                    />
                                  </ListItem>
                                  <Divider component="li" />
                                </>
                              );
                            }
                          })}
                        </List>
                      </div>
                    </Modal>
                  </div>
                </div>
                <div className="row">
                  {currentLeaseTerm ? (
                    <>
                      <div className="col-md-4 mb-4">
                        <h6>Rent</h6>${currentLeaseTerm.rent}
                      </div>
                      <div className="col-md-4 mb-4">
                        <h6>Term</h6>
                        {currentLeaseTerm.term} Months
                      </div>
                      <div className="col-md-4 mb-4">
                        <h6>Late Fee</h6>
                        {`$${currentLeaseTerm.late_fee}`}
                      </div>
                      <div className="col-md-4 mb-4">
                        <h6>Security Deposit</h6>
                        {`$${currentLeaseTerm.security_deposit}`}
                      </div>
                      <div className="col-md-4 mb-4">
                        <h6>Gas Included?</h6>
                        {`${currentLeaseTerm.gas_included ? "Yes" : "No"}`}
                      </div>
                      <div className="col-md-4 mb-4">
                        <h6>Electric Included?</h6>
                        {`${currentLeaseTerm.electric_included ? "Yes" : "No"}`}
                      </div>
                      <div className="col-md-4 mb-4">
                        <h6>Water Included?</h6>
                        {`${currentLeaseTerm.water_included ? "Yes" : "No"}`}
                      </div>
                      <div className="col-md-4 mb-4">
                        <h6>Lease Cancellation Fee</h6>
                        {`$${currentLeaseTerm.lease_cancellation_fee}`}
                      </div>
                      <div className="col-md-4 mb-4">
                        <h6>Lease Cancellation Notice period</h6>
                        {`${currentLeaseTerm.lease_cancellation_notice_period} Month(s)`}
                      </div>
                      <div className="col-md-4 mb-4">
                        <h6>Grace period</h6>
                        {currentLeaseTerm.grace_period === 0 ? (
                          "None"
                        ) : (
                          <>{`${currentLeaseTerm.grace_period} Month(s)`}</>
                        )}
                      </div>
                      <div className="col-md-12 mb-4">
                        {!isOccupided && (
                          <Button
                            sx={{
                              textTransform: "none",
                              background: uiGreen,
                              color: "white",
                              marginTop: "1rem",
                            }}
                            onClick={() => setShowLeaseTermSelector(true)}
                          >
                            Change Lease Template
                          </Button>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-md-12">
                        A Lease template has not been assigned to this unit.
                      </div>
                      <div className="col-md-12 mb-4">
                        <Button
                          sx={{
                            textTransform: "none",
                            background: uiGreen,
                            color: "white",
                            marginTop: "1rem",
                          }}
                          onClick={() => setShowLeaseTermSelector(true)}
                        >
                          Change Lease Template
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateUnit;
