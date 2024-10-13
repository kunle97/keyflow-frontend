import React, { useEffect } from "react";
import UIButton from "../../../UIComponents/UIButton";
import { useState } from "react";
import { authUser, validationMessageStyle } from "../../../../../constants";
import { createLeaseCancellationRequest } from "../../../../../api/lease_cancellation_requests";
import {
  triggerValidation,
  validateForm,
} from "../../../../../helpers/formValidation";
import ProgressModal from "../../../UIComponents/Modals/ProgressModal";
import { validAnyString, validHTMLDateInput } from "../../../../../constants/rexgex";
const LeaseCancellationForm = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = triggerValidation(
      name,
      value,
      formInputs.find((input) => input.name === name).validations
    );
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: newErrors[name],
    }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));


  };

  const formInputs = [
    {
      name: "reason",
      label: "Reason for Cancellation",
      type: "select",
      options: [
        "I am moving to a new place",
        "I am moving in with my partner",
        "Unsatisfied with the property",
        "Poor communication with property manager",
        "Other",
      ],
      onChange: (e) => handleChange(e),
      colSpan: 12,
      validations: {
        required: true,
        regex: validAnyString,
        errorMessage: "Please select a reason for the cancellation",
      },
      dataTestId: "reason-select",
      errorMessageDataTestId: "reason-select-error",
    },
    {
      name: "moveOutDate",
      label: "Desired Move Out Date",
      type: "date",
      colSpan: 12,
      onChange: (e) => handleChange(e),

      validations: {
        required: true,
        errorMessage: "Please select a move out date",
        //Create a regeext property whoes value is a regex that matches the date format
        regex: validHTMLDateInput,
      },
      dataTestId: "move-out-date-input",
      errorMessageDataTestId: "move-out-date-input-error",
    },
    {
      name: "comments",
      label: "Comments",
      type: "textarea",
      colSpan: 12,
      onChange: (e) => handleChange(e),

      validations: {
        required: true,
        regex:validAnyString,
        errorMessage: "Please enter a breif comment on your reason for cancellation",
      },
      dataTestId: "comments-textarea",
      errorMessageDataTestId: "comments-textarea-error",
    },
  ];

  const onSubmit = () => {
    setIsLoading(true);
    // Check that the move out date is not before the end of the lease agreement end date
    const moveOutDate = new Date(formData.moveOutDate);
    const leaseEndDate = new Date(props.leaseAgreement.end_date);
    if (moveOutDate > leaseEndDate) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        moveOutDate:
          "Move out date cannot be after the end of the lease. Please select a date before " +
          leaseEndDate.toDateString(),
      }));
      return;
    }

    const payload = {
      reason: formData.reason,
      request_date: formData.moveOutDate,
      comments: formData.comments,
      tenant: authUser.id,
      owner: props.leaseAgreement.owner.id,
      rental_unit: props.leaseAgreement.rental_unit.id,
      rental_property: props.leaseAgreement.rental_unit.rental_property,
      lease_agreement: props.leaseAgreement.id,
    };
    try {
      createLeaseCancellationRequest(payload).then((res) => {

        if (res.status === 201) {
          props.setShowLeaseCancellationFormDialog(false);
          props.setAlertModalTitle("Lease Cancellation Request Created");
          props.setAlertModalMessage(
            "Your lease cancellation request has been created. You will be notified when the property manager responds."
          );
          props.setShowAlertModal(true);
        } else {

          props.setShowLeaseCancellationFormDialog(false);
          props.setAlertModalTitle("Error");
          props.setAlertModalMessage(
            `Error creating lease cancellation request: ${res.response?.data?.message}`
          );
          props.setShowAlertModal(true);
        }
      });
    } catch (err) {
      props.setShowLeaseCancellationFormDialog(false);
      props.setAlertModalTitle("Error");
      props.setAlertModalMessage(
        `Error creating lease cancellation request. Please try again.`
      );
      props.setShowAlertModal(true);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
     
  },[]);
  return (
    <div>
      <ProgressModal open={isLoading} title="Creating Lease Cancellation Request..." />
      <form style={{ margin: "20px 0", width: "100%" }}>
        <div style={{ margin: "15px 0" }}>
          {formInputs.map((input, index) => {
            return (
              <div
                key={index}
                className={`row ${
                  input.colSpan ? `col-md-${input.colSpan}` : ""
                }`}
              >
                <div className="form-group  mb-2">
                  <label htmlFor={input.name} className="text-black">
                    {input.label}
                  </label>
                  {input.type === "select" ? (
                    <select
                      className="form-control"
                      id={input.name}
                      name={input.name}
                      onChange={input.onChange}
                      onBlur={input.onChange}
                      data-testid={input.dataTestId}
                    > 
                      <option value="">Select a reason</option>
                      {input.options.map((option, index) => {
                        return (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        );
                      })}
                    </select>
                  ) : input.type === "textarea" ? (
                    <textarea
                      className="form-control"
                      id={input.name}
                      name={input.name}
                      onChange={input.onChange}
                      onBlur={input.onChange}
                      data-testid={input.dataTestId}
                    ></textarea>
                  ) : (
                    <input
                      type={input.type}
                      className="form-control"
                      id={input.name}
                      name={input.name}
                      onChange={input.onChange}
                      onBlur={input.onChange}
                      data-testid={input.dataTestId}
                    />
                  )}
                  {errors[input.name] && (
                    <span
                      data-testId={input.errorMessageDataTestId}
                      style={{ ...validationMessageStyle }}
                    >
                      {errors[input.name]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <UIButton
        dataTestId="lease-cancellation-form-submit-button"
          btnText="Submit"
          onClick={() => {
            const { isValid, newErrors } = validateForm(formData, formInputs);
            if (isValid) {
              onSubmit();
            } else {
              setErrors(newErrors);
            }
          }}
          style={{ width: "100%" }}
        />
      </form>
    </div>
  );
};

export default LeaseCancellationForm;
