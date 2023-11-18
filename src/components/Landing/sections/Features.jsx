import React from "react";
import { Parallax } from "react-scroll-parallax";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import { uiGreen } from "../../../constants";
import SouthIcon from "@mui/icons-material/South";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
const Features = () => {
  const featureIconStyle = {
    color: uiGreen,
    fontSize: "3rem",
  };
  return (
    <section id="features" className="landing-section">
      <div className="section-header">
        <h2>Let us do the heavy lifting</h2>
        <p>
          Enhanced features to simplfy and navigate a complex&nbsp;
          industry&nbsp;
        </p>
      </div>
      <div className="container">
        <div className="row feature-row">
          <div className="col-md-6">
            <div>
              <PaymentIcon sx={featureIconStyle} />
              <h2 className="feature-heading">
                One time payments with tenant auto-pay
              </h2>
              <p>
                <span style={{ color: "rgb(0, 0, 0)" }}>
                  Nulla eget mollis libero. Vestibulum lacinia vitae sapien id
                  varius. Donec sed dolor quis ligula hendrerit lobortis. Donec
                  dictum dui nec rhoncus mattis. Quisque sed molestie lacus.
                  Duis id nisi non ligula blandit tempor ac ut tortor.&nbsp;
                </span>
                <br />
              </p>
            </div>
          </div>
          <div className="col-md-6 align-self-center">
            <div className="card feature-card">
              <div className="card-body">
                <h4
                  className="card-title"
                  style={{ color: "rgb(255,255,255)" }}
                >
                  <i
                    className="fas fa-dollar-sign feature-card-icon"
                    style={{ color: "rgb(58, 175, 92)" }}
                  />
                  &nbsp; Payment Success
                </h4>
                <h4 className="feature-card-text">+$3,400</h4>
                <p className="feature-card-text">
                  John Smith made a rent payment today.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row feature-row">
          <div className="col-md-6 align-self-center">
            <div className="card feature-card">
              <div className="card-body">
                <h4
                  className="card-title"
                  style={{ color: "rgb(255,255,255)" }}
                >
                  <i className="fas fa-tools feature-card-icon" />
                  &nbsp; Maintenance Request Initiated
                </h4>
                <p>
                  <span style={{ color: "rgb(255, 255, 255)" }}>
                    One of your properties requires servicing
                  </span>
                  <br />
                </p>
                <h4 className="feature-card-text" />
                <p className="feature-card-text">
                  Status:&nbsp;<span className="pending-text">Pending</span>
                </p>
              </div>
            </div>
            {/* <div className="mr-divider" /> */}
            <center style={{ margin: "15px 0" }}>
              {" "}
              <SouthIcon sx={featureIconStyle} />
            </center>
            <div className="card feature-card">
              <div className="card-body">
                <h4
                  className="card-title"
                  style={{ color: "rgb(255,255,255)" }}
                >
                  <i className="fas fa-tools feature-card-icon" />
                  &nbsp; Vendor found
                </h4>
                <p>
                  <span style={{ color: "rgb(255, 255, 255)" }}>
                    A vendor has been found for your maintenance request and
                    will contact you on further&nbsp;details about repairs
                  </span>
                  <br />
                </p>
                <h4 className="feature-card-text" />
                <p className="feature-card-text">
                  Status:&nbsp;
                  <span className="in-progress-text">In Progress</span>
                </p>
              </div>
            </div>
            {/* <div className="mr-divider" /> */}
            <center style={{ margin: "15px 0" }}>
              {" "}
              <SouthIcon sx={featureIconStyle} />
            </center>
            <div className="card feature-card">
              <div className="card-body">
                <h4
                  className="card-title"
                  style={{ color: "rgb(255,255,255)" }}
                >
                  <i className="fas fa-tools feature-card-icon" />
                  &nbsp; Issue has been resolved
                </h4>
                <p>
                  <span style={{ color: "rgb(255, 255, 255)" }}>
                    Your maintenance&nbsp;is now resolved.
                  </span>
                  <br />
                </p>
                <h4 className="feature-card-text" />
                <p className="feature-card-text">
                  Status:&nbsp;
                  <span className="resolved-text">Resolved</span>
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 align-self-center">
            <div>
              <HomeRepairServiceIcon sx={featureIconStyle} />
              <h2 className="feature-heading">
                Handle maintenance request workflows automatically.
              </h2>
              <p>
                <span style={{ color: "rgb(0, 0, 0)" }}>
                  Nulla eget mollis libero. Vestibulum lacinia vitae sapien id
                  varius. Donec sed dolor quis ligula hendrerit lobortis. Donec
                  dictum dui nec rhoncus mattis. Quisque sed molestie lacus.
                  Duis id nisi non ligula blandit tempor ac ut tortor.&nbsp;
                </span>
                <br />
              </p>
            </div>
          </div>
        </div>

        <div className="row feature-row">
          <div className="col-md-6">
            <div>
              <AccountBalanceIcon sx={featureIconStyle} />
              <h2 className="feature-heading">
                Manage accounting tasks like a pro
              </h2>
              <p>
                <span style={{ color: "rgb(0, 0, 0)" }}>
                  Nulla eget mollis libero. Vestibulum lacinia vitae sapien id
                  varius. Donec sed dolor quis ligula hendrerit lobortis. Donec
                  dictum dui nec rhoncus mattis. Quisque sed molestie lacus.
                  Duis id nisi non ligula blandit tempor ac ut tortor.&nbsp;
                </span>
                <br />
              </p>
            </div>
          </div>
          <div className="col-md-6 align-self-center">
            <div className="card feature-card">
              <div className="card-body">
                <h4>Assets</h4>
                <div className="row">
                  <div className="col-md-6">
                    <h5
                      className="card-title"
                      style={{ color: "rgb(255,255,255)" }}
                    >
                      {/* <i
                    className="fas fa-dollar-sign feature-card-icon"
                    style={{ color: "rgb(58, 175, 92)" }}
                  /> */}
                      {/* <AccountBalanceWalletIcon sx={featureIconStyle} /> */}
                      Cash
                    </h5>
                    <p className="feature-card-text">$18,941</p>
                  </div>
                  <div className="col-md-6">
                    <h5
                      className="card-title"
                      style={{ color: "rgb(255,255,255)" }}
                    >
                      {/* <i
                    className="fas fa-dollar-sign feature-card-icon"
                    style={{ color: "rgb(58, 175, 92)" }}
                  /> */}
                      {/* <AccountBalanceWalletIcon sx={featureIconStyle} /> */}
                      Accounts Recievable
                    </h5>
                    <p className="feature-card-text">$6,190</p>
                  </div>
                  <div className="col-md-6">
                    <h5
                      className="card-title"
                      style={{ color: "rgb(255,255,255)" }}
                    >
                      {/* <i
                    className="fas fa-dollar-sign feature-card-icon"
                    style={{ color: "rgb(58, 175, 92)" }}
                  /> */}
                      {/* <AccountBalanceWalletIcon sx={featureIconStyle} /> */}
                      Land
                    </h5>
                    <p className="feature-card-text">$476,234.12</p>
                  </div>
                  <div className="col-md-6">
                    <h5
                      className="card-title"
                      style={{ color: "rgb(255,255,255)" }}
                    >
                      {/* <i
                    className="fas fa-dollar-sign feature-card-icon"
                    style={{ color: "rgb(58, 175, 92)" }}
                  /> */}
                      {/* <AccountBalanceWalletIcon sx={featureIconStyle} /> */}
                      Inventory
                    </h5>
                    <p className="feature-card-text">$5,049</p>
                  </div>
                </div>

                <div style={{ width: "100%" }}>
                  <button
                    className="btn btn-primary ui-button"
                    style={{ float: "right" }}
                    type="button"
                  >
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
