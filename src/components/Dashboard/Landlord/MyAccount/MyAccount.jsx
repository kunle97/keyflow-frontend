import React, { useEffect, useState } from "react";
import {
  authUser,
  token,
  uiGreen,
  uiRed,
  validationMessageStyle,
} from "../../../../constants";
import {
  deleteStripePaymentMethod,
  listStripePaymentMethods,
  setDefaultPaymentMethod,
} from "../../../../api/payment_methods";
import { getTenantDashboardData } from "../../../../api/tenants";
import { changePassword } from "../../../../api/passwords";
import { getSubscriptionPlanPrices } from "../../../../api/manage_subscriptions";
import {
  getUserStripeSubscriptions,
  updateUserData,
} from "../../../../api/auth";
import { useForm } from "react-hook-form";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import { Box, Button, Stack, Typography } from "@mui/material";
import UIButton from "../../UIComponents/UIButton";
import { useNavigate } from "react-router";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import { ListDivider } from "@mui/joy";
import UITabs from "../../UIComponents/UITabs";
import PlanChangeDialog from "./PlanChangeDialog";

const MyAccount = () => {
  const [tabPage, setTabPage] = useState(0);
  const [tabs, setTabs] = useState([
    { label: "Account" },
    { label: "Change Password" },
    { label: "Banking" },
    { label: "Payment Methods" },
    { label: "Manage Subscription" },
    { label: "Preferences" },
  ]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [plans, setPlans] = useState([]);
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseTitle, setResponseTitle] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [paymentMethodDeleteId, setPaymentMethodDeleteId] = useState(null);
  const [showDefaultConfirm, setShowDefaultConfirm] = useState(false);
  const [paymentMethodDefaultId, setPaymentMethodDefaultId] = useState(null);
  const [defaultPaymentMethod, setPrimaryPaymentMethod] = useState(null);
  const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState(null);
  const navigate = useNavigate();

  const handleSetDefaultPaymentMethod = async (paymentMethodId) => {
    getTenantDashboardData().then((res) => {
      console.log("Set as default PM: ", paymentMethodId);
      let data = {};
      data.payment_method_id = paymentMethodId;
      data.user_id = authUser.user_id;
      console.log(res.lease_agreement.id);
      //Retrieve the lease agreement
      data.lease_agreement_id = res.lease_agreement.id;
      console.log("Payload fata", data);
      setDefaultPaymentMethod(data).then((res) => {
        console.log(res);
        setResponseTitle("Alert");
        setResponseMessage("Payment method set as default");
        setShowResponseModal(true);
        //Get the payment methods for the user
        listStripePaymentMethods(`${authUser.user_id}`).then((res) => {
          console.log(res.data);
          setPaymentMethods(res.data);
        });
        navigate(0);
      });
    });
  };
  const handlePaymentMethodDelete = (paymentMethodId) => {
    console.log("Deleted PM: ", paymentMethodId);
    let data = {
      payment_method_id: paymentMethodId,
    };
    deleteStripePaymentMethod(data).then((res) => {
      console.log(res);
      setResponseTitle("Alert");
      setResponseMessage("Payment method deleted");
      setShowResponseModal(true);
      //Get the payment methods for the user
      listStripePaymentMethods(`${authUser.user_id}`).then((res) => {
        console.log(res.data);
        setPaymentMethods(res.data);
      });
    });
  };
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

  const handleTabChange = (event, newValue) => {
    setTabPage(newValue);
  };

  useEffect(() => {
    //Get the payment methods for the user
    listStripePaymentMethods(`${authUser.user_id}`).then((res) => {
      setPaymentMethods(res.data);
    });
    getSubscriptionPlanPrices().then((res) => {
      setPlans(res.products);
    });
    getUserStripeSubscriptions(authUser.user_id, token).then((res) => {
      setCurrentSubscriptionPlan(res.subscriptions);
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

      <UITabs
        style={{ marginBottom: "30px" }}
        value={tabPage}
        tabs={tabs}
        handleChange={handleTabChange}
      />

      {tabPage === 0 && (
        <div className="row basic-info-row">
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
        </div>
      )}

      {tabPage === 1 && (
        <div className="row  change-password-row ">
          <div className="col-md-12">
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
          </div>
        </div>
      )}

      {tabPage === 2 && (
        <div className="row ">
          <div className="col-md-12">
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
      )}

      {tabPage === 3 && (
        <div className="row payment-methods-row">
          <div className="col-md-6 ">
            <div className="mb-3" style={{ overflow: "auto" }}>
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
                    <ConfirmModal
                      open={showDefaultConfirm}
                      handleClose={() => setShowDefaultConfirm(false)}
                      title="Set As Default Payment Method"
                      message="Are you sure you want to set this as your default payment method?"
                      cancelBtnText="Cancel"
                      confirmBtnText="Set As Default"
                      handleConfirm={() => {
                        handleSetDefaultPaymentMethod(paymentMethodDefaultId);
                        setShowDefaultConfirm(false);
                      }}
                      handleCancel={() => setShowDefaultConfirm(false)}
                    />

                    <ConfirmModal
                      open={showDeleteConfirm}
                      handleClose={() => setShowDeleteConfirm(false)}
                      title="Delete Payment Method"
                      message="Are you sure you want to delete this payment method?"
                      cancelBtnText="Cancel"
                      confirmBtnText="Delete"
                      confirmBtnStyle={{ backgroundColor: uiRed }}
                      cancelBtnStyle={{ backgroundColor: uiGreen }}
                      handleConfirm={() => {
                        handlePaymentMethodDelete(paymentMethodDeleteId);
                        setShowDeleteConfirm(false);
                      }}
                      handleCancel={() => setShowDeleteConfirm(false)}
                    />
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
                                {paymentMethod.id === defaultPaymentMethod ? (
                                  <Typography
                                    sx={{ fontSize: "10pt", color: uiGreen }}
                                  >
                                    Default Payment Method
                                  </Typography>
                                ) : (
                                  <>
                                    <br />
                                    <UIButton
                                      sx={{
                                        color: uiGreen,
                                        textTransform: "none",
                                        display: "block",
                                        fontSize: "6pt",
                                      }}
                                      onClick={() => {
                                        setPaymentMethodDefaultId(
                                          paymentMethod.id
                                        );
                                        setShowDefaultConfirm(true);
                                      }}
                                      btnText="Set As Default"
                                    />
                                  </>
                                )}
                              </Typography>
                            </Box>
                            <Box>
                              <Button
                                sx={{ color: uiRed, textTransform: "none" }}
                                onClick={() => {
                                  setPaymentMethodDeleteId(paymentMethod.id);
                                  setShowDeleteConfirm(true);
                                }}
                              >
                                Delete
                              </Button>
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
      )}
      {tabPage === 4 && (
        <div className="row">
          <PlanChangeDialog
            open={showChangePlanModal}
            onClose={() => setShowChangePlanModal(false)}
            plans={plans}
          />
          <div className="col-md-6">
            <div className="card shadow mb-3">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      {plans.map((plan) => {
                        if (
                          plan.product_id ===
                          currentSubscriptionPlan.items.data[0].plan.product
                        ) {
                          return (
                            <Stack>
                              <h5 className="text-white">{plan.name}</h5>
                              <Stack
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                spacing={2}
                              >
                                <h4 style={{ fontSize: "25pt" }}>
                                  ${plan.price}
                                </h4>
                                <Stack
                                  direction="column"
                                  justifyContent="flex-start"
                                  alignItems="baseline"
                                  spacing={0}
                                >
                                  {currentSubscriptionPlan.items.data[0].plan
                                    .product ===
                                    process.env
                                      .REACT_APP_STRIPE_PRO_PLAN_PRODUCT_ID && (
                                    <span>per Rental Unit</span>
                                  )}
                                  <span>per month</span>
                                </Stack>
                              </Stack>
                            </Stack>
                          );
                        }
                      })}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <UIButton
                    onClick={() => {
                      setShowChangePlanModal(true);
                    }}
                    btnText="Change Plan"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;
