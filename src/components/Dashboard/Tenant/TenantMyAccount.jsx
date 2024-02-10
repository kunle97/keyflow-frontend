import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { authUser, uiGreen, uiRed } from "../../../constants";
import {
  deleteStripePaymentMethod,
  listStripePaymentMethods,
  setDefaultPaymentMethod,
} from "../../../api/payment_methods";
import { getTenantDashboardData } from "../../../api/tenants";
import { changePassword } from "../../../api/passwords";
import { getStripeSubscription, updateUserData } from "../../../api/auth";
import { ListDivider } from "@mui/joy";
import UIButton from "../UIComponents/UIButton";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../constants";
import AlertModal from "../UIComponents/Modals/AlertModal";
import ConfirmModal from "../UIComponents/Modals/ConfirmModal";
import UploadDialog from "../UIComponents/Modals/UploadDialog/UploadDialog";
import { retrieveFilesBySubfolder } from "../../../api/file_uploads";
import useScreen from "../../../hooks/useScreen";
const TenantMyAccount = () => {
  const { isMobile } = useScreen();
  const [email, setEmail] = useState(authUser.email);
  const [firstName, setFirstName] = useState(authUser.first_name);
  const [lastName, setLastName] = useState(authUser.last_name);
  const [paymentMethods, setPaymentMethods] = useState([]); //Value of either the Stripe token or the Plaid token
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseTitle, setResponseTitle] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [paymentMethodDeleteId, setPaymentMethodDeleteId] = useState(null);
  const [showDefaultConfirm, setShowDefaultConfirm] = useState(false);
  const [paymentMethodDefaultId, setPaymentMethodDefaultId] = useState(null);
  const [leaseAgreement, setLeaseAgreement] = useState(null);
  const [defaultPaymentMethod, setPrimaryPaymentMethod] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
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
        setResponseMessage("Error changing your password");
        setShowResponseModal(true);
      }
    });
  };
  const handleSetDefaultPaymentMethod = async (paymentMethodId) => {
    getTenantDashboardData().then((res) => {
      console.log("Set as default PM: ", paymentMethodId);
      let data = {};
      data.payment_method_id = paymentMethodId;
      data.user_id = authUser.id;
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
        listStripePaymentMethods(`${authUser.id}`).then((res) => {
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
      listStripePaymentMethods(`${authUser.id}`).then((res) => {
        console.log(res.data);
        setPaymentMethods(res.data);
      });
    });
  };

  useEffect(() => {
    //Get the payment methods for the user
    listStripePaymentMethods(`${authUser.id}`).then((res) => {
      console.log(res.data);
      setPaymentMethods(res.data);
    });
    //Retrieve the users lease agreemetn
    getTenantDashboardData().then((res) => {
      console.log("Dashboard datrat ", res);
      setLeaseAgreement(res.lease_agreement);
      const subscription_id = res.lease_agreement.stripe_subscription_id;
      getStripeSubscription(subscription_id).then((res) => {
        console.log("Subscription", res);
        setPrimaryPaymentMethod(res.default_payment_method);
      });
    });
    retrieveFilesBySubfolder("user_profile_picture", authUser.id).then(
      (res) => {
        setProfilePictureFile(res.data[0]);
      }
    );
  }, []);

  return (
    <div className="container">
      <UploadDialog
        open={uploadDialogOpen}
        setOpen={setUploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        subfolder={"user_profile_picture"}
        acceptedFileTypes={[".png", ".jpg", ".jpeg"]}
      />
      <AlertModal
        title={responseTitle}
        message={responseMessage}
        open={showResponseModal}
        btnText="Okay"
        handleClose={() => setShowResponseModal(false)}
        onClick={() => setShowResponseModal(false)}
      />
      <Stack
        direction={"column"}
        justifyContent="center"
        alignItems="center"
        spacing={1}
        sx={{ marginBottom: "30px" }}
      >
        <div
          style={{
            borderRadius: "50%",
            overflow: "hidden",
            width: isMobile ? "100px" : "200px",
            height: isMobile ? "100px" : "200px",
            margin: "15px auto",
          }}
        >
          <img
            style={{ height: "100%" }}
            src={
              profilePictureFile
                ? profilePictureFile.file
                : "/assets/img/avatars/default-user-profile-picture.png"
            }
          />
        </div>
        <Button
          btnText="Change Profile Picture"
          onClick={() => setUploadDialogOpen(true)}
          variant="text"
          sx={{
            color: uiGreen,
            textTransform: "none",
            fontSize: "12pt",
            margin: "0 10px",
          }}
        >
          Change Profile Picture
        </Button>
        <h4 style={{ width: "100%", textAlign: "center" }}>
          {authUser.first_name} {authUser.last_name}
        </h4>
        <div style={{ width: "100%", textAlign: "center" }}>
          <span className="text-muted">{authUser.email}</span>
        </div>
      </Stack>
      <div className="row mb-3">
        <div className="col">
          <div className="row">
            <div className="col-md-12">
              <div className="card shadow mb-3">
                <div className="card-body">
                  <h5 className="text-black mb-2 ">Basic Information</h5>
                  <form
                    onSubmit={handleSubmitAccountUpdate(onSubmitUpdateAccount)}
                  >
                    {" "}
                    <div className="row">
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label text-black"
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
                            className="form-label text-black"
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
                            className="form-label text-black"
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
              <div className="card shadow mb-3">
                <div className="card-body">
                  <h5 className="text-black mb-2 ">Change Password</h5>
                  <form
                    onSubmit={handleSubmitChangePassword(
                      onSubmitChangePassword
                    )}
                  >
                    <div className="row">
                      <div className="col-12">
                        <div className="mb-3">
                          <label
                            className="form-label text-black"
                            htmlFor="username"
                          >
                            Current Password
                          </label>
                          <input
                            {...registerChangePassword("old_password", {
                              required: "This is a required field",
                            })}
                            className="form-control border-0"
                            type="password"
                          />
                          <span style={validationMessageStyle}>
                            {errorsChangePassword.old_password &&
                              errorsChangePassword.old_password.message}
                          </span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <label
                            className="form-label text-black"
                            htmlFor="email"
                          >
                            Retype-Current Password
                          </label>
                          <input
                            {...registerChangePassword("repeat_password", {
                              required: "This is a required field",
                              validate: (val) => {
                                if (
                                  watchChangePassword("old_password") != val
                                ) {
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
                            className="form-label text-black"
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
              <div className="card shadow mb-3">
                <div className="card-body">
                  <div className="mb-3" style={{ overflow: "auto" }}>
                    <h5 className="text-black  my-1 " style={{ float: "left" }}>
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
                      <div style={{ maxHeight: "277px", overflowY: "auto" }}>
                        {paymentMethods.map((paymentMethod) => {
                          return (
                            <div className="col-sm-12 col-md-12 col-lg-12 mb-2">
                              <Box className="mb-3" sx={{ display: "flex" }}>
                                <Box sx={{ flex: "2" }}>
                                  <Typography className="text-black">
                                    {paymentMethod.card.brand} ending in{" "}
                                    {paymentMethod.card.last4}
                                  </Typography>
                                  <Typography
                                    sx={{ fontSize: "10pt" }}
                                    className="text-black"
                                  >
                                    Expires {paymentMethod.card.exp_month}/
                                    {paymentMethod.card.exp_year}
                                    {paymentMethod.id ===
                                    defaultPaymentMethod ? (
                                      <Typography
                                        sx={{
                                          fontSize: "10pt",
                                          color: uiGreen,
                                        }}
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
                                      setPaymentMethodDeleteId(
                                        paymentMethod.id
                                      );
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
