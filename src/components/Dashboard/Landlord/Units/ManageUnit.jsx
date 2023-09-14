import React, { useEffect, useState } from "react";
import {
  updateUnit,
  getUnit,
  getLeaseTermsByUser,
  getLeaseTermById,
  createLeaseTerm,
} from "../../../../api/api";
import { Link, useParams } from "react-router-dom";
import BackButton from "../../BackButton";
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
import { authUser, uiGreen } from "../../../../constants";
import { uiGrey2 } from "../../../../constants";
import { modalStyle } from "../../../../constants";
import { CloseOutlined } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../../constants";
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
          user_id: authUser.id,
        }).then((res) => {
          setCurrentLeaseTerm(res);
        });
      }
    });
    //retrieve lease terms that the user has created
    getLeaseTermsByUser().then((res) => {
      setLeaseTerms(res.data);
    });
  }, []);
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
        Create Lease Term
      </Button>
    </Link>
  );

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
      <div className="row mb-3">
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
                  <p style={{ fontSize: "11pt" }} className="text-white m-0">
                    John Doe
                  </p>
                </div>
                <div className="mb-4">
                  <h6
                    style={{ fontSize: "11pt" }}
                    className="text-white fw-bold m-0"
                  >
                    Email
                  </h6>
                  <p style={{ fontSize: "11pt" }} className="text-white m-0">
                    jdoe@email.com
                  </p>
                </div>
                <div className="mb-4">
                  <h6
                    style={{ fontSize: "11pt" }}
                    className="text-white fw-bold m-0"
                  >
                    Phone
                  </h6>
                  <p style={{ fontSize: "11pt" }} className="text-white m-0">
                    555-555-5555
                  </p>
                </div>
                <Button
                  style={{
                    background: uiGreen,
                    color: "white",
                    textTransform: "none",
                  }}
                >
                  Manage Tenant
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h5 className="mb-2">Rental Application Link</h5>
              <div className="card shadow mb-3">
                <div className="card-body">
                  <input
                    className="form-control"
                    value={`http://localhost:3000/rental-application/${unit_id}/${authUser.id}/`}
                  />
                  <a
                    href={`http://localhost:3000/rental-application/${unit_id}/${authUser.id}/`}
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
                    style={{ borderStyle: "none", color: "rgb(255,255,255)" }}
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

          <div className="py-3" style={{ overflow: "auto" }}>
            <h4 style={{ float: "left" }} className="mb-2">
              Lease Terms
            </h4>
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
                        {leaseTerms.map((leaseTerm) => {
                          return (
                            <>
                              <ListItem alignItems="flex-start">
                                <ListItemText
                                  primary={`${leaseTerm.term} Month Lease @ $${leaseTerm.rent}/mo`}
                                  secondary={
                                    <React.Fragment>
                                      <h6 style={{ fontSize: "10pt" }}>
                                        Security Deposit: ${" "}
                                        {leaseTerm.security_deposit} | Late Fee:
                                        ${leaseTerm.late_fee} | Grace Period:{" "}
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
                                            handleChangeLeaseTerm(leaseTerm.id)
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
                                    </React.Fragment>
                                  }
                                />
                              </ListItem>
                              <Divider component="li" />
                            </>
                          );
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
                          Change Lease Term
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-md-12">
                      A Lease term has not been assigned to this unit.
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
                        Change Lease Term
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUnit;
