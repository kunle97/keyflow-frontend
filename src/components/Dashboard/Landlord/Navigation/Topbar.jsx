import React, { useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { logout } from "../../../../api/api";
import { useNavigate } from "react-router";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import { Link } from "react-router-dom";
import { authUser, token, uiGreen } from "../../../../constants";
import { faker } from "@faker-js/faker";
const Topbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    //call logout api
    const response = await logout(token);
    console.log("Logout funtion return value on Login.jsx: ", response);

    if (response.status == 200) {
      //Set authUser and isLoggedIn in context
      // setAuthUser({});
      // setIsLoggedIn(false);
      setOpen(true);
    }
  };

  return (
    <div className="container">
      {open && (
        <AlertModal
          open={true}
          onClose={() => setOpen(false)}
          title={"Logout Successful!"}
          message="You have been logged Out Successfully! Click the link below to  return to the home page"
          btnText="Return Home"
          to={
            authUser.account_type === "landlord"
              ? "/dashboard/landlord/login"
              : "/dashboard/tenant/login"
          }
        />
      )}
      <nav
        className="navbar navbar-expand shadow mb-4 topbar static-top navbar-light"
        style={{
          background: "#2c3a4a",
          boxShadow:
            "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23) !important",
        }}
      >
        <div className="container-fluid">
          <button
            className="btn btn-link d-md-none rounded-circle me-3"
            id="sidebarToggleTop"
            type="button"
          >
            <i className="fas fa-bars" />
          </button>
          <form className="d-none d-sm-inline-block me-auto ms-md-3 my-2 my-md-0 mw-100 navbar-search">
            <div className="input-group">
              <input
                className="bg-light form-control border-0 small top-bar-searchbar"
                type="text"
                placeholder="Search for ..."
              />
              <button
                className="btn btn-primary py-0"
                type="button"
                style={{ background: uiGreen, borderStyle: "none" }}
              >
                <i className="fas fa-search" />
              </button>
            </div>
          </form>
          <ul className="navbar-nav flex-nowrap ms-auto">
            <li className="nav-item dropdown d-sm-none no-arrow">
              <a
                className="dropdown-toggle nav-link"
                aria-expanded="false"
                data-bs-toggle="dropdown"
                href="#"
              >
                <i className="fas fa-search" />
              </a>
              <div
                className="dropdown-menu dropdown-menu-end p-3 animated--grow-in"
                aria-labelledby="searchDropdown"
              >
                <form className="me-auto navbar-search w-100">
                  <div className="input-group">
                    <input
                      className="bg-light form-control border-0 small"
                      type="text"
                      placeholder="Search for ..."
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary py-0" type="button">
                        <i className="fas fa-search" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </li>
            <li className="nav-item dropdown no-arrow mx-1">
              <div className="nav-item dropdown no-arrow">
                <a
                  className="dropdown-toggle nav-link"
                  aria-expanded="false"
                  data-bs-toggle="dropdown"
                  href="#"
                >
                  <span className="badge bg-danger badge-counter">3+</span>
                  <i className="fas fa-bell fa-fw" />
                </a>
                <div className="dropdown-menu dropdown-menu-end dropdown-list animated--grow-in">
                  <h6
                    className="dropdown-header"
                    style={{ background: uiGreen, borderStyle: "none" }}
                  >
                    alerts center
                  </h6>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <div className="me-3">
                      <div className="bg-primary icon-circle">
                        <i className="fas fa-file-alt text-white" />
                      </div>
                    </div>
                    <div>
                      <span className="small text-gray-500">
                        December 12, 2019
                      </span>
                      <p>A new monthly report is ready to download!</p>
                    </div>{" "}
                  </a>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <div className="me-3">
                      <div className="bg-success icon-circle">
                        <i className="fas fa-donate text-white" />
                      </div>
                    </div>
                    <div>
                      <span className="small text-gray-500">
                        December 7, 2019
                      </span>
                      <p>$290.29 has been deposited into your account!</p>
                    </div>{" "}
                  </a>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <div className="me-3">
                      <div className="bg-warning icon-circle">
                        <i className="fas fa-exclamation-triangle text-white" />
                      </div>
                    </div>
                    <div>
                      <span className="small text-gray-500">
                        December 2, 2019
                      </span>
                      <p>
                        Spending Alert: We've noticed unusually high spending
                        for your account.
                      </p>
                    </div>{" "}
                  </a>
                  <a
                    className="dropdown-item text-center small text-gray-500"
                    href="#"
                  >
                    Show All Alerts
                  </a>
                </div>
              </div>
            </li>
            <li className="nav-item dropdown no-arrow mx-1">
              <div className="nav-item dropdown no-arrow">
                <a
                  className="dropdown-toggle nav-link"
                  aria-expanded="false"
                  data-bs-toggle="dropdown"
                  href="#"
                >
                  <span className="badge bg-danger badge-counter">7</span>
                  <i className="fas fa-envelope fa-fw" />
                </a>
                <div
                  className="dropdown-menu dropdown-menu-end dropdown-list animated--grow-in"
                  style={{ borderStyle: "none" }}
                >
                  <h6
                    className="dropdown-header"
                    style={{ background: uiGreen, borderStyle: "none" }}
                  >
                    Messages
                  </h6>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                    style={{ borderStyle: "none" }}
                  >
                    <div className="dropdown-list-image me-3">
                      <img
                        className="rounded-circle"
                        src="../assets/img/avatars/avatar4.jpeg"
                      />
                      <div className="bg-success status-indicator" />
                    </div>
                    <div className="fw-bold">
                      <div className="text-truncate">
                        <span>
                          Hi there! I am wondering if you can help me with a
                          problem I've been having.
                        </span>
                      </div>
                      <p className="small text-gray-500 mb-0">
                        Emily Fowler - 58m
                      </p>
                    </div>{" "}
                  </a>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                    style={{ borderStyle: "none" }}
                  >
                    <div className="dropdown-list-image me-3">
                      <img
                        className="rounded-circle"
                        src="../assets/img/avatars/avatar2.jpeg"
                      />
                      <div className="status-indicator" />
                    </div>
                    <div className="fw-bold">
                      <div className="text-truncate">
                        <span>
                          I have the photos that you ordered last month!
                        </span>
                      </div>
                      <p className="small text-gray-500 mb-0">Jae Chun - 1d</p>
                    </div>{" "}
                  </a>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                    style={{ borderStyle: "none" }}
                  >
                    <div className="dropdown-list-image me-3">
                      <img
                        className="rounded-circle"
                        src="../assets/img/avatars/avatar3.jpeg"
                      />
                      <div className="bg-warning status-indicator" />
                    </div>
                    <div className="fw-bold">
                      <div className="text-truncate">
                        <span>
                          Last month's report looks great, I am very happy with
                          the progress so far, keep up the good work!
                        </span>
                      </div>
                      <p className="small text-gray-500 mb-0">
                        Morgan Alvarez - 2d
                      </p>
                    </div>{" "}
                  </a>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                    style={{ borderStyle: "none" }}
                  >
                    <div className="dropdown-list-image me-3">
                      <img
                        className="rounded-circle"
                        src="../assets/img/avatars/avatar5.jpeg"
                      />
                      <div className="bg-success status-indicator" />
                    </div>
                    <div className="fw-bold">
                      <div className="text-truncate">
                        <span>
                          Am I a good boy? The reason I ask is because someone
                          told me that people say this to all dogs, even if they
                          aren't good...
                        </span>
                      </div>
                      <p className="small text-gray-500 mb-0">
                        Chicken the Dog · 2w
                      </p>
                    </div>{" "}
                  </a>
                  <a
                    className="dropdown-item text-center small text-gray-500"
                    href="#"
                    style={{ borderStyle: "none" }}
                  >
                    Show All Alerts
                  </a>
                </div>
              </div>
              <div
                className="shadow dropdown-list dropdown-menu dropdown-menu-end"
                aria-labelledby="alertsDropdown"
              />
            </li>
            <div className="d-none d-sm-block topbar-divider" />
            <li className="nav-item dropdown no-arrow">
              <div className="nav-item dropdown no-arrow">
                <a
                  className="dropdown-toggle nav-link"
                  aria-expanded="true"
                  data-bs-toggle="dropdown"
                  href="#"
                >
                  <span className="d-none d-lg-inline me-2 text-gray-600 small">
                    {authUser.first_name} {authUser.last_name}
                  </span>
                  <img
                    className="border rounded-circle img-profile"
                    src={faker.internet.avatar()}
                  />
                </a>
                <div
                  className="dropdown-menu shadow dropdown-menu-end animated--grow-in"
                  data-bs-popper="none"
                  style={{ borderStyle: "none" }}
                >
                  <Link
                    className="dropdown-item"
                    to={
                      authUser.account_type === "landlord"
                        ? "/dashboard/landlord/my-account"
                        : "/dashboard/tenant/my-account"
                    }
                    style={{ borderStyle: "none" }}
                  >
                    <i className="fas fa-user fa-sm fa-fw me-2 text-gray-400" />
                    &nbsp;My Account
                  </Link>
                  <div className="dropdown-divider" />
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      handleLogout(e);
                    }}
                  >
                    <i className="fas fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400" />
                    &nbsp;Logout
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Topbar;
