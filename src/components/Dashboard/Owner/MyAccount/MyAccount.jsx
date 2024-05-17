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
  createBillingPortalSession,
  deleteStripePaymentMethod,
  listOwnerStripePaymentMethods,
  setOwnerDefaultPaymentMethod,
} from "../../../../api/payment_methods";
import { changePassword } from "../../../../api/passwords";
import { getSubscriptionPlanPrices } from "../../../../api/manage_subscriptions";
import {
  getUserStripeSubscriptions,
  updateUserData,
} from "../../../../api/auth";
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
import UITabs from "../../UIComponents/UITabs";
import PlanChangeDialog from "./PlanChangeDialog";
import UploadDialog from "../../UIComponents/Modals/UploadDialog/UploadDialog";
import { retrieveFilesBySubfolder } from "../../../../api/file_uploads";
import UISwitch from "../../UIComponents/UISwitch";
import useScreen from "../../../../hooks/useScreen";
import {
  triggerValidation,
  validateForm,
} from "../../../../helpers/formValidation";
import {
  getOwnerPreferences,
  updateOwnerPreferences,
} from "../../../../api/owners";
import { syncPreferences } from "../../../../helpers/preferences";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import UIPrompt from "../../UIComponents/UIPrompt";
import AddCardIcon from "@mui/icons-material/AddCard";
const MyAccount = () => {
  const { isMobile } = useScreen();
  const [isLoading, setIsLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState(null);
  const [tabPage, setTabPage] = useState(0);
  const [tabs, setTabs] = useState([
    { label: "Account" },
    { label: "Notification Settings" },
    // { label: "Payment Methods" },
    // { label: "Manage Subscription" },
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
  const [updatedDefaultPaymentMethod, setUpdatedDefaultPaymentMethod] =
    useState(null);
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
    setIsLoading(true);
    setProgressMessage("Setting as default payment method...");
    console.log("Set as default PM: ", paymentMethodId);
    let data = {};
    data.payment_method_id = paymentMethodId;
    data.user_id = authUser.id;
    setOwnerDefaultPaymentMethod(data)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setResponseTitle("Alert");
          setResponseMessage("Payment method set as default");
          //Get the payment methods for the user
          listOwnerStripePaymentMethods(`${authUser.id}`).then((res) => {
            setPaymentMethods(res.payment_methods.data);
          });
          setPaymentMethodDefaultId(paymentMethodId);
        } else {
          setResponseTitle("Error");
          setResponseMessage("Error setting payment method as default");
        }
      })
      .catch((error) => {
        setResponseTitle("Error");
        setResponseMessage("Error setting payment method as default");
      })
      .finally(() => {
        setIsLoading(false);
        setShowResponseModal(true);
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
      listOwnerStripePaymentMethods(`${authUser.id}`).then((res) => {
        console.log(res.data);
        setPaymentMethods(res.payment_methods.data);
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
      });
      console.log("New Owner Preferences ", newOwnerPreferences);
      setOwnerPreferences(newOwnerPreferences);
      let payload = {
        preferences: newOwnerPreferences,
      };
      updateOwnerPreferences(payload).then((res) => {
        console.log(res);
      });
    } else {
      console.log(e.target.value);
    }
  };

  const manageBillingOnClick = () => {
    setIsLoading(true);
    setProgressMessage("Redirecting to billing portal...");
    createBillingPortalSession()
      .then((res) => {
        console.log(res);
        window.location.href = res.url;
      })
      .catch((error) => {
        console.log("Error creating billing portal session: ", error);
        setIsLoading(false);
      })
      .finally(() => {});
  };

  useEffect(() => {
    syncPreferences();
    //Get the payment methods for the user
    listOwnerStripePaymentMethods(`${authUser.id}`)
      .then((res) => {
        console.log("PAyment M3th0Ds Response: ", res);
        setPaymentMethods(res.payment_methods.data);
        setPaymentMethodDefaultId(res.default_payment_method);
      })
      .catch((error) => {
        console.log("Error getting payment methods: ", error);
        setPaymentMethods([]);
      });
    getSubscriptionPlanPrices().then((res) => {
      setPlans(res.products);
    }).catch((error) => {
      console.log("Error getting subscription plans: ", error);
      setResponseTitle("Error");
      setResponseMessage("Error getting subscription plans");
      setShowResponseModal(true);
    }
    );
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
  }, []);

  return (
    <div className="container">
      <ProgressModal open={isLoading} title={progressMessage} />
      <AlertModal
        title={responseTitle}
        message={responseMessage}
        open={showResponseModal}
        btnText="Okay"
        handleClose={() => setShowResponseModal(false)}
        onClick={() => setShowResponseModal(false)}
      />
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
        sx={{ marginBottom: "30px" }}
      >
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={0}
        >
          {" "}
          <div
            style={{
              borderRadius: "50%",
              overflow: "hidden",
              width: "75px",
              height: "75px",
              margin: "15px 0",
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
            btnText="Change Photo"
            onClick={() => setUploadDialogOpen(true)}
            variant="text"
            sx={{
              color: uiGreen,
              textTransform: "none",
              fontSize: "10pt",
              margin: "0 10px",
            }}
          >
            Change Photo
          </Button>
        </Stack>

        <div>
          <h5 style={{ width: "100%", textAlign: "left", margin: "0" }}>
            {authUser.first_name} {authUser.last_name}
          </h5>
          <div style={{ width: "100%", textAlign: "left" }}>
            <a href={`mailto:${authUser.email}`} className="text-muted">
              {authUser.email}
            </a>
          </div>
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
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
              sx={{ mb: 2 }}
            >
              <h4>Account Information</h4>
              <UIButton
                btnText="Manage Billing"
                onClick={manageBillingOnClick}
              />
            </Stack>
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
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
            sx={{ mb: 2 }}
          >
            <h4>Change Password</h4>
          </Stack>
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
        </>
      )}
      {tabPage === 1 && (
        <div className={isMobile && "container-fluid"}>
          <div className="row">
            <div className="col-md-12">
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
                                      handlePreferenceChange(
                                        e,
                                        value.inputType,
                                        preference.name,
                                        value.name
                                      )
                                    }
                                    value={value.value}
                                  />
                                )}
                              </>
                            );
                          })}
                        </Stack>
                      </ListItem>
                    );
                  })}
              </List>
            </div>
          </div>
        </div>
      )}
      {/* {tabPage === 2 && (
        <>
          <div className="mb-3" style={{ overflow: "auto" }}>
            <UIButton
              style={{ float: "right" }}
              onClick={() => {
                navigate("/dashboard/add-payment-method");
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
                handleSetDefaultPaymentMethod(updatedDefaultPaymentMethod);
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
            {paymentMethods ? (
              paymentMethods.map((paymentMethod) => {
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
                              {paymentMethod.id === paymentMethodDefaultId ? (
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
                                      setUpdatedDefaultPaymentMethod(
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
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <UIPrompt
                icon={<AddCardIcon sx={{ fontSize: "30pt", color: uiGreen }} />}
                title="No payment methods found"
                message="You have not added any payment methods yet"
                body={
                  <UIButton
                    onClick={() => navigate("/dashboard/add-payment-method")}
                    btnText="Add Payment Method"
                  />
                }
              />
            )}
          </div>
        </>
      )}
      {tabPage === 3 && (
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
      )} */}
    </div>
  );
};

export default MyAccount;
