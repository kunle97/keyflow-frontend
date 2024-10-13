import React, { useState } from "react";
import { authUser, uiGreen } from "../../../constants";
import { faker } from "@faker-js/faker";
import { getRentalApplicationByApprovalHash } from "../../../api/rental_applications";
import { verifyTenantRegistrationCredentials } from "../../../api/tenants";
import { checkEmail, checkUsername, registerTenant } from "../../../api/auth";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import AlertModal from "../UIComponents/Modals/AlertModal";
import ProgressModal from "../UIComponents/Modals/ProgressModal";
import { useEffect } from "react";
import { CardElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { validationMessageStyle } from "../../../constants";
import { makeId, preventPageReload } from "../../../helpers/utils";
import { getLeaseAgreementByIdAndApprovalHash } from "../../../api/lease_agreements";
import {
  hasNoErrors,
  triggerValidation,
  validateForm,
} from "../../../helpers/formValidation";
import UIButton from "../UIComponents/UIButton";
import {
  validEmail,
  validName,
  validStrongPassword,
  validUserName,
} from "../../../constants/rexgex";
const TenantRegister = () => {
  const { lease_agreement_id, approval_hash, unit_id } = useParams();

  //Create a state for the form data
  const [firstName, setFirstName] = useState(
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.person.firstName()
  );
  const [lastName, setLastName] = useState(
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.person.lastName()
  );
  const [userName, setUserName] = useState(
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.internet.userName({ firstName, lastName })
  );
  const [email, setEmail] = useState(
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.internet.email({ firstName, lastName })
  );

  const [open, setOpen] = useState(false);
  const [errorMode, setErrorMode] = useState(false);
  const [errorModeMessage, setErrorModeMessage] = useState(null);
  const [errorModeTitle, setErrorModeTitle] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertTitle, setAlertTitle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showStep1, setShowStep1] = useState(true);
  const [showStep2, setShowStep2] = useState(false);
  const [userId, setUserId] = useState(null);
  const [errors, setErrors] = useState({}); //Create a state to hold the form errors
  const [formData, setFormData] = useState({
    first_name:
      process.env.REACT_APP_ENVIRONMENT !== "development"
        ? ""
        : faker.person.firstName(),
    last_name: "",
    email: "",
    username: "",
    password: "",
    password_repeat: "",
  }); //Create a state to hold the form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = triggerValidation(
      name,
      value,
      step1FormInputs.find((input) => input.name == name).validations
    );
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: newErrors[name],
    }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));


  };

  const step1FormInputs = [
    {
      name: "first_name",
      label: "First Name",
      type: "text",
      onChange: (e) => handleChange(e),
      colSpan: 6,
      placeholder: "John",
      validations: {
        required: true,
        regex: validName,
        errorMessage: "Please enter a valid first name",
      },
      dataTestId: "first_name",
      errorMessageDataTestId: "first-name-error",
    },
    {
      name: "last_name",
      label: "Last Name",
      type: "text",
      onChange: (e) => handleChange(e),
      colSpan: 6,
      placeholder: "Doe",
      validations: {
        required: true,
        regex: validName,
        errorMessage: "Please enter a valid last name",
      },
      dataTestId: "last_name",
      errorMessageDataTestId: "last-name-error",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      onChange: (e) => handleChange(e),
      colSpan: 12,
      placeholder: "jdoe@email.com",
      validations: {
        required: true,
        validate: async (val) => {
          let regex = validEmail;

          if (!regex.test(val)) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: "Please enter a valid email address",
            }));
          }
          await checkEmail(val).then((res) => {
            if (res.status === 400) {
              setErrors((prevErrors) => ({
                ...prevErrors,
                email: "A user with this email already exists",
              }));
            }
          });
        },
      },
      dataTestId: "email",
      errorMessageDataTestId: "email-error",
    },
    {
      name: "username",
      label: "Username",
      type: "text",
      onChange: (e) => handleChange(e),
      colSpan: 12,
      placeholder: "johndoe",
      validations: {
        required: true,
        validate: async (val) => {
          let regex = validUserName;
          if (!regex.test(val)) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              username: "Please enter a valid username",
            }));
            return false;
          }
          await checkUsername(val).then((res) => {
            if (res.status === 400) {
              setErrors((prevErrors) => ({
                ...prevErrors,
                username: "A user with this username already exists",
              }));
              return false;
            }
          });
        },
      },
      dataTestId: "username",
      errorMessageDataTestId: "username-error",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      onChange: (e) => handleChange(e),
      colSpan: 6,
      placeholder: "Password",
      validations: {
        required: true,
        regex: validStrongPassword,
        errorMessage:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      },
      dataTestId: "password",
      errorMessageDataTestId: "password-error",
    },
    {
      name: "password_repeat",
      label: "Repeat Password",
      type: "password",
      onChange: (e) => handleChange(e),
      colSpan: 6,
      placeholder: "Repeat Password",
      validations: {
        required: true,
        regex: validStrongPassword,
        errorMessage:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      },
      dataTestId: "password-repeat",
      errorMessageDataTestId: "password-repeat-error",
    },
  ];

  //Cards state variables
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [successMode, setSuccessMode] = useState(false); //If true, display error message
  const [paymentMethodId, setPaymentMethodId] = useState(null); //If true, display error message

  //Create handlSubmit() function to handle form submission to create a new user using the API
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    //Check if stripe elements are valid
    const { isValid, newErrors } = validateForm(formData, step1FormInputs);
    if (hasNoErrors(errors) && isValid) {

      let payload = {
        unit_id: unit_id,
        lease_agreement_id: lease_agreement_id,
        approval_hash: approval_hash,
        activation_token: makeId(32),
        account_type: "tenant",
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        password_repeat: formData.password_repeat,
      };

      //Handle stripe elements
      if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {

        setErrorMode(true);
        setMessage("Please enter a valid card number");
        setErrorModeMessage("Please enter a valid card number");
        setErrorModeTitle("Error");
        setIsLoading(false);
        return;
      }
      try {
        const { paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });
        setPaymentMethodId(paymentMethod.id);
        payload.payment_method_id = paymentMethod.id;
      } catch (err) {
        setMessage("Error adding your payment method");

        setErrorMode(true);
        setSuccessMode(false);
        setIsLoading(false);
        return;
      }

      const response = await registerTenant(payload).then((res) => {

        if (res.status === 200) {
          setUserId(authUser.id);

          //Show success message
          setMessage("Your account has been created successfully!");
          setErrorMode(false);
          setOpen(true);
          setIsLoading(false);
        } else {
          //TODO: Show error message moodal
          setErrorMode(true);
          setOpen(true);
          setIsLoading(false);
          return;
        }
      });
    } else {
      setIsLoading(false);
      setErrors(newErrors);
      //Create alert modal to show user that there are errors in the form
      setAlertTitle("Error");
      //Filter out the errors that are not undefined
      let filteredErrors = Object.keys(errors).reduce((acc, key) => {
        if (errors[key] !== undefined) {
          acc[key] = errors[key];
        }
        return acc;
      }, {});
      setAlertMessage("Please fill out all the following required fields correctly: " + Object.keys(filteredErrors).join(", "));
      setShowAlert(true);
    }
  };

  //Veryfy that the lease agreement id and approval hash are valid on page load
  useEffect(() => {
    preventPageReload();
    try {
      verifyTenantRegistrationCredentials({
        lease_agreement_id,
        approval_hash,
      })
        .then((res) => {
          if (res.status !== 200) {
            //TODO: Show error message modal to make the tenant contact thier owner
          }
        })
        .catch((err) => {

          setShowAlert(true);
          setAlertTitle("Error");
          setAlertMessage(
            "Invalid or expired registration link. Please contact your landlord."
          );
        });
      //TODO: Populate the form with rental application or tenant invite data
      getLeaseAgreementByIdAndApprovalHash({
        lease_agreement_id,
        approval_hash,
      })
        .then((res) => {
          if (res.id) {
            if (res.rental_application) {
              //Retrieve users rental application data using the approval_hash
              getRentalApplicationByApprovalHash(approval_hash).then((res) => {

                if (res.id) {
                  //Populate the form with the rental application data
                  const first_name = res.first_name;
                  const last_name = res.last_name;
                  const preloadedData = {
                    first_name: res.first_name,
                    last_name: res.last_name,
                    email: res.email,
                    account_type: "tenant",
                    //Mock Data bleow
                    username:
                      process.env.REACT_APP_ENVIRONMENT !== "development"
                        ? ""
                        : faker.internet.userName({ first_name, last_name }),
                    password:
                      process.env.REACT_APP_ENVIRONMENT !== "development"
                        ? ""
                        : "Password1*",
                    password_repeat:
                      process.env.REACT_APP_ENVIRONMENT !== "development"
                        ? ""
                        : "Password1*",
                  };
                  //Set the form data
                  setFormData({
                    first_name: res.first_name,
                    last_name: res.last_name,
                    email: res.email,
                    username: preloadedData.username,
                    password: preloadedData.password,
                    password_repeat: preloadedData.password_repeat,
                  });
                }
              });
            } else if (res.tenant_invite) {
              //Populate the form with the tenant invite data
              const first_name = res.tenant_invite.first_name;
              const last_name = res.tenant_invite.last_name;
              const preloadedData = {
                first_name: res.tenant_invite.first_name,
                last_name: res.tenant_invite.last_name,
                email: res.tenant_invite.email,
                account_type: "tenant",
                //Mock Data bleow
                username:
                  process.env.REACT_APP_ENVIRONMENT !== "development"
                    ? ""
                    : faker.internet.userName({ first_name, last_name }),
                password:
                  process.env.REACT_APP_ENVIRONMENT !== "development"
                    ? ""
                    : "Password1",
                password_repeat:
                  process.env.REACT_APP_ENVIRONMENT !== "development"
                    ? ""
                    : "Password1",
              };
              setFormData({
                first_name: res.tenant_invite.first_name,
                last_name: res.tenant_invite.last_name,
                email: res.tenant_invite.email,
                username: preloadedData.username,
                password: preloadedData.password,
                password_repeat: preloadedData.password_repeat,
              });
            }
          }
        })
        .catch((err) => {

          setShowAlert(true);
          setAlertTitle("Error");
          setAlertMessage(
            "Invalid or expired registration link. Please contact your landlord."
          );
        });
    } catch (err) {

      setShowAlert(true);
      setAlertTitle("Error");
      setAlertMessage(
        "Invalid or expired registration link. Please contact your landlord."
      );
    }
      //Warns user before leaving the page
  },[]);
  return (
    <div className="container-fluid">
      <ProgressModal
        open={isLoading}
        onClose={() => setIsLoading}
        title="Registering Your Account. Do not refresh the page..."
      />
      {open && (
        <>
          {errorMode ? (
            <AlertModal
              open={true}
              onClose={() => setOpen(false)}
              title={errorModeTitle ? errorModeTitle : "Registration Failed"}
              message={
                errorModeMessage
                  ? errorModeMessage
                  : "Registration failed. Please try again"
              }
              btnText="Close"
              to={`/dashboard/tenant/register/${lease_agreement_id}/${approval_hash}/`}
            />
          ) : (
            <Navigate to={`/dashboard/activate-account/`} replace />
          )}
        </>
      )}
      <AlertModal
        open={showAlert && !open}
        onClick={() => setShowAlert(false)}
        title={alertTitle}
        message={alertMessage}
      />
      <div
        className="row"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.41) 99%),url('/assets/img/tenant-register-page-banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "5%",
          height: "100vh",
        }}
      >
        {" "}
        <div className="col-md-4 offset-md-4 d-flex justify-content-center align-items-center">
          <div className="card">
            <div className="card-body">
              <img
                style={{ maxWidth: "170px", marginBottom: "25px" }}
                src="/assets/img/key-flow-logo-black-transparent.png"
              />
              <form className="user">
                <input type="hidden" name="account_type" value="tenant" />
                {showStep1 && (
                  <div className="row">
                    <h5 className="mb-3"> Create Your Account</h5>
                    {step1FormInputs.map((input, index) => {
                      return (
                        <div
                          key={index}
                          className={`${
                            input.colSpan ? `col-md-${input.colSpan}` : ""
                          }`}
                        >
                          <div className="form-group  mb-2">
                            <label htmlFor={input.name} className="text-black">
                              {input.label}
                            </label>
                            {input.type === "select" ? (
                              <select
                                className="form-control"
                                id={input.name}
                                name={input.name}
                                onChange={input.onChange}
                                data-testid={input.dataTestId}
                                value={formData[input.name]}
                              >
                                {input.options.map((option, index) => {
                                  return (
                                    <option key={index} value={option}>
                                      {option}
                                    </option>
                                  );
                                })}
                              </select>
                            ) : input.type === "textarea" ? (
                              <textarea
                                className="form-control"
                                id={input.name}
                                name={input.name}
                                onChange={input.onChange}
                                onBlur={input.onChange}
                                data-testid={input.dataTestId}
                              >
                                {formData[input.name]}
                              </textarea>
                            ) : (
                              <input
                                type={input.type}
                                className="form-control"
                                id={input.name}
                                name={input.name}
                                onChange={input.onChange}
                                onBlur={input.onChange}
                                data-testid={input.dataTestId}
                                value={formData[input.name]}
                              />
                            )}
                            {errors[input.name] && (
                              <span
                                data-testId={input.errorMessageDataTestId}
                                style={{ ...validationMessageStyle }}
                              >
                                {errors[input.name]}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <UIButton
                      type="button"
                      btnText="Next"
                      onClick={() => {
                        const { isValid, newErrors } = validateForm(
                          formData,
                          step1FormInputs
                        );
                        if (isValid) {
                          setShowStep1(false);
                          setShowStep2(true);
                        } else {
                          setErrors(newErrors);
                        }
                      }}
                    />
                  </div>
                )}
                {showStep2 && (
                  <div className="">
                    <IconButton>
                      <ArrowBack
                        sx={{ color: uiGreen }}
                        onClick={() => {
                          setShowStep1(true);
                          setShowStep2(false);
                        }}
                      />
                    </IconButton>
                    <h5 className="mb-3 text-black">Add A Payment Method</h5>
                    <p className="text-black">
                      This will be used to pay for your rent and all other
                      expenses.
                    </p>
                    <AlertModal
                      open={errorMode}
                      title="Error"
                      message={message}
                      handleClose={() => setErrorMode(false)}
                      btnText="Close"
                      onClick={() => setErrorMode(false)}
                    />
                    <AlertModal
                      open={successMode}
                      title="Success"
                      message={message}
                      handleClose={() => setSuccessMode(false)}
                      btnText="Close"
                      to="/dashboard/tenant/"
                    />

                    <div className="">
                      <div className="stripeSection">
                        <>
                          {" "}
                          <div className="form-row">
                            <label
                              className="form-label text-black"
                              htmlFor="card-element"
                            >
                              Credit or Debit Card
                            </label>
                            <div
                              style={{
                                backgroundColor: "#f2f2f2",
                                padding: "10px",
                                borderRadius: "5px",
                              }}
                            >
                              <CardElement
                                options={{
                                  style: {
                                    base: {
                                      fontSize: "16px",
                                      color: "black",
                                      marginBottom: "15px",
                                    },
                                  },
                                }}
                              />
                            </div>
                          </div>
                          {errorMode && message && (
                            <div
                              className="error-message"
                              style={{
                                fontSize: "14pt",
                                width: "100%",
                                color: uiGreen,
                              }}
                            >
                              {message}
                            </div>
                          )}
                        </>
                        <UIButton
                          btnText="Sign Up"
                          style={{ marginTop: "15px", width: "100%" }}
                          onClick={onSubmit}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantRegister;
