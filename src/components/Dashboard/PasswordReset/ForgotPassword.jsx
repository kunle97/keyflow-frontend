import { useState } from "react";
import React from "react";
import UIButton from "../UIComponents/UIButton";
import { sendPasswordResetEmail } from "../../../api/passwords";
import { validationMessageStyle } from "../../../constants";
import AlertModal from "../UIComponents/Modals/AlertModal";
import { useNavigate } from "react-router-dom";
import {
  triggerValidation,
  validateForm,
} from "../../../helpers/formValidation";
import ProgressModal from "../UIComponents/Modals/ProgressModal";
import { validEmail } from "../../../constants/rexgex";
const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(
    "A password reset link has been sent to your email address"
  );
  const [alertTitle, setAlertTitle] = useState("Password Reset Link Sent");
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = triggerValidation(
      name,
      value,
      formInputs.find((input) => input.name === name).validations
    );
    setErrors((prevErrors) => ({ ...prevErrors, [name]: newErrors[name] }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log("Form data ", formData);
    console.log("Errors ", errors);
  };

  const formInputs = [
    {
      name: "email",
      label: "Email",
      type: "email",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "Email",
      validations: {
        required: true,
        regex: validEmail,
        errorMessage: "Please enter a valid email address",
      },
      dataTestId: "email",
      errorMessageDataTestId: "email-error",
    },
  ];

  // emailjs.init(process.env.REACT_APP_EMAIL_JS_API_KEY);
  //TODO: Add form validation
  //TODO: Create PasswordResetToken
  //TODO: Send email to user with link to reset password (using SendGrid
  const navigate = useNavigate();

  const onSubmit = () => {
    setIsLoading(true);
    // data.token = makeId(100);
    let payload = {
      email: formData.email,
    };
    sendPasswordResetEmail(payload)
      .then((res) => {
        console.log(res);
        setAlertTitle("Password Reset Link Sent");
        setAlertMessage(
          `A password reset link has been sent to your email address. Please check your email and follow the instructions to reset your password`
        );
        setShowAlertModal(true);
      })
      .catch((error) => {
        console.error("Error sending password reset email", error);
        setAlertTitle("Error");
        setAlertMessage("An error occurred. Please try again");
        setShowAlertModal(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className="container">
      <ProgressModal open={isLoading} title="Sending Password Reset Link..." />
      <AlertModal
        open={showAlertModal}
        setOpen={setShowAlertModal}
        title={alertTitle}
        message={alertMessage}
        btnText="Okay"
        onClick={() => {
          if (alertTitle === "Password Reset Link Sent") {
            navigate("/dashboard/owner/login/");
          } else {
            setShowAlertModal(false);
          }
        }}
      />
      <div className="row justify-content-center">
        <div className="col-md-9 col-lg-9 col-xl-9">
          <div className="card shadow-lg o-hidden border-0 my-5">
            <div className="card-body p-0">
              <div className="row">
                <div className="col-lg-12">
                  <div className="p-5">
                    <div className="text-center">
                      <img
                        src="/assets/img/key-flow-logo-black-transparent.png"
                        className="mb-3"
                        width={200}
                        alt="logo"
                      />
                      <h4 className="mb-4">Forgot Your Password?</h4>
                    </div>
                    <form className="user">
                      {formInputs.map((input) => {
                        return (
                          <div className={`mb-3 col-md-${input.colSpan}`}>
                            <label htmlFor={input.name} className="form-label">
                              {input.label}
                            </label>
                            <input
                              className="form-control"
                              type={input.type}
                              id={input.name}
                              placeholder={input.placeholder}
                              name={input.name}
                              onChange={input.onChange}
                              onBlur={input.onChange}
                              data-testid={input.dataTestId}
                            />
                            {errors[input.name] && (
                              <span
                                data-testId={input.errorMessageDataTestId}
                                style={{ ...validationMessageStyle }}
                              >
                                {errors[input.name]}
                              </span>
                            )}
                          </div>
                        );
                      })}
                      <UIButton
                        className="btn btn-primary d-block btn-user w-100"
                        type="button"
                        btnText="Reset Password"
                        style={{ width: "100%" }}
                        onClick={() => {
                          const { isValid, newErrors } = validateForm(
                            formData,
                            formInputs
                          );
                          if (isValid) {
                            onSubmit();
                          } else {
                            setErrors(newErrors);
                          }
                        }}
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
