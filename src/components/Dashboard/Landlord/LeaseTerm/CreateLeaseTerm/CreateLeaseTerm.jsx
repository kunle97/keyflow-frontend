import React, { useState } from "react";
import { Typography, Box, Stack } from "@mui/material";
import { uiGreen } from "../../../../../constants";
import { createLeaseTerm } from "../../../../../api/lease_terms";
import { faker } from "@faker-js/faker";
import BackButton from "../../../UIComponents/BackButton";
import UIStepper from "../../../UIComponents/UIStepper";
import UIButton from "../../../UIComponents/UIButton";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../../../constants";
import { useNavigate } from "react-router";
import AddTerms from "./Steps/AddTerms";
import AddAdditionalCharges from "./Steps/AddAdditionalCharges";
import Assign from "./Steps/Assign";
import UploadLeaseDocument from "./Steps/UploadLeaseDocument";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AlertModal from "../../../UIComponents/Modals/AlertModal";
import ProgressModal from "../../../UIComponents/Modals/ProgressModal";
const CreateLeaseTerm = () => {
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
  const [step, setStep] = useState(0);
  const [steps, setSteps] = useState([
    "Upload & Prepare Lease Document",
    "Add Terms",
    "Add Addtional Charges",
    "Assign to Units and Properties",
    "Done",
  ]);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseTitle, setResponseTitle] = useState("");
  const [addtionalCharges, setAddtionalCharges] = useState([
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

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rent:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.finance.account(4),
      term: 12,
      late_fee:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.finance.account(3),
      security_deposit:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.finance.account(4),
      gas_included: "false",
      water_included: "false",
      electric_included: "false",
      repairs_included: "false",
      grace_period: 0,
      lease_cancellation_notice_period: 12,
      lease_cancellation_fee:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : faker.finance.account(4),
    },
  });

  const [alertSeverity, setAlertSeverity] = useState("success");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShowUpdateSuccess(false);
  };

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

  const onSubmit = (data) => {
    setIsLoading(true);
    //Get the values from the form
    console.log("Form data", data);
    console.log("Additional charges", addtionalCharges);
    console.log("Selected assignments", selectedAssignments);
    console.log("Skipped", skippedSteps);
    if (!skippedSteps.includes(2)) {
      data.additional_charges = JSON.stringify(addtionalCharges);
    } else {
      data.additional_charges = JSON.stringify([]);
    }
    if (!skippedSteps.includes(3)) {
      //REtreive all selected assignments that have the selected property set to true
      let payloadSelectedAssignments = selectedAssignments.filter(
        (assignment) => assignment.selected === true
      );
      data.assignment_mode = assignmentMode;
      data.selected_assignments = JSON.stringify(payloadSelectedAssignments);
    } else {
      data.assignment_mode = "";
      data.selected_assignments = JSON.stringify([]);
    }
    console.log("Create lease term submit tewmplate id", templateId);
    data.template_id = templateId;
    console.log("Full Form data", data);

    // Call the API to createLeaseTerm() function to create the lease term
    createLeaseTerm(data).then((res) => {
      console.log(res);
      if (res.status === 200) {
        setAlertSeverity("success");
        setResponseTitle("Success");
        setResponseMessage("Lease term created!");
        setShowUpdateSuccess(true);
        setIsLoading(false);
      } else {
        setShowUpdateSuccess(true);
        setAlertSeverity("error");
        setResponseTitle("Error");
        setResponseMessage("Something went wrong");
      }
    });
  };
  return (
    <div className="container">
      <AlertModal
        open={showUpdateSuccess}
        handleClose={() => setShowUpdateSuccess(false)}
        title={responseTitle}
        message={responseMessage}
        onClick={() => {
          //navigate to previous page
          navigate("/dashboard/landlord/lease-terms");
        }}
        btnText="Okay"
      />
      {isLoading && (
        <ProgressModal title="Create Lease Agreement..." open={isLoading} />
      )}
      <BackButton />
      <h2 style={{ color: "white" }}>Create Lease Agreement</h2>
      <div className="card">
        <UIStepper steps={steps} step={step} style={{ margin: "30px 0" }} />
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} enctype="multipart/form-data">
            {step === 0 && (
              <UploadLeaseDocument
                handlePreviousStep={handlePreviousStep}
                handleNextStep={handleNextStep}
                step={step}
                steps={steps}
                setTemplateId={setTemplateId}
                templateId={templateId}
              />
            )}
            {step === 1 && (
              <AddTerms
                register={register}
                errors={errors}
                trigger={trigger}
                validationMessageStyle={validationMessageStyle}
                handleNextStep={handleNextStep}
                step={step}
                steps={steps}
              />
            )}
            {step === 2 && (
              <AddAdditionalCharges
                register={register}
                errors={errors}
                trigger={trigger}
                addtionalCharges={addtionalCharges}
                setAddtionalCharges={setAddtionalCharges}
                validationMessageStyle={validationMessageStyle}
                handlePreviousStep={handlePreviousStep}
                handleNextStep={handleNextStep}
                step={step}
                steps={steps}
                skippedSteps={skippedSteps}
                setSkippedSteps={setSkippedSteps}
              />
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
                    marginBottom: "1rem",
                  }}
                />
                <h3>Would you like to save this Lease Agreement?</h3>
                <p>You can always make changes later.</p>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                >
                  <UIButton
                    type="button"
                    style={{ margin: "1rem 0" }}
                    onClick={() => {
                      setStep(1);
                    }}
                    btnText="Continue editing"
                  />
                  <UIButton
                    type="submit"
                    style={{ margin: "1rem 0" }}
                    btnText="Save Lease Agreement"
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

export default CreateLeaseTerm;
