import React, { useEffect, useState } from "react";
import { uiGreen, uiGrey1, uiGrey2 } from "../../../../constants";
import { fa, faker } from "@faker-js/faker";
import { registerLandlord } from "../../../../api/auth";
import { Link } from "react-router-dom";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import { Input, Button, Stack, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../../constants";
import { makeId } from "../../../../helpers/utils";
import { send } from "@emailjs/browser";
import UIButton from "../../UIComponents/UIButton";
import { CardElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import PlanSelectDialog from "./PlanSelectDialog";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import UIStepper from "../../UIComponents/UIStepper";
const LandlordRegister = () => {
  //Cards state variables
  const stripe = useStripe();
  const elements = useElements();
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
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
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
    },
  });

  //Create handlSubmit() function to handle form submission to create a new user using the API
  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log(data);
    data.activation_token = makeId(32);
    data.account_type = "owner";
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
        data.payment_method_id = paymentMethod.id;
        data.price_id = selectedPlan.price_id;
        data.product_id = selectedPlan.product_id;
        console.log("COMPLETE FORM DATA", data);
      } else {
      }
      //Call the API to create a new landlord user
    } catch (err) {
      setMessage("Error adding your payment method");
      console.log(err);
      setErrorMode(true);
      setSuccessMode(false);
      setIsLoading(false);
      return;
    }

    const response = await registerLandlord(data).then((res) => {
      console.log(res);
      if (res.status === 200) {
        //Send actication email
        const activation_link = `${process.env.REACT_APP_HOSTNAME}/dashboard/activate-user-account/${data.activation_token}`;
        console.log(activation_link);
        const email_data = {
          to_email: data.email,
          reply_to: `donotreply@${process.env.REACT_APP_HOSTNAME}`,
          subject: "Activate Your KeyFlow Account",
          message: `Hi ${data.first_name},<br/><br/>Thank you for registering with KeyFlow. Please click the link below to activate your account.<br/><br/><a href="${activation_link}">Activate Account</a><br/><br/>Regards,<br/>KeyFlow Team`,
        };
        //Send activation email using emailJS
        send(
          process.env.REACT_APP_EMAIL_JS_SERVICE_ID,
          process.env.REACT_APP_EMAIL_JS_TEMPLATE_ID,
          email_data,
          process.env.REACT_APP_EMAIL_JS_API_KEY
        ).then((res) => {
          console.log("Email sent successfully", res);
        });

        //Show success message
        setErrorMode(false);
        setOpen(true);
        setStripeRedirectLink(res.stripe_onboarding_link.url);
        setIsLoading(false);
      } else {
        //TODO: Show error message moodal
        setErrorMode(true);
        setOpen(true);
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="container-fluid"  style={{ padding: 0, overflow: "hidden" }}>
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
              to="/dashboard/landlord/register"
            />
          ) : (
            <AlertModal
              open={true}
              onClose={() => setOpen(false)}
              title={"Registration Successful!"}
              message="You have been registered Successfully! Be sure to check your email
              for confirmation to activate your account. On the next screen you will be
              onboarded to our payment processing platform. You will be asked for your industry.
              Be sure to select Property Rentals. Click the link below to continue the registration process"
              btnText="Continue"
              to={stripeRedirectLink}
            />
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

                <form className="user mt-3" onSubmit={handleSubmit(onSubmit)}>
                  {step === 0 && (
                    <>
                      <div className="row mb-3">
                        <div className="col-sm-6 mb-3 mb-sm-0">
                          <input
                            {...register("first_name", {
                              required: "This is a required field",
                              minLength: {
                                value: 3,
                                message:
                                  "Minimum length should be 3 characters",
                              },
                            })}
                            type="text"
                            className="form-control"
                            placeholder="First Name"
                          />
                          <span style={validationMessageStyle}>
                            {errors.first_name && errors.first_name.message}
                          </span>
                        </div>
                        <div className="col-sm-6">
                          <input
                            {...register("last_name", {
                              required: "This is a required field",
                              minLength: {
                                value: 3,
                                message:
                                  "Minimum length should be 3 characters",
                              },
                            })}
                            className="form-control "
                            type="text"
                            placeholder="Last Name"
                          />
                          <span style={validationMessageStyle}>
                            {errors.last_name && errors.last_name.message}
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <input
                          {...register("username", {
                            required: "This is a required field",
                            minLength: {
                              value: 3,
                              message: "Minimum length should be 3 characters",
                            },
                          })}
                          className="form-control"
                          type="text"
                          placeholder="Username"
                        />
                        <span style={validationMessageStyle}>
                          {errors.username && errors.username.message}
                        </span>
                      </div>
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
                          aria-describedby="emailHelp"
                          placeholder="Email Address"
                        />
                        <span style={validationMessageStyle}>
                          {errors.email && errors.email.message}
                        </span>
                      </div>
                      <div className="row mb-3">
                        <div className="col-sm-6 mb-3 mb-sm-0">
                          <input
                            {...register("password", {
                              required: "This is a required field",
                              minLength: {
                                value: 6,
                                message:
                                  "Minimum length should be 6 characters",
                              },
                              pattern: {
                                value:
                                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                                message:
                                  "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                              },
                            })}
                            className="form-control"
                            type="password"
                            id="examplePasswordInput"
                            placeholder="Password"
                          />
                          <span style={validationMessageStyle}>
                            {errors.password && errors.password.message}
                          </span>
                        </div>
                        <div className="col-sm-6">
                          <input
                            {...register("password_repeat", {
                              required: "This is a required field",
                              minLength: {
                                value: 6,
                                message:
                                  "Minimum length should be 6 characters",
                              },
                              validate: (val) => {
                                if (watch("password") != val) {
                                  return "Your passwords do not match";
                                }
                              },
                            })}
                            className="form-control"
                            type="password"
                            id="exampleRepeatPasswordInput"
                            placeholder="Repeat Password"
                          />
                          <span style={validationMessageStyle}>
                            {errors.password_repeat &&
                              errors.password_repeat.message}
                          </span>
                        </div>
                      </div>
                      <UIButton
                        onClick={() => {
                          console.log(errors);
                          trigger([
                            "first_name",
                            "last_name",
                            "username",
                            "email",
                            "password",
                            "password_repeat",
                          ]);
                          if (
                            !errors.first_name &&
                            !errors.last_name &&
                            !errors.username &&
                            !errors.email &&
                            !errors.password &&
                            !errors.password_repeat
                          ) {
                            console.log("No errors");
                            setStep(1);
                          }
                        }}
                        style={{ width: "100%" }}
                        btnText="Next"
                      />
                    </>
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
                          type="submit"
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
                    to="/dashboard/landlord/login"
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

export default LandlordRegister;
