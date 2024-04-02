import React, { useEffect, useState } from "react";
import { Typography, Box, Stack } from "@mui/material";
import { uiGreen } from "../../../../../constants";
import { createLeaseTemplate } from "../../../../../api/lease_templates";
import { faker } from "@faker-js/faker";
import BackButton from "../../../UIComponents/BackButton";
import UIStepper from "../../../UIComponents/UIStepper";
import UIButton from "../../../UIComponents/UIButton";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../../../constants";
import { useNavigate } from "react-router";
import AddTerms from "./Steps/AddTerms";
import AddAdditionalCharge from "./Steps/AdditionalCharge";
import Assign from "./Steps/Assign";
import UploadLeaseDocument from "./Steps/UploadLeaseDocument";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AlertModal from "../../../UIComponents/Modals/AlertModal";
import ProgressModal from "../../../UIComponents/Modals/ProgressModal";
import useScreen from "../../../../../hooks/useScreen";
import { triggerValidation } from "../../../../../helpers/formValidation";
import AdditionalCharge from "./Steps/AdditionalCharge";
const CreateLeaseTemplate = (props) => {
  //TODO: Add steps to create lease term form
  /**
   * Step 1: Add Terms (with rent change frequncy e.g. monthly, yearly, bi-weekly, etc.)
   * Step 2: (Skipable) Add Addtional Charges
   * Step 3: (Skipable) Allow assigning to multiple units or properties
   * Step 4: Upload lease document
   * Step 5: Landlord is navigated to docusign embeded template editor to edit the lease document and add signature fields
   * Step 6: (Skipable) Landlord is navigated to docusign to send the lease document to the tenant
   * Step 7: Show completion screen animation and Landlord is navigated to the lease term detail page
   *
   */
  const { isMobile } = useScreen();
  const [step, setStep] = useState(0);
  const [steps, setSteps] = useState([
    "Upload Document",
    "Terms",
    "Addtional Charges",
    "Assign ",
    "Done",
  ]);
  const [showResponseMessage, setShowResponseMessage] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseTitle, setResponseTitle] = useState("");
  const [alertLink, setAlertLink] = useState("");
  const [additionalCharges, setAdditionalCharges] = useState([
    {
      name: "",
      amount: "",
      frequency: "",
    },
  ]);
  const [selectedAssignments, setSelectedAssignments] = useState([
    // { id: 1, selected: true },
  ]); //Array holding ids and boolean values of the selected properties or units
  const [assignmentMode, setAssignmentMode] = useState("unit"); //portfolio, property or unit
  const [templateId, setTemplateId] = useState("");
  const [skippedSteps, setSkippedSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chargesValid, setChargesValid] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    trigger,
    // formState: { errors },
  } = useForm({
    defaultValues: {
      rent: props.isLeaseRenewal
        ? props.currentLeaseAgreement.lease_template.rent
        : process.env.REACT_APP_ENVIRONMENT === "development"
        ? faker.finance.amount(1000, 5000, 0)
        : "",
      rent_frequency: props.isLeaseRenewal
        ? props.currentLeaseAgreement.lease_template.rent_frequency
        : "month",
      term: props.isLeaseRenewal ? props.leaseRenewalRequest.request_term : 12,
      late_fee: props.isLeaseRenewal
        ? props.currentLeaseAgreement.lease_template.late_fee
        : process.env.REACT_APP_ENVIRONMENT === "development"
        ? faker.finance.amount(1000, 5000, 0)
        : "",
      security_deposit: props.isLeaseRenewal
        ? props.currentLeaseAgreement.lease_template.security_deposit
        : process.env.REACT_APP_ENVIRONMENT === "development"
        ? faker.finance.amount(1000, 5000, 0)
        : "",
      gas_included: props.isLeaseRenewal
        ? props.currentLeaseAgreement.lease_template.gas_included
        : process.env.REACT_APP_ENVIRONMENT === "development"
        ? false
        : "",
      water_included: props.isLeaseRenewal
        ? props.currentLeaseAgreement.lease_template.water_included
        : process.env.REACT_APP_ENVIRONMENT === "development"
        ? false
        : "",
      electric_included: props.isLeaseRenewal
        ? props.currentLeaseAgreement.lease_template.electric_included
        : process.env.REACT_APP_ENVIRONMENT === "development"
        ? false
        : "",
      repairs_included: props.isLeaseRenewal
        ? props.currentLeaseAgreement.lease_template.repairs_included
        : process.env.REACT_APP_ENVIRONMENT === "development"
        ? false
        : "",
      grace_period: props.isLeaseRenewal
        ? props.currentLeaseAgreement.lease_template.grace_period
        : 0,
      lease_cancellation_notice_period: props.isLeaseRenewal
        ? props.currentLeaseAgreement.lease_template
            .lease_cancellation_notice_period
        : 0,
      lease_cancellation_fee: props.isLeaseRenewal
        ? props.currentLeaseAgreement.lease_template.lease_cancellation_fee
        : process.env.REACT_APP_ENVIRONMENT === "development"
        ? faker.finance.amount(1000, 5000, 0)
        : "",
      lease_renewal_notice_period: props.isLeaseRenewal
        ? props.currentLeaseAgreement.lease_template.lease_renewal_notice_period
        : 0,
      lease_renewal_fee: props.isLeaseRenewal
        ? props.currentLeaseAgreement.lease_template.lease_renewal_fee
        : process.env.REACT_APP_ENVIRONMENT === "development"
        ? faker.finance.amount(1000, 5000, 0)
        : "",
    },
  });
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    rent:
      process.env.REACT_APP_ENVIRONMENT === "development"
        ? faker.finance.amount(1000, 5000, 0)
        : "",
    rent_frequency: "month",
    term: 12,
    late_fee:
      process.env.REACT_APP_ENVIRONMENT === "development"
        ? faker.finance.amount(1000, 5000, 0)
        : "",
    security_deposit:
      process.env.REACT_APP_ENVIRONMENT === "development"
        ? faker.finance.amount(1000, 5000, 0)
        : "",
    gas_included:
      process.env.REACT_APP_ENVIRONMENT === "development" ? false : "",
    water_included:
      process.env.REACT_APP_ENVIRONMENT === "development" ? false : "",
    electric_included:
      process.env.REACT_APP_ENVIRONMENT === "development" ? false : "",
    repairs_included:
      process.env.REACT_APP_ENVIRONMENT === "development" ? false : "",
    grace_period: null,
    lease_cancellation_notice_period: 5,
    lease_cancellation_fee:
      process.env.REACT_APP_ENVIRONMENT === "development"
        ? faker.finance.amount(1000, 5000, 0)
        : "",
    lease_renewal_notice_period: 5,
    lease_renewal_fee:
      process.env.REACT_APP_ENVIRONMENT === "development"
        ? faker.finance.amount(1000, 5000, 0)
        : "",
  });

  const handleNextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const addAdditionalCharge = () => {
    setAdditionalCharges([
      ...additionalCharges,
      {
        name: "",
        amount: "",
        frequency: "",
      },
    ]);
  };

  const removeAdditionalCharge = (index) => {
    let newCharges = [...additionalCharges];
    newCharges.splice(index, 1);
    setAdditionalCharges(newCharges);
  };
  const onSubmit = () => {
    setIsLoading(true);
    //Get the values from the form
    console.log("Form data", formData);
    console.log("Additional charges array", additionalCharges);
    console.log("Selected assignments", selectedAssignments);
    console.log("Skipped", skippedSteps);

    if (!skippedSteps.includes(2)) {
      //Check if additional charges all have the same frequency
      const frequencies = additionalCharges.map((charge) => charge.frequency);
      const allFrequenciesEqual = frequencies.every(
        (freq, index) => freq === frequencies[0]
      );
      if (!allFrequenciesEqual) {
        // Handle case where frequencies are not all the same
        console.log("Additional charges have different frequencies");
        // Perform actions or show an error message to the user
        // You can return early, show an error message, or prevent form submission
        setIsLoading(false);
        setResponseMessage(
          "All additional charges must have the same frequency"
        );
        setResponseTitle("Error creating lease term");
        setAlertLink(null);
        setShowResponseMessage(true);
        return; // Example: return or show an error message
      }

      //Check if additional charges have the same frequency as the rent frequency
      const rentFrequency = formData.rent_frequency;
      const chargesMatchRentFrequency = additionalCharges.every(
        (charge) => charge.frequency === rentFrequency
      );
      if (!chargesMatchRentFrequency) {
        // Handle case where frequencies don't match rent frequency
        setIsLoading(false);
        setResponseMessage(
          "Additional charges must have the same frequency as the rent frequency"
        );
        setResponseTitle("Error creating lease term");
        setAlertLink(null);
        setShowResponseMessage(true);
        return; // Example: return or show an error message
      }
      formData.additional_charges = JSON.stringify(additionalCharges);
    } else {
      formData.additional_charges = JSON.stringify([]);
    }
    if (!skippedSteps.includes(3)) {
      //REtreive all selected assignments that have the selected property set to true
      let payloadSelectedAssignments = selectedAssignments.filter(
        (assignment) => assignment.selected === true
      );
      formData.assignment_mode = assignmentMode;
      formData.selected_assignments = JSON.stringify(
        payloadSelectedAssignments
      );
    } else {
      formData.assignment_mode = "";
      formData.selected_assignments = JSON.stringify([]);
    }
    formData.template_id = templateId;
    console.log("Create lease term submit tewmplate id", templateId);
    if (props.isLeaseRenewal) {
      if (props.documentMode === "new") {
        props.setCurrentTemplateId(templateId);
      } else if (props.documentMode === "existing") {
        props.setCurrentTemplateId(
          props.currentLeaseAgreement.lease_template.template_id
        );
        formData.template_id =
          props.currentLeaseAgreement.lease_template.template_id;
      }
    }
    console.log("Full Form data", formData);

    // Call the API to createLeaseTemplate() function to create the lease term
    createLeaseTemplate(formData)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          if (props.isLeaseRenewal) {
            props.setCurrentLeaseTemplate(res.res.data);
            props.setViewMode("review");
          }
          setResponseTitle("Success");
          setResponseMessage("Lease term created!");
          setShowResponseMessage(true);
          setAlertLink("/dashboard/landlord/lease-templates");
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setResponseTitle("Error");
          setResponseMessage("Something went wrong");
          setShowResponseMessage(true);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setResponseTitle("Error");
        setResponseMessage("Something went wrong: " + err.message);
        setAlertLink(null);
        setShowResponseMessage(true);
      });
  };

  return (
    <div className="container">
      <AlertModal
        open={showResponseMessage}
        handleClose={() => setShowResponseMessage(false)}
        title={responseTitle}
        message={responseMessage}
        onClick={() => {
          if (alertLink) {
            //navigate to previous page
            navigate(alertLink);
          } else {
            //close modal
            setShowResponseMessage(false);
          }
        }}
        btnText="Okay"
      />
      {isLoading && (
        <ProgressModal
          title="Creating Lease Agreement Template..."
          open={isLoading}
        />
      )}
      {!props.hideBackButton && <BackButton />}
      <h2
        style={{
          fontSize: isMobile ? "15pt" : "25pt",
          marginBottom: "15px",
        }}
      >
        {props.isLeaseRenewal
          ? props.customTitle
          : "Create Lease Agreement Template"}
      </h2>
      <div className="card">
        <UIStepper steps={steps} step={step} style={{ margin: "30px 0" }} />
        <div className="card-body">
          <form enctype="multipart/form-data">
            {step === 0 && (
              <UploadLeaseDocument
                isLeaseRenewal={props.isLeaseRenewal}
                handlePreviousStep={handlePreviousStep}
                handleNextStep={handleNextStep}
                step={step}
                steps={steps}
                setTemplateId={setTemplateId}
                templateId={templateId}
                documentMode={props.documentMode}
                setDocumentMode={props.setDocumentMode}
                documentTemplateId={props.documentTemplateId}
                setDocumentTemplateId={props.setDocumentTemplateId}
              />
            )}
            {step === 1 && (
              <AddTerms
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                isLeaseRenewal={props.isLeaseRenewal}
                register={register}
                trigger={trigger}
                validationMessageStyle={validationMessageStyle}
                handleNextStep={handleNextStep}
                step={step}
                steps={steps}
                leaseTemplate={
                  props.isLeaseRenewal
                    ? props.currentLeaseAgreement.lease_template
                    : null
                }
              />
            )}
            {step === 2 && (
              <>
                {" "}
                {additionalCharges.map((charge, index) => (
                  <AdditionalCharge
                    index={index}
                    register={register}
                    setErrors={setErrors}
                    errors={errors}
                    trigger={trigger}
                    charge={charge}
                    addAdditionalCharge={addAdditionalCharge}
                    removeAdditionalCharge={removeAdditionalCharge}
                    chargesValid={chargesValid}
                    setChargesValid={setChargesValid}
                    additionalCharges={additionalCharges}
                    setAdditionalCharges={setAdditionalCharges}
                    validationMessageStyle={validationMessageStyle}
                    handlePreviousStep={handlePreviousStep}
                    handleNextStep={handleNextStep}
                    step={step}
                    steps={steps}
                    skippedSteps={skippedSteps}
                    setSkippedSteps={setSkippedSteps}
                  />
                ))}
              </>
            )}
            {step === 3 && (
              <Assign
                handlePreviousStep={handlePreviousStep}
                handleNextStep={handleNextStep}
                step={step}
                steps={steps}
                skippedSteps={skippedSteps}
                setSkippedSteps={setSkippedSteps}
                selectedAssignments={selectedAssignments}
                setSelectedAssignments={setSelectedAssignments}
                assignmentMode={assignmentMode}
                setAssignmentMode={setAssignmentMode}
                handleSubmit={handleSubmit(onSubmit)}
              />
            )}
            {step === 4 && (
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{ padding: "1rem 0 3rem" }}
              >
                <HistoryEduIcon
                  style={{
                    fontSize: "5rem",
                    color: uiGreen,
                    marginBottom: isMobile ? "0" : "1rem",
                  }}
                />
                <div
                  style={{
                    textAlign: "center",
                  }}
                >
                  <h3
                    style={{
                      textAlign: "center",
                      fontSize: isMobile ? "12pt" : "15pt",
                      margin: isMobile ? "0 " : "1rem 0",
                      marginBottom: "5px",
                    }}
                  >
                    Would you like to save this lease agreement template?
                  </h3>
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: isMobile ? "10pt" : "12pt",
                    }}
                    className="text-black"
                  >
                    You can always make changes later.
                  </p>
                </div>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                >
                  <UIButton
                    type="button"
                    style={{
                      margin: "1rem 0",
                      fontSize: isMobile ? "10pt" : "12pt",
                    }}
                    onClick={() => {
                      setStep(1);
                    }}
                    btnText="Continue Editing"
                  />
                  <UIButton
                    type="button"
                    onClick={() => {
                      onSubmit();
                      
                    }}
                    style={{
                      margin: "1rem 0",
                      fontSize: isMobile ? "10pt" : "12pt",
                    }}
                    btnText="Save Template"
                  />
                </Stack>
              </Stack>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLeaseTemplate;
