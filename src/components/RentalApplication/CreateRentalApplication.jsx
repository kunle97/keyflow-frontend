import { Button, Stack, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fakeData, uiGreen } from "../../constants";
import UIBinaryRadioGroup from "../Dashboard/UIBinaryRadioGroup";
import EmploymentHistorySection from "./EmploymentHistorySection";
import RentalHistorySection from "./RentalHistorySection";
import { HelpOutline } from "@mui/icons-material";
import { faker } from "@faker-js/faker";
import { useEffect } from "react";
import {
  createRentalApplication,
  getLeaseTermByUnitId,
  getPropertyUnauthenticated,
  getUnitUnauthenticated,
} from "../../api/api";
import { useParams } from "react-router-dom";
import ProgressModal from "../Dashboard/Modals/ProgressModal";
import AlertModal from "../Dashboard/Modals/AlertModal";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../constants";
const CreateRentalApplication = () => {
  const { unit_id, landlord_id } = useParams();

  const [unit, setUnit] = useState({}); // unit data
  const [property, setProperty] = useState({}); // property data
  const [submissionMessage, setSubmissionMessage] = useState(""); // submission message
  const [isLoading, setIsLoading] = useState(false); // loading state
  const [showSubmissionMessage, setShowSubmissionMessage] = useState(false); // show submission message state
  const [submissionMessageLink, setSubmissionMessageLink] = useState(""); // submission message link state
  const [alertButtonText, setAlertButtonText] = useState(""); // alert button text state
  const [alertTitle, setAlertTitle] = useState(""); // alert title state
  const [leaseTerm, setLeaseTerm] = useState({}); // lease terms
  const navigate = useNavigate();
  const [errorMode, setErrorMode] = useState(false); // error mode state

  useEffect(() => {
    /**
     * TODO: Add Steps to the form with progress bar so that it can fit the page better. Use react-hook-forms for validation
     *  Reference: https://makerkit.dev/blog/tutorials/multi-step-forms-reactjs
     *
     * TODO: Create a functioning checkbox for the employment history and residence history sections for current employment and current residence
     *
     * */

    // get unit data
    getUnitUnauthenticated(unit_id).then((unit_res) => {
      setIsLoading(true);
      console.log(unit_res);
      if (unit_res.data) {
        setUnit(unit_res.data);
        //Retrieve Lease Term for the unit
        getLeaseTermByUnitId(unit_res.data.id).then((res) => {
          setLeaseTerm(res);
        });
        if (unit_res.data.is_occupied) {
          //Redirect to 404 screen if unit is occupied
          navigate("/*");
        }
        if (unit_res.data.rental_property) {
          // get property data from unit data
          getPropertyUnauthenticated(unit_res.data.rental_property).then(
            (property_res) => {
              if (property_res.data) {
                setProperty(property_res.data);
                setIsLoading(false);
                setErrorMode(false);
              } else {
                setIsLoading(false);
                setErrorMode(true);
                setProperty(null);
              }
            }
          );
        } else {
          setUnit(null);
        }
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: firstName,
      last_name: lastName,
      email: faker.internet.email({ firstName, lastName }),
      phone: faker.phone.number("###-###-####"),
      ssn: faker.phone.number("###-##-####"),
      date_of_birth: faker.date.past().toISOString().split("T")[0],
      desired_move_in_date: faker.date.future().toISOString().split("T")[0],
    },
  });

  //Step 3
  const [employmentHistory, setEmploymentHistory] = useState([
    {
      companyName: fakeData.fakeCompanyName,
      position: fakeData.fakePosition,
      companyAddress: fakeData.fakeAddress,
      income: fakeData.fakeFinanceAmount,
      startDate: fakeData.fakePastDate,
      endDate: fakeData.fakePastDate,
      supervisorName: `${fakeData.fakeFirstName} ${fakeData.fakeLastName}`,
      supervisorPhone: fakeData.fakePhoneNumber,
      supervisorEmail: fakeData.fakeEmail,
      isCurrent: false,
    },
  ]);
  const [residenceHistory, setResidenceHistory] = useState([
    {
      address: faker.address.streetAddress(),
      startDate: faker.date.past().toISOString().split("T")[0],
      endDate: faker.date.past().toISOString().split("T")[0],
      landlordName: `${faker.person.firstName()} ${faker.person.lastName()}`,
      landlordPhone: faker.phone.number("###-###-####"),
      landlordEmail: faker.internet.email(),
      isCurrent: false,
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
      companyName: faker.company.name(),
      position: faker.name.jobTitle(),
      companyAddress: faker.address.streetAddress(),
      income: faker.finance.amount(),
      startDate: faker.date.past().toISOString().split("T")[0],
      endDate: fakeData.fakePastDate,
      supervisorName: `${faker.person.firstName()} ${faker.person.lastName()}`,
      supervisorPhone: faker.phone.number("###-###-####"),
      supervisorEmail: faker.internet.email(),
      isCurrent: false,
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
      address: faker.address.streetAddress(),
      startDate: faker.date.past().toISOString().split("T")[0],
      endDate: faker.date.past().toISOString().split("T")[0],
      landlordName: `${faker.person.firstName()} ${faker.person.lastName()}`,
      landlordPhone: faker.phone.number("###-###-####"),
      landlordEmail: faker.internet.email(),
      isCurrent: false,
    };
    setResidenceHistory([...residenceHistory, newRentalHistory]);
  };

  const removeRentalHistoryNode = (index) => {
    if (residenceHistory.length === 1) return;
    const updatedHistory = [...residenceHistory];
    updatedHistory.splice(index, 1);
    setResidenceHistory(updatedHistory);
  };

  const onSubmit = async (data) => {
    data.employment_history = employmentHistory;
    data.residential_history = residenceHistory;
    data.unit_id = unit_id;
    data.landlord_id = landlord_id;

    console.log(data);

    const res = await createRentalApplication(data);
    setIsLoading(true);
    console.log(res);
    if (res.status == 200) {
      // show a success message
      setIsLoading(false);
      setSubmissionMessage(
        "Application Submitted Successfully. You will be contacted directly upon submission approval."
      );
      setShowSubmissionMessage(true);
      setSubmissionMessageLink("/");
      setAlertButtonText("Go Home");
      setAlertTitle("Application Submitted");
    } else {
      //Show error message
      setIsLoading(false);
      setSubmissionMessage("Error Submitting Application");
      setShowSubmissionMessage(true);
      setSubmissionMessageLink(
        `/rental-application/${unit_id}/${landlord_id}/`
      );
      setAlertButtonText("Try Again");
      setAlertTitle("Error Submitting Application");
    }
  };

  const handleOtherOccupants = (value) => {
    setOtherOccupants(value);
  };

  return (
    <>
      {isLoading ? (
        <ProgressModal open={isLoading} title="Loading Application" />
      ) : (
        <div className="container py-4">
          {errorMode ? (
            <AlertModal
              open={errorMode}
              title="Application Error"
              message="Error loading application"
              btnText="Okay"
            />
          ) : (
            <div className="row">
              <div className="col-md-6 ">
                <h2>
                  Unit {unit.name} at {property.street}
                </h2>
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-6 col-md-6 mb-4">
                        <h6 className="rental-application-lease-heading">
                          Rent
                        </h6>
                        ${leaseTerm.rent}
                      </div>
                      <div className="col-sm-6 col-md-6 mb-4">
                        <h6 className="rental-application-lease-heading">
                          Term
                        </h6>
                        {leaseTerm.term} Months
                      </div>
                      <div className="col-sm-6 col-md-6 mb-4">
                        <h6 className="rental-application-lease-heading">
                          Late Fee
                        </h6>
                        {`$${leaseTerm.late_fee}`}
                      </div>
                      <div className="col-sm-6 col-md-6 mb-4">
                        <h6 className="rental-application-lease-heading">
                          Security Deposit
                        </h6>
                        {`$${leaseTerm.security_deposit}`}
                      </div>
                      <div className="col-sm-6 col-md-6 mb-4">
                        <h6 className="rental-application-lease-heading">
                          Gas Included?
                        </h6>
                        {`${leaseTerm.gas_included ? "Yes" : "No"}`}
                      </div>
                      <div className="col-sm-6 col-md-6 mb-4">
                        <h6 className="rental-application-lease-heading">
                          Electric Included?
                        </h6>
                        {`${leaseTerm.electric_included ? "Yes" : "No"}`}
                      </div>
                      <div className="col-sm-6 col-md-6 mb-4">
                        <h6 className="rental-application-lease-heading">
                          Water Included?
                        </h6>
                        {`${leaseTerm.water_included ? "Yes" : "No"}`}
                      </div>
                      <div className="col-sm-6 col-md-6 mb-4">
                        <h6 className="rental-application-lease-heading">
                          Lease Cancellation Fee
                        </h6>
                        {`$${leaseTerm.lease_cancellation_fee}`}
                      </div>
                      <div className="col-sm-6 col-md-6 mb-4">
                        <h6 className="rental-application-lease-heading">
                          Lease Cancellation Notice period
                        </h6>
                        {`${leaseTerm.lease_cancellation_notice_period} Month(s)`}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="banner-col  d-none d-md-block"
                  style={{
                    height: "600px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="/assets/img/tenant-application-banner.jpg"
                    width="100%"
                  />
                </div>
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
              {/* */}
              {property && unit ? (
                <>
                  {isLoading && (
                    <ProgressModal
                      open={isLoading}
                      title="Submitting Application"
                    />
                  )}
                  {!isLoading && (
                    <div className="col-md-6  justify-content-center align-items-center">
                      <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <>
                            <div className="card mb-3">
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-md-12 mb-4">
                                    <div className="form-group">
                                      <label className="mb-2">First Name</label>
                                      <input
                                        {...register("first_name", {
                                          required: "This is a required field",
                                        })}
                                        type="text"
                                        className="form-control"
                                        id="firstName"
                                        placeholder="First Name"
                                        name="first_name"
                                      />
                                      <span style={validationMessageStyle}>
                                        {errors.first_name &&
                                          errors.first_name.message}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-md-12 mb-4">
                                    <div className="form-group">
                                      <label className="mb-2">Last Name</label>
                                      <input
                                        {...register("last_name", {
                                          required: "This is a required field",
                                        })}
                                        type="text"
                                        className="form-control"
                                        id="lastName"
                                        placeholder="Last Name"
                                        name="last_name"
                                      />
                                      <span style={validationMessageStyle}>
                                        {errors.last_name &&
                                          errors.last_name.message}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-md-12 mb-4">
                                    <div className="form-group">
                                      <label className="mb-2">
                                        Date Of Birth
                                      </label>
                                      <input
                                        {...register("date_of_birth", {
                                          required: "This is a required field",
                                          pattern: {
                                            value: /\d{4}-\d{2}-\d{2}/,
                                            message:
                                              "Please enter a valid date",
                                          },
                                        })}
                                        type="date"
                                        className=" form-control"
                                        id="dateOfBirth"
                                        placeholder="Date of Birth"
                                        name="date_of_birth"
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
                                      <span style={validationMessageStyle}>
                                        {errors.date_of_birth &&
                                          errors.date_of_birth.message}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="col-md-12 mb-4">
                                    <div className="form-group">
                                      <label className="mb-2">E-mail</label>
                                      <input
                                        {...register("email", {
                                          required: "This is a required field",
                                          pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message:
                                              "Please enter a valid email address",
                                          },
                                        })}
                                        type="email"
                                        className="form-control form-control-user"
                                        id="email"
                                        placeholder="E-mail"
                                        name="email"
                                      />
                                      <span style={validationMessageStyle}>
                                        {errors.email && errors.email.message}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-md-12 mb-4">
                                    <div className="form-group">
                                      <label className="mb-2">
                                        Phone Number
                                      </label>
                                      <input
                                        {...register("phone", {
                                          required: "This is a required field",
                                          pattern: {
                                            value: /\d{3}-\d{3}-\d{4}/,
                                            message:
                                              "Please enter a valid phone number",
                                          },
                                        })}
                                        type="text"
                                        className="form-control"
                                        id="phone"
                                        placeholder="Phone Number"
                                        name="phone"
                                      />
                                      <span style={validationMessageStyle}>
                                        {errors.phone && errors.phone.message}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-md-12 mb-4">
                                    <div className="form-group">
                                      <label className="mb-2">
                                        Social Security Number{" "}
                                        <Tooltip title="Your social security number will not be stored on KeyFlow servers. It will only be used for credit reporting and background checks.">
                                          <HelpOutline
                                            sx={{
                                              marginLeft: "5px",
                                              width: "20px",
                                            }}
                                          />
                                        </Tooltip>
                                      </label>
                                      <input
                                        {...register("ssn", {
                                          required: "This is a required field",
                                          pattern: {
                                            value: /\d{3}-\d{2}-\d{4}/,
                                            message:
                                              "Please enter a valid social security number",
                                          },
                                        })}
                                        type="text"
                                        className="form-control"
                                        id="ssn"
                                        placeholder="SSN"
                                        name="ssn"
                                      />
                                      <span style={validationMessageStyle}>
                                        {errors.ssn && errors.ssn.message}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-md-12 mb-4">
                                    <div className="form-group">
                                      <label className="mb-2">
                                        Desired Move-in Date
                                      </label>
                                      <input
                                        {...register("desired_move_in_date", {
                                          required: "This is a required field",
                                          pattern: {
                                            value: /\d{4}-\d{2}-\d{2}/,
                                            message:
                                              "Please enter a valid date",
                                          },
                                        })}
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
                                      <span style={validationMessageStyle}>
                                        {errors.desired_move_in_date &&
                                          errors.desired_move_in_date.message}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>

                          <>
                            <h5 className="my-4 ml-5">
                              Additional Information
                            </h5>
                            <div className="card mb-3">
                              <div className="card-body">
                                <div className="row">
                                  <div className="form-group col-md-6 mb-4">
                                    <label className="mb-2">
                                      Will there be any other occupants?
                                    </label>
                                    <select
                                      {...register("other_occupants", {
                                        required: "This is a required field",
                                      })}
                                      className="form-select"
                                      defaultValue="false"
                                    >
                                      <option value="">Select One</option>
                                      <option value="true">Yes</option>
                                      <option value="false">No</option>
                                    </select>
                                    <span style={validationMessageStyle}>
                                      {errors.other_occupants &&
                                        errors.other_occupants.message}
                                    </span>
                                  </div>

                                  <div className="form-group col-md-6 mb-4">
                                    <label className="mb-2">
                                      Do you plan on having any pets during your
                                      lease?
                                    </label>
                                    <select
                                      {...register("pets", {
                                        required: "This is a required field",
                                      })}
                                      className="form-select"
                                      defaultValue="false"
                                    >
                                      <option value="">Select One</option>
                                      <option value="true">Yes</option>
                                      <option value="false">No</option>
                                    </select>
                                    <span style={validationMessageStyle}>
                                      {errors.pets && errors.pets.message}
                                    </span>
                                  </div>

                                  <div className="form-group col-md-6 mb-4">
                                    <label className="mb-2">
                                      Do you plan on having/storing any
                                      vehicles?
                                    </label>
                                    <select
                                      {...register("vehicles", {
                                        required: "This is a required field",
                                      })}
                                      className="form-select"
                                      defaultValue="false"
                                    >
                                      <option value="">Select One</option>
                                      <option value="true">Yes</option>
                                      <option value="false">No</option>
                                    </select>
                                    <span style={validationMessageStyle}>
                                      {errors.vehicles &&
                                        errors.vehicles.message}
                                    </span>
                                  </div>

                                  <div className="form-group col-md-6 mb-4">
                                    <label className="mb-2">
                                      Have you ever been convicted of a crime?
                                    </label>
                                    <select
                                      {...register("crime", {
                                        required: "This is a required field",
                                      })}
                                      className="form-select"
                                      defaultValue="false"
                                    >
                                      <option value="">Select One</option>
                                      <option value="true">Yes</option>
                                      <option value="false">No</option>
                                    </select>
                                    <span style={validationMessageStyle}>
                                      {errors.crime && errors.crime.message}
                                    </span>
                                  </div>

                                  <div className="form-group col-md-6 mb-4">
                                    <label className="mb-2">
                                      Have you ever filed for bankrupcy?
                                    </label>
                                    <select
                                      {...register("bankrupcy", {
                                        required: "This is a required field",
                                      })}
                                      className="form-select"
                                      defaultValue="false"
                                    >
                                      <option value="">Select One</option>
                                      <option value="true">Yes</option>
                                      <option value="false">No</option>
                                    </select>
                                    <span style={validationMessageStyle}>
                                      {errors.bankrupcy &&
                                        errors.bankrupcy.message}
                                    </span>
                                  </div>

                                  <div className="form-group col-md-6 mb-4">
                                    <label className="mb-2">
                                      Have you been evicted from aprevious
                                      residence?
                                    </label>
                                    <select
                                      {...register("evicted", {
                                        required: "This is a required field",
                                      })}
                                      className="form-select"
                                      defaultValue="false"
                                    >
                                      <option value="">Select One</option>
                                      <option value="true">Yes</option>
                                      <option value="false">No</option>
                                    </select>
                                    <span style={validationMessageStyle}>
                                      {errors.evicted && errors.evicted.message}
                                    </span>
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
                                        id={index}
                                        register={register}
                                        companyNameErrors={
                                          errors[`companyName_${index}`]
                                        }
                                        positionErrors={
                                          errors[`position_${index}`]
                                        }
                                        companyAddressErrors={
                                          errors[`companyAddress_${index}`]
                                        }
                                        incomeErrors={errors[`income_${index}`]}
                                        startDateErrors={
                                          errors[`startDate_${index}`]
                                        }
                                        endDateErrors={
                                          errors[`endDate_${index}`]
                                        }
                                        supervisorNameErrors={
                                          errors[`supervisorName_${index}`]
                                        }
                                        supervisorPhoneErrors={
                                          errors[`supervisorPhone_${index}`]
                                        }
                                        supervisorEmailErrors={
                                          errors[`supervisorEmail_${index}`]
                                        }
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
                                sx={{
                                  background: uiGreen,
                                  textTransform: "none",
                                }}
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
                                        id={index}
                                        register={register}
                                        addressErrors={
                                          errors[`address_${index}`]
                                        }
                                        startDateErrors={
                                          errors[`startDate_${index}`]
                                        }
                                        endDateErrors={
                                          errors[`endDate_${index}`]
                                        }
                                        landlordNameErrors={
                                          errors[`landlordName_${index}`]
                                        }
                                        landlordPhoneErrors={
                                          errors[`landlordPhone_${index}`]
                                        }
                                        landlordEmailErrors={
                                          errors[`landlordEmail_${index}`]
                                        }
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
                                sx={{
                                  background: uiGreen,
                                  textTransform: "none",
                                }}
                                variant="contained"
                                onClick={addRentalHistoryNode}
                              >
                                Add
                              </Button>
                            </Stack>
                          </>
                          <div className="mt-4">
                            <h5>Additional Comments</h5>
                            <div className="card">
                              <div className="card-body">
                                <textarea
                                  name="comments"
                                  className="form-control"
                                  rows={10}
                                ></textarea>
                              </div>
                            </div>
                          </div>
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
                      </div>
                    </div>
                  )}
                  <AlertModal
                    open={showSubmissionMessage}
                    title={alertTitle}
                    message={submissionMessage}
                    onClose={() => navigate("/")}
                    to={submissionMessageLink}
                    btnText={alertButtonText}
                  />
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
          )}
        </div>
      )}
    </>
  );
};

export default CreateRentalApplication;
