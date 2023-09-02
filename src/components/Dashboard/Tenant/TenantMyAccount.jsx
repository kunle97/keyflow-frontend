import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { authUser, uiGreen } from "../../../constants";
import { listStripePaymentMethods } from "../../../api/api";
import { ListDivider } from "@mui/joy";
import UIButton from "../UIButton";
import { useNavigate } from "react-router";

const TenantMyAccount = () => {
  const [email, setEmail] = useState(authUser.email);
  const [firstName, setFirstName] = useState(authUser.first_name);
  const [lastName, setLastName] = useState(authUser.last_name);
  const [paymentMethods, setPaymentMethods] = useState([]); //Value of either the Stripe token or the Plaid token
  const navigate = useNavigate();
  useEffect(() => {
    //Get the payment methods for the user
    listStripePaymentMethods(`${authUser.id}`).then((res) => {
      console.log(res.data);
      setPaymentMethods(res.data);
    });
  }, []);

  return (
    <div className="container">
      <h3 className="text-white mb-4">My Account</h3>
      <div className="row mb-3">
        <div className="col">
          <div className="row">
            <div className="col">
              <div className="card shadow mb-3">
                <div className="card-body">
                  <form>
                    {" "}
                    <div className="row">
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="first_name"
                          >
                            First Name
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            id="first_name"
                            placeholder="John"
                            name="first_name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            style={{
                              borderStyle: "none",
                              color: "rgb(255,255,255)",
                            }}
                          />
                        </div>
                      </div>
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="last_name"
                          >
                            Last Name
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            id="last_name"
                            placeholder="Doe"
                            name="last_name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            style={{
                              borderStyle: "none",
                              color: "rgb(255,255,255)",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="email"
                          >
                            Email Address
                          </label>
                          <input
                            className="form-control"
                            type="email"
                            id="email"
                            placeholder="user@example.com"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                              borderStyle: "none",
                              color: "rgb(255,255,255)",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <button
                        className="btn btn-primary btn-sm ui-btn"
                        type="submit"
                        style={{ padding: "6px 12px" }}
                      >
                        Save Settings
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <h5 className="text-primary mb-2 card-header-text">
                Change Password
              </h5>
              <div className="card shadow mb-3">
                <div className="card-body">
                  <form>
                    <div className="row">
                      <div className="col-12">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="username"
                          >
                            Current Password
                          </label>
                          <input
                            className="form-control border-0"
                            type="password"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="email"
                          >
                            Retype-Current Password
                          </label>
                          <input
                            className="form-control border-0"
                            type="password"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="first_name"
                          >
                            New Password
                          </label>
                          <input
                            className="form-control border-0"
                            type="password"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <button
                        className="btn btn-primary btn-sm ui-btn"
                        type="submit"
                        style={{ padding: "6px 12px" }}
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-6 ">
              <div className="mb-3" style={{ overflow: "auto" }}>
                <h5
                  className="text-primary  my-1 card-header-text"
                  style={{ float: "left" }}
                >
                  Payment Methods
                </h5>
                <UIButton
                  style={{ float: "right" }}
                  onClick={() => {
                    navigate("/dashboard/tenant/add-payment-method");
                  }}
                  btnText="Add New"
                />
              </div>
              <div className="card shadow mb-3">
                <div className="card-body">
                  <form>
                    <div className="row">
                      {paymentMethods.map((paymentMethod) => {
                        return (
                          <div className="col-sm-12 col-md-12 col-lg-12 mb-2">
                            <Box className="mb-3" sx={{ display: "flex" }}>
                              <Box sx={{ flex: "2" }}>
                                <Typography className="text-white">
                                  {paymentMethod.card.brand} ending in{" "}
                                  {paymentMethod.card.last4}
                                </Typography>
                                <Typography
                                  sx={{ fontSize: "10pt" }}
                                  className="text-white"
                                >
                                  Expires {paymentMethod.card.exp_month}/
                                  {paymentMethod.card.exp_year}
                                  {/* <span style={{ color: uiGreen }}>
                                   {" "} - {" "} Primary Method
                                  </span> */}
                                </Typography>
                              </Box>
                              <Box>
                                <Button sx={{ color: uiGreen }}>Edit</Button>
                              </Box>
                            </Box>
                            <ListDivider sx={{ color: "white" }} />
                          </div>
                        );
                      })}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantMyAccount;
