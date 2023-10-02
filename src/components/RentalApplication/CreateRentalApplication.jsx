import { Button, Stack, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fakeData, uiGreen } from "../../constants";
import UIBinaryRadioGroup from "../Dashboard/UIComponents/UIBinaryRadioGroup";
import EmploymentHistorySection from "./ApplicationSections/EmploymentHistorySection";
import RentalHistorySection from "./ApplicationSections/RentalHistorySection";
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
import ProgressModal from "../Dashboard/UIComponents/Modals/ProgressModal";
import AlertModal from "../Dashboard/UIComponents/Modals/AlertModal";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../constants";
import BasicInfoSection from "./ApplicationSections/BasicInfoSection";
import AdditionalInformationSection from "./ApplicationSections/AdditionalInformationSection";
import UIButton from "../Dashboard/UIComponents/UIButton";
import UIStepper from "../Dashboard/UIComponents/UIStepper";

const CreateRentalApplication = () => {
  const { unit_id, landlord_id } = useParams();

  const [step, setStep] = useState(0); // step state
  const [step0IsValid, setStep0IsValid] = useState(false); // step 1 validation state
  const [step1IsValid, setStep1IsValid] = useState(false); // step 2 validation state
  const [step2IsValid, setStep2IsValid] = useState(false); // step 3 validation state
  const [step3IsValid, setStep3IsValid] = useState(false); // step 4 validation state
  const [step4IsValid, setStep4IsValid] = useState(false); // step 5 validation state
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
  const [firstName, setFirstName] = useState(
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.person.firstName()
  ); // first name of the applicant
  const [lastName, setLastName] = useState(
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.person.lastName()
  ); // last name of the applicant
  const [dateOfBirth, setDateOfBirth] = useState(
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.date.past().toISOString().split("T")[0]
  ); // date of birth of the applicant
  const [email, setEmail] = useState(
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.internet.email({ firstName, lastName })
  ); // email of the applicant
  const [phone, setPhone] = useState(
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.phone.number("###-###-####")
  ); // phone number of the applicant
  const [ssn, setSsn] = useState(
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.phone.number("###-##-####")
  ); // social security number of the applicant
  const [desiredMoveInDate, setDesiredMoveInDate] = useState(
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.date.future().toISOString().split("T")[0]
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
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: firstName,
      last_name: lastName,
      email:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.internet.email({ firstName, lastName }),
      phone:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.phone.number("###-###-####"),
      ssn:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.phone.number("###-##-####"),
      date_of_birth:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.date.past().toISOString().split("T")[0],
      desired_move_in_date:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.date.future().toISOString().split("T")[0],
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
      address:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.address.streetAddress(),
      startDate:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.date.past().toISOString().split("T")[0],
      endDate:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.date.past().toISOString().split("T")[0],
      landlordName: `${
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.person.firstName()
      } ${
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.person.lastName()
      }`,
      landlordPhone:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.phone.number("###-###-####"),
      landlordEmail:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.internet.email(),
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
      companyName:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.company.name(),
      position:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.name.jobTitle(),
      companyAddress:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.address.streetAddress(),
      income:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.finance.amount(),
      startDate:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.date.past().toISOString().split("T")[0],
      endDate: fakeData.fakePastDate,
      supervisorName: `${
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.person.firstName()
      } ${
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.person.lastName()
      }`,
      supervisorPhone:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.phone.number("###-###-####"),
      supervisorEmail:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.internet.email(),
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
      address:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.address.streetAddress(),
      startDate:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.date.past().toISOString().split("T")[0],
      endDate:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.date.past().toISOString().split("T")[0],
      landlordName: `${
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.person.firstName()
      } ${
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.person.lastName()
      }`,
      landlordPhone:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.phone.number("###-###-####"),
      landlordEmail:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.internet.email(),
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

  const steps = [
    "Basic Information",
    "Additional Information",
    "Employment History",
    "Residence History",
    "Submit Application",
  ];
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
                      <UIStepper steps={steps} step={step} />
                      <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          {step === 0 && (
                            <>
                              <BasicInfoSection
                                register={register}
                                errors={errors}
                              />
                              <UIButton
                                style={{ width: "100%" }}
                                btnText="Next"
                                type="button"
                                onClick={() => {
                                  trigger([
                                    "first_name",
                                    "last_name",
                                    "date_of_birth",
                                    "email",
                                    "phone",
                                    "ssn",
                                    "desired_move_in_date",
                                  ]);
                                  if (
                                    errors.first_name ||
                                    errors.last_name ||
                                    errors.date_of_birth ||
                                    errors.email ||
                                    errors.phone ||
                                    errors.ssn ||
                                    errors.desired_move_in_date
                                  ) {
                                    setStep0IsValid(false);
                                  } else {
                                    setStep0IsValid(true);
                                  }
                                  if (step0IsValid) {
                                    setStep(1);
                                  }
                                }}
                              />
                            </>
                          )}
                          {step === 1 && (
                            <>
                              <AdditionalInformationSection
                                register={register}
                                errors={errors}
                              />
                              <Stack direction="row" spacing={2}>
                                <UIButton
                                  style={{ width: "100%" }}
                                  btnText="Back"
                                  onClick={() => setStep(0)}
                                  type="button"
                                />
                                <UIButton
                                  style={{ width: "100%" }}
                                  btnText="Next"
                                  onClick={() => {
                                    trigger([
                                      "other_occupants",
                                      "pets",
                                      "vehicles",
                                      "crime",
                                      "bankrupcy",
                                      "evicted",
                                    ]);
                                    if (
                                      errors.other_occupants &&
                                      errors.pets &&
                                      errors.vehicles &&
                                      errors.crime &&
                                      errors.bankrupcy &&
                                      errors.evicted
                                    ) {
                                      setStep1IsValid(false);
                                    } else {
                                      setStep1IsValid(true);
                                    }
                                    if (step1IsValid) {
                                      setStep(2);
                                    }
                                  }}
                                  type="button"
                                />
                              </Stack>
                            </>
                          )}
                          {step === 2 && (
                            <div id="employment-history-section">
                              <div className="information">
                                <h5 className="my-4 ml-5">
                                  Employment History
                                </h5>
                                <div className="">
                                  {employmentHistory.map(
                                    (employment, index) => {
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
                                            incomeErrors={
                                              errors[`income_${index}`]
                                            }
                                            employmentStartDateErrors={
                                              errors[
                                                `employmentStartDate_${index}`
                                              ]
                                            }
                                            employmentEndDateErrors={
                                              errors[
                                                `employmentEndDate_${index}`
                                              ]
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
                                                    removeEmploymentInfoNode(
                                                      index
                                                    )
                                                  }
                                                >
                                                  Remove
                                                </Button>
                                              )
                                            }
                                            showStepButtons={
                                              index ===
                                              employmentHistory.length - 1
                                            }
                                            isValid={step2IsValid}
                                            setIsValid={setStep2IsValid}
                                            previousStep={() => setStep(1)}
                                            nextStep={() => setStep(3)}
                                            trigger={trigger}
                                            watch={watch}
                                            addEmploymentInfoNode={
                                              addEmploymentInfoNode
                                            }
                                          />
                                        </>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          {step === 3 && (
                            <div id="resicence-history-section">
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
                                          residenceStartDateErrors={
                                            errors[
                                              `residenceStartDate_${index}`
                                            ]
                                          }
                                          residenceEndDateErrors={
                                            errors[`residenceEndDate_${index}`]
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
                                          showStepButtons={
                                            index ===
                                            residenceHistory.length - 1
                                          }
                                          isValid={step3IsValid}
                                          setIsValid={setStep3IsValid}
                                          previousStep={() => setStep(2)}
                                          nextStep={() => setStep(4)}
                                          trigger={trigger}
                                          watch={watch}
                                          addRentalHistoryNode={
                                            addRentalHistoryNode
                                          }
                                        />
                                      </>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                          {step === 4 && (
                            <>
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
                              <Stack
                                style={{ marginTop: "20px" }}
                                direction="row"
                                spacing={2}
                              >
                                <UIButton
                                  style={{ width: "100%" }}
                                  btnText="Back"
                                  onClick={() => setStep(3)}
                                  type="button"
                                />
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
                              </Stack>
                            </>
                          )}
                        </form>
                      </div>
                      {console.log(errors)}
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
