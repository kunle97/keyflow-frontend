import React, { Children, Fragment, useState } from "react";
import Sidebar from "./Landlord/Navigation/Sidebar";
import Topbar from "./Landlord/Navigation/Topbar";
import SidebarDrawer from "./Landlord/Navigation/SidebarDrawer";
import TopBarMUI from "../Dashboard/Landlord/Navigation/TopBarMUI";
import { uiGreen } from "../../constants";

const DashboardContainer = ({ children }) => {
  const [muiMode, setMuiSidebarMode] = useState(false);
  return (
    <div id="wrapper">
      {/* Sidebar nav */}
      {muiMode ? <SidebarDrawer /> : <Sidebar />}
      <div className="d-flex flex-column" id="content-wrapper">
        <div id="content" style={{ background: "#2c3a4a" }}>
          {/* Top Nav */}
          {muiMode ? <TopBarMUI /> : <Topbar />}
          <div className="container">
            {/* Page Content */}
            {children}
          </div>
        </div>
        <footer
          className="bg-white sticky-footer"
          style={{ background: "#2c3a4a", color: uiGreen }}
        >
          <div className="container my-auto">
            <div className="text-center my-auto copyright">
              <span className="text-white">
                Copyright © KeyFlow {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardContainer;
