import React, { Children, Fragment, useEffect, useState } from "react";
import Sidebar from "./Landlord/Navigation/Sidebar";
import Topbar from "./Landlord/Navigation/Topbar";
import SidebarDrawer from "./Landlord/Navigation/SidebarDrawer";
import TopBarMUI from "../Dashboard/Landlord/Navigation/TopBarMUI";
import { authUser, uiGrey, uiGrey2 } from "../../constants";
import { Navigate, useNavigate } from "react-router-dom";
import DeveloperToolsMenu from "./DevTools/DeveloperToolsMenu";
import useScreen from "../../hooks/useScreen"; //src\hooks\useScreen.jsx
import SearchDialog from "./UIComponents/Modals/Search/SearchDialog";
import { getMessages } from "../../api/messages";
import { authenticatedInstance } from "../../api/api";
import { createThreads } from "../../helpers/messageUtils"; // src\helpers\messageUtils.js
import { routes } from "../../routes";
import { useLocation } from "react-router-dom";
const DashboardContainer = ({ children }) => {
  const [pageTitle, setPageTitle] = useState("");
  const [pageBreadCrumb, setPageBreadCrumb] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [muiMode, setMUIMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavMenu, setShowNavMenu] = useState(false);
  const { screenWidth, breakpoints } = useScreen();
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageThreads, setMessageThreads] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const style = { paddingTop: muiMode ? "80px " : "" };
  //Check if user account is active
  if (authUser.is_active === false) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("stripe_onoboarding_link");
  }

  const fetchNotifications = async (count = 0) => {
    let endpoint = "";
    if (count === 0) {
      endpoint = "/notifications/";
    } else {
      endpoint = `/notifications/?limit=${count}&ordering=-timestamp`;
    }
    try {
      const res = await authenticatedInstance.get(endpoint);
      if (res.data.results) {
        setNotifications(res.data.results);
        setNotificationCount(res.data.count);
      } else {
        setNotifications(res.data);
        setNotificationCount(res.data.length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Using useLocation retrieve the current path and find the object in the routes array that matches the path
  const findCurrentRoute = () => {
    const currentPath = location.pathname;
    console.log("path anme ", currentPath);
    const currentRoute = routes.find((route) => route.path === currentPath);
    console.log("current route ", currentRoute);
    return currentRoute;
  };

  useEffect(() => {
    // fetchNotifications(5);
    // setPageTitle(findCurrentRoute().label);
    if (screenWidth < breakpoints.lg) {
      setMUIMode(true);
    } else {
      setMUIMode(false);
    }
  }, [screenWidth, location.pathname]);
  return (
    <div id="wrapper pb-2">
      {showSearchDialog && (
        <SearchDialog
          open={showSearchDialog}
          handleClose={() => setShowSearchDialog(false)}
          query={searchQuery}
        />
      )}
      {/* Sidebar nav */}
      {muiMode ? (
        <SidebarDrawer open={menuOpen} onClose={setMenuOpen} />
      ) : (
        <Sidebar showNavMenu={showNavMenu} setShowNavMenu={setShowNavMenu} />
      )}
      <div className="d-flex flex-column" id="content-wrapper">
        <div id="content">
          <div
            className={`${screenWidth > breakpoints.md && "container"} `}
            style={{ ...style }}
          >
            {/* Top Nav */}
            {muiMode ? (
              <TopBarMUI
                showSearchDialog={showSearchDialog}
                setShowSearchDialog={setShowSearchDialog}
                openMenu={setMenuOpen}
                notifications={notifications}
                notificationCount={notificationCount}
              />
            ) : (
              <Topbar
                showSearchDialog={showSearchDialog}
                setShowSearchDialog={setShowSearchDialog}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showNavMenu={showNavMenu}
                setShowNavMenu={setShowNavMenu}
                notifications={notifications}
                notificationCount={notificationCount}
              />
            )}
            {<h1>{pageTitle}</h1>}
            {/* Page Content */}
            {authUser.is_active === false ? (
              <Navigate to="/dashboard/activate-account/" replace />
            ) : (
              children
            )}
            {/* Footer */}
            <footer
              // className=" sticky-footer"
              style={{
                // background: "white",
                padding: "2rem 0",
                color: uiGrey2,
                borderRadius: "10px",
                margin: "15px",
              }}
            >
              <div className="container my-auto">
                <div className="text-center my-auto copyright">
                  <span className="text-dark">
                    Copyright © KeyFlow {new Date().getFullYear()}
                  </span>
                </div>
              </div>
            </footer>
          </div>
        </div>
        {process.env.REACT_APP_ENVIRONMENT === "development" && (
          <DeveloperToolsMenu />
        )}
      </div>
    </div>
  );
};

export default DashboardContainer;
