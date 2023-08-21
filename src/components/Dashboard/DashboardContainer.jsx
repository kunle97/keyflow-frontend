import React, { Children, Fragment, useState } from "react";
import Sidebar from "./Landlord/Navigation/Sidebar";

import Topbar from "./Landlord/Navigation/Topbar";
import SidebarDrawer from "./Landlord/Navigation/SidebarDrawer";
import { uiGreen } from "../../constants";

const DashboardContainer = ({ children }) => {
  const [muiSidebarMode, setMuiSidebarMode] = useState(false);
  return (
    <div id="wrapper">
      {/* Sidebar nav */}
      {muiSidebarMode ? <SidebarDrawer /> : <Sidebar />}
      <div className="d-flex flex-column" id="content-wrapper">
        <div id="content" style={{ background: "#2c3a4a" }}>
          {/* Top Nav */}
          <Topbar />
          {children}
        </div>
        <footer
          className="bg-white sticky-footer"
          style={{ background: "#2c3a4a", color: uiGreen}}
        >
          <div className="container my-auto">
            <div className="text-center my-auto copyright">
              <span className="text-white">Copyright © KeyFlow {new Date().getFullYear()}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardContainer;
