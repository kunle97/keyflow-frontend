import React, { Children, Fragment, useEffect, useState } from "react";
import Sidebar from "./Landlord/Navigation/Sidebar";
import Topbar from "./Landlord/Navigation/Topbar";
import SidebarDrawer from "./Landlord/Navigation/SidebarDrawer";
import TopBarMUI from "../Dashboard/Landlord/Navigation/TopBarMUI";
import { authUser, uiGreen, uiGrey, uiGrey2 } from "../../constants";
import { Navigate, useNavigate } from "react-router-dom";
import DeveloperToolsMenu from "./DevTools/DeveloperToolsMenu";
import useScreen from "../../hooks/useScreen"; //src\hooks\useScreen.jsx
import SearchDialog from "./UIComponents/Modals/Search/SearchDialog";
import { getMessages } from "../../api/messages";
import { authenticatedInstance } from "../../api/api";
import { createThreads } from "../../helpers/messageUtils"; // src\helpers\messageUtils.js
import { routes } from "../../routes";
import { useLocation } from "react-router-dom";
import {
  clearLocalStorage,
  isTokenExpired,
  validateToken,
} from "../../helpers/utils";
import Joyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  STATUS,
  Step,
} from "react-joyride";
import { IconButton, Tooltip } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
const DashboardContainer = ({ children }) => {
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const ownerTourSteps = [
    {
      target: ".dashboard-content",
      content: (
        <>
          <h4>Welcome to your dashboard</h4>
          <p>
            This is the the Keyflow owner dashboard. here you can view and
            manage your properties, units, tenants and more. Let's go over the
            basics!
          </p>
        </>
      ),
      disableBeacon: true,
      placement: "center",
    },
    {
      target: ".navbar.topbar",
      content:
        "This is the navigation bar. You will be using this frequently to navigate to different sections of the dashboard.",
    },
    {
      target: "[data-testid='nav-menu-button'] ",
      content:
        "Click here to access the navigation menu. You can access all the sections of the dashboard from here including properties, units, tenants, maintenance requests, lease agreements, etc. ",
      spotlightClicks: true,
      disableBeacon: false,
      disableOverlayClose: true,
      placement: "right",
      styles: {
        options: {
          zIndex: 10000,
        },
      },
    },
    {
      target: ".topbar-brand",
      content:
        "This is the Keyflow logo. Click here to return to the dashboard home page at any time.",
    },
    {
      target: '[data-testid="search-bar-desktop"]',
      content:
        "Use the search bar to search for properties, units, tenants,maintenance requests and any other resources. You can simply type in the search bar or click the search icon to bring up the search dialog.",
    },
    {
      target: ".notification-topbar-icon",
      content:
        "Click here to view your notifications. You will receive notifications for tenant activity, lease renewal requests, lease cancellation requests, maintenance requests, and more. You can turn some notifications on or off in your account settings.",
    },
    {
      target: ".messages-topbar-icon",
      content:
        "Click here to view your messages. You can send and receive messages from your tenants.",
    },
    {
      target: ".my-account-topbar-dropdown",
      content: "Click here to view your account settings, and to log out.",
      spotlightClicks: true,
      disableBeacon: false,
    },
  ];
  const ownerMobileTourSteps = [];
  const tenantTourSteps = [
    {
      target: ".dashboard-content",
      content: (
        <>
          <h4>Welcome to your dashboard</h4>
          <p>
            This is the the Keyflow tenant dashboard. here you can view and
            manage your lease, maintenance requests, messages and more. Let's go
            over the basics!
          </p>
        </>
      ),
      disableBeacon: true,
      placement: "center",
    },
    {
      target: ".navbar.topbar",
      content:
        "This is the navigation bar. You will be using this frequently to navigate to different sections of the dashboard.",
    },
    {
      target: "[data-testid='nav-menu-button'] ",
      content:
        "Click here to access the navigation menu. You can access all the sections of the dashboard from here. This includes your bills, lease, and maintenance requests.",
      spotlightClicks: true,
      disableBeacon: false,
      disableOverlayClose: true,
      placement: "right",
      styles: {
        options: {
          zIndex: 10000,
        },
      },
    },
    {
      target: ".topbar-brand",
      content:
        "This is the Keyflow logo. Click here to return to the dashboard home page at any time.",
    },
    {
      target: ".notification-topbar-icon",
      content:
        "Click here to view your notifications. You will receive notifications for lease renewal requests, lease cancellation requests, maintenance requests, and more. You can turn some notifications on or off in your account settings.",
    },
    {
      target: ".messages-topbar-icon",
      content:
        "Click here to view your messages. You can send and receive messages from your landlord.",
    },
    {
      target: ".my-account-topbar-dropdown",
      content: "Click here to view your account settings, and to log out.",
      spotlightClicks: true,
      disableBeacon: false,
    },
  ];
  const tenantMobileTourSteps = [
    {
      target: "button.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-colorInherit.MuiIconButton-edgeStart.MuiIconButton-sizeLarge.css-1k3nyda-MuiButtonBase-root-MuiIconButton-root",
      content: (
        <>
          <h4>Welcome to your dashboard</h4>
          <p>
            This is the the Keyflow tenant dashboard. here you can view and
            manage your lease, maintenance requests, messages and more. Let's go
            over the basics!
          </p>
        </>
      ),
    }
  ];

  const [tourSteps, setTourSteps] = useState([]);
  const handleClickStart = (event) => {
    event.preventDefault();
    setRunTour(true);
    console.log(runTour);
  };

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

  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setTourIndex(0);
      setRunTour(false);
    }
  };

  useEffect(() => {
    console.log("TOken is expired value: ", isTokenExpired());

    const fetchData = async () => {
      const tokenValidationResponse = await validateToken();
      console.log("Token Validation response ", tokenValidationResponse);
      if (!tokenValidationResponse.data.isValid) {
        clearLocalStorage();
        navigate("/");
      }
      // fetchNotifications(5);
      // setPageTitle(findCurrentRoute().label);
      if (screenWidth < breakpoints.lg) {
        setMUIMode(true);
      } else {
        setMUIMode(false);
      }
    };

    fetchData();

    return () => {
      // Cleanup function if needed
    };
  }, [screenWidth, location.pathname]);

  return (
    <div id="wrapper pb-2">
      {/* <Joyride
        run={runTour}
        index={tourIndex}
        steps={
          authUser.account_type === "owner" ? ownerTourSteps : tenantTourSteps
        }
        callback={handleJoyrideCallback}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        styles={{
          options: {
            primaryColor: uiGreen,
          },
        }}
        locale={{
          back: "Back",
          close: "Close",
          last: "Finish",
          next: "Next",
          skip: "Skip",
        }}
      /> */}

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
        <div id="content" className="dashboard-content">
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
        {process.env.REACT_APP_ENVIRONMENT !== "development" ? (
          <DeveloperToolsMenu />
        ) : (
          <>
            {/* <div className="d-flex justify-content-center">
              <Tooltip title="Help">
                <IconButton
                  onClick={handleClickStart}
                  style={{
                    background: uiGrey,
                    color: uiGreen,
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                  }}
                >
                  <HelpIcon
                    sx={{
                      fontSize: "2rem",
                    }}
                  />
                </IconButton>
              </Tooltip>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardContainer;
