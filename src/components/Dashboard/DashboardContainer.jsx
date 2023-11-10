import React, { Children, Fragment, useState } from "react";
import Sidebar from "./Landlord/Navigation/Sidebar";
import Topbar from "./Landlord/Navigation/Topbar";
import SidebarDrawer from "./Landlord/Navigation/SidebarDrawer";
import TopBarMUI from "../Dashboard/Landlord/Navigation/TopBarMUI";
import { authUser, uiGreen } from "../../constants";
import { Navigate, useNavigate } from "react-router-dom";
import DeveloperToolsMenu from "./DevTools/DeveloperToolsMenu";
const DashboardContainer = ({ children }) => {

  const [muiMode, setMuiSidebarMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const style = { paddingTop: muiMode ? "80px " : "" };
  //Check if user account is active
  if (authUser.is_active === false) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("stripe_onoboarding_link");
  }
  return (
    <div id="wrapper">
      {/* Sidebar nav */}
      {muiMode ? (
        <SidebarDrawer open={menuOpen} onClose={setMenuOpen} />
      ) : (
        <Sidebar />
      )}
      <div className="d-flex flex-column" id="content-wrapper">
        <div id="content" style={{ background: "#2c3a4a" }}>
          {/* Top Nav */}
          {muiMode ? <TopBarMUI openMenu={setMenuOpen} /> : <Topbar />}
          <div className={`container `} style={style}>
            {authUser.is_active === false ? (
              <Navigate to="/dashboard/activate-account/" replace />
            ) : (
              children
            )}
          </div>
        </div>
        <DeveloperToolsMenu />
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
