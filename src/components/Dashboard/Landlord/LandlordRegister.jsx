import React, { useState } from "react";
import { uiGreen } from "../../../constants";
import { fa, faker } from "@faker-js/faker";
import { registerLandlord } from "../../../api/api";
import { Link, useNavigate } from "react-router-dom";
import AlertModal from "../Modals/AlertModal";
import ProgressModal from "../Modals/ProgressModal";
import { Input, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../constants";
const LandlordRegister = () => {
  //Create a state for the form data
  const [firstName, setFirstName] = useState(faker.person.firstName());
  const [lastName, setLastName] = useState(faker.person.lastName());

  const [open, setOpen] = useState(false);
  const [errorMode, setErrorMode] = useState(false);
  const [stripeRedirectLink, setStripeRedirectLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: firstName,
      last_name: lastName,
      email: faker.internet.email({ firstName, lastName }),
      username: faker.internet.userName({ firstName, lastName }),
      password: "password",
      password_repeat: "password",
    },
  });

  //TODO: Add plan selector and add payment method to onboarding flow

  //Create handlSubmit() function to handle form submission to create a new user using the API
  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log(data);
    //Call the API to create a new user
    const response = await registerLandlord(data).then((res) => {
      console.log(res);
      if (res.token) {
        // If the user was created successfully, set token in local storage and redirect to dashboard
        localStorage.setItem("accessToken", res.token);
        localStorage.setItem("authUser", JSON.stringify(res.userData));

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
              for confirmation to activate your account. Click the link below to continue
              the registration process"
              btnText="Continue"
              to={stripeRedirectLink}
            />
          )}
        </>
      )}

      <div className="row">
        <div className="col-md-4 col-sm-12 login-col " style={{}}>
          <div className="row card py-3">
            <div className=" ">
              <img
                style={{ maxWidth: "175px", marginBottom: "25px" }}
                src="/assets/img/key-flow-logo-white-transparent.png"
              />
              <form className="user " onSubmit={handleSubmit(onSubmit)}>
                <input
                  {...register("account_type")}
                  type="hidden"
                  name="account_type"
                  defaultValue="landlord"
                />
                <div className="row mb-3">
                  <div className="col-sm-6 mb-3 mb-sm-0">
                    <input
                      {...register("first_name", {
                        required: "This is a required field",
                        minLength: {
                          value: 3,
                          message: "Minimum length should be 3 characters",
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
                          message: "Minimum length should be 3 characters",
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
                          message: "Minimum length should be 6 characters",
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
                          message: "Minimum length should be 6 characters",
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
                      {errors.password_repeat && errors.password_repeat.message}
                    </span>
                  </div>
                </div>
                <Button
                  className="btn btn-primary d-block  w-100 mb-2"
                  type="submit"
                  style={{
                    background: uiGreen,
                    border: "none",
                    textTransform: "none",
                    color: "white",
                  }}
                >
                  Sign Up
                </Button>
              </form>
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
        </div>
        <div
          className="col-md-8 banner-col  d-none d-md-block"
          style={{
            background: "url('/assets/img/register-page-banner-1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
          }}
        >
          {/* <img style={{width:"100%"}} src="/assets/img/login-page-banner.jpg" /> */}
        </div>
        {/* d-flex justify-content-center */}
      </div>
    </div>
  );
};

export default LandlordRegister;
