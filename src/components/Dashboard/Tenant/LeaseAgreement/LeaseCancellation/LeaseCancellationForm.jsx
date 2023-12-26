import React from "react";
import UIStepper from "../../../UIComponents/UIStepper";
import UIButton from "../../../UIComponents/UIButton";
import { useState } from "react";
import { Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import {
  authUser,
  defaultWhiteInputStyle,
  validationMessageStyle,
} from "../../../../../constants";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import { createLeaseCancellationRequest, getTenantLeaseCancellationRequests } from "../../../../../api/lease_cancellation_requests";
const LeaseCancellationForm = (props) => {
  const [step, setStep] = useState(0);
  const [steps, setSteps] = useState([
    "Reason for Cancellation",
    "Desired Move Out Date",
    "Comments",
    "Submit",
  ]);

  const reasons = [
    "I am moving to a new place",
    "I am moving in with my partner",
    "Unsatisfied with the property",
    "Poor communication with property manager",
    "Other",
  ];
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const handleNext = () => {
    setStep(step + 1);
  };
  const handleBack = () => {
    setStep(step - 1);
  };
  const onSubmit = (data) => {
    const payload = {
      reason: data.reason,
      request_date: data.moveOutDate,
      comments: data.comments,
      tenant: authUser.user_id,
      user: props.leaseAgreement.user.id,
      rental_unit: props.leaseAgreement.rental_unit.id,
      rental_property: props.leaseAgreement.rental_unit.rental_property,
      lease_agreement: props.leaseAgreement.id,
    };


    try {
      createLeaseCancellationRequest(payload).then((res) => {
        console.log(res);
        if (res.status === 201) {
          props.setShowLeaseCancellationFormDialog(false);
          props.setAlertModalTitle("Lease Cancellation Request Created");
          props.setAlertModalMessage(
            "Your lease cancellation request has been created. You will be notified when the property manager responds."
          );
          props.setShowAlertModal(true);
        } else {
          console.log("Error creating lease cancellation request", res);
          props.setShowLeaseCancellationFormDialog(false);
          props.setAlertModalTitle("Error");
          props.setAlertModalMessage(res.data?.message);
          props.setShowAlertModal(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <UIStepper steps={steps} step={step} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ margin: "20px 0", width: "100%" }}
      >
        <div style={{ margin: "15px 0" }}>
          {step === 0 && (
            <div>
              <h6>Why are you cancelling your lease?</h6>
              <div>
                <select
                  style={defaultWhiteInputStyle}
                  {...register("reason", {
                    required: "This is a required field",
                    //Validate that the value is not a blank string
                    validate: (value) => value !== "",
                  })}
                >
                  <option value="" disabled selected>
                    Select a reason
                  </option>
                  {reasons.map((reason, index) => {
                    return (
                      <option key={index} value={reason}>
                        {reason}
                      </option>
                    );
                  })}
                </select>

                <span className={validationMessageStyle}>
                  {errors.reason && errors.reason}
                </span>
              </div>
            </div>
          )}
          {step === 1 && (
            <div>
              <h6>Desired Move Out Date</h6>
              <input
                type="date"
                {...register("moveOutDate", {
                  required: "This is a required field",
                  //Validate that the value is not a blank string
                  validate: (value) => value !== "",
                })}
                // className="form-control"
                style={defaultWhiteInputStyle}
              />
              {errors.moveOutDate && (
                <span className={validationMessageStyle}>
                  {errors.moveOutDate}
                </span>
              )}
            </div>
          )}
          {step === 2 && (
            <div>
              <h6>Comments</h6>
              <textarea
                {...register("comments", {
                  required: "This is a required field",
                  //Validate that the value is not a blank string
                  validate: (value) => value !== "",
                })}
                className=""
                rows="5"
                style={defaultWhiteInputStyle}
              ></textarea>
              {errors.comments && (
                <span className={validationMessageStyle}>
                  {errors.comments}
                </span>
              )}
            </div>
          )}
          {step === 3 && (
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
              spacing={2}
            >
              <CancelIcon sx={{ fontSize: "50px", color: "red" }} />
              <h3>Cancel Lease</h3>
              <p className={`text-black`}  style={{ textAlign: "center" }}>
                Are you sure you want to cancel your lease? You will not be able
                to retract this lease canellation request. If the request is
                approved you will be liable for fromaining payments in your
                balance as well as the lease cancellation fee.
              </p>
            </Stack>
          )}
        </div>
        <div className="d-flex justify-content-between mt-4">
          {step !== 0 && (
            <UIButton
              btnText="Back"
              onClick={handleBack}
              disabled={step === 0}
              sx={{ width: "100px" }}
            />
          )}
          <div></div>
          {step !== steps.length - 1 && (
            <UIButton
              btnText="Next"
              onClick={handleNext}
              disabled={step === steps.length - 1}
              sx={{ width: "100px" }}
            />
          )}
          {step === steps.length - 1 && (
            <UIButton
              btnText="Submit"
              onClick={handleSubmit(onSubmit)}
              sx={{ width: "100px" }}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default LeaseCancellationForm;
