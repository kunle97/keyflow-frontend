import React, { useEffect, useState } from "react";
import { uiGreen, uiGrey1, uiGrey2 } from "../../../../constants";
import { fa, faker } from "@faker-js/faker";
import { registerOwner } from "../../../../api/auth";
import { Link, useNavigate } from "react-router-dom";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import { Input, Button, Stack, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../../constants";
import { makeId, preventPageReload } from "../../../../helpers/utils";
import UIButton from "../../UIComponents/UIButton";
import { CardElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import PlanSelectDialog from "./PlanSelectDialog";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import UIStepper from "../../UIComponents/UIStepper";
import {
  triggerValidation,
  validateForm,
} from "../../../../helpers/formValidation";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
const OwnerRegister = () => {
  //Cards state variables
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [errorMode, setErrorMode] = useState(false);
  const [stripeRedirectLink, setStripeRedirectLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [successMode, setSuccessMode] = useState(false);
  const [errMsg, setErrMsg] = useState();
  const [cardMode, setCardMode] = useState(true);
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [step, setStep] = useState(0);
  const [planSelectDialogIsOpen, setPlanSelectDialogIsOpen] = useState(false);
  const [tax, setTax] = useState(0.05);
  const [errors, setErrors] = useState({});
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

  const [formData, setFormData] = useState({
    first_name: firstName,
    last_name: lastName,
    email:
      process.env.REACT_APP_ENVIRONMENT !== "development"
        ? ""
        : faker.internet.email({ firstName, lastName }),
    username:
      process.env.REACT_APP_ENVIRONMENT !== "development"
        ? ""
        : faker.internet.userName({ firstName, lastName }),
    password: "Password1",
    password_repeat: "Password1",
  });
  const handleChange = (e) => {
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
  const formInputs = [
    {
      name: "first_name",
      label: "First Name",
      type: "text",
      onChange: (e) => handleChange(e),
      colSpan: 6,
      validations: {
        required: true,
        minLength: 3,
        errorMessage: "Minimum length should be 3 characters",
      },
      dataTestId: "first_name",
      errorMessageDataTestId: "first_name_error",
    },
    {
      name: "last_name",
      label: "Last Name",
      type: "text",
      onChange: (e) => handleChange(e),
      colSpan: 6,
      validations: {
        required: true,
        minLength: 3,
        errorMessage: "Minimum length should be 3 characters",
      },
      dataTestId: "last_name",
      errorMessageDataTestId: "last_name_error",
    },
    {
      name: "username",
      label: "Username",
      type: "text",
      onChange: (e) => handleChange(e),
      colSpan: 12,
      validations: {
        required: true,
        minLength: 3,
        errorMessage: "Minimum length should be 3 characters",
      },
      dataTestId: "username",
      errorMessageDataTestId: "username_error",
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      onChange: (e) => handleChange(e),
      colSpan: 12,
      validations: {
        required: true,
        pattern: /\S+@\S+\.\S+/,
        errorMessage: "Please enter a valid email address",
      },
      dataTestId: "email",
      errorMessageDataTestId: "email_error",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      onChange: (e) => handleChange(e),
      colSpan: 6,
      validations: {
        required: true,
        minLength: 6,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        errorMessage:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      },
      dataTestId: "password",
      errorMessageDataTestId: "password_error",
    },
    {
      name: "password_repeat",
      label: "Repeat Password",
      type: "password",
      colSpan: 6,
      onChange: (e) => handleChange(e),

      validations: {
        required: true,
        minLength: 6,
        validate: (val) => {
          if (formData.password != val) {
            return "Your passwords do not match";
          }
        },
      },
      dataTestId: "password_repeat",
      errorMessageDataTestId: "password_repeat_error",
    },
  ];
  useEffect(() => {
    preventPageReload();
  }, []);
  //Create handlSubmit() function to handle form submission to create a new user using the API
  const onSubmit = async (data) => {
    setIsLoading(true);
    let payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      username: formData.username,
      password: formData.password,
      password_repeat: formData.password_repeat,
    };
    payload.activation_token = makeId(32);
    payload.account_type = "owner";
    //Handle stripe elements
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      if (cardMode) {
        const { paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });
        setPaymentMethodId(paymentMethod.id);
        console.log(paymentMethod.id);
        console.log("PaymentMethod:", paymentMethod);
        payload.payment_method_id = paymentMethod.id;
        payload.price_id = selectedPlan.price_id;
        payload.product_id = selectedPlan.product_id;
        console.log("COMPLETE FORM DATA", payload);
      } else {
      }
      const response = await registerOwner(payload).then((res) => {
        console.log(res);
        if (res.status === 200) {
          //Show success message
          setErrorMode(false);
          setOpen(true);
          setStripeRedirectLink(res.stripe_onboarding_link.url);
        } else {
          //TODO: Show error message moodal
          setErrorMode(true);
          setOpen(true);
          setIsLoading(false);
        }
      });
      //Call the API to create a new owner user
    } catch (err) {
      setMessage("Error adding your payment method");
      console.log(err);
      setErrorMode(true);
      setSuccessMode(false);
      setIsLoading(false);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid" style={{ padding: 0, overflow: "hidden" }}>
      <ProgressModal
        open={isLoading}
        onClose={() => setIsLoading}
        title="Registering Your Account..."
      />
      {open && (
        <>
          {errorMode ? (
            <AlertModal
              open={true}
              onClose={() => setOpen(false)}
              title={"Registration Failed!"}
              message="Registration failed. Please try again"
              btnText="Close"
              to="/dashboard/owner/register"
            />
          ) : (
            <>
              <ConfirmModal
                title="Registration Successful!"
                message="You have been registered Successfully! You will now be redirected to the payment 
                processing platform to complete your registration. You may skip this and complete it later, 
                however you will not be able to receive payments until you complete this step. Click the button
                below to continue."
                open={true}
                handleCancel={() => {
                  //Redirect to the account activation message page
                  navigate("/dashboard/activate-account/");
                }}
                cancelBtnStyle={{ background: uiGreen, color: "white" }}
                cancelBtnText="Skip"
                handleConfirm={() => {
                  //Redirect to the stripe onboarding link
                  window.location.href = stripeRedirectLink;
                }}
                confirmBtnStyle={{ background: uiGreen, color: "white" }}
                confirmBtnText="Continue"
              />
            </>
          )}
        </>
      )}

      <div className="row">
        <div
          className="col-md-12"
          style={{
            background: "url('/assets/img/register-page-banner-1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
          }}
        >
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{ height: "100vh" }}
          >
            <div className="row card py-3">
              <div className=" ">
                <img
                  style={{ maxWidth: "175px", marginBottom: "25px" }}
                  src="/assets/img/key-flow-logo-black-transparent.png"
                />
                <UIStepper
                  step={step}
                  steps={[
                    "Basic Information",
                    "Select Plan",
                    "Payment Information",
                  ]}
                />

                <form className="user mt-3">
                  <div></div>
                  {step === 0 && (
                    <div className="row">
                      {formInputs.map((input, index) => {
                        return (
                          <div
                            key={index}
                            className={` ${
                              input.colSpan
                                ? `mb-3 col-md-${input.colSpan}`
                                : ""
                            }`}
                          >
                            <div className="form-group  mb-2">
                              <label
                                htmlFor={input.name}
                                className="text-black"
                              >
                                {input.label}
                              </label>

                              <input
                                className="form-control"
                                type={input.type}
                                id={input.name}
                                placeholder={input.label}
                                onChange={input.onChange}
                                onBlur={input.onChange}
                                name={input.name}
                                value={formData[input.name]}
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
                          </div>
                        );
                      })}
                      <div className="col-md-12">
                        <UIButton
                          onClick={() => {
                            const { isValid, newErrors } = validateForm(
                              formData,
                              formInputs
                            );
                            if (isValid) {
                              setStep(1);
                            } else {
                              setErrors(newErrors);
                            }
                          }}
                          style={{ width: "100%" }}
                          btnText="Next"
                        />
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div>
                      <div>
                        <IconButton onClick={() => setStep(0)}>
                          <ArrowBackOutlinedIcon sx={{ color: uiGreen }} />
                        </IconButton>
                      </div>
                      {selectedPlan ? (
                        <>
                          <div className="mb-3">
                            <Stack
                              direction="row"
                              justifyContent="flex-start"
                              alignItems="center"
                              spacing={2}
                            >
                              <div>
                                <h6
                                  style={{ marginBottom: 0, fontSize: "14pt" }}
                                >
                                  {selectedPlan.name}
                                </h6>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1}
                                >
                                  <h2>${selectedPlan.price}</h2>
                                  <Stack direction="row" spacing={0}>
                                    {selectedPlan.product_id ===
                                      process.env
                                        .REACT_APP_STRIPE_PRO_PLAN_PRODUCT_ID && (
                                      <span
                                        style={{
                                          color: "white",
                                          marginRight: "5px",
                                        }}
                                      >
                                        per Rental Unit
                                      </span>
                                    )}{" "}
                                    <span style={{ color: "white" }}>
                                      per Month
                                    </span>
                                  </Stack>
                                </Stack>
                              </div>
                            </Stack>
                            <Button
                              sx={{ color: uiGreen, textTransform: "none" }}
                              onClick={() => {
                                setPlanSelectDialogIsOpen(true);
                              }}
                            >
                              Change Plan
                            </Button>
                          </div>{" "}
                          <UIButton
                            style={{ width: "100%", marginTop: "10px" }}
                            btnText="Next"
                            onClick={() => setStep(2)}
                          />
                        </>
                      ) : (
                        <>
                          <UIButton
                            style={{ width: "100%" }}
                            btnText="Select A Plan"
                            onClick={() => {
                              setPlanSelectDialogIsOpen(true);
                            }}
                          />
                        </>
                      )}
                    </div>
                  )}
                  {step === 2 && (
                    <div>
                      <div>
                        <IconButton onClick={() => setStep(1)}>
                          <ArrowBackOutlinedIcon sx={{ color: uiGreen }} />
                        </IconButton>
                      </div>
                      <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={2}
                      >
                        <div>
                          <h6 style={{ marginBottom: 0, fontSize: "14pt" }}>
                            {selectedPlan.name}
                          </h6>
                        </div>
                      </Stack>

                      <div id="totals-section">
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={2}
                        >
                          <span sx={{ color: "white" }}>Subtotal</span>
                          <span sx={{ color: "white" }}>
                            ${selectedPlan.price}
                          </span>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={2}
                        >
                          <span sx={{ color: "white" }}>Tax</span>
                          <span sx={{ color: "white" }}>
                            ${selectedPlan.price * tax}
                          </span>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={2}
                        >
                          <span sx={{ color: "white" }}>Total</span>
                          <span sx={{ color: "white" }}>
                            ${selectedPlan.price * tax + selectedPlan.price}
                          </span>
                        </Stack>
                      </div>

                      <div className="my-3">
                        <label className="form-label" htmlFor="card-element">
                          Credit or debit card
                        </label>
                        <div
                          id="card-element"
                          style={{
                            borderRadius: ".25rem",
                            padding: ".375rem .75rem",
                            color: "white",
                            backgroundColor: "#f2f2f5",
                            backgroundClip: "padding-box",
                            transition:
                              "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
                          }}
                        >
                          <CardElement
                            options={{
                              style: {
                                base: {
                                  fontSize: "16px",
                                  color: "black",
                                  "::placeholder": {
                                    color: "#aab7c4",
                                  },
                                },
                                invalid: {
                                  color: "#9e2146",
                                },
                              },
                            }}
                          />
                        </div>
                      </div>
                      {selectedPlan && (
                        <UIButton
                          style={{ width: "100%" }}
                          className="btn btn-primary d-block  w-100 mb-2"
                          onClick={() => {
                            const { isValid, newErrors } = validateForm(
                              formData,
                              formInputs
                            );
                            if (isValid) {
                              onSubmit();
                            } else {
                              setErrors(newErrors);
                            }
                          }}
                          btnText="Sign Up"
                        />
                      )}
                    </div>
                  )}
                  <PlanSelectDialog
                    open={planSelectDialogIsOpen}
                    onClose={() => setPlanSelectDialogIsOpen(false)}
                    setSelectedPlan={setSelectedPlan}
                    selectedPlan={selectedPlan}
                  />
                </form>
              </div>
              <div className="my-3">
                <div className="mb-2">
                  <a
                    className="small"
                    href="forgot-password.html"
                    style={{ color: uiGreen }}
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="mb-2">
                  <Link
                    className="small"
                    to="/dashboard/owner/login"
                    style={{ color: uiGreen }}
                  >
                    Already have an account? Login!
                  </Link>
                </div>
              </div>
            </div>
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default OwnerRegister;
