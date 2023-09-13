import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { authUser, uiGreen } from "../../../constants";
import { listStripePaymentMethods, updateUserData } from "../../../api/api";
import { ListDivider } from "@mui/joy";
import UIButton from "../UIButton";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../constants";
import AlertModal from "../Modals/AlertModal";
const TenantMyAccount = () => {
  const [email, setEmail] = useState(authUser.email);
  const [firstName, setFirstName] = useState(authUser.first_name);
  const [lastName, setLastName] = useState(authUser.last_name);
  const [paymentMethods, setPaymentMethods] = useState([]); //Value of either the Stripe token or the Plaid token
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const navigate = useNavigate();
  const {
    register: registerAccountUpdate,
    handleSubmit: handleSubmitAccountUpdate,
    formState: { errors: errorsAccountUpdate },
  } = useForm({
    defaultValues: {
      first_name: firstName,
      last_name: lastName,
      email: email,
    },
  });
  const {
    register: registerChangePassword,
    watch: watchChangePassword,
    handleSubmit: handleSubmitChangePassword,
    formState: { errors: errorsChangePassword },
  } = useForm();

  const onSubmitUpdateAccount = (data) => {
    console.log(data);
    updateUserData(data).then((res) => {
      console.log(res);
      if (res.status === 200) {
        setResponseMessage("Account updated successfully");
        setShowResponseModal(true);
      }
    });
  };

  const onSubmitChangePassword = (data) => {
    console.log(data);
  };

  useEffect(() => {
    //Get the payment methods for the user
    listStripePaymentMethods(`${authUser.id}`).then((res) => {
      console.log(res.data);
      setPaymentMethods(res.data);
    });
  }, []);

  return (
    <div className="container">
      <AlertModal
        title="Success"
        message={responseMessage}
        open={showResponseModal}
        btnText="Okay"
        handleClose={() => setShowResponseModal(false)}
        onClick={() => setShowResponseModal(false)}
      />
      <h3 className="text-white mb-4">My Account</h3>
      <div className="row mb-3">
        <div className="col">
          <div className="row">
            <div className="col">
              <div className="card shadow mb-3">
                <div className="card-body">
                  <form
                    onSubmit={handleSubmitAccountUpdate(onSubmitUpdateAccount)}
                  >
                    {" "}
                    <div className="row">
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="first_name"
                          >
                            First Name
                          </label>
                          <input
                            {...registerAccountUpdate("first_name", {
                              required: "This is a required field",
                            })}
                            className="form-control"
                            type="text"
                            id="first_name"
                            placeholder="John"
                            name="first_name"
                            style={{
                              borderStyle: "none",
                              color: "rgb(255,255,255)",
                            }}
                          />
                          <span style={validationMessageStyle}>
                            {errorsAccountUpdate.first_name &&
                              errorsAccountUpdate.first_name.message}
                          </span>
                        </div>
                      </div>
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="last_name"
                          >
                            Last Name
                          </label>
                          <input
                            {...registerAccountUpdate("last_name", {
                              required: "This is a required field",
                            })}
                            className="form-control"
                            type="text"
                            id="last_name"
                            placeholder="Doe"
                            name="last_name"
                            style={{
                              borderStyle: "none",
                              color: "rgb(255,255,255)",
                            }}
                          />
                          <span style={validationMessageStyle}>
                            {errorsAccountUpdate.last_name &&
                              errorsAccountUpdate.last_name.message}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="email"
                          >
                            Email Address
                          </label>
                          <input
                            {...registerAccountUpdate("email", {
                              required: "This is a required field",
                              pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Please enter a valid email",
                              },
                            })}
                            className="form-control"
                            type="email"
                            id="email"
                            placeholder="user@example.com"
                            style={{
                              borderStyle: "none",
                              color: "rgb(255,255,255)",
                            }}
                          />
                          <span style={validationMessageStyle}>
                            {errorsAccountUpdate.email &&
                              errorsAccountUpdate.email.message}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <button
                        className="btn btn-primary btn-sm ui-btn"
                        type="submit"
                        style={{ padding: "6px 12px" }}
                      >
                        Save Settings
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <h5 className="text-primary mb-2 card-header-text">
                Change Password
              </h5>
              <div className="card shadow mb-3">
                <div className="card-body">
                  <form
                    onSubmit={handleSubmitChangePassword(
                      onSubmitChangePassword
                    )}
                  >
                    <div className="row">
                      <div className="col-12">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="username"
                          >
                            Current Password
                          </label>
                          <input
                            {...registerChangePassword("password", {
                              required: "This is a required field",
                            })}
                            className="form-control border-0"
                            type="password"
                          />
                          <span style={validationMessageStyle}>
                            {errorsChangePassword.password &&
                              errorsChangePassword.password.message}
                          </span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="email"
                          >
                            Retype-Current Password
                          </label>
                          <input
                            {...registerChangePassword("repeat_password", {
                              required: "This is a required field",
                              validate: (val) => {
                                if (watchChangePassword("password") != val) {
                                  return "Your passwords do not match";
                                }
                              },
                            })}
                            className="form-control border-0"
                            type="password"
                          />
                          <span style={validationMessageStyle}>
                            {errorsChangePassword.repeat_password &&
                              errorsChangePassword.repeat_password.message}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="first_name"
                          >
                            New Password
                          </label>
                          <input
                            {...registerChangePassword("new_password", {
                              required: "This is a required field",
                              minLength: {
                                value: 8,
                                message:
                                  "Password must be at least 8 characters",
                              },
                              pattern: {
                                value:
                                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                                message:
                                  "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                              },
                            })}
                            className="form-control border-0"
                            type="password"
                          />
                          <span style={validationMessageStyle}>
                            {errorsChangePassword.new_password &&
                              errorsChangePassword.new_password.message}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <button
                        className="btn btn-primary btn-sm ui-btn"
                        type="submit"
                        style={{ padding: "6px 12px" }}
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-6 ">
              <div className="mb-3" style={{ overflow: "auto" }}>
                <h5
                  className="text-primary  my-1 card-header-text"
                  style={{ float: "left" }}
                >
                  Payment Methods
                </h5>
                <UIButton
                  style={{ float: "right" }}
                  onClick={() => {
                    navigate("/dashboard/tenant/add-payment-method");
                  }}
                  btnText="Add New"
                />
              </div>
              <div className="card shadow mb-3">
                <div className="card-body">
                  <form>
                    <div className="row">
                      {paymentMethods.map((paymentMethod) => {
                        return (
                          <div className="col-sm-12 col-md-12 col-lg-12 mb-2">
                            <Box className="mb-3" sx={{ display: "flex" }}>
                              <Box sx={{ flex: "2" }}>
                                <Typography className="text-white">
                                  {paymentMethod.card.brand} ending in{" "}
                                  {paymentMethod.card.last4}
                                </Typography>
                                <Typography
                                  sx={{ fontSize: "10pt" }}
                                  className="text-white"
                                >
                                  Expires {paymentMethod.card.exp_month}/
                                  {paymentMethod.card.exp_year}
                                  {/* <span style={{ color: uiGreen }}>
                                   {" "} - {" "} Primary Method
                                  </span> */}
                                </Typography>
                              </Box>
                              <Box>
                                <Button sx={{ color: uiGreen }}>Edit</Button>
                              </Box>
                            </Box>
                            <ListDivider sx={{ color: "white" }} />
                          </div>
                        );
                      })}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantMyAccount;
