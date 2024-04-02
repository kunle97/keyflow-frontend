import React from "react";
import UIButton from "../../../UIComponents/UIButton";
import { useState } from "react";
import {
  authUser,
  validationMessageStyle,
} from "../../../../../constants";
import {
  createLeaseCancellationRequest,
} from "../../../../../api/lease_cancellation_requests";
import {
  triggerValidation,
  validateForm,
} from "../../../../../helpers/formValidation";
const LeaseCancellationForm = (props) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [steps, setSteps] = useState([
    "Reason for Cancellation",
    "Desired Move Out Date",
    "Comments",
    "Submit",
  ]);

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
    console.log("Form data ", formData);
    console.log("Errors ", errors);
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
        regex: /^[a-zA-Z0-9\s]*$/,
        errorMessage: "Please select a reason for the cancellation",
      },
      dataTestId: "reason",
      errorMessageDataTestId: "reason-error",
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
        regex: /^(\d{4})-(\d{2})-(\d{2})$/,
      },
      dataTestId: "move-out-date",
      errorMessageDataTestId: "move-out-date-error",
    },
    {
      name: "comments",
      label: "Comments",
      type: "textarea",
      colSpan: 12,
      onChange: (e) => handleChange(e),

      validations: {
        required: false,
        errorMessage: "Please enter comments",
      },
      dataTestId: "comments",
      errorMessageDataTestId: "comments-error",
    },
  ];

  const onSubmit = () => {
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
          props.setAlertModalMessage(
            `Error creating lease cancellation request: ${res.response?.data?.message}`
          );
          props.setShowAlertModal(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      {" "}
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
                      data-testid={input.dataTestId}
                    >
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
