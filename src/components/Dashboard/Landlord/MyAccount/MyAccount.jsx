import React, { useEffect, useState } from "react";
import {
  authUser,
  token,
  uiGreen,
  uiGrey,
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
  getOwnerUserData,
  getUserStripeSubscriptions,
  updateUserData,
} from "../../../../api/auth";
import { useForm } from "react-hook-form";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import UIButton from "../../UIComponents/UIButton";
import { useNavigate } from "react-router";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import { ListDivider } from "@mui/joy";
import UITabs from "../../UIComponents/UITabs";
import PlanChangeDialog from "./PlanChangeDialog";
import { faker } from "@faker-js/faker";
import UploadDialog from "../../UIComponents/Modals/UploadDialog/UploadDialog";
import { authenticatedInstance } from "../../../../api/api";
import { retrieveFilesBySubfolder } from "../../../../api/file_uploads";
import UISwitch from "../../UIComponents/UISwitch";
import useScreen from "../../../../hooks/useScreen";
import UIPreferenceRow from "../../UIComponents/UIPreferenceRow";
import {
  triggerValidation,
  validateForm,
} from "../../../../helpers/formValidation";
import { defaultLandlordAccountPreferences } from "../../../../constants/landlord_account_preferences";
import { getOwnerPreferences, updateOwnerPreferences } from "../../../../api/owners";
import { syncPreferences } from "../../../../helpers/preferences";
const MyAccount = () => {
  const { isMobile } = useScreen();
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
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [ownerPreferences, setOwnerPreferences] = useState([]);
  const navigate = useNavigate();
  const [accountFormData, setAccountFormData] = useState({
    username: authUser.username,
    email: authUser.email,
    first_name: authUser.first_name,
    last_name: authUser.last_name,
  });
  const [passwordFormData, setPasswordFormData] = useState({
    old_password: "",
    new_password: "",
    repeat_password: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const handleChange = (e, formData, setFormData, formInputs, setErrors) => {
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

  const accountFormInputs = [
    {
      name: "first_name",
      label: "First Name",
      type: "text",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          accountFormData,
          setAccountFormData,
          accountFormInputs,
          setErrors
        ),
      placeholder: "First Name",
      validations: {
        required: true,
        regex: /^[a-zA-Z0-9\s]*$/,
        errorMessage: "Please enter a valid first name",
      },
      dataTestId: "first-name",
      errorMessageDataTestId: "first-name-error",
    },
    {
      name: "last_name",
      label: "Last Name",
      type: "text",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          accountFormData,
          setAccountFormData,
          accountFormInputs,
          setErrors
        ),
      placeholder: "Last Name",
      validations: {
        required: true,
        regex: /^[a-zA-Z0-9\s]*$/,
        errorMessage: "Please enter a valid last name",
      },
      dataTestId: "last-name",
      errorMessageDataTestId: "last-name-error",
    },
    {
      name: "username",
      label: "Username",

      type: "text",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          accountFormData,
          setAccountFormData,
          accountFormInputs,
          setErrors
        ),
      placeholder: "Username",
      validations: {
        required: true,
        regex: /^[a-zA-Z0-9\s]*$/,
        errorMessage: "Please enter a valid username",
      },
      dataTestId: "username",
      errorMessageDataTestId: "username-error",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      colSpan: 6,
      onChange: (e) =>
        handleChange(
          e,
          accountFormData,
          setAccountFormData,
          accountFormInputs,
          setErrors
        ),
      placeholder: "Email",
      validations: {
        required: true,
        regex: /^[\w.!]+@[a-zA-Z_]+\.[a-zA-Z]{2,}$/,
        errorMessage: "Please enter a valid email",
      },
      dataTestId: "email",
      errorMessageDataTestId: "email-error",
    },
  ];
  const passwordFormInputs = [
    {
      name: "old_password",
      label: "Current Password",
      type: "password",
      colSpan: 12,
      onChange: (e) =>
        handleChange(
          e,
          passwordFormData,
          setPasswordFormData,
          passwordFormInputs,
          setPasswordErrors
        ),
      placeholder: "Current Password",
      validations: {
        required: true,
        regex: /^[a-zA-Z0-9\s!@#$%^&*()-_=+[\]{};:'",.<>/?`~]*$/,
        errorMessage: "Please enter your current password",
      },
      dataTestId: "current-password",
      errorMessageDataTestId: "current-password-error",
    },
    {
      name: "new_password",
      label: "New Password",
      type: "password",
      colSpan: 12,
      onChange: (e) =>
        handleChange(
          e,
          passwordFormData,
          setPasswordFormData,
          passwordFormInputs,
          setPasswordErrors
        ),
      placeholder: "New Password",
      validations: {
        required: true,
        regex:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        errorMessage:
          "Your password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
      },
      dataTestId: "new-password",
      errorMessageDataTestId: "new-password-error",
    },
    {
      name: "repeat_password",
      label: "Retype New Password",
      type: "password",
      colSpan: 12,
      onChange: (e) =>
        handleChange(
          e,
          passwordFormData,
          setPasswordFormData,
          passwordFormInputs,
          setPasswordErrors
        ),
      placeholder: "Retype New Password",
      validations: {
        required: true,
        errorMessage: "New passwords must match",
        validate: (val) => {
          if (passwordFormData.new_password != val) {
            return "Your passwords do not match";
          }
        },
      },
      dataTestId: "repeat-password",
      errorMessageDataTestId: "repeat-password-error",
    },
  ];

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

  const onAccountUpdateSubmit = () => {
    //Create a data object to send to the backend
    updateUserData(accountFormData).then((res) => {
      console.log(res);
      if (res.status === 200) {
        setResponseTitle("Success");
        setResponseMessage("Account updated successfully");
        setShowResponseModal(true);
      }
    });
  };

  const onSubmitChangePassword = () => {
    changePassword(passwordFormData).then((res) => {
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

  //Create a function that handle the change of the value of a preference
  const handlePreferenceChange = (e, inputType, preferenceName, valueName) => {
    if (inputType === "switch") {
      console.log(e.target.checked);
      //Update the value of the preference and use setOwnerPreferences to update the state
      let newOwnerPreferences = ownerPreferences.map((preference) => {
        if (preference.name === preferenceName) {
          preference.values.map((value) => {
            if (value.name === valueName) {
              value.value = e.target.checked;
            }
          });
        }
        return preference;
      }
      );
      console.log("New Owner Preferences ", newOwnerPreferences);
      setOwnerPreferences(newOwnerPreferences);
      let payload = {
        preferences: newOwnerPreferences
      }
      updateOwnerPreferences(payload).then((res) => {
        console.log(res);
      });
    } else {
      console.log(e.target.value);
    }
  };

  useEffect(() => {
    //Get the payment methods for the user
    listStripePaymentMethods(`${authUser.id}`).then((res) => {
      setPaymentMethods(res.data);
    });
    getSubscriptionPlanPrices().then((res) => {
      setPlans(res.products);
    });
    getUserStripeSubscriptions(authUser.id, token).then((res) => {
      setCurrentSubscriptionPlan(res.subscriptions);
    });
    retrieveFilesBySubfolder("user_profile_picture", authUser.id).then(
      (res) => {
        setProfilePictureFile(res.data[0]);
      }
    );
    getOwnerPreferences().then((res) => {
      console.log("PREfffekwf", res);
      setOwnerPreferences(res.preferences);
    });
    syncPreferences();
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
          <a href={`mailto:${authUser.email}`} className="text-muted">
            {authUser.email}
          </a>
        </div>
      </Stack>

      <UITabs
        style={{ marginBottom: "30px" }}
        value={tabPage}
        tabs={tabs}
        handleChange={handleTabChange}
      />

      {tabPage === 0 && (
        <>
          <UploadDialog
            open={uploadDialogOpen}
            setOpen={setUploadDialogOpen}
            onClose={() => setUploadDialogOpen(false)}
            subfolder={"user_profile_picture"}
            acceptedFileTypes={[".png", ".jpg", ".jpeg"]}
          />
          <div className="row basic-info-row">
            <div className="col-md-12">
              <div className="card shadow mb-3">
                <div className="card-body">
                  <form>
                    <div className="row">
                      {accountFormInputs.map((input, index) => {
                        return (
                          <div
                            className={`col-md-${input.colSpan} mb-3`}
                            key={index}
                            data-testId={`${input.dataTestId}`}
                          >
                            <label
                              className="form-label text-black"
                              htmlFor={input.name}
                            >
                              {input.label}
                            </label>

                            <input
                              style={{
                                background: uiGrey,
                              }}
                              className="form-control"
                              type={input.type}
                              name={input.name}
                              onChange={input.onChange}
                              onBlur={input.onChange}
                              value={accountFormData[input.name]}
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
                    </div>
                    <div className="mb-3">
                      <UIButton
                        style={{ float: "right" }}
                        onClick={() => {
                          const { isValid, newErrors } = validateForm(
                            accountFormData,
                            accountFormInputs
                          );
                          if (isValid) {
                            onAccountUpdateSubmit();
                          } else {
                            setErrors(newErrors);
                          }
                        }}
                        btnText="Update Account "
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {tabPage === 1 && (
        <div className="row  change-password-row ">
          <div className="col-md-12">
            <div className="card shadow mb-3">
              <div className="card-body">
                <form>
                  {passwordFormInputs.map((input, index) => {
                    return (
                      <div
                        className={`col-md-${input.colSpan} mb-3`}
                        key={index}
                        data-testId={`${input.dataTestId}`}
                      >
                        <label
                          className="form-label text-black"
                          htmlFor={input.name}
                        >
                          {input.label}
                        </label>
                        <input
                          style={{
                            background: uiGrey,
                          }}
                          className="form-control"
                          type={input.type}
                          name={input.name}
                          onChange={input.onChange}
                          onBlur={input.onChange}
                          value={passwordFormData[input.name]}
                        />
                        {passwordErrors[input.name] && (
                          <span
                            data-testId={input.errorMessageDataTestId}
                            style={{ ...validationMessageStyle }}
                          >
                            {passwordErrors[input.name]}
                          </span>
                        )}
                      </div>
                    );
                  })}
                  <div className="mb-3">
                    <UIButton
                      style={{ float: "right" }}
                      onClick={() => {
                        const { isValid, newErrors } = validateForm(
                          passwordFormData,
                          passwordFormInputs
                        );
                        if (isValid) {
                          onSubmitChangePassword();
                        } else {
                          setPasswordErrors(newErrors);
                        }
                      }}
                      btnText="Change Password"
                    />
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
              <div className="card-body">
                <form>
                  <div className="row">
                    <div className="col">
                      <div className="mb-3">
                        <label
                          className="form-label text-black"
                          htmlFor="username"
                        >
                          <strong>Account Number</strong>
                        </label>
                        <p className="text-black">****9010</p>
                      </div>
                      <div className="mb-3">
                        <label
                          className="form-label text-black"
                          htmlFor="first_name"
                        >
                          <strong>Account Type</strong>
                        </label>
                        <p className="text-black">Checking</p>
                      </div>
                    </div>
                    <div className="col">
                      <div className="mb-3">
                        <label
                          className="form-label text-black"
                          htmlFor="email"
                        >
                          <strong>Routing Number</strong>
                          <br />
                        </label>
                        <p className="text-black">****8990</p>
                      </div>
                      <div className="mb-3">
                        <label
                          className="form-label text-black"
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
        <>
          <div className="mb-3" style={{ overflow: "auto" }}>
            <UIButton
              style={{ float: "right" }}
              onClick={() => {
                navigate("/dashboard/tenant/add-payment-method");
              }}
              btnText="Add New"
            />
          </div>
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
                <div className="col-sm-12 col-md-6  mb-3">
                  <div className="card" style={{ width: "100%" }}>
                    <div className="card-body">
                      <Box sx={{ display: "flex" }}>
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
                                    setPaymentMethodDefaultId(paymentMethod.id);
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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
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
                              <h5 className="text-black">{plan.name}</h5>
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
      {tabPage === 5 && (
        <div className={isMobile && "container-fluid"}>
          <div className="row">
            <div className="col-md-3">
              <ul className="list-group">
                <li className="list-group-item">
                  <h5>Notifications</h5>
                </li>
              </ul>
            </div>
            <div className="col-md-9">
              <List
                sx={{
                  width: "100%",
                  // maxWidth: 360,
                }}
              >
                {ownerPreferences &&
                  ownerPreferences.map((preference) => {
                    return (
                      <ListItem
                        style={{
                          borderRadius: "10px",
                          background: "white",
                          margin: "10px 0",
                          boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ width: "100%" }}
                        >
                          <ListItemText
                            primary={
                              <Typography sx={{ color: "black" }}>
                                {preference.label}
                              </Typography>
                            }
                            secondary={
                              <React.Fragment>
                                {preference.description}
                              </React.Fragment>
                            }
                          />
                          {preference.values.map((value) => {
                            return (
                              <>
                                <span className="text-black">
                                  {value.label}
                                </span>
                                {value.inputType === "switch" && (
                                  <UISwitch
                                    onChange={(e) =>
                                      handlePreferenceChange(e, value.inputType, preference.name, value.name)
                                    }
                                    value={value.value}
                                  />
                                )}
                              </>
                            );
                          })}
                          {/* {defaultLandlordAccountPreferences
                            .find((pref) => pref.name === preference.name)
                            .inputTypes.map((inputType) => {
                              return (
                                <>
                                  <span className="text-black">
                                    {inputType.label}
                                  </span>
                                  {inputType.type === "switch" && (
                                    <UISwitch
                                      onChange={(e) => {
                                        console.log(e.target.checked);
                                      }}
                                      value={false}
                                    />
                                  )}
                                </>
                              );
                            })} */}
                          {/* {preference.inputType === "switch" && (
                    )}
                    {preference.inputType === "number" && (
                      <input
                        className="form-control"
                        type="number"
                        onChange={props.onChange}
                        style={inputStyle}
                        defaultValue={props.value}
                        min="0"
                      />
                    )}
                    {preference.inputType === "text" && (
                      <input
                        className="form-control"
                        type="text"
                        onChange={props.onChange}
                        style={inputStyle}
                        defaultValue={props.value}
                      />
                    )}
                    {preference.inputType === "select" && (
                      <select
                        className="form-select"
                        type="select"
                        onChange={props.onChange}
                        style={inputStyle}
                        defaultValue={props.value}
                      >
                        {props.selectOptions.map((option) => (
                          <option value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    )} */}
                        </Stack>
                      </ListItem>
                    );
                  })}
              </List>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;
