import React, { useEffect, useState } from "react";
import { authUser, validationMessageStyle } from "../../constants";
import {
  changePassword,
  listStripePaymentMethods,
  updateUserData,
} from "../../api/api";
import { set, useForm } from "react-hook-form";
import AlertModal from "./UIComponents/Modals/AlertModal";
const MyAccount = () => {
  const [paymentMethods, setPaymentMethods] = useState(null); //Value of either the Stripe token or the Plaid token
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseTitle, setResponseTitle] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);

  const {
    register: registerAccountUpdate,
    handleSubmit: handleSubmitAccountUpdate,
    formState: { errors: accountUpdateErrors },
  } = useForm({
    defaultValues: {
      username: authUser.username,
      email: authUser.email,
      first_name: authUser.first_name,
      last_name: authUser.last_name,
    },
  });

  const {
    register: registerPasswordChange,
    watch: watchPasswordChange,
    handleSubmit: handleSubmitPasswordChange,
    formState: { errors: passwordChangeErrors },
  } = useForm();

  const onAccountUpdateSubmit = (data) => {
    //Create a data object to send to the backend
    updateUserData(data).then((res) => {
      console.log(res);
      if (res.status === 200) {
        setResponseTitle("Success");
        setResponseMessage("Account updated successfully");
        setShowResponseModal(true);
      }
    });
  };

  const onSubmitChangePassword = (data) => {
    console.log(data);
    changePassword(data).then((res) => {
      console.log(res);
      if (res.status === 200) {
        setResponseTitle("Success");
        setResponseMessage("Password changed successfully");
        setShowResponseModal(true);
      } else {
        setResponseTitle("Error");
        setResponseMessage("Error changeing your password");
        setShowResponseModal(true);
      }
    });
  };

  useEffect(() => {
    //Get the payment methods for the user
    listStripePaymentMethods(`${authUser.id}`).then((res) => {
      console.log(res);
      setPaymentMethods(res.data);
    });
  }, []);

  return (
    <div className="container">
      <AlertModal
        title={responseTitle}
        message={responseMessage}
        open={showResponseModal}
        btnText="Okay"
        handleClose={() => setShowResponseModal(false)}
        onClick={() => setShowResponseModal(false)}
      />
      <h3 className="text-white mb-4">My Account</h3>
      <div className="row mb-3">
        <div className="row">
          <div className="col-md-12">
            <div className="card shadow mb-3">
              <div className="card-body">
                <form
                  onSubmit={handleSubmitAccountUpdate(onAccountUpdateSubmit)}
                >
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label
                          className="form-label text-white"
                          htmlFor="username"
                        >
                          <strong>Username</strong>
                        </label>
                        <input
                          {...registerAccountUpdate("username", {
                            required: "This is a required field",
                          })}
                          className="form-control"
                          type="text"
                          id="username"
                          placeholder="Username"
                          name="username"
                          style={{
                            borderStyle: "none",
                            color: "rgb(255,255,255)",
                          }}
                        />
                        <span style={validationMessageStyle}>
                          {accountUpdateErrors.username &&
                            accountUpdateErrors.username.message}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label
                          className="form-label text-white"
                          htmlFor="email"
                        >
                          <strong>Email Address</strong>
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
                          name="email"
                          style={{
                            borderStyle: "none",
                            color: "rgb(255,255,255)",
                          }}
                        />
                        <span style={validationMessageStyle}>
                          {accountUpdateErrors.email &&
                            accountUpdateErrors.email.message}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label
                          className="form-label text-white"
                          htmlFor="first_name"
                        >
                          <strong>First Name</strong>
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
                          {accountUpdateErrors.first_name &&
                            accountUpdateErrors.first_name.message}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label
                          className="form-label text-white"
                          htmlFor="last_name"
                        >
                          <strong>Last Name</strong>
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
                          {accountUpdateErrors.last_name &&
                            accountUpdateErrors.last_name.message}
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
          <div className="col-md-12">
            <h6 className="text-primary fw-bold m-0 card-header-text">
              Change Password
            </h6>
            <div className="card shadow mb-3">
              <div className="card-body">
                <form
                  onSubmit={handleSubmitPasswordChange(onSubmitChangePassword)}
                >
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-3">
                        <label
                          className="form-label text-white"
                          htmlFor="username"
                        >
                          <strong>Current Password</strong>
                        </label>
                        <input
                          {...registerPasswordChange("old_password", {
                            required: "This is a required field",
                          })}
                          className="form-control border-0"
                          type="password"
                        />
                        <span style={validationMessageStyle}>
                          {passwordChangeErrors.old_password &&
                            passwordChangeErrors.old_password.message}
                        </span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-3">
                        <label
                          className="form-label text-white"
                          htmlFor="email"
                        >
                          <strong>Retype-Current Password</strong>
                        </label>
                        <input
                          {...registerPasswordChange("repeat_password", {
                            required: "This is a required field",
                            validate: (val) => {
                              if (watchPasswordChange("old_password") != val) {
                                return "Your passwords do not match";
                              }
                            },
                          })}
                          className="form-control border-0"
                          type="password"
                        />
                        <span style={validationMessageStyle}>
                          {passwordChangeErrors.repeat_password &&
                            passwordChangeErrors.repeat_password.message}
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
                          <strong>New Password</strong>
                        </label>
                        <input
                          {...registerPasswordChange("new_password", {
                            required: "This is a required field",
                            minLength: {
                              value: 8,
                              message: "Password must be at least 8 characters",
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
                          {passwordChangeErrors.new_password &&
                            passwordChangeErrors.new_password.message}
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
            <div className="card shadow mb-3">
              <div className="card-header py-3">
                <h6 className="text-primary fw-bold m-0 card-header-text">
                  Banking Information
                </h6>
              </div>
              <div className="card-body">
                <form>
                  <div className="row">
                    <div className="col">
                      <div className="mb-3">
                        <label
                          className="form-label text-white"
                          htmlFor="username"
                        >
                          <strong>Account Number</strong>
                        </label>
                        <p className="text-white">****9010</p>
                      </div>
                      <div className="mb-3">
                        <label
                          className="form-label text-white"
                          htmlFor="first_name"
                        >
                          <strong>Account Type</strong>
                        </label>
                        <p className="text-white">Checking</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="mb-3">
                        <label
                          className="form-label text-white"
                          htmlFor="email"
                        >
                          <strong>Routing Number</strong>
                          <br />
                        </label>
                        <p className="text-white">****8990</p>
                      </div>
                      <div className="mb-3">
                        <label
                          className="form-label text-white"
                          htmlFor="last_name"
                        >
                          <strong>Bank Setup</strong>
                        </label>
                        <button
                          className="btn btn-primary ui-btn d-block"
                          type="button"
                        >
                          Manage Payments
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h5 className="text-primary  mb-2 card-header-text">
            Payment Methods
          </h5>
          <div className="card shadow mb-3">
            <div className="card-body">
              <form>
                <div className="row">
                  {/* {paymentMethods.map((paymentMethod) => {
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

                            </Typography>
                          </Box>
                          <Box>
                            <Button sx={{ color: uiGreen }}>Edit</Button>
                          </Box>
                        </Box>
                        <ListDivider sx={{ color: "white" }} />
                      </div>
                    );
                  })} */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
