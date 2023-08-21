import React, { useState } from "react";
import { uiGreen } from "../../constants";
import { faker } from "@faker-js/faker";
import { register } from "../../api/api";
import { useNavigate } from "react-router-dom";
import AlertModal from "./AlertModal";
import ProgressModal from "./ProgressModal";

const Register = () => {
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
    <div className="container">
      <ProgressModal open={isLoading} onClose={()=>setIsLoading} title="Registering Your Account..."   />
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
      <div className="card shadow-lg o-hidden border-0 my-5">
        <div className="card-body p-0">
          <div className="row">
            <div className="col-lg-12">
              <div className="p-5">
                <div className="text-center">
                  <h4 className="text-light mb-4">Create an Account!</h4>
                </div>
                <form className="user" onSubmit={handleSubmit}>
                  <input type="hidden" name="account_type" value="landlord" />
                  <div className="row mb-3">
                    <div className="col-sm-6 mb-3 mb-sm-0">
                      <input
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
                      <input
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
                    <input
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
                    <input
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
                      <input
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
                      <input
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
                  <button
                    className="btn btn-primary d-block btn-user w-100"
                    type="submit"
                    style={{ background: uiGreen, border: "none" }}
                  >
                    Register Account
                  </button>
                </form>
                <div className="text-center">
                  <a
                    className="small"
                    href="forgot-password.html"
                    style={{ color: uiGreen }}
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="text-center">
                  <a
                    className="small"
                    href="/dashboard/login"
                    style={{ color: uiGreen }}
                  >
                    Already have an account? Login!
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
