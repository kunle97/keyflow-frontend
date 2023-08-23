import React, { useState } from "react";
import { uiGreen } from "../../../constants";
import { faker } from "@faker-js/faker";
import { register } from "../../../api/api";
import { Link, useNavigate } from "react-router-dom";
import AlertModal from "../AlertModal";
import ProgressModal from "../ProgressModal";
import { Input, Button } from "@mui/material";

const LandlordRegister = () => {
  //Create a state for the form data
  const [firstName, setFirstName] = useState(faker.person.firstName());
  const [lastName, setLastName] = useState(faker.person.lastName());
  const [userName, setUserName] = useState(
    faker.internet.userName({ firstName, lastName })
  );
  const [email, setEmail] = useState(
    faker.internet.email({ firstName, lastName })
  );
  const [password, setPassword] = useState("password");
  const [password2, setPassword2] = useState("password");
  const [open, setOpen] = useState(false);
  const [errorMode, setErrorMode] = useState(false);
  const [stripeRedirectLink, setStripeRedirectLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState();

  const navigate = useNavigate();

  //Create handlSubmit() function to handle form submission to create a new user using the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log(data);
    //Call the API to create a new user
    const response = await register(data).then((res) => {
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
              to="/dashboard/register"
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
        {" "}
        <div className="col-md-4 col-sm-12 login-col " style={{}}>
          <div className="row">
            <div className=" ">
              <img
                style={{ width: "60%", marginBottom: "25px" }}
                src="/assets/img/key-flow-logo-white-transparent.png"
              />
              <form className="user" onSubmit={handleSubmit}>
                <input type="hidden" name="account_type" value="landlord" />
                <div className="row mb-3">
                  <div className="col-sm-6 mb-3 mb-sm-0">
                    <Input
                      className="form-control form-control-user"
                      type="text"
                      id="exampleFirstName"
                      placeholder="First Name"
                      name="first_name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="col-sm-6">
                    <Input
                      className="form-control form-control-user"
                      type="text"
                      id="exampleLastName"
                      placeholder="Last Name"
                      name="last_name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <Input
                    className="form-control form-control-user"
                    type="text"
                    id="exampleInputUsername"
                    aria-describedby="usernameHelp"
                    placeholder="Username"
                    name="username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <Input
                    className="form-control form-control-user"
                    type="email"
                    id="exampleInputEmail"
                    aria-describedby="emailHelp"
                    placeholder="Email Address"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="row mb-3">
                  <div className="col-sm-6 mb-3 mb-sm-0">
                    <Input
                      className="form-control form-control-user"
                      type="password"
                      id="examplePasswordInput"
                      placeholder="Password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="col-sm-6">
                    <Input
                      className="form-control form-control-user"
                      type="password"
                      id="exampleRepeatPasswordInput"
                      placeholder="Repeat Password"
                      name="password_repeat"
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                    />
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
                  to="/dashboard/login"
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
