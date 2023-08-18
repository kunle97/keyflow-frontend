import React from "react";

const MyAccount = () => {
  return (
    <div className="container">
      <h3 className="text-white mb-4">My Account</h3>
      <div className="row mb-3">
        <div className="col">
          <div className="row mb-3 d-none">
            <div className="col">
              <div className="card text-white bg-primary shadow">
                <div className="card-body">
                  <div className="row mb-2">
                    <div className="col">
                      <p className="m-0">Peformance</p>
                      <p className="m-0">
                        <strong>65.2%</strong>
                      </p>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-rocket fa-2x" />
                    </div>
                  </div>
                  <p className="text-white-50 small m-0">
                    <i className="fas fa-arrow-up" />
                    &nbsp;5% since last month
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card text-white bg-success shadow">
                <div className="card-body">
                  <div className="row mb-2">
                    <div className="col">
                      <p className="m-0">Peformance</p>
                      <p className="m-0">
                        <strong>65.2%</strong>
                      </p>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-rocket fa-2x" />
                    </div>
                  </div>
                  <p className="text-white-50 small m-0">
                    <i className="fas fa-arrow-up" />
                    &nbsp;5% since last month
                  </p>
                </div>
              </div>
            </div>
          </div>
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
                            Connect/Manage Account
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
