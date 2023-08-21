import React from "react";
import { authUser } from "../../constants";

const MyAccount = () => {
  //Create state for username, email, first name, and last name
  const [username, setUsername] = React.useState(authUser.username);
  const [email, setEmail] = React.useState(authUser.email);
  const [firstName, setFirstName] = React.useState(authUser.first_name);
  const [lastName, setLastName] = React.useState(authUser.last_name);

  return (
    <div className="container">
      <h3 className="text-white mb-4">My Account</h3>
      <div className="row mb-3">
        <div className="col">
          <div className="row">
            <div className="col">
              <div className="card shadow mb-3">
                <div className="card-header py-3">
                  <h6 className="text-primary fw-bold m-0 card-header-text">
                    Basic Info
                  </h6>
                </div>
                <div className="card-body">
                  <form>
                    <div className="row">
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="username"
                          >
                            <strong>Username</strong>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            id="username"
                            placeholder="user.name"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                            htmlFor="email"
                          >
                            <strong>Email Address</strong>
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
                    <div className="row">
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="first_name"
                          >
                            <strong>First Name</strong>
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
                            <strong>Last Name</strong>
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
              <div className="card shadow mb-3">
                <div className="card-header py-3">
                  <h6 className="text-primary fw-bold m-0 card-header-text">
                    Change Password
                  </h6>
                </div>
                <div className="card-body">
                  <form>
                    <div className="row">
                      <div className="col-12">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="username"
                          >
                            <strong>Current Password</strong>
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
                            <strong>Retype-Current Password</strong>
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
                            <strong>New Password</strong>
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
              <div className="card shadow mb-3">
                <div className="card-header py-3">
                  <h6 className="text-primary fw-bold m-0 card-header-text">
                    Banking Information
                  </h6>
                </div>
                <div className="card-body">
                  <form>
                    <div className="row">
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="username"
                          >
                            <strong>Account Number</strong>
                          </label>
                          <p className="text-white">****9010</p>
                        </div>
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="first_name"
                          >
                            <strong>Account Type</strong>
                          </label>
                          <p className="text-white">Checking</p>
                        </div>
                      </div>
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="email"
                          >
                            <strong>Routing Number</strong>
                            <br />
                          </label>
                          <p className="text-white">****8990</p>
                        </div>
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="last_name"
                          >
                            <strong>Bank Setup</strong>
                          </label>
                          <button
                            className="btn btn-primary ui-btn d-block"
                            type="button"
                          >
                            Manage Payments
                          </button>
                        </div>
                      </div>
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

export default MyAccount;
