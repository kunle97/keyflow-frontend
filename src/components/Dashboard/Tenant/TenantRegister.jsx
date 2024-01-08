import React, { useState } from "react";
import { authUser, uiGreen, uiGrey1 } from "../../../constants";
import { faker } from "@faker-js/faker";
import { getRentalApplicationByApprovalHash } from "../../../api/rental_applications";
import { verifyTenantRegistrationCredentials } from "../../../api/tenants";
import { registerTenant } from "../../../api/auth";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import AlertModal from "../UIComponents/Modals/AlertModal";
import ProgressModal from "../UIComponents/Modals/ProgressModal";
import { Button } from "@mui/material";
import { useEffect } from "react";
import { CardElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { PlaidLink } from "react-plaid-link";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../constants";
import { makeId } from "../../../helpers/utils";
import { send } from "@emailjs/browser";
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
  const [password, setPassword] = useState("password");
  const [password2, setPassword2] = useState("password");
  const [open, setOpen] = useState(false);
  const [errorMode, setErrorMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showStep1, setShowStep1] = useState(true);
  const [showStep2, setShowStep2] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm({});
  //Cards state variables
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [cardMode, setCardMode] = useState(true);
  const [returnToken, setReturnToken] = useState(null); //Value of either the Stripe token or the Plaid token
  const [successMode, setSuccessMode] = useState(false); //If true, display error message
  const [paymentMethodId, setPaymentMethodId] = useState(null); //If true, display error message
  const handlePlaidSuccess = (token, metadata) => {
    console.log(token);
    console.log(metadata);
    setReturnToken(token);
  };

  //Create handlSubmit() function to handle form submission to create a new user using the API
  const onSubmit = async (data) => {
    setIsLoading(true);
    let payload = {};
    //Captuere form data
    data.unit_id = unit_id;
    data.lease_agreement_id = lease_agreement_id;
    data.approval_hash = approval_hash;
    data.activation_token = makeId(32);
    console.log(data);

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
        console.log("Return Token:", returnToken);
        console.log("PaymentMethod:", paymentMethod);
        data.payment_method_id = paymentMethod.id;

        console.log("COMPLETE FORM DATA", data);
      } else {
      }
    } catch (err) {
      setMessage("Error adding your payment method");
      console.log(err);
      setErrorMode(true);
      setSuccessMode(false);
      setIsLoading(false);
      return;
    }

    const response = await registerTenant(data).then((res) => {
      console.log(res);
      if (res.status === 200) {
        setUserId(authUser.id);

        //Show success message
        setMessage("Your account has been created successfully!");
        setErrorMode(false);
        setOpen(true);
        setIsLoading(false);
        //Send actication email
        const activation_link = `${process.env.REACT_APP_HOSTNAME}/dashboard/activate-user-account/${data.activation_token}`;
        console.log(activation_link);
        const email_data = {
          to_email: data.email,
          reply_to: `donotreply@${process.env.REACT_APP_HOSTNAME}`,
          subject: "Activate Your KeyFlow Account",
          html_message: `Hi ${data.first_name},<br/><br/>Thank you for registering with KeyFlow. Please click the link below to activate your account.<br/><br/><a href="${activation_link}">Activate Account</a><br/><br/>Regards,<br/>KeyFlow Team`,
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

        //TODO: On submit update lease agrrement model to attach newly created user, etc.
        //TODO: On submit, send email to tenant to confirm email address
        //TODO: On submit, send email to landlord to confirm new tenant
      } else {
        //TODO: Show error message moodal
        setErrorMode(true);
        setOpen(true);
        setIsLoading(false);
        return;
      }
    });
  };

  //Veryfy that the lease agreement id and approval hash are valid on page load
  useEffect(() => {
    verifyTenantRegistrationCredentials({
      lease_agreement_id,
      approval_hash,
    }).then((res) => {
      if (res.status !== 200) {
        //TODO: Show error message modal to make the tenant contact thier landlord
      }
    });
    //TODO: Populate the form with rental application data
    //Retrieve users rental application data using the approval_hash
    getRentalApplicationByApprovalHash(approval_hash).then((res) => {
      console.log(res);
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
              : "Password1",
          password_repeat:
            process.env.REACT_APP_ENVIRONMENT !== "development"
              ? ""
              : "Password1",
        };
        // Set the preloaded data in the form using setValue
        Object.keys(preloadedData).forEach((key) => {
          setValue(key, preloadedData[key]);
        });
      }
    });
  }, []);
  return (
    <div className="container-fluid">
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
              title={"Registration Failed"}
              message="Registration failed. Please try again"
              btnText="Close"
              to={`/dashboard/tenant/register/${lease_agreement_id}/${approval_hash}/`}
            />
          ) : (
            // <AlertModal
            //   open={true}
            //   onClose={() => setOpen(false)}
            //   title={"Registration Successful!"}
            //   message="Your account has been created successfully! Be Sure to check for your confirmation email to activate your account. Click the link below to be redirected to your dashboard."
            //   btnText="Go To Dashboard"
            //   to={`/dashboard/tenant/`}
            // />
            <Navigate to={`/dashboard/activate-account/`} replace />
          )}
        </>
      )}

      <div className="row">
        {" "}
        <div className="col-md-4 col-sm-12 login-col " style={{}}>
          <div className="row">
            <div className="card">
              <div className="card-body">
                <img
                  style={{ maxWidth: "200px", marginBottom: "25px" }}
                  src="/assets/img/key-flow-logo-black-transparent.png"
                />
                <form className="user" onSubmit={handleSubmit(onSubmit)}>
                  <input type="hidden" name="account_type" value="tenant" />
                  {showStep1 && (
                    <div className="step-1">
                      <h5 className="mb-3"> Create Your Account</h5>
                      <div className="row mb-3">
                        <div className="col-sm-6 mb-3 mb-sm-0">
                          <label className="form-label text-black">
                            First Name
                          </label>
                          <input
                            {...register("first_name", {
                              required: "This is a required field",
                              minLength: {
                                value: 3,
                                message: "First name must be at least 3 chars",
                              },
                            })}
                            className="form-control"
                            type="text"
                            id="exampleFirstName"
                            placeholder="First Name"
                          />
                          <span style={validationMessageStyle}>
                            {errors.first_name && errors.first_name.message}
                          </span>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label text-black">
                            Last Name
                          </label>
                          <input
                            {...register("last_name", {
                              required: "This is a required field",
                              minLength: {
                                value: 3,
                                message: "Last name must be at least 3 chars",
                              },
                            })}
                            className="form-control"
                            type="text"
                            id="exampleLastName"
                            placeholder="Last Name"
                          />
                          <span style={validationMessageStyle}>
                            {errors.last_name && errors.last_name.message}
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-black">
                          Username
                        </label>
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
                        <label className="form-label text-black">E-mail</label>
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
                        <div className="col-sm-12 col-md-6 mb-3 mb-sm-0">
                          <label className="form-label text-black">
                            Password
                          </label>
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
                        <div className="col-sm-12 col-md-6">
                          <label className="form-label text-black">
                            Retype Password
                          </label>
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
                      <Button
                        onClick={() => {
                          trigger([
                            "first_name",
                            "last_name",
                            "username",
                            "email",
                            "password",
                            "password_repeat",
                          ]);
                          if (
                            !errors.firstName &&
                            !errors.lastName &&
                            !errors.username &&
                            !errors.email &&
                            !errors.password &&
                            !errors.password_repeat
                          ) {
                            setShowStep1(false);
                            setShowStep2(true);
                          }
                        }}
                        className="btn btn-primary d-block  w-100 mb-2"
                        type="button"
                        style={{
                          marginTop: "20px",
                          background: uiGreen,
                          border: "none",
                          textTransform: "none",
                          color: "white",
                        }}
                      >
                        Next
                      </Button>

                      {/* <div className="mb-2">
                        <Link
                          className="small"
                          to="/dashboard/tenant/login"
                          style={{ color: uiGreen }}
                        >
                          Already have an account? Login!
                        </Link>
                      </div> */}
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
                        This will be used to pay for your rent monthly and all
                        other expenses.
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
                        <FormControl sx={{ marginBottom: "10px" }}>
                          <FormLabel
                            sx={{ fontSize: "12pt" }}
                            id="payment-type"
                          >
                            Method Type
                          </FormLabel>
                          <RadioGroup
                            row
                            defaultValue={"card"}
                            aria-labelledby="payment-type"
                            name="payment_method"
                          >
                            <FormControlLabel
                              value="card"
                              control={
                                <Radio
                                  onClick={() => setCardMode(true)}
                                  onSelect={() => setCardMode(true)}
                                  sx={{
                                    color: "#f2f2f2",
                                    "&.Mui-checked": {
                                      color: uiGreen,
                                    },
                                  }}
                                />
                              }
                              label="Debit/Credit Card"
                              sx={{ color: "black" }}
                            />
                            <FormControlLabel
                              value="bank_account"
                              control={
                                <Radio
                                  onClick={() => setCardMode(false)}
                                  onSelect={() => setCardMode(false)}
                                  sx={{
                                    color: "#f2f2f2",
                                    "&.Mui-checked": {
                                      color: uiGreen,
                                    },
                                  }}
                                />
                              }
                              label="Bank Account"
                              sx={{ color: "black" }}
                            />
                          </RadioGroup>
                        </FormControl>
                        <div className="stripeSection">
                          {cardMode ? (
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
                          ) : (
                            <PlaidLink
                              token={`${process.env.REACT_APP_PLAID_CLIENT_ID}`}
                              onSuccess={handlePlaidSuccess}
                              // Additional Plaid Link configuration options
                            >
                              Add Bank Account
                            </PlaidLink>
                          )}
                          {/* <UIButton
                              onClick={handleSubmit}
                              btnText="Add Payment Method"
                              style={{ marginTop: "15px", width: "100%" }}
                            /> */}
                          <Button
                            className="btn btn-primary d-block  w-100 mb-2"
                            type="submit"
                            style={{
                              marginTop: "20px",
                              background: uiGreen,
                              border: "none",
                              textTransform: "none",
                              color: "white",
                            }}
                          >
                            Sign Up
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          className="col-md-8 banner-col  d-none d-md-block"
          style={{
            background: "url('/assets/img/tenant-register-page-banner.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "5%",
            height: "100vh",
          }}
        ></div>
      </div>
    </div>
  );
};

export default TenantRegister;
