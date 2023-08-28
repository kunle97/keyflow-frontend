import { Button, Stack, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { uiGreen } from "../../constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import UIBinaryRadioGroup from "../Dashboard/UIBinaryRadioGroup";
import EmploymentHistorySection from "./EmploymentHistorySection";
import RentalHistorySection from "./RentalHistorySection";
import { HelpOutline } from "@mui/icons-material";
import { faker } from "@faker-js/faker";
import { useEffect } from "react";
import { createRentalApplication, getProperty } from "../../api/api";
import { useParams } from "react-router-dom";
import { getUnit } from "../../api/api";

const CreateRentalApplication = () => {
  const { unit_id, landlord_id } = useParams();

  const [unit, setUnit] = useState({}); // unit data
  const [property, setProperty] = useState({}); // property data
  const [submissionMessage, setSubmissionMessage] = useState(""); // submission message
  const [isLoading, setIsLoading] = useState(false); // loading state
  const [showSubmissionMessage, setShowSubmissionMessage] = useState(false); // show submission message state

  useEffect(() => {
    // get unit data
    getUnit(unit_id).then((unit_res) => {
      if (unit_res) {
        if (unit_res.rental_property) {
          setUnit(unit_res);
        } else {
          setUnit(null);
        }
        // get property data from unit data
        getProperty(unit_res.rental_property).then((property_res) => {
          if (property_res) {
            if (property_res.address) {
              setProperty(property_res);
            } else {
              setProperty(null);
            }
          }
        });
      }
    });
  }, []);

  //Step one data
  const [firstName, setFirstName] = useState(faker.person.firstName()); // first name of the applicant
  const [lastName, setLastName] = useState(faker.person.lastName()); // last name of the applicant
  const [dateOfBirth, setDateOfBirth] = useState(
    faker.date.past().toISOString().split("T")[0]
  ); // date of birth of the applicant
  const [email, setEmail] = useState(
    faker.internet.email({ firstName, lastName })
  ); // email of the applicant
  const [phone, setPhone] = useState(faker.phone.number("###-###-####")); // phone number of the applicant
  const [ssn, setSsn] = useState(faker.phone.number("###-##-####")); // social security number of the applicant
  const [desiredMoveInDate, setDesiredMoveInDate] = useState(
    faker.date.future().toISOString().split("T")[0]
  ); // desired move in date of the applicant

  //Step two  data
  const [otherOccupants, setOtherOccupants] = useState("false"); // will there be any other occupants
  const [pets, setPets] = useState("false"); // do you plan on having any pets
  const [vehicles, setVehicles] = useState("false"); // do you plan on having/storing any vehicles
  const [convicted, setConvicted] = useState("false"); // have you ever been convicted of a crime
  const [bankrupcy, setBankrupcy] = useState("false"); // have you ever filed for bankrupcy
  const [evicted, setEvicted] = useState("false"); // have you been evicted

  //Step 3

  const [currentStep, setCurrentStep] = useState(1); // current step of the form
  const [employmentHistory, setEmploymentHistory] = useState([
    {
      companyName: "",
      position: "",
      companyAddress: "",
      income: "",
      startDate: "",
      endDate: "",
      supervisorName: "",
      supervisorPhone: "",
      supervisorEmail: "",
    },
  ]);
  const [residenceHistory, setResidenceHistory] = useState([
    {
      address: "",
      startDate: "",
      endDate: "",
      landlordName: "",
      landlordPhone: "",
      landlordEmail: "",
    },
  ]);

  const handleEmploymentChange = (e, index) => {
    // employmentHistory[index][e.target.name] = e.target.value;
    const { name, value } = e.target;
    const updatedHistory = [...employmentHistory];
    updatedHistory[index][name] = value;
    setEmploymentHistory(updatedHistory);
  };

  const addEmploymentInfoNode = () => {
    const newEmployment = {
      companyName: "",
      position: "",
      companyAddress: "",
      income: "",
      startDate: "",
      endDate: "",
      supervisorName: "",
      supervisorPhone: "",
      supervisorEmail: "",
    };
    setEmploymentHistory([...employmentHistory, newEmployment]);
  };

  const removeEmploymentInfoNode = (index) => {
    if (employmentHistory.length === 1) return;
    const updatedHistory = [...employmentHistory];
    updatedHistory.splice(index, 1);
    setEmploymentHistory(updatedHistory);
  };

  const handleResidenceChange = (e, index) => {
    // employmentHistory[index][e.target.name] = e.target.value;
    const { name, value } = e.target;
    const updatedHistory = [...residenceHistory];
    updatedHistory[index][name] = value;
    setResidenceHistory(updatedHistory);
  };

  const addRentalHistoryNode = () => {
    const newRentalHistory = {
      address: "",
      startDate: "",
      endDate: "",
      landlordName: "",
      landlordPhone: "",
      landlordEmail: "",
    };
    setResidenceHistory([...residenceHistory, newRentalHistory]);
  };

  const removeRentalHistoryNode = (index) => {
    if (residenceHistory.length === 1) return;
    const updatedHistory = [...residenceHistory];
    updatedHistory.splice(index, 1);
    setResidenceHistory(updatedHistory);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.employment_history = employmentHistory;
    data.residential_history = residenceHistory;
    data.unit_id = unit_id;
    data.landlord_id = landlord_id;
    console.log(data);
    const res = await createRentalApplication(data);
    setIsLoading(true);
    if (res.id !== undefined) {
      // show a success message
      // setIsLoading(false);
      setSubmissionMessage("Application Submitted Successfully. You will be contacted shortly.");
      // setShowSubmissionMessage(true);
    } else {
      //Show error message
      // setIsLoading(false);
      setSubmissionMessage("Error Submitting Application");
      // setShowSubmissionMessage(true);
    }
  };

  const handleOtherOccupants = (value) => {
    setOtherOccupants(value);
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div
            className="col-md-8 banner-col  d-none d-md-block"
            style={{
              background: "url('/assets/img/tenant-application-banner.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100vh",
            }}
          ></div>
          {property && unit ? (
            <>
              {!showSubmissionMessage ? (
                <div
                  className="col-md-4  justify-content-center align-items-center"
                  style={{ overflowY: "auto", maxHeight: "100vh" }}
                >
                  <div>
                    <h2>
                      Rental Application for Unit {unit.name} at{" "}
                      {property.address}
                    </h2>
                    <p>Enter descriuption here...</p>
                    <form onSubmit={handleSubmit}>
                      <>
                        <h5>Basic Information</h5>
                        <div className="card mb-3">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-12 mb-4">
                                <div className="form-group">
                                  <label className="mb-2">First Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="firstName"
                                    placeholder="First Name"
                                    name="first_name"
                                    value={firstName}
                                    onChange={(e) =>
                                      setFirstName(e.target.value)
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-12 mb-4">
                                <div className="form-group">
                                  <label className="mb-2">Last Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    placeholder="Last Name"
                                    name="last_name"
                                    value={lastName}
                                    onChange={(e) =>
                                      setLastName(e.target.value)
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-12 mb-4">
                                <div className="form-group">
                                  <label className="mb-2">Date Of Birth</label>
                                  <input
                                    type="date"
                                    className=" form-control"
                                    id="dateOfBirth"
                                    placeholder="Date of Birth"
                                    name="date_of_birth"
                                    value={dateOfBirth}
                                    onChange={(e) =>
                                      setDateOfBirth(e.target.value)
                                    }
                                    required
                                    style={{
                                      border: "none",
                                      borderBottom:
                                        "1px solid white !important",
                                      borderRadius: "5px",
                                      padding: "10px",
                                      width: "100%",
                                      background: "transparent",
                                      color: "white",
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="col-md-12 mb-4">
                                <div className="form-group">
                                  <input
                                    type="email"
                                    className="form-control form-control-user"
                                    id="email"
                                    placeholder="E-mail"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-12 mb-4">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="phone"
                                    placeholder="Phone Number"
                                    name="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-12 mb-4">
                                <div className="form-group">
                                  <label className="mb-2">
                                    Social Security Number{" "}
                                    <Tooltip title="Your social security number will not be stored on KeyFlow servers. It will only be used for creedit reporting.">
                                      <HelpOutline
                                        sx={{
                                          marginLeft: "5px",
                                          width: "20px",
                                        }}
                                      />
                                    </Tooltip>
                                  </label>

                                  <input
                                    type="text"
                                    className="form-control"
                                    id="ssn"
                                    placeholder="SSN"
                                    name="ssn"
                                    value={ssn}
                                    onChange={(e) => setSsn(e.target.value)}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-12 mb-4">
                                <div className="form-group">
                                  <label className="mb-2">
                                    Desired Move-in Date
                                  </label>
                                  <input
                                    type="date"
                                    className=" form-control"
                                    id="dateOfBirth"
                                    placeholder="Desired Move-in Date"
                                    name="desired_move_in_date"
                                    required
                                    value={desiredMoveInDate}
                                    onChange={(e) =>
                                      setDesiredMoveInDate(e.target.value)
                                    }
                                    style={{
                                      border: "none",
                                      borderBottom:
                                        "1px solid white !important",
                                      borderRadius: "5px",
                                      padding: "10px",
                                      width: "100%",
                                      background: "transparent",
                                      color: "white",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>

                      <>
                        <h5 className="my-4 ml-5">Additional Information</h5>
                        <div className="card mb-3">
                          <div className="card-body">
                            <div className="row">
                              <div className="form-group col-md-6 mb-4">
                                <UIBinaryRadioGroup
                                  label="Will there be any other occupants?"
                                  name="other_occupants"
                                  default_value={otherOccupants}
                                  radio_one_value="true"
                                  radio_one_label="Yes"
                                  radio_two_value="false"
                                  radio_two_label="No"
                                  onSet={handleOtherOccupants}
                                />
                              </div>

                              <div className="form-group col-md-6 mb-4">
                                <UIBinaryRadioGroup
                                  label="Do you plan on having any pets?"
                                  name="pets"
                                  default_value={pets}
                                  radio_one_value="true"
                                  radio_one_label="Yes"
                                  radio_two_value="false"
                                  radio_two_label="No"
                                  onSet={setPets}
                                />
                              </div>

                              <div className="form-group col-md-6 mb-4">
                                <UIBinaryRadioGroup
                                  label="Do you plan on having/storing any vehicles?"
                                  name="vehicles"
                                  default_value={vehicles}
                                  radio_one_value="true"
                                  radio_one_label="Yes"
                                  radio_two_value="false"
                                  radio_two_label="No"
                                  onSet={setVehicles}
                                />
                              </div>

                              <div className="form-group col-md-6 mb-4">
                                <UIBinaryRadioGroup
                                  label="Have you ever been convicted of a crime?"
                                  name="crime"
                                  default_value={convicted}
                                  radio_one_value="true"
                                  radio_one_label="Yes"
                                  radio_two_value="false"
                                  radio_two_label="No"
                                  onSet={setConvicted}
                                />
                              </div>

                              <div className="form-group col-md-6 mb-4">
                                <UIBinaryRadioGroup
                                  label="Have you ever filed for bankrupcy?"
                                  name="bankrupcy"
                                  default_value={bankrupcy}
                                  radio_one_value="true"
                                  radio_one_label="Yes"
                                  radio_two_value="false"
                                  radio_two_label="No"
                                  onSet={setBankrupcy}
                                />
                              </div>

                              <div className="form-group col-md-6 mb-4">
                                <UIBinaryRadioGroup
                                  label="Have you been evicted?"
                                  name="evicted"
                                  default_value={evicted}
                                  radio_one_value="true"
                                  radio_one_label="Yes"
                                  radio_two_value="false"
                                  radio_two_label="No"
                                  onSet={setEvicted}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>

                      <>
                        <div className="information">
                          <h5 className="my-4 ml-5">Employment History</h5>
                          <div className="">
                            {employmentHistory.map((employment, index) => {
                              return (
                                <>
                                  <EmploymentHistorySection
                                    employment={employment}
                                    onPositionChange={(e) =>
                                      handleEmploymentChange(e, index)
                                    }
                                    removeBtn={
                                      index !== 0 && (
                                        <Button
                                          sx={{
                                            background: uiGreen,
                                            textTransform: "none",
                                          }}
                                          variant="contained"
                                          onClick={() =>
                                            removeEmploymentInfoNode(index)
                                          }
                                        >
                                          Remove
                                        </Button>
                                      )
                                    }
                                  />
                                </>
                              );
                            })}
                          </div>
                        </div>
                        <Stack direction="row" gap={2}>
                          <Button
                            sx={{ background: uiGreen, textTransform: "none" }}
                            variant="contained"
                            onClick={addEmploymentInfoNode}
                          >
                            Add
                          </Button>
                        </Stack>
                      </>

                      <>
                        <div className="information">
                          <h5 className="my-4 ml-5">Residence History</h5>

                          <div className="">
                            {residenceHistory.map((residence, index) => {
                              return (
                                <>
                                  <RentalHistorySection
                                    residence={residence}
                                    onResidenceChange={(e) =>
                                      handleResidenceChange(e, index)
                                    }
                                    removeBtn={
                                      index !== 0 && (
                                        <Button
                                          sx={{
                                            background: uiGreen,
                                            textTransform: "none",
                                          }}
                                          variant="contained"
                                          onClick={() =>
                                            removeRentalHistoryNode(index)
                                          }
                                        >
                                          Remove
                                        </Button>
                                      )
                                    }
                                  />
                                </>
                              );
                            })}
                          </div>
                        </div>
                        <Stack direction="row" gap={2}>
                          <Button
                            sx={{ background: uiGreen, textTransform: "none" }}
                            variant="contained"
                            onClick={addRentalHistoryNode}
                          >
                            Add
                          </Button>
                        </Stack>
                      </>
                      <Button
                        variant="contained"
                        sx={{
                          color: "white",
                          width: "100%",
                          background: uiGreen,
                          marginTop: "20px",
                        }}
                        type="submit"
                      >
                        Submit
                      </Button>
                    </form>
                    <div className="mt-4">
                      <Typography sx={{ color: "white" }}>
                        Powered by{" "}
                        <Link to="/">
                          <img
                            src="/assets/img/key-flow-logo-white-transparent.png"
                            width={150}
                          />
                        </Link>
                      </Typography>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body">
                      <center>
                        <h4>{submissionMessage}</h4>
                      </center>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="col-md-4">
              <div className="card mt-2">
                <div className="card-body">
                  <center>
                    <h4>Error Loading Application Data</h4>
                  </center>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateRentalApplication;
