import {
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { authUser, uiGreen, uiGrey } from "../../../constants";
import {
  createBillingPortalSession,
  deleteStripePaymentMethod,
  listStripePaymentMethods,
  setDefaultPaymentMethod,
} from "../../../api/payment_methods";
import {
  getTenantDashboardData,
  getTenantPreferences,
  updateTenantPreferences,
} from "../../../api/tenants";
import { changePassword } from "../../../api/passwords";
import { updateUserData } from "../../../api/auth";
import UIButton from "../UIComponents/UIButton";
import { useNavigate } from "react-router";
import { validationMessageStyle } from "../../../constants";
import AlertModal from "../UIComponents/Modals/AlertModal";
import UploadDialog from "../UIComponents/Modals/UploadDialog/UploadDialog";
import { retrieveFilesBySubfolder } from "../../../api/file_uploads";
import useScreen from "../../../hooks/useScreen";
import {
  triggerValidation,
  validateForm,
} from "../../../helpers/formValidation";
import UITabs from "../UIComponents/UITabs";
import UISwitch from "../UIComponents/UISwitch";
import { syncPreferences } from "../../../helpers/preferences";
import ProgressModal from "../UIComponents/Modals/ProgressModal";
import { validAnyString, validEmail, validName, validStrongPassword, validUserName } from "../../../constants/rexgex";
const TenantMyAccount = () => {
  const { isMobile } = useScreen();
  const [tabPage, setTabPage] = useState(0);
  const [tabs, setTabs] = useState([
    { label: "Basic Information" },
    { label: "Notification Settings" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]); //Value of either the Stripe token or the Plaid token
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseTitle, setResponseTitle] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [leaseAgreement, setLeaseAgreement] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [tenantPreferences, setTenantPreferences] = useState({});
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
        regex: validName,
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
        regex: validName,
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
        regex: validUserName,
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
        regex: validEmail,
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
        regex: validAnyString,
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
          validStrongPassword,
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

  const onSubmitUpdateAccount = () => {
    setIsLoading(true);
    //Create a data object to send to the backend
    updateUserData(accountFormData).then((res) => {

      if (res.status === 200) {
        setResponseTitle("Success");
        setResponseMessage("Account updated successfully");
        setShowResponseModal(true);
      }
    }).catch((error) => {
      console.error("Error updating account: ", error);
      setResponseTitle("Error");
      setResponseMessage("Error updating account");
      setShowResponseModal(true);
    }).finally(() => {
      setIsLoading(false);
    });
  };

  const onSubmitChangePassword = () => {
    setIsLoading(true);
    setProgressMessage("Changing password...");
    changePassword(passwordFormData).then((res) => {

      if (res.status === 200) {
        setResponseTitle("Success");
        setResponseMessage("Password changed successfully");
        setShowResponseModal(true);
      } else {
        setResponseTitle("Error");
        setResponseMessage("Error changeing your password");
        setShowResponseModal(true);
      }
    }).catch((error) => {
      console.error("Error changing password: ", error);
      setResponseTitle("Error");
      setResponseMessage("Error changing your password");
      setShowResponseModal(true);
    }).finally(() => {
      setIsLoading(false);
    });
  };
  const handleSetDefaultPaymentMethod = async (paymentMethodId) => {
    getTenantDashboardData().then((res) => {

      let data = {};
      data.payment_method_id = paymentMethodId;
      data.user_id = authUser.id;

      //Retrieve the lease agreement
      data.lease_agreement_id = res.lease_agreement.id;

      setDefaultPaymentMethod(data).then((res) => {

        setResponseTitle("Alert");
        setResponseMessage("Payment method set as default");
        setShowResponseModal(true);
        //Get the payment methods for the user
        listStripePaymentMethods(`${authUser.id}`).then((res) => {

          setPaymentMethods(res.data);
        });
        navigate(0);
      });
    });
  };
  const handlePaymentMethodDelete = (paymentMethodId) => {

    let data = {
      payment_method_id: paymentMethodId,
    };
    deleteStripePaymentMethod(data).then((res) => {

      setResponseTitle("Alert");
      setResponseMessage("Payment method deleted");
      setShowResponseModal(true);
      //Get the payment methods for the user
      listStripePaymentMethods(`${authUser.id}`).then((res) => {

        setPaymentMethods(res.data);
      });
    });
  };

  const manageBillingOnClick = () => {
    setIsLoading(true);
    setProgressMessage("Redirecting to billing portal...");
    createBillingPortalSession()
      .then((res) => {

        window.location.href = res.url;
      })
      .catch((error) => {

        setIsLoading(false);
      })
      .finally(() => {});
  };
  //Create a function that handle the change of the value of a preference
  const handlePreferenceChange = (e, inputType, preferenceName, valueName) => {
    if (inputType === "switch") {

      //Update the value of the preference and use setOwnerPreferences to update the state
      let newTenantPreferences = tenantPreferences.map((preference) => {
        if (preference.name === preferenceName) {
          preference.values.map((value) => {
            if (value.name === valueName) {
              value.value = e.target.checked;
            }
          });
        }
        return preference;
      });

      setTenantPreferences(newTenantPreferences);
      let payload = {
        preferences: newTenantPreferences,
      };
      updateTenantPreferences(payload).then((res) => {

      });
    } else {

    }
  };

  const handleTabChange = (event, newValue) => {
    setTabPage(newValue);
  };

  useEffect(() => {
    try{
      syncPreferences();
      //Get the payment methods for the user
      listStripePaymentMethods(`${authUser.id}`).then((res) => {

        setPaymentMethods(res.data);
      });
      //Retrieve the users lease agreemetn
      getTenantDashboardData().then((res) => {

        setLeaseAgreement(res.lease_agreement);
      });
      retrieveFilesBySubfolder("user_profile_picture", authUser.id).then(
        (res) => {
          setProfilePictureFile(res.data[0]);
        }
      );
      getTenantPreferences().then((res) => {

        setTenantPreferences(res.preferences);
      });
    }catch(e){

      setResponseTitle("Error");
      setResponseMessage("Error loading data");
      setShowResponseModal(true);
    }
  },[]);

  return (
    <div className="container">
      <ProgressModal open={isLoading} title={progressMessage} />
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
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{ mb: 2 }}
          >
            <h4>Account Information</h4>
            <UIButton btnText="Manage Billing" onClick={manageBillingOnClick} />
          </Stack>
          <div className="row mb-3">
            <div className="col">
              <div className="row">
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
                                onSubmitUpdateAccount();
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
              <div className="row">
                <div className="col-md-12">
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={2}
                    sx={{ mb: 2 }}
                  >
                    <h4>Change Password</h4>
                  </Stack>
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
                }}
              >
                {tenantPreferences &&
                  tenantPreferences.map((preference) => {
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
    </div>
  );
};

export default TenantMyAccount;
