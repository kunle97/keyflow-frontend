import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import UIButton from "../UIComponents/UIButton";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../constants";
import {
  resetPassword,
  validatePasswordResetToken,
} from "../../../api/api";
import { useEffect } from "react";
import AlertModal from "../UIComponents/Modals/AlertModal";
const ResetPassword = () => {
  const { token } = useParams();
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(
    "A password reset link has been sent to your email address"
  );
  const [alertTitle, setAlertTitle] = useState("Password Reset Link Sent");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      token: token,
    },
  });
  const onSubmit = (data) => {
    console.log(data);
    resetPassword(data).then((res) => {
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
    validatePasswordResetToken(token).then((res) => {
      console.log(res);
      if (res.status !== 200) {
        //if Reset token validation fails navigate to 404
        navigate("/*");
      }
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
            navigate("/dashboard/landlord/login/");
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
                        src="/assets/img/key-flow-logo-white-transparent.png"
                        className="mb-3"
                        width={200}
                        alt="logo"
                      />
                      <h4 className="mb-4">Reset Your Password</h4>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <input
                        type="hidden"
                        value={token}
                        name="token"
                        {...register("token")}
                      />
                      <div className="row">
                        <div className="col-12">
                          <div className="mb-3">
                            <label
                              className="form-label text-white"
                              htmlFor="username"
                            >
                              <strong>New Password</strong>
                            </label>
                            <input
                              {...register("new_password", {
                                required: "This is a required field",
                              })}
                              className="form-control border-0"
                              type="password"
                            />
                            <span style={validationMessageStyle}>
                              {errors.new_password &&
                                errors.new_password.message}
                            </span>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="mb-3">
                            <label
                              className="form-label text-white"
                              htmlFor="email"
                            >
                              <strong>Retype New Password</strong>
                            </label>
                            <input
                              {...register("repeat_new_password", {
                                required: "This is a required field",
                                validate: (val) => {
                                  if (watch("new_password") != val) {
                                    return "Your passwords do not match";
                                  }
                                },
                              })}
                              className="form-control border-0"
                              type="password"
                            />
                            <span style={validationMessageStyle}>
                              {errors.repeat_new_password &&
                                errors.repeat_new_password.message}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <UIButton
                          className="btn btn-primary btn-sm ui-btn"
                          type="submit"
                          style={{ padding: "6px 12px", width: "100%" }}
                          btnText="Update Password"
                        >
                          Update Password
                        </UIButton>
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
