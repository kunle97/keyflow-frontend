import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import UIButton from "../UIComponents/UIButton";
import { validationMessageStyle } from "../../../constants";
import {
  resetPassword,
  validatePasswordResetToken,
} from "../../../api/passwords";
import AlertModal from "../UIComponents/Modals/AlertModal";
import {
  triggerValidation,
  validateForm,
} from "../../../helpers/formValidation";
const ResetPassword = () => {
  const { token } = useParams();
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(
    "A password reset link has been sent to your email address"
  );
  const [alertTitle, setAlertTitle] = useState("Password Reset Link Sent");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    token: token,
  });
  const [errors, setErrors] = useState({});

  const formInputs = [
    {
      name: "token",
      type: "hidden",
      value: token,
      colSpan: 12,
      onChange: (e) => {},
      validations: { required: false, errorMessage: "" },
    },
    {
      name: "new_password",
      label: "New Password",
      type: "password",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "",
      validations: {
        required: true,
        regex:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        errorMessage:
          "Your password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
      },
      dataTestId: "new_password",
      errorMessageDataTestId: "new_password-error",
    },
    {
      name: "repeat_new_password",
      label: "Repeat New Password",
      type: "password",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "",
      validations: {
        required: true,
        validate: (val) => {
          if (formData.new_password != val) {
            return "Your passwords do not match";
          }
        },
        errorMessage: "Please repeat your new password",
      },
      dataTestId: "repeat_new_password",
      errorMessageDataTestId: "repeat_new_password-error",
    },
  ];
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
  const onSubmit = () => {
    let payload = {
      token: formData.token,
      new_password: formData.new_password,
    };
    resetPassword(payload).then((res) => {
      console.log(res);
      if (res.status === 200) {
        setAlertTitle("Password Reset Successful");
        setAlertMessage(
          "Your password has been reset successfully. You can now log in with your new password"
        );
        setShowAlertModal(true);
      } else {
        setAlertTitle("Error");
        setAlertMessage(
          "An error occurred while resetting your password. Please try again"
        );
        setShowAlertModal(true);
      }
    });
  };

  //TODO:Verify token. If token is valid, show reset password form. If token is invalid, show error message
  useEffect(() => {
    // retrievePasswordResetToken
    validatePasswordResetToken(token)
      .then((res) => {
        console.log(res);
        if (res.status !== 200) {
          //if Reset token validation fails navigate to 404
          navigate("/*");
        }
      })
      .catch((error) => {
        console.error("Error validating password reset token", error);
        navigate("/*");
      });
  }, []);
  return (
    <div className="container">
      <AlertModal
        open={showAlertModal}
        setOpen={setShowAlertModal}
        title={alertTitle}
        message={alertMessage}
        btnText={alertTitle === "Password Reset Successful" ? "Login" : "Okay"}
        onClick={() => {
          if (alertTitle === "Password Reset Successful") {
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
                      <h4 className="mb-4">Reset Your Password</h4>
                    </div>
                    <form>
                      {formInputs.map((input) => {
                        return (
                          <div
                            className={` ${
                              input.type !== "hidden" && "mb-3"
                            } col-md-${input.colSpan}`}
                          >
                            <label
                              htmlFor={input.name}
                              className="form-label text-black"
                            >
                              {input.label}
                            </label>
                            <input
                              className="form-control border-0"
                              name={input.name}
                              type={input.type}
                              placeholder={input.placeholder}
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

                      <div className="">
                        <UIButton
                          className="btn btn-primary btn-sm ui-btn"
                          type="button"
                          style={{ padding: "6px 12px", width: "100%" }}
                          btnText="Update Password"
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
                      </div>
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

export default ResetPassword;
