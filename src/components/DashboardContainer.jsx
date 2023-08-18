import React, { Children, Fragment } from "react";
import Sidebar from "./Landlord/Navigation/Sidebar";
import Topbar from "./Landlord/Navigation/Topbar";

const DashboardContainer = ({ children }) => {
  return (
    <div id="wrapper">
      {/* Sidebar nav */}
      <Sidebar />
      <div className="d-flex flex-column" id="content-wrapper">
        <div id="content" style={{ background: "#2c3a4a" }}>
          {/* Top Nav */}
          <Topbar />
          {children}
        </div>
        <footer
          className="bg-white sticky-footer"
          style={{ background: "#2c3a4a", color: "#3aaf5c" }}
        >
          <div className="container my-auto">
            <div className="text-center my-auto copyright">
              <span className="text-white">Copyright © KeyFlow 2023</span>
            </div>
          </div>
        </footer>
      </div>
      <a className="border rounded d-inline scroll-to-top" href="#page-top">
        <i className="fas fa-angle-up" />
      </a>
    </div>
  );
};

export default DashboardContainer;
