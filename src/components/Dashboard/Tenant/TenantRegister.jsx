import React, { useState } from "react";
import { authUser, uiGreen } from "../../../constants";
import { faker } from "@faker-js/faker";
import {
  getRentalApplicationByApprovalHash,
  register_tenant,
  updateUnit,
  verifyTenantRegistrationCredentials,
} from "../../../api/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import AlertModal from "../Modals/AlertModal";
import ProgressModal from "../Modals/ProgressModal";
import { Button } from "@mui/material";
import { useEffect } from "react";
import AddPaymentMethod from "./AddPaymentMethod";

const TenantRegister = () => {
  const { lease_agreement_id, approval_hash, unit_id } = useParams();

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
  const [isLoading, setIsLoading] = useState(false);
  const [showStep1, setShowStep1] = useState(true);
  const [showStep2, setShowStep2] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
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
        setFirstName(res.first_name);
        setLastName(res.last_name);
        setEmail(res.email);
        setUserName(faker.internet.userName({ firstName, lastName }));
      }
    });
  }, []);

  //Create handlSubmit() function to handle form submission to create a new user using the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.first_name = firstName;
    data.last_name = lastName;
    data.username = userName;
    data.email = email;
    data.password = password;
    data.unit_id = unit_id;
    data.lease_agreement_id = lease_agreement_id;
    data.approval_hash = approval_hash;
    console.log(data);
    //Show success message
    setErrorMode(false);
    setOpen(true);
    setIsLoading(false);
    //Call the API to create a new user
    const response = await register_tenant(data).then((res) => {
      console.log(res);
      if (res.token) {
        // If the user was created successfully, set token in local storage and redirect to dashboard
        localStorage.setItem("accessToken", res.token);
        localStorage.setItem("authUser", JSON.stringify(res.userData));

        //Update Unit to have tenant id of newly created user
        // console.log("token", localStorage.getItem("accessToken"));
        // updateUnit(unit_id, { tenant_id: res.userData.id }).then((res) => {
        //   console.log("Update Unit Response", res);
        // });
        //
        setUserId(authUser.id);
        //Show success message
        setErrorMode(false);
        setOpen(true);
        setIsLoading(false);
        //TODO: On submit update lease agrrement model to attach newly created user, etc.
        //TODO: On submit, send email to tenant to confirm email address
        //TODO: On submit, send email to landlord to confirm new tenant
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
              title={"Registration Failed"}
              message="Registration failed. Please try again"
              btnText="Close"
              to={`/dashboard/tenant/register/${lease_agreement_id}/${approval_hash}/`}
            />
          ) : (
            <AlertModal
              open={true}
              onClose={() => setOpen(false)}
              title={"Registration Successful!"}
              message="Your account has been created successfully! Be Sure to check for your confirmation email to activate your account. Click the link below to be redirected to your dashboard."
              btnText="Go To Dashboard"
              to={`/dashboard/tenant/`}
            />
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
                  style={{ maxWidth: "250px", marginBottom: "25px" }}
                  src="/assets/img/key-flow-logo-white-transparent.png"
                />

                <form className="user" onSubmit={handleSubmit}>
                  <input type="hidden" name="account_type" value="tenant" />

                  {showStep1 && (
                    <div className="step-1">
                      <h5 className="mb-3"> Create Your Account</h5>
                      <div className="row mb-3">
                        <div className="col-sm-6 mb-3 mb-sm-0">
                          <label className="form-label">First Name</label>
                          <input
                            className="form-control"
                            type="text"
                            id="exampleFirstName"
                            placeholder="First Name"
                            name="first_name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label">Last Name</label>
                          <input
                            className="form-control"
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
                        <label className="form-label">E-mail</label>
                        <input
                          className="form-control"
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
                        <div className="col-sm-12 col-md-6 mb-3 mb-sm-0">
                          <label className="form-label">Password</label>
                          <input
                            className="form-control"
                            type="password"
                            id="examplePasswordInput"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <div className="col-sm-12 col-md-6">
                          <label className="form-label">Retype Password</label>
                          <input
                            className="form-control"
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
                          marginTop: "20px",
                          background: uiGreen,
                          border: "none",
                          textTransform: "none",
                          color: "white",
                        }}
                      >
                        Sign Up
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
                  {showStep2 && <AddPaymentMethod user_id={userId} />}
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
