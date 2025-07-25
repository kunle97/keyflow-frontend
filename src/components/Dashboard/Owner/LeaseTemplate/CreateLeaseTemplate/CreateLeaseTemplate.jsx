import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { uiGreen } from "../../../../../constants";
import { createLeaseTemplate } from "../../../../../api/lease_templates";
import {  faker } from "@faker-js/faker";
import BackButton from "../../../UIComponents/BackButton";
import UIStepper from "../../../UIComponents/UIStepper";
import UIButton from "../../../UIComponents/UIButton";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../../../constants";
import { useNavigate } from "react-router";
import AddTerms from "./Steps/AddTerms";
import Assign from "./Steps/Assign";
import UploadLeaseDocument from "./Steps/UploadLeaseDocument";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AlertModal from "../../../UIComponents/Modals/AlertModal";
import ProgressModal from "../../../UIComponents/Modals/ProgressModal";
import useScreen from "../../../../../hooks/useScreen";
import AdditionalCharge from "./Steps/AdditionalCharge";
import Joyride, {
  ACTIONS,
  EVENTS,
  STATUS,
} from "react-joyride";
import UIHelpButton from "../../../UIComponents/UIHelpButton";
import { getOwnerSubscriptionPlanData } from "../../../../../api/owners";
const CreateLeaseTemplate = (props) => {
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
  ]); 
  
  //Array holding ids and boolean values of the selected properties or units
  const [assignmentMode, setAssignmentMode] = useState("unit"); //portfolio, property or unit
  const [templateId, setTemplateId] = useState("");
  const [skipAdditionalChargesStep, setSkipAdditionalChargesStep] = useState(false);
  const [skipAssignStep, setSkipAssignStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chargesValid, setChargesValid] = useState(false);
  const navigate = useNavigate();
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".lease-template-creation-page",
      content:
        "This is the lease template creation page. Here you can create a lease template for any of your units.",
      placement: "center",
      disableBeacon: true,
    },
    {
      target: ".lease-document-upload-container",
      content:
        "Here you can upload a lease agreement document to create a lease agreement template. Once uploaded you can edit the document and add signature fields.",
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
    if (step === 0) {
      setTourIndex(0);
    } else if (step === 1) {
      setTourIndex(2);
    } else if (step === 2) {
      setTourIndex(3);
    } else if (step === 3) {
      setTourIndex(4);
    } else if (step === 4) {
      setTourIndex(5);
    }
    setRunTour(true);
  };

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




    if (!skipAdditionalChargesStep) {
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
    if (!skipAssignStep) {
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


    // Call the API to createLeaseTemplate() function to create the lease term
    createLeaseTemplate(formData)
      .then((res) => {

        if (res.status === 200) {
          if (props.isLeaseRenewal) {
            props.setCurrentLeaseTemplate(res.res.data);
            props.setViewMode("review");
          }
          setResponseTitle("Success");
          setResponseMessage("Lease term created!");
          setShowResponseMessage(true);
          setAlertLink("/dashboard/owner/lease-templates");
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setResponseTitle("Error");
          setResponseMessage(res.message ? res.message : "Something went wrong");
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
  useEffect(() => {
    getOwnerSubscriptionPlanData().then((res) => {
      if(!res.can_create_new_lease_template){
        setAlertLink("/dashboard/owner/lease-templates");
        setResponseTitle("Subscription Plan Mismatch");
        setResponseMessage("You have reached the maximum number of lease templates allowed by your plan. Upgrade your plan to create more lease templates.");
        setShowResponseMessage(true);
      }else{
        setAlertLink(null);
        setResponseTitle("");
        setResponseMessage("");
        setShowResponseMessage(false);
      }
    });
     
  }, [step, skipAdditionalChargesStep, skipAssignStep]);
  return (
    <div className="container lease-template-creation-page">
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
          <form encType="multipart/form-data">
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
                    forrmData={formData}
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
                    skipAdditionalChargesStep={skipAdditionalChargesStep}
                    setSkipAdditionalChargesStep={setSkipAdditionalChargesStep}
                    step={step}
                    steps={steps}
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
                skipAssignStep={skipAssignStep}
                setSkipAssignStep={setSkipAssignStep}
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
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default CreateLeaseTemplate;
