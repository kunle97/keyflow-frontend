import { useState } from "react";
import React from "react";
import UIButton from "../UIComponents/UIButton";
import { useForm } from "react-hook-form";
import { makeId } from "../../../helpers/utils";
import { sendPasswordResetEmail } from "../../../api/passwords";
import { validationMessageStyle } from "../../../constants";
import AlertModal from "../UIComponents/Modals/AlertModal";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";
const ForgotPassword = () => {
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(
    "A password reset link has been sent to your email address"
  );
  const [alertTitle, setAlertTitle] = useState("Password Reset Link Sent");
  // emailjs.init(process.env.REACT_APP_EMAIL_JS_API_KEY);
  //TODO: Add form validation
  //TODO: Create PasswordResetToken
  //TODO: Send email to user with link to reset password (using SendGrid
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    data.token = makeId(100);
    sendPasswordResetEmail(data).then((res) => {
      console.log(res);
      if (res.status == 200) {
        const resetLink = `${process.env.REACT_APP_HOSTNAME}/dashboard/reset-password/${data.token}`;
        console.log(resetLink);
        const emailMessage = `Click <a href=${resetLink}>here</a> to reset your password`;
        //TODO: Find a better way to send email
        emailjs
          .send(
            process.env.REACT_APP_EMAIL_JS_SERVICE_ID,
            process.env.REACT_APP_EMAIL_JS_TEMPLATE_ID,
            {
              to_email: data.email,
              subject: "KeyFlow Account Password Reset",
              html_message: emailMessage,
              reply_to: `donotreply@${process.env.REACT_APP_HOSTNAME}`,
            },
            process.env.REACT_APP_EMAIL_JS_API_KEY
          )
          .then(
            (result) => {
              console.log(result.text);
            },
            (error) => {
              console.log(error.text);
            }
          );
        setAlertTitle("Password Reset Link Sent");
        setAlertMessage(
          `A password reset link has been sent to your email address. Please check your email and follow the instructions to reset your password`
        );
        setShowAlertModal(true);
      } else {
        setAlertTitle("Error");
        setAlertMessage("Invalid Email. Please Try Again");
        setShowAlertModal(true);
      }
    });
    console.log(data);
  };
  return (
    <div className="container">
      <AlertModal
        open={showAlertModal}
        setOpen={setShowAlertModal}
        title={alertTitle}
        message={alertMessage}
        btnText="Okay"
        onClick={() => {
          if (alertTitle === "Password Reset Link Sent") {
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
                      <h4 className="mb-4">Forgot Your Password?</h4>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="user">
                      <div className="mb-3">
                        <input
                          {...register("email", {
                            required: "This is a required field",
                            pattern: {
                              value: /\S+@\S+\.\S+/,
                              message: "Please enter a valid email address",
                            },
                          })}
                          className="form-control"
                          type="email"
                          id="exampleInputEmail"
                          placeholder="Enter Email Address..."
                          name="email"
                        />
                        <span style={validationMessageStyle}>
                          {errors.email && errors.email.message}
                        </span>
                      </div>
                      <UIButton
                        className="btn btn-primary d-block btn-user w-100"
                        type="submit"
                        btnText="Reset Password"
                        style={{ width: "100%" }}
                      >
                        Reset Password
                      </UIButton>
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
